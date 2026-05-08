"""Admin authentication: password + TOTP 2FA, httpOnly cookie session."""

import base64
import io
from datetime import datetime, timezone

import pyotp
import qrcode
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import get_settings
from ..db import get_db
from ..models import AdminUser
from ..security import (
    clear_session_cookie,
    current_admin,
    decode_token,
    issue_token,
    set_session_cookie,
    verify_password,
)

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["auth"])


# ---- Schemas ----------------------------------------------------------------

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class LoginChallenge(BaseModel):
    """Returned by /auth/login. The next step the client must take."""

    step: str  # "verify_2fa" or "setup_2fa"
    challenge_token: str


class TotpSetupIn(BaseModel):
    challenge_token: str


class TotpSetupOut(BaseModel):
    secret: str
    otpauth_url: str
    qr_code_data_url: str


class TotpVerifyIn(BaseModel):
    challenge_token: str
    code: str = Field(min_length=6, max_length=10)


class AdminMeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    last_login_at: datetime | None


class OkOut(BaseModel):
    ok: bool = True


# ---- Helpers ----------------------------------------------------------------

def _otpauth_url(secret: str, account: str) -> str:
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=account, issuer_name=settings.totp_issuer
    )


def _qr_data_url(otpauth_url: str) -> str:
    img = qrcode.make(otpauth_url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    encoded = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


# ---- Endpoints --------------------------------------------------------------

@router.post("/login", response_model=LoginChallenge)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> LoginChallenge:
    user = db.execute(
        select(AdminUser).where(AdminUser.email == str(payload.email).lower())
    ).scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.totp_secret and user.totp_confirmed_at:
        token = issue_token(
            sub=user.id, scope="pre-2fa", ttl_minutes=settings.pre_2fa_ttl_minutes
        )
        return LoginChallenge(step="verify_2fa", challenge_token=token)

    # First-time setup or partial provisioning — issue setup-scoped token.
    token = issue_token(
        sub=user.id, scope="setup-2fa", ttl_minutes=settings.pre_2fa_ttl_minutes
    )
    return LoginChallenge(step="setup_2fa", challenge_token=token)


@router.post("/2fa/setup", response_model=TotpSetupOut)
def setup_2fa(payload: TotpSetupIn, db: Session = Depends(get_db)) -> TotpSetupOut:
    """Generate a fresh TOTP secret for the half-authenticated user.

    The secret is saved provisionally; only confirmed when /2fa/verify succeeds.
    """
    user_id = decode_token(payload.challenge_token, expected_scope="setup-2fa")
    user = db.get(AdminUser, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Account not found")

    secret = pyotp.random_base32()
    user.totp_secret = secret
    user.totp_confirmed_at = None
    db.commit()

    otpauth_url = _otpauth_url(secret, user.email)
    return TotpSetupOut(
        secret=secret,
        otpauth_url=otpauth_url,
        qr_code_data_url=_qr_data_url(otpauth_url),
    )


@router.post("/2fa/verify", response_model=AdminMeOut)
def verify_2fa(
    payload: TotpVerifyIn,
    response: Response,
    db: Session = Depends(get_db),
) -> AdminUser:
    """Verify a TOTP code and either confirm setup or complete login.

    The challenge_token may be either a `setup-2fa` (first-time confirmation)
    or `pre-2fa` (subsequent login) scope. On success a session cookie is set.
    """
    # Try both expected scopes — the client doesn't have to tell us which.
    user_id: int | None = None
    for scope in ("pre-2fa", "setup-2fa"):
        try:
            user_id = decode_token(payload.challenge_token, expected_scope=scope)  # type: ignore[arg-type]
            break
        except HTTPException:
            continue
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid challenge")

    user = db.get(AdminUser, user_id)
    if user is None or not user.totp_secret:
        raise HTTPException(status_code=401, detail="Invalid challenge")

    if not pyotp.TOTP(user.totp_secret).verify(payload.code.strip(), valid_window=1):
        raise HTTPException(status_code=401, detail="Invalid 2FA code")

    user.totp_confirmed_at = user.totp_confirmed_at or datetime.now(timezone.utc)
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    session_token = issue_token(
        sub=user.id, scope="admin", ttl_minutes=settings.session_ttl_minutes
    )
    set_session_cookie(response, session_token)
    return user


@router.post("/logout", response_model=OkOut)
def logout(response: Response) -> OkOut:
    clear_session_cookie(response)
    return OkOut(ok=True)


@router.get("/me", response_model=AdminMeOut)
def me(admin: AdminUser = Depends(current_admin)) -> AdminUser:
    return admin

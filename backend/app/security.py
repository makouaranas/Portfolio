"""Auth primitives: password hashing, JWT, current-admin dependency."""

from datetime import datetime, timedelta, timezone
from typing import Literal

import bcrypt
import jwt
from fastapi import Cookie, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .db import get_db
from .models import AdminUser

settings = get_settings()


# ---- Passwords --------------------------------------------------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


# ---- Tokens -----------------------------------------------------------------

TokenScope = Literal["admin", "pre-2fa", "setup-2fa"]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def issue_token(*, sub: int, scope: TokenScope, ttl_minutes: int) -> str:
    payload = {
        "sub": str(sub),
        "scope": scope,
        "iat": int(_now().timestamp()),
        "exp": int((_now() + timedelta(minutes=ttl_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str, *, expected_scope: TokenScope) -> int:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("scope") != expected_scope:
        raise HTTPException(status_code=401, detail="Wrong token scope")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Malformed token")
    try:
        return int(sub)
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Malformed token")


# ---- Cookie helpers ---------------------------------------------------------

def set_session_cookie(response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.session_ttl_minutes * 60,
        path="/",
    )


def clear_session_cookie(response) -> None:
    response.delete_cookie(key=settings.session_cookie_name, path="/")


# ---- Dependency -------------------------------------------------------------

def current_admin(
    request: Request,
    db: Session = Depends(get_db),
    session: str | None = Cookie(default=None, alias=None),
) -> AdminUser:
    """Resolve the current admin from the session cookie.

    Raises 401 if missing/invalid. Use as `Depends(current_admin)`.
    """
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    user_id = decode_token(token, expected_scope="admin")
    user = db.get(AdminUser, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Account not found")
    return user

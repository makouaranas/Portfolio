from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = f"sqlite:///{Path(__file__).resolve().parent.parent / 'data' / 'app.db'}"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://makouaranas.site",
        "https://admin.makouaranas.site",
    ]
    contact_inbox_email: str = "makouaranass@gmail.com"

    # Auth
    jwt_secret: str = "dev-only-change-me-in-production"
    jwt_algorithm: str = "HS256"
    session_cookie_name: str = "portfolio_admin_session"
    session_ttl_minutes: int = 60 * 24  # 1 day
    pre_2fa_ttl_minutes: int = 5
    cookie_secure: bool = False  # set True behind HTTPS in production
    cookie_samesite: str = "lax"
    totp_issuer: str = "MAKOUAR Anas Admin"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

"""Bootstrap (or reset) the admin account.

Usage:
    uv run python -m app.create_admin --email you@example.com --password 'sekret'
    uv run python -m app.create_admin --email you@example.com  # prompts for password

If an admin with that email already exists, the password is reset and the TOTP
secret is cleared so 2FA must be re-enrolled on next login.
"""

import argparse
import getpass
import sys

from sqlalchemy import select

from .db import Base, SessionLocal, engine
from .models import AdminUser
from .security import hash_password


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or reset the portfolio admin account")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument(
        "--password",
        required=False,
        help="Admin password (omit to be prompted, recommended)",
    )
    args = parser.parse_args()

    email = args.email.strip().lower()
    password = args.password or getpass.getpass("Password: ")
    if not password:
        print("Password is required.", file=sys.stderr)
        return 2
    if len(password) < 8:
        print("Password must be at least 8 characters.", file=sys.stderr)
        return 2

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.execute(
            select(AdminUser).where(AdminUser.email == email)
        ).scalar_one_or_none()
        if existing:
            existing.password_hash = hash_password(password)
            existing.totp_secret = None
            existing.totp_confirmed_at = None
            db.commit()
            print(f"Admin {email} updated. 2FA cleared — re-enroll on next login.")
        else:
            admin = AdminUser(email=email, password_hash=hash_password(password))
            db.add(admin)
            db.commit()
            print(f"Admin {email} created. Log in at /admin to enroll 2FA.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    sys.exit(main())

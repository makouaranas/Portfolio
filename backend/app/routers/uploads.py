"""Image upload endpoint for the admin panel."""

import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status

from ..schemas import UploadOut
from ..security import current_admin

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(current_admin)])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
ALLOWED_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/uploads", response_model=UploadOut, status_code=201)
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
) -> UploadOut:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported content type: {file.content_type}",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    suffix = ALLOWED_TYPES[file.content_type]
    filename = f"{secrets.token_urlsafe(16)}{suffix}"
    target = UPLOAD_DIR / filename

    size = 0
    with target.open("wb") as out:
        while chunk := await file.read(64 * 1024):
            size += len(chunk)
            if size > MAX_SIZE_BYTES:
                out.close()
                target.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds {MAX_SIZE_BYTES // (1024 * 1024)} MB limit",
                )
            out.write(chunk)

    relative_url = f"/uploads/{filename}"
    absolute_url = str(request.url_for("uploads", path=filename))
    return UploadOut(
        url=absolute_url or relative_url,
        filename=filename,
        size=size,
        content_type=file.content_type,
    )

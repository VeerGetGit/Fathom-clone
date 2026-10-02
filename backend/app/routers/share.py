from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.core.db import get_db
from app.services import meeting_service as ms

router = APIRouter(prefix="/api", tags=["share"])


@router.get("/meetings/{meeting_id}/share")
def get_share_link(meeting_id: str):
    """Share button: returns the public link for the meeting."""
    meeting = ms.get_meeting_or_404(meeting_id)
    origin = get_settings().frontend_origin.split(",")[0].strip().rstrip("/")
    path = f"/shared/{meeting['share_token']}"
    return {"share_token": meeting["share_token"], "path": path, "url": origin + path}


@router.get("/shared/{token}")
def get_shared_meeting(token: str):
    """Resolve a share token to its meeting (read-only, no login)."""
    res = get_db().table("meetings").select("*").eq("share_token", token).limit(1).execute()
    if not res.data:
        raise HTTPException(404, "Share link not found")
    return ms.meeting_with_participants(res.data[0])

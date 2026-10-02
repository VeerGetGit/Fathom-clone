from fastapi import APIRouter, Query

from app.core.db import get_db
from app.services import meeting_service as ms

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

LIST_COLS = "id,title,meeting_type,started_at,duration_seconds,thumbnail_url,video_url,share_token"


@router.get("")
def list_meetings():
    db = get_db()
    meetings = db.table("meetings").select(LIST_COLS).order("started_at", desc=True).execute().data
    parts = db.table("participants").select("meeting_id,name,avatar_color,is_host").execute().data
    by_meeting: dict[str, list] = {}
    for p in parts:
        by_meeting.setdefault(p["meeting_id"], []).append(p)
    return [{**m, "participants": by_meeting.get(m["id"], [])} for m in meetings]


@router.get("/{meeting_id}")
def get_meeting(meeting_id: str):
    return ms.meeting_with_participants(ms.get_meeting_or_404(meeting_id))


@router.get("/{meeting_id}/transcript")
def get_transcript(meeting_id: str, q: str | None = Query(default=None, max_length=200)):
    """Speaker-labeled segments; `q` filters to lines containing the text."""
    ms.get_meeting_or_404(meeting_id)
    people = {p["id"]: p for p in ms.get_participants(meeting_id)}
    out = []
    for seg in ms.get_segments(meeting_id):
        p = people.get(seg.get("participant_id") or "")
        seg = {k: v for k, v in seg.items() if k != "search_tsv"}
        seg["speaker"] = p["name"] if p else None
        seg["speaker_color"] = p["avatar_color"] if p else None
        out.append(seg)
    if q:
        needle = q.lower()
        out = [s for s in out if needle in s["text"].lower()]
    return out

"""Supabase queries shared by several routers."""
from fastapi import HTTPException

from app.core.db import get_db
from app.services import groq_service


def get_meeting_or_404(meeting_id: str) -> dict:
    res = get_db().table("meetings").select("*").eq("id", meeting_id).limit(1).execute()
    if not res.data:
        raise HTTPException(404, "Meeting not found")
    return res.data[0]


def get_participants(meeting_id: str) -> list[dict]:
    return (get_db().table("participants").select("*")
            .eq("meeting_id", meeting_id).order("is_host", desc=True).execute().data)


def get_segments(meeting_id: str) -> list[dict]:
    return (get_db().table("transcript_segments").select("*")
            .eq("meeting_id", meeting_id).order("segment_index").execute().data)


def transcript_text(meeting_id: str) -> str:
    names = {p["id"]: p["name"] for p in get_participants(meeting_id)}
    return groq_service.format_transcript(get_segments(meeting_id), names)


def meeting_with_participants(meeting: dict) -> dict:
    return {**meeting, "participants": get_participants(meeting["id"])}

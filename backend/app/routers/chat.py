from fastapi import APIRouter, HTTPException

from app.core.db import get_db
from app.schemas.models import ChatRequest
from app.services import groq_service
from app.services import meeting_service as ms

router = APIRouter(prefix="/api", tags=["ask-fathom"])


def _history(meeting_id: str | None) -> list[dict]:
    q = get_db().table("chat_messages").select("id,role,content,created_at")
    q = q.eq("meeting_id", meeting_id) if meeting_id else q.is_("meeting_id", "null")
    return q.order("created_at").execute().data


def _ask(meeting_id: str | None, message: str, context: str) -> dict:
    history = [{"role": m["role"], "content": m["content"]} for m in _history(meeting_id)]
    try:
        answer = groq_service.answer_question(message, context, history)
    except Exception as e:
        raise HTTPException(502, f"Ask Fathom failed: {e}")
    get_db().table("chat_messages").insert([
        {"meeting_id": meeting_id, "role": "user", "content": message},
        {"meeting_id": meeting_id, "role": "assistant", "content": answer},
    ]).execute()
    return {"answer": answer}


@router.get("/meetings/{meeting_id}/chat")
def meeting_chat_history(meeting_id: str):
    ms.get_meeting_or_404(meeting_id)
    return _history(meeting_id)


@router.post("/meetings/{meeting_id}/chat")
def meeting_chat(meeting_id: str, body: ChatRequest):
    meeting = ms.get_meeting_or_404(meeting_id)
    context = f"Meeting: {meeting['title']}\n{ms.transcript_text(meeting_id)}"
    return _ask(meeting_id, body.message, context)


@router.delete("/meetings/{meeting_id}/chat")
def clear_meeting_chat(meeting_id: str):
    ms.get_meeting_or_404(meeting_id)
    get_db().table("chat_messages").delete().eq("meeting_id", meeting_id).execute()
    return {"ok": True}


@router.get("/chat")
def global_chat_history():
    return _history(None)


@router.post("/chat")
def global_chat(body: ChatRequest):
    """Ask Fathom across every meeting."""
    blocks = []
    meetings = get_db().table("meetings").select("id,title,started_at").order("started_at").execute().data
    for m in meetings:
        blocks.append(f"=== MEETING: {m['title']} ({m['started_at'][:10]}) ===\n"
                      f"{ms.transcript_text(m['id'])}")
    return _ask(None, body.message, "\n\n".join(blocks))


@router.delete("/chat")
def clear_global_chat():
    get_db().table("chat_messages").delete().is_("meeting_id", "null").execute()
    return {"ok": True}

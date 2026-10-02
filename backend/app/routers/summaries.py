from fastapi import APIRouter, HTTPException, Query

from app.core.db import get_db
from app.schemas.models import SummaryRequest, Template
from app.services import groq_service
from app.services import meeting_service as ms

router = APIRouter(prefix="/api/meetings/{meeting_id}", tags=["summary"])


def _load(meeting_id: str, template: str) -> dict | None:
    db = get_db()
    res = (db.table("summaries").select("*").eq("meeting_id", meeting_id)
           .eq("template", template).limit(1).execute())
    if not res.data:
        return None
    summary = res.data[0]
    summary["highlights"] = (db.table("highlights").select("*").eq("summary_id", summary["id"])
                             .order("position").execute().data)
    return summary


def _generate(meeting_id: str, template: str, custom_prompt: str | None) -> dict:
    meeting = ms.get_meeting_or_404(meeting_id)
    try:
        data = groq_service.generate_summary(
            meeting, ms.transcript_text(meeting_id), template, custom_prompt)
    except Exception as e:  # Groq, network or JSON failure
        raise HTTPException(502, f"Summary generation failed: {e}")

    db = get_db()
    db.table("summaries").delete().eq("meeting_id", meeting_id).eq("template", template).execute()
    row = db.table("summaries").insert({
        "meeting_id": meeting_id,
        "template": template,
        "purpose": str(data.get("purpose", "")),
        "key_takeaways": [str(x) for x in data.get("key_takeaways", [])],
        "custom_prompt": custom_prompt,
    }).execute().data[0]
    highlights = [
        {"meeting_id": meeting_id, "summary_id": row["id"], "position": i,
         "start_seconds": float(h["start_seconds"]), "label": str(h["label"])}
        for i, h in enumerate(data.get("highlights", []))
        if isinstance(h, dict) and "start_seconds" in h and "label" in h
    ]
    if highlights:
        db.table("highlights").insert(highlights).execute()
    return _load(meeting_id, template)


@router.get("/summary")
def get_summary(meeting_id: str, template: Template = Query(default="general")):
    """Cached summary for a template; generated with Groq on first request."""
    ms.get_meeting_or_404(meeting_id)
    return _load(meeting_id, template) or _generate(meeting_id, template, None)


@router.post("/summary")
def regenerate_summary(meeting_id: str, body: SummaryRequest):
    """Customize button: regenerate with an optional custom prompt."""
    return _generate(meeting_id, body.template, body.custom_prompt)

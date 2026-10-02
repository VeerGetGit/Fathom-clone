from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.core.db import get_db
from app.schemas.models import ActionItemCreate, ActionItemUpdate
from app.services import meeting_service as ms

router = APIRouter(prefix="/api", tags=["action-items"])


@router.get("/meetings/{meeting_id}/action-items")
def list_action_items(meeting_id: str):
    ms.get_meeting_or_404(meeting_id)
    names = {p["id"]: p["name"] for p in ms.get_participants(meeting_id)}
    items = (get_db().table("action_items").select("*").eq("meeting_id", meeting_id)
             .order("start_seconds").execute().data)
    return [{**i, "assignee": names.get(i.get("assignee_id") or "")} for i in items]


@router.post("/meetings/{meeting_id}/action-items", status_code=201)
def create_action_item(meeting_id: str, body: ActionItemCreate):
    ms.get_meeting_or_404(meeting_id)
    description = body.description.strip()
    if not description:
        raise HTTPException(422, "Description cannot be blank")
    row = (get_db().table("action_items")
           .insert({"meeting_id": meeting_id, "description": description})
           .execute().data[0])
    return {**row, "assignee": None}


@router.patch("/action-items/{item_id}")
def update_action_item(item_id: str, body: ActionItemUpdate):
    completed_at = datetime.now(timezone.utc).isoformat() if body.is_completed else None
    res = (get_db().table("action_items")
           .update({"is_completed": body.is_completed, "completed_at": completed_at})
           .eq("id", item_id).execute())
    if not res.data:
        raise HTTPException(404, "Action item not found")
    return res.data[0]

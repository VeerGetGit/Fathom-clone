from fastapi import APIRouter, Query

from app.core.db import get_db

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search")
def search(q: str = Query(min_length=1, max_length=200)):
    """Global search over meeting titles and transcripts, grouped per meeting."""
    db = get_db()
    hits = db.rpc("search_meetings", {"q": q}).execute().data
    # full-text search only matches whole words; add a substring fallback for partial words
    seen = {(h["meeting_id"], h["match_type"], h["snippet"]) for h in hits}
    like = f"%{q}%"
    for m in db.table("meetings").select("id,title").ilike("title", like).execute().data:
        if (m["id"], "title", m["title"]) not in seen:
            hits.append({"meeting_id": m["id"], "match_type": "title",
                         "snippet": m["title"], "start_seconds": None})
    for s in (db.table("transcript_segments").select("meeting_id,text,start_seconds")
              .eq("segment_type", "speech").ilike("text", like).limit(50).execute().data):
        if (s["meeting_id"], "transcript", s["text"]) not in seen:
            hits.append({"meeting_id": s["meeting_id"], "match_type": "transcript",
                         "snippet": s["text"], "start_seconds": s["start_seconds"]})

    titles = {m["id"]: m["title"] for m in db.table("meetings").select("id,title").execute().data}
    grouped: dict[str, dict] = {}
    for h in hits:
        g = grouped.setdefault(h["meeting_id"], {
            "meeting_id": h["meeting_id"], "title": titles.get(h["meeting_id"]), "matches": []})
        g["matches"].append({"type": h["match_type"], "snippet": h["snippet"],
                             "start_seconds": h["start_seconds"]})
    return list(grouped.values())

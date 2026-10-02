"""Seed the 4 demo meetings. Run from backend/:  python -m seed.seed

To only move the meeting dates to "now" (keeps chats and checked action items):
    python -m seed.seed --dates
"""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.db import get_db  # noqa: E402
from seed import data_architecture, data_review, data_roadmap, data_sales  # noqa: E402

# No real recordings exist, so every meeting points at the same public sample video.
VIDEO_URL = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"

MODULES = [data_roadmap, data_sales, data_review, data_architecture]

# How long before "now" each meeting started, so the dashboard shows the
# Today / Yesterday / This Week groups whenever the data is (re)seeded.
STARTED_AGO = {
    data_roadmap: timedelta(hours=96),
    data_sales: timedelta(hours=48),
    data_review: timedelta(hours=24),
    data_architecture: timedelta(minutes=70),
}


def started_at(mod) -> str:
    return (datetime.now(timezone.utc) - STARTED_AGO[mod]).isoformat()


def to_seconds(ts: str) -> float:
    m, s = ts.split(":")
    return float(int(m) * 60 + int(s))


def seed_module(db, mod) -> None:
    meeting = db.table("meetings").insert({**mod.MEETING, "video_url": VIDEO_URL, "started_at": started_at(mod)}).execute().data[0]
    mid = meeting["id"]

    people = db.table("participants").insert(
        [{**p, "meeting_id": mid} for p in mod.PARTICIPANTS]).execute().data
    by_name = {p["name"]: p["id"] for p in people}

    rows = []
    for i, entry in enumerate(mod.TRANSCRIPT):
        start = to_seconds(entry[0])
        nxt = to_seconds(mod.TRANSCRIPT[i + 1][0]) if i + 1 < len(mod.TRANSCRIPT) else mod.MEETING["duration_seconds"]
        row = {"meeting_id": mid, "segment_index": i, "start_seconds": start, "end_seconds": nxt}
        if entry[1] == "@share_start":
            row.update(segment_type="screen_share_start", participant_id=by_name[entry[2]], text=entry[3])
        elif entry[1] == "@share_end":
            row.update(segment_type="screen_share_end", text="Screen sharing ended")
        else:
            row.update(segment_type="speech", participant_id=by_name[entry[1]], text=entry[2])
        rows.append(row)
    db.table("transcript_segments").insert(rows).execute()

    s = mod.SUMMARY
    summary = db.table("summaries").insert({
        "meeting_id": mid, "template": "general",
        "purpose": s["purpose"], "key_takeaways": s["key_takeaways"],
    }).execute().data[0]
    db.table("highlights").insert([
        {"meeting_id": mid, "summary_id": summary["id"], "position": i,
         "start_seconds": float(sec), "label": label}
        for i, (sec, label) in enumerate(s["highlights"])
    ]).execute()

    db.table("action_items").insert([
        {"meeting_id": mid, "assignee_id": by_name[who], "description": desc,
         "start_seconds": float(sec)}
        for who, desc, sec in mod.ACTION_ITEMS
    ]).execute()
    print(f"seeded: {mod.MEETING['title']} ({len(rows)} segments)")


def refresh_dates() -> None:
    db = get_db()
    for mod in MODULES:
        db.table("meetings").update({"started_at": started_at(mod)}).eq("title", mod.MEETING["title"]).execute()
        print(f"dated: {mod.MEETING['title']}")


def main() -> None:
    if "--dates" in sys.argv:
        return refresh_dates()
    db = get_db()
    # cascade deletes children; the filter matches every row
    db.table("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    db.table("meetings").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    for mod in MODULES:
        seed_module(db, mod)


if __name__ == "__main__":
    main()

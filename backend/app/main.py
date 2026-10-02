from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import action_items, chat, meetings, search, share, summaries

app = FastAPI(title="Fathom Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in get_settings().frontend_origin.split(",")],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (meetings, summaries, action_items, search, chat, share):
    app.include_router(r.router)


@app.get("/health")
def health():
    return {"status": "ok"}

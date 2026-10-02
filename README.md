# Fathom8x

Fathom8x is a clone of [Fathom](https://fathom.video), the AI meeting assistant. It turns a recorded
call into something you can skim and search: a summary with clickable highlights, a speaker-labeled
transcript, action items, and a chat that answers questions about the meeting.

The meetings in this build are **seeded** (4 realistic calls with full transcripts). There is no
recording bot, so the product is exercised end to end on that data. See
[What was stubbed](#what-was-stubbed-and-why).

> **Live demo:** https://fathom-clone-rouge.vercel.app &nbsp;·&nbsp; **API:** https://fathom-clone.onrender.com
>
> The API runs on Render's free tier and sleeps when idle. The first request after a quiet period
> can take up to a minute; the app shows a splash screen explaining this.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7 |
| Backend | FastAPI (Python), Pydantic, Uvicorn |
| Database | Supabase (PostgreSQL), accessed with `supabase-py` |
| AI | Groq API, model `openai/gpt-oss-120b` |
| Hosting | Vercel (frontend), Render (backend) |

## Features built

**Dashboard (`/`)**
- Horizontal top nav (My Calls, Team Calls, Playlists, Alerts, Deals), logo left, search centre, icons right.
- Meeting cards (thumbnail, duration badge, title, date, participant avatars) grouped under
  Today / Yesterday / This Week / Earlier.
- Global **Ask Fathom8x** chat in the right sidebar, answering across all meetings.
- Splash screen while the first load is in flight.

**Meeting detail (`/calls/:id`)**
- Video player with a load-error state and Retry.
- **Summary** tab: template selector (General, Sales, Action Items), Customize (regenerate with your own
  instructions), Copy, Meeting Purpose, Key Takeaways, and Highlights that seek the video.
- **Transcript** tab: speaker bubbles with timestamps, click any line to seek, in-transcript search with
  highlighting, the currently playing line highlighted, screen-share events inline, and a Copy Transcript button.
- **Ask Fathom8x** tab: chat grounded in that meeting's transcript, with saved history and clickable timestamps in answers.
- Right sidebar: action items with checkboxes (saved), add your own item, screen-sharing events with
  timestamps, and a Share button that copies a public link.

**Global search**
- Searches meeting titles and transcript text. Results are grouped by meeting; clicking a hit opens the
  transcript at that line.

**Shared meeting (`/shared/:token`)**
- Public, read-only view: video, summary and action items. No nav, chat or editing.

**Prompt handling (limited, see note)**
- Chat answers are grounded by a system prompt that restricts the model to the supplied transcript(s) and
  tells it to say so when the answer isn't there; input length is capped at 4,000 characters.
- **This is not a full prompt-injection defense.** Transcript text and user messages are not sanitized or
  isolated from instructions. Hardening is listed in [DECISIONS.md](DECISIONS.md#what-i-would-build-next).

**Not built:** Team Calls, Playlists, Alerts and Deals show a "Coming Soon" page.

## What was stubbed and why

| Stubbed | Why |
|---|---|
| Recording bot and calendar integration | Capturing live calls needs a meeting-bot service, calendar OAuth and media processing. That is a product of its own and tells you nothing about the parts users see. Meetings are seeded instead, and everything downstream of a transcript is real. |
| Authentication and login | One implicit user keeps the focus on the meeting experience. There is no users table. |
| Team Calls, Playlists, Alerts, Deals | They depend on multiple users and organizations, which don't exist without auth. They are stubbed pages. |
| CRM integrations | Outbound integrations with no data worth syncing here. |

## Repository layout

```
backend/    FastAPI app (app/), seed data and script (seed/), requirements.txt
frontend/   React + Vite app (src/)
database/   schema.sql, the full Supabase schema
```

## Run locally

### Prerequisites
- Node 20+ and npm
- Python 3.11+
- A Supabase project and a Groq API key

### 1. Database
Open the Supabase SQL editor and run [`database/schema.sql`](database/schema.sql). It drops and recreates the
tables, so it is safe to re-run.

### 2. Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then fill in the values (see below)
python -m seed.seed         # loads the 4 demo meetings
uvicorn app.main:app --reload --port 8000
```
API docs are at http://localhost:8000/docs and a health check at `/health`.

The seeded meetings are dated relative to when you seed them so the dashboard shows Today / Yesterday /
This Week. To move the dates to "now" later without wiping chats or checked items:
`python -m seed.seed --dates`.

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:8000
npm run dev
```
Open http://localhost:5173.

## Environment variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | Defaults to `openai/gpt-oss-120b` |
| `FRONTEND_ORIGIN` | Allowed browser origin(s), comma-separated. Also used to build share links. Default `http://localhost:5173` |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend, no trailing slash |

`.env` files are git-ignored; only the `.env.example` templates are committed. Vite bundles `VITE_*`
values into the public JavaScript, so never put a secret there.

## Deployment

Deploy the backend first, because the frontend needs its URL.

### Backend on Render
1. New, Web Service, connect this repository.
2. **Root Directory** `backend` · **Build** `pip install -r requirements.txt` ·
   **Start** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add the environment variables above, plus `PYTHON_VERSION=3.11.9`.
4. Check `https://<service>.onrender.com/health`.

### Frontend on Vercel
1. Add New, Project, import this repository.
2. **Root Directory** `frontend` · Framework preset Vite · Build `npm run build` · Output `dist`.
3. Set `VITE_API_URL` to the Render URL.
4. `frontend/vercel.json` rewrites all paths to `index.html` so deep links such as `/calls/:id` work.

### Connect them
Set `FRONTEND_ORIGIN` on Render to the Vercel URL. The backend also allows any `*.vercel.app` origin
through a CORS regex, which covers preview deployments.

## API overview

| Method and path | Purpose |
|---|---|
| `GET /api/meetings` | Dashboard list with participants |
| `GET /api/meetings/{id}` | Meeting detail |
| `GET /api/meetings/{id}/transcript` | Speaker-labeled segments, including screen-share events |
| `GET /api/meetings/{id}/summary?template=` | Cached summary, generated on first request |
| `POST /api/meetings/{id}/summary` | Regenerate with a custom prompt |
| `GET`/`POST /api/meetings/{id}/action-items` | List and add action items |
| `PATCH /api/action-items/{id}` | Toggle completion |
| `GET /api/meetings/{id}/share` · `GET /api/shared/{token}` | Create and resolve a share link |
| `GET /api/search?q=` | Search titles and transcripts |
| `GET`/`POST`/`DELETE /api/meetings/{id}/chat` · `/api/chat` | Per-meeting and global Ask Fathom8x |

## Known limitations

- **One sample video.** Every seeded meeting points at the same public sample video, so clicking a call
  timestamp seeks proportionally into that video rather than to the exact moment. With real recordings the
  scale is 1. The video is hosted by a third party and could move.
- **No access control.** With no auth, the API is open and Row Level Security is off. Share links use an
  unguessable token, but the other endpoints are addressable by meeting id. This is acceptable for a demo
  and not for real customer data.
- **Free-tier cold starts** on Render, as noted above.
- The global chat sends every transcript to the model on each question, which works for 4 meetings and
  would not scale.

"""All Groq calls live here: Ask Fathom8x chat and summary generation."""
import json
import re
from functools import lru_cache

from groq import Groq

from app.core.config import get_settings

CHAT_SYSTEM = (
    "You are Ask Fathom8x, an assistant that answers questions about recorded meetings. "
    "Answer ONLY from the transcript(s) provided. If the answer is not in them, say you "
    "couldn't find it in the meeting. Be concise. When you cite a moment, include its "
    "timestamp in [mm:ss] form exactly as it appears in the transcript. Use plain text, "
    "short '- ' bullet lists and **bold** only; never use tables or headings."
)

TEMPLATE_GUIDE = {
    "general": "Balanced overview: the purpose of the meeting, key decisions and discussion points.",
    "sales": "Sales lens: customer needs and pain points, objections, buying signals, pricing, "
             "competitors, timeline and next steps in the deal.",
    "action_items": "Action lens: focus on commitments, owners, deadlines and decisions that "
                    "require follow-up.",
}


@lru_cache
def _client() -> Groq:
    return Groq(api_key=get_settings().groq_api_key)


def _complete(messages: list[dict], json_mode: bool = False) -> str:
    kwargs = {}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    resp = _client().chat.completions.create(
        model=get_settings().groq_model,
        messages=messages,
        temperature=0.3,
        max_completion_tokens=2048,
        reasoning_effort="low",
        **kwargs,
    )
    return (resp.choices[0].message.content or "").strip()


def fmt_ts(seconds: float) -> str:
    s = int(seconds)
    return f"{s // 60:02d}:{s % 60:02d}"


def format_transcript(segments: list[dict], names: dict[str, str]) -> str:
    lines = []
    for seg in segments:
        t = fmt_ts(float(seg["start_seconds"]))
        if seg["segment_type"] == "speech":
            who = names.get(seg.get("participant_id") or "", "Unknown")
            lines.append(f"[{t}] {who}: {seg['text']}")
        elif seg["segment_type"] == "screen_share_start":
            lines.append(f"[{t}] (screen share started: {seg['text']})")
        else:
            lines.append(f"[{t}] (screen share ended)")
    return "\n".join(lines)


def answer_question(question: str, context: str, history: list[dict]) -> str:
    messages = [
        {"role": "system", "content": CHAT_SYSTEM + "\n\nTRANSCRIPT(S):\n" + context},
        *history[-10:],
        {"role": "user", "content": question},
    ]
    return _complete(messages)


def generate_summary(meeting: dict, transcript: str, template: str,
                     custom_prompt: str | None) -> dict:
    guide = TEMPLATE_GUIDE[template]
    extra = f"\nUser customization: {custom_prompt}" if custom_prompt else ""
    prompt = (
        f"Summarize this meeting titled \"{meeting['title']}\".\n"
        f"Template: {template}. {guide}{extra}\n\n"
        "Return ONLY JSON with this shape:\n"
        '{"purpose": "1-2 sentence meeting purpose",\n'
        ' "key_takeaways": ["4-7 concise bullets"],\n'
        ' "highlights": [{"start_seconds": <number copied from a transcript timestamp>, '
        '"label": "short description of that moment"}]}\n'
        "Give 4-6 highlights in chronological order. start_seconds must correspond to "
        "real [mm:ss] timestamps in the transcript.\n\nTRANSCRIPT:\n" + transcript
    )
    raw = _complete([{"role": "user", "content": prompt}], json_mode=True)
    return parse_json(raw)


def parse_json(raw: str) -> dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", raw, re.S)
        if not m:
            raise ValueError("Model did not return JSON")
        return json.loads(m.group(0))

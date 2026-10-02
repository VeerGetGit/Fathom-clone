import { useMemo, useState } from "react";
import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { formatTimestamp } from "../../lib/format";
import { Avatar } from "../common/Avatar";
import { ErrorBox, Spinner } from "../common/States";

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  for (let idx = lower.indexOf(q); idx !== -1; idx = lower.indexOf(q, i)) {
    out.push(text.slice(i, idx));
    out.push(
      <mark key={idx} className="rounded bg-accent/30 px-0.5 text-white">
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    i = idx + q.length;
  }
  out.push(text.slice(i));
  return <>{out}</>;
}

export function TranscriptTab({
  meetingId,
  currentSeconds,
  onSeek,
  initialQuery = "",
}: {
  meetingId: string;
  currentSeconds: number;
  onSeek: (seconds: number) => void;
  initialQuery?: string;
}) {
  const { data, error, loading } = useFetch(() => api.transcript(meetingId), [meetingId]);
  const [query, setQuery] = useState(initialQuery);

  const visible = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return q ? data.filter((s) => s.text.toLowerCase().includes(q)) : data;
  }, [data, query]);

  const activeIndex = useMemo(() => {
    if (!data) return -1;
    let idx = -1;
    for (const s of data) if (s.start_seconds <= currentSeconds) idx = s.segment_index;
    return idx;
  }, [data, currentSeconds]);

  if (loading) return <Spinner label="Loading transcript…" />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcript"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
        {query.trim() && (
          <p className="mt-1.5 text-xs text-muted">
            {visible.length} {visible.length === 1 ? "match" : "matches"}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {visible.length === 0 && <p className="text-sm text-muted">No lines match “{query}”.</p>}
        {visible.map((s) => {
          if (s.segment_type !== "speech") {
            const starting = s.segment_type === "screen_share_start";
            return (
              <div key={s.id} className="flex justify-center">
                <button
                  onClick={() => onSeek(s.start_seconds)}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted hover:border-accent/60"
                >
                  🖥 {formatTimestamp(s.start_seconds)} ·{" "}
                  {starting ? `Screen sharing started: ${s.text}` : "Screen sharing ended"}
                </button>
              </div>
            );
          }
          const active = s.segment_index === activeIndex;
          return (
            <div key={s.id} className="flex items-start gap-3">
              <Avatar name={s.speaker ?? "?"} color={s.speaker_color} size={32} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{s.speaker}</span>
                  <button
                    onClick={() => onSeek(s.start_seconds)}
                    className="font-mono text-xs text-accent hover:underline"
                  >
                    {formatTimestamp(s.start_seconds)}
                  </button>
                </div>
                <div
                  className={`rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed transition-colors ${
                    active ? "bg-accent-dim ring-1 ring-accent/50" : "bg-surface-2"
                  }`}
                >
                  <Highlighted text={s.text} query={query.trim()} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

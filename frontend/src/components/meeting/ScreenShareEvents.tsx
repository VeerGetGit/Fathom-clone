import { api } from "../../api/client";
import { useFetch } from "../../hooks/useFetch";
import { formatTimestamp } from "../../lib/format";

/** Screen-share start/end events from the transcript, listed under the action items. */
export function ScreenShareEvents({
  meetingId,
  onSeek,
}: {
  meetingId: string;
  onSeek: (seconds: number) => void;
}) {
  const { data } = useFetch(() => api.transcript(meetingId), [meetingId]);
  const events = (data ?? []).filter((s) => s.segment_type !== "speech");
  if (events.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">Screen Sharing</h3>
      <ul className="space-y-2">
        {events.map((e) => {
          const starting = e.segment_type === "screen_share_start";
          return (
            <li key={e.id}>
              <button
                onClick={() => onSeek(e.start_seconds)}
                className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-surface-2"
              >
                <span className="mt-0.5">🖥</span>
                <span className="min-w-0 text-sm leading-snug">
                  {starting ? "Screen sharing started" : "Screen sharing ended"}
                  {starting && <span className="block text-xs text-muted">{e.text}</span>}
                </span>
                <span className="ml-auto shrink-0 rounded bg-accent-dim px-1.5 py-0.5 font-mono text-xs text-accent">
                  {formatTimestamp(e.start_seconds)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

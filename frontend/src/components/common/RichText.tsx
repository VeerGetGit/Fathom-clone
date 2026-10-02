import { Fragment } from "react";
import { parseMmSs } from "../../lib/format";

// The model sometimes cites ranges like [31:20-31:35] or adds 【source】 marks; keep the first timestamp.
function clean(text: string): string {
  return text
    .replace(/【[^】]*】/g, "")
    .replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\s*[-‐-―]\s*\d{1,2}:\d{2}(?::\d{2})?\]/g, "[$1]");
}

function inline(text: string, onSeek?: (s: number) => void) {
  const parts = clean(text).split(/(\*\*[^*]+\*\*|\[\d{1,2}:\d{2}(?::\d{2})?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const ts = part.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]$/);
    if (ts) {
      return onSeek ? (
        <button
          key={i}
          onClick={() => onSeek(parseMmSs(ts[1]))}
          className="rounded bg-accent-dim px-1 font-mono text-xs text-accent hover:brightness-125"
        >
          {ts[1]}
        </button>
      ) : (
        <span key={i} className="font-mono text-xs text-accent">
          {ts[1]}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Renders assistant answers: **bold**, "- " bullets, and [mm:ss] timestamps.
 * When onSeek is given, timestamps become buttons that seek the video.
 */
export function RichText({ text, onSeek }: { text: string; onSeek?: (s: number) => void }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const bullet = line.match(/^\s*[-*•]\s+(.*)/);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-accent">•</span>
              <span>{inline(bullet[1], onSeek)}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{inline(line, onSeek)}</p>;
      })}
    </div>
  );
}

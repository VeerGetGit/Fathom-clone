import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { formatTimestamp } from "../../lib/format";
import type { SearchGroup } from "../../types";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchGroup[] | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      api
        .search(term)
        .then((r) => {
          if (cancelled) return;
          setResults(r);
          setError(false);
        })
        .catch(() => !cancelled && setError(true));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function go(group: SearchGroup, seconds: number | null) {
    const params = new URLSearchParams({ tab: "transcript", q: q.trim() });
    if (seconds != null) params.set("t", String(seconds));
    setOpen(false);
    navigate(`/calls/${group.meeting_id}?${params}`);
  }

  return (
    <div ref={box} className="relative w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search meetings and transcripts"
        className="w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
      />
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[420px] overflow-y-auto rounded-xl border border-line bg-surface shadow-2xl">
          {error && <p className="p-4 text-sm text-red-300">Search failed. Is the API running?</p>}
          {!error && results && results.length === 0 && (
            <p className="p-4 text-sm text-muted">No results for “{q.trim()}”.</p>
          )}
          {results?.map((g) => (
            <div key={g.meeting_id} className="border-b border-line last:border-0">
              <button
                onClick={() => go(g, null)}
                className="w-full px-4 pb-1 pt-3 text-left text-sm font-semibold hover:text-accent"
              >
                {g.title}
              </button>
              {g.matches
                .filter((m) => m.type === "transcript")
                .slice(0, 3)
                .map((m, i) => (
                  <button
                    key={i}
                    onClick={() => go(g, m.start_seconds)}
                    className="flex w-full gap-3 px-4 py-1.5 text-left text-xs text-muted hover:bg-surface-2"
                  >
                    <span className="shrink-0 font-mono text-accent">
                      {formatTimestamp(m.start_seconds ?? 0)}
                    </span>
                    <span className="line-clamp-2">{m.snippet}</span>
                  </button>
                ))}
              <div className="h-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

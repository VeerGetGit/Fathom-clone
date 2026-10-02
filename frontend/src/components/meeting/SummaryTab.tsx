import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { formatTimestamp } from "../../lib/format";
import type { Summary, Template } from "../../types";
import { ErrorBox } from "../common/States";

const TEMPLATES: { value: Template; label: string }[] = [
  { value: "general", label: "General" },
  { value: "sales", label: "Sales" },
  { value: "action_items", label: "Action Items" },
];

function summaryToText(s: Summary): string {
  const takeaways = s.key_takeaways.map((t) => `• ${t}`).join("\n");
  const highlights = s.highlights.map((h) => `${formatTimestamp(h.start_seconds)} ${h.label}`).join("\n");
  return `Meeting Purpose\n${s.purpose}\n\nKey Takeaways\n${takeaways}\n\nHighlights\n${highlights}`;
}

export function SummaryTab({
  meetingId,
  onSeek,
  readOnly = false,
}: {
  meetingId: string;
  onSeek: (seconds: number) => void;
  readOnly?: boolean;
}) {
  const [template, setTemplate] = useState<Template>("general");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .summary(meetingId, template)
      .then((s) => !cancelled && setSummary(s))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [meetingId, template]);

  async function copy() {
    if (!summary) return;
    await navigator.clipboard.writeText(summaryToText(summary));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function regenerate() {
    setCustomizing(false);
    setLoading(true);
    setError(null);
    try {
      setSummary(await api.regenerateSummary(meetingId, template, prompt.trim() || null));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value as Template)}
          className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
        >
          {TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {!readOnly && (
          <button
            onClick={() => {
              setPrompt(summary?.custom_prompt ?? "");
              setCustomizing(true);
            }}
            className="rounded-lg border border-line px-3 py-1.5 text-sm text-zinc-300 hover:border-accent/60"
          >
            Customize
          </button>
        )}
        <button
          onClick={copy}
          disabled={!summary}
          className="ml-auto rounded-lg border border-line px-3 py-1.5 text-sm text-zinc-300 hover:border-accent/60 disabled:opacity-40"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex items-center gap-3 py-10 text-sm text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
          Generating summary…
        </div>
      ) : (
        summary && (
          <div className="space-y-7">
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                Meeting Purpose
              </h3>
              <p className="text-[15px] leading-relaxed">{summary.purpose}</p>
              {summary.custom_prompt && (
                <p className="mt-2 text-xs text-muted">Customized: “{summary.custom_prompt}”</p>
              )}
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                Key Takeaways
              </h3>
              <ul className="space-y-2.5">
                {summary.key_takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            {summary.highlights.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  Highlights
                </h3>
                <ul className="space-y-1.5">
                  {summary.highlights.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => onSeek(h.start_seconds)}
                        className="group flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-surface-2"
                      >
                        <span className="mt-0.5 shrink-0 rounded bg-accent-dim px-1.5 py-0.5 font-mono text-xs text-accent group-hover:brightness-125">
                          ▶ {formatTimestamp(h.start_seconds)}
                        </span>
                        <span className="text-sm text-zinc-200">{h.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )
      )}

      {customizing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setCustomizing(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-line bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 font-semibold">Customize summary</h3>
            <p className="mb-3 text-sm text-muted">
              Tell Fathom what to focus on. It will regenerate the {template.replace("_", " ")} summary.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="e.g. Focus on risks and budget decisions"
              className="w-full rounded-lg border border-line bg-surface-2 p-3 text-sm outline-none focus:border-accent"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCustomizing(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={regenerate}
                className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-black hover:brightness-110"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

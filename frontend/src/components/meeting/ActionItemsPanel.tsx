import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { formatTimestamp } from "../../lib/format";
import type { ActionItem } from "../../types";
import { ErrorBox, Spinner } from "../common/States";

export function ActionItemsPanel({
  meetingId,
  onSeek,
  readOnly = false,
}: {
  meetingId: string;
  onSeek: (seconds: number) => void;
  readOnly?: boolean;
}) {
  const [items, setItems] = useState<ActionItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setItems(null);
    api.actionItems(meetingId).then(setItems).catch((e: Error) => setError(e.message));
  }, [meetingId]);

  async function toggle(item: ActionItem) {
    const next = !item.is_completed;
    // optimistic update, rolled back if the request fails
    setItems((all) => all?.map((i) => (i.id === item.id ? { ...i, is_completed: next } : i)) ?? null);
    try {
      await api.setActionItem(item.id, next);
    } catch (e) {
      setItems((all) => all?.map((i) => (i.id === item.id ? { ...i, is_completed: !next } : i)) ?? null);
      setError((e as Error).message);
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const description = draft.trim();
    if (!description || adding) return;
    setAdding(true);
    try {
      const created = await api.createActionItem(meetingId, description);
      setItems((all) => [...(all ?? []), created]);
      setDraft("");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
    }
  }

  if (error && !items) return <ErrorBox message={error} />;
  if (!items) return <Spinner />;

  const done = items.filter((i) => i.is_completed).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Action Items</h3>
        <span className="text-xs text-muted">
          {done}/{items.length} done
        </span>
      </div>
      {items.length === 0 && <p className="text-sm text-muted">No action items.</p>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <input
              type="checkbox"
              checked={item.is_completed}
              disabled={readOnly}
              onChange={() => toggle(item)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-cyan-500"
            />
            <div className="min-w-0">
              <p className={`text-sm leading-snug ${item.is_completed ? "text-muted line-through" : ""}`}>
                {item.description}
              </p>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                {item.assignee && <span>{item.assignee}</span>}
                {item.start_seconds != null && (
                  <button
                    onClick={() => onSeek(item.start_seconds!)}
                    className="font-mono text-accent hover:underline"
                  >
                    {formatTimestamp(item.start_seconds)}
                  </button>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
      {!readOnly && (
        <form onSubmit={add} className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            placeholder="Add an action item"
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <button
            type="submit"
            disabled={adding || !draft.trim()}
            aria-label="Add action item"
            className="w-9 shrink-0 rounded-lg bg-accent text-lg font-semibold leading-none text-black transition enabled:hover:brightness-110 disabled:opacity-40"
          >
            +
          </button>
        </form>
      )}
    </div>
  );
}

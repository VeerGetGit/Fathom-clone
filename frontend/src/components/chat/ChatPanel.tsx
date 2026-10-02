import { useEffect, useRef, useState } from "react";
import { api } from "../../api/client";
import type { ChatMessage } from "../../types";
import { RichText } from "../common/RichText";

interface Props {
  /** Omit for the global (all meetings) chat. */
  meetingId?: string;
  suggestions: string[];
  placeholder?: string;
  onSeek?: (seconds: number) => void;
}

export function ChatPanel({ meetingId, suggestions, placeholder, onSeek }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    api
      .chatHistory(meetingId)
      .then((h) => !cancelled && setMessages(h))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", content: message }]);
    setBusy(true);
    try {
      const { answer } = await api.chat(message, meetingId);
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    await api.clearChat(meetingId).catch(() => undefined);
    setMessages([]);
    setError(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Try asking:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-left text-sm text-zinc-200 transition hover:border-accent/60"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-black">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[95%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2.5">
              <RichText text={m.content} onSeek={onSeek} />
            </div>
          ),
        )}
        {busy && <div className="text-sm text-muted">Fathom is thinking…</div>}
        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-xs text-red-300">
            {error}
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div className="border-t border-line p-3">
        {messages.length > 0 && (
          <button onClick={clear} className="mb-2 text-xs text-muted hover:text-zinc-200">
            Clear conversation
          </button>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder ?? "Ask Fathom…"}
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-lg bg-accent px-3.5 text-sm font-semibold text-black transition enabled:hover:brightness-110 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

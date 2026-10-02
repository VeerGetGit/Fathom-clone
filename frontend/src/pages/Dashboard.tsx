import { api } from "../api/client";
import { ChatPanel } from "../components/chat/ChatPanel";
import { ErrorBox, Spinner } from "../components/common/States";
import { MeetingCard } from "../components/dashboard/MeetingCard";
import { useFetch } from "../hooks/useFetch";

const SUGGESTIONS = [
  "What did we decide about the mobile app?",
  "Which meetings mention pricing?",
  "What action items do I own across all meetings?",
];

export function Dashboard() {
  const { data, error, loading } = useFetch(api.meetings, []);

  return (
    <div className="flex h-full">
      <section className="min-w-0 flex-1 overflow-y-auto p-6">
        <h1 className="mb-1 text-xl font-semibold">My Calls</h1>
        <p className="mb-6 text-sm text-muted">Recent recorded meetings</p>
        {loading && <Spinner />}
        {error && <ErrorBox message={`Couldn't load meetings: ${error}`} />}
        {data && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((m) => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        )}
      </section>

      <aside className="hidden w-[360px] shrink-0 flex-col border-l border-line bg-surface lg:flex">
        <div className="border-b border-line px-4 py-3.5">
          <h2 className="text-sm font-semibold">Ask Fathom</h2>
          <p className="text-xs text-muted">Ask anything across all your meetings</p>
        </div>
        <div className="min-h-0 flex-1">
          <ChatPanel suggestions={SUGGESTIONS} placeholder="Ask about all meetings…" />
        </div>
      </aside>
    </div>
  );
}

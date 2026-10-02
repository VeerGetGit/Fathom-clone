import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { ChatPanel } from "../components/chat/ChatPanel";
import { SplashScreen } from "../components/common/SplashScreen";
import { ErrorBox } from "../components/common/States";
import { MeetingCard } from "../components/dashboard/MeetingCard";
import { useFetch } from "../hooks/useFetch";
import { groupMeetings } from "../lib/groupMeetings";

const SUGGESTIONS = [
  "What did we decide about the mobile app?",
  "Which meetings mention pricing?",
  "What action items do I own across all meetings?",
];

// Show the splash only on the first dashboard load of a session.
let splashShown = false;

export function Dashboard() {
  const { data, error, loading } = useFetch(api.meetings, []);
  const [showSplash] = useState(() => !splashShown);
  useEffect(() => {
    splashShown = true;
  }, []);
  const groups = useMemo(() => (data ? groupMeetings(data) : []), [data]);

  return (
    <div className="flex h-full">
      {showSplash && <SplashScreen ready={!loading} />}
      <section className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
        {error && <ErrorBox message={`Couldn't load meetings: ${error}`} />}
        <div className="space-y-9">
          {groups.map((g) => (
            <div key={g.label}>
              <h2 className="mb-4 text-sm font-semibold text-zinc-300">{g.label}</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {g.meetings.map((m) => (
                  <MeetingCard key={m.id} meeting={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="hidden w-[340px] shrink-0 flex-col border-l border-line bg-surface lg:flex">
        <div className="border-b border-line px-4 py-3.5">
          <h2 className="text-sm font-semibold">Ask Fathom8x</h2>
          <p className="text-xs text-muted">Ask anything across all your meetings</p>
        </div>
        <div className="min-h-0 flex-1">
          <ChatPanel suggestions={SUGGESTIONS} placeholder="Ask about all meetings…" />
        </div>
      </aside>
    </div>
  );
}

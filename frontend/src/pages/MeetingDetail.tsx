import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { AvatarStack } from "../components/common/Avatar";
import { ChatPanel } from "../components/chat/ChatPanel";
import { ErrorBox, Spinner } from "../components/common/States";
import { ActionItemsPanel } from "../components/meeting/ActionItemsPanel";
import { ShareButton } from "../components/meeting/ShareButton";
import { SummaryTab } from "../components/meeting/SummaryTab";
import { TranscriptTab } from "../components/meeting/TranscriptTab";
import { VideoPlayer } from "../components/meeting/VideoPlayer";
import { useFetch } from "../hooks/useFetch";
import { useVideo } from "../hooks/useVideo";
import { formatDateTime, formatTimestamp } from "../lib/format";

type Tab = "summary" | "transcript" | "ask";
const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "SUMMARY" },
  { id: "transcript", label: "TRANSCRIPT" },
  { id: "ask", label: "ASK FATHOM" },
];

const SUGGESTIONS = [
  "What were the main decisions?",
  "What are the next steps and who owns them?",
  "Were any concerns or risks raised?",
];

export function MeetingDetail() {
  const { id = "" } = useParams();
  const { data: meeting, error, loading } = useFetch(() => api.meeting(id), [id]);
  const [params] = useSearchParams();
  const initialTab = params.get("tab");
  const [tab, setTab] = useState<Tab>(
    initialTab === "transcript" || initialTab === "ask" ? initialTab : "summary",
  );
  const { ref, seek, current, onTimeUpdate } = useVideo(meeting?.duration_seconds ?? 1);

  // Deep link from search: ?t=<seconds> seeks once the video metadata is available.
  const pendingSeek = useRef(params.get("t"));
  useEffect(() => {
    const t = pendingSeek.current;
    const video = ref.current;
    if (!t || !video || !meeting) return;
    const go = () => {
      seek(Number(t));
      pendingSeek.current = null;
    };
    if (video.readyState >= 1) go();
    else video.addEventListener("loadedmetadata", go, { once: true });
    return () => video.removeEventListener("loadedmetadata", go);
  }, [meeting, ref, seek]);

  if (loading) return <Spinner />;
  if (error || !meeting) return <ErrorBox message={error ?? "Meeting not found"} />;

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto p-6">
        <Link to="/" className="mb-4 inline-block text-sm text-muted hover:text-accent">
          ← All calls
        </Link>

        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{meeting.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {formatDateTime(meeting.started_at)} · {formatTimestamp(meeting.duration_seconds)}
            </p>
          </div>
          <AvatarStack people={meeting.participants} max={6} />
        </div>

        <VideoPlayer
          videoRef={ref}
          src={meeting.video_url}
          poster={meeting.thumbnail_url}
          onTimeUpdate={onTimeUpdate}
        />

        <div className="mt-5 flex gap-6 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 pb-3 text-xs font-semibold tracking-wider transition ${
                tab === t.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-1 h-[560px] overflow-y-auto rounded-b-xl">
          {tab === "summary" && <SummaryTab meetingId={meeting.id} onSeek={seek} />}
          {tab === "transcript" && (
            <TranscriptTab
              meetingId={meeting.id}
              currentSeconds={current}
              onSeek={seek}
              initialQuery={params.get("q") ?? ""}
            />
          )}
          {tab === "ask" && (
            <ChatPanel
              meetingId={meeting.id}
              suggestions={SUGGESTIONS}
              placeholder="Ask about this meeting…"
              onSeek={seek}
            />
          )}
        </div>
      </div>

      <aside className="w-full shrink-0 space-y-6 overflow-y-auto border-t border-line bg-surface p-5 xl:w-[340px] xl:border-l xl:border-t-0">
        <ShareButton meetingId={meeting.id} />
        <ActionItemsPanel meetingId={meeting.id} onSeek={seek} />
      </aside>
    </div>
  );
}

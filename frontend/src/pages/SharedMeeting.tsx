import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { AvatarStack } from "../components/common/Avatar";
import { Spinner } from "../components/common/States";
import { ActionItemsPanel } from "../components/meeting/ActionItemsPanel";
import { ScreenShareEvents } from "../components/meeting/ScreenShareEvents";
import { SummaryTab } from "../components/meeting/SummaryTab";
import { VideoPlayer } from "../components/meeting/VideoPlayer";
import { useFetch } from "../hooks/useFetch";
import { useVideo } from "../hooks/useVideo";
import { formatDateTime, formatTimestamp } from "../lib/format";

/** Public, read-only view reached through a share link. No nav, chat or editing. */
export function SharedMeeting() {
  const { token = "" } = useParams();
  const { data: meeting, error, loading } = useFetch(() => api.sharedMeeting(token), [token]);
  const { ref, seek, onTimeUpdate } = useVideo(meeting?.duration_seconds ?? 1);

  if (loading) return <Spinner />;
  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="mb-2 text-xl font-semibold">Link not found</h1>
        <p className="text-sm text-muted">This shared meeting link is invalid or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <header className="flex items-center gap-2 border-b border-line bg-surface px-6 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-black">
          F
        </span>
        <span className="text-lg font-semibold tracking-tight">Fathom</span>
        <span className="ml-3 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
          Shared meeting
        </span>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
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
          <div className="mt-5 border-b border-line">
            <span className="-mb-px inline-block border-b-2 border-accent pb-3 text-xs font-semibold tracking-wider text-accent">
              SUMMARY
            </span>
          </div>
          <SummaryTab meetingId={meeting.id} onSeek={seek} readOnly />
        </div>
        <aside className="h-fit rounded-xl border border-line bg-surface p-5">
          <ActionItemsPanel meetingId={meeting.id} onSeek={seek} readOnly />
          <div className="mt-6">
            <ScreenShareEvents meetingId={meeting.id} onSeek={seek} />
          </div>
        </aside>
      </div>
    </div>
  );
}

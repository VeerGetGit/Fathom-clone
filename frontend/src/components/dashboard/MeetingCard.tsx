import { Link } from "react-router-dom";
import { formatDate, formatTimestamp } from "../../lib/format";
import type { Meeting } from "../../types";
import { AvatarStack } from "../common/Avatar";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link
      to={`/calls/${meeting.id}`}
      className="group block overflow-hidden rounded-xl border border-line bg-surface transition hover:border-accent/60"
    >
      <div className="relative aspect-video bg-surface-2">
        {meeting.thumbnail_url && (
          <img
            src={meeting.thumbnail_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
          />
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-xs font-medium">
          {formatTimestamp(meeting.duration_seconds)}
        </span>
      </div>
      <div className="space-y-2 p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{meeting.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">{formatDate(meeting.started_at)}</span>
          <AvatarStack people={meeting.participants} />
        </div>
      </div>
    </Link>
  );
}

import type { Meeting } from "../types";

export interface MeetingGroup {
  label: string;
  meetings: Meeting[];
}

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Today / Yesterday / This Week (the rest of the last 7 days) / Earlier, in the viewer's timezone. */
export function groupMeetings(meetings: Meeting[], now = new Date()): MeetingGroup[] {
  const today = startOfDay(now);
  const buckets: MeetingGroup[] = [
    { label: "Today", meetings: [] },
    { label: "Yesterday", meetings: [] },
    { label: "This Week", meetings: [] },
    { label: "Earlier", meetings: [] },
  ];

  const sorted = [...meetings].sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  );
  for (const m of sorted) {
    const day = startOfDay(new Date(m.started_at));
    const daysAgo = Math.round((today - day) / DAY);
    const idx = daysAgo <= 0 ? 0 : daysAgo === 1 ? 1 : daysAgo < 7 ? 2 : 3;
    buckets[idx].meetings.push(m);
  }
  return buckets.filter((b) => b.meetings.length > 0);
}

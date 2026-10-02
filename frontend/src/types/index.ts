export interface Participant {
  id?: string;
  name: string;
  role?: string | null;
  is_host: boolean;
  avatar_color: string | null;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  meeting_type: string;
  started_at: string;
  duration_seconds: number;
  video_url: string | null;
  thumbnail_url: string | null;
  share_token: string;
  participants: Participant[];
}

export interface TranscriptSegment {
  id: string;
  segment_index: number;
  segment_type: "speech" | "screen_share_start" | "screen_share_end";
  start_seconds: number;
  end_seconds: number | null;
  text: string;
  speaker: string | null;
  speaker_color: string | null;
}

export interface Highlight {
  id: string;
  start_seconds: number;
  label: string;
}

export type Template = "general" | "sales" | "action_items";

export interface Summary {
  id: string;
  template: Template;
  purpose: string;
  key_takeaways: string[];
  custom_prompt: string | null;
  highlights: Highlight[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string | null;
  start_seconds: number | null;
  is_completed: boolean;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

export interface SearchGroup {
  meeting_id: string;
  title: string;
  matches: { type: "title" | "transcript"; snippet: string; start_seconds: number | null }[];
}

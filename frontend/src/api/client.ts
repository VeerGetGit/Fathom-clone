import type {
  ActionItem,
  ChatMessage,
  Meeting,
  SearchGroup,
  Summary,
  Template,
  TranscriptSegment,
} from "../types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let detail: unknown = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return res.json() as Promise<T>;
}

const post = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
  meetings: () => request<Meeting[]>("/api/meetings"),
  meeting: (id: string) => request<Meeting>(`/api/meetings/${id}`),
  sharedMeeting: (token: string) => request<Meeting>(`/api/shared/${token}`),
  transcript: (id: string) => request<TranscriptSegment[]>(`/api/meetings/${id}/transcript`),
  summary: (id: string, template: Template) =>
    request<Summary>(`/api/meetings/${id}/summary?template=${template}`),
  regenerateSummary: (id: string, template: Template, custom_prompt: string | null) =>
    request<Summary>(`/api/meetings/${id}/summary`, post({ template, custom_prompt })),
  actionItems: (id: string) => request<ActionItem[]>(`/api/meetings/${id}/action-items`),
  setActionItem: (id: string, is_completed: boolean) =>
    request<ActionItem>(`/api/action-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_completed }),
    }),
  shareLink: (id: string) => request<{ url: string; path: string }>(`/api/meetings/${id}/share`),
  search: (q: string) => request<SearchGroup[]>(`/api/search?q=${encodeURIComponent(q)}`),
  chatHistory: (meetingId?: string) =>
    request<ChatMessage[]>(meetingId ? `/api/meetings/${meetingId}/chat` : "/api/chat"),
  chat: (message: string, meetingId?: string) =>
    request<{ answer: string }>(
      meetingId ? `/api/meetings/${meetingId}/chat` : "/api/chat",
      post({ message }),
    ),
  clearChat: (meetingId?: string) =>
    request<{ ok: boolean }>(meetingId ? `/api/meetings/${meetingId}/chat` : "/api/chat", {
      method: "DELETE",
    }),
};

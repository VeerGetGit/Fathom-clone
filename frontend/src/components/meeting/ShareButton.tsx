import { useState } from "react";
import { api } from "../../api/client";

export function ShareButton({ meetingId }: { meetingId: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function share() {
    try {
      const { path } = await api.shareLink(meetingId);
      // build from the page origin so the link works wherever the app is deployed
      await navigator.clipboard.writeText(window.location.origin + path);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      onClick={share}
      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
    >
      {state === "copied" ? "Link copied ✓" : state === "error" ? "Couldn't copy" : "Share"}
    </button>
  );
}

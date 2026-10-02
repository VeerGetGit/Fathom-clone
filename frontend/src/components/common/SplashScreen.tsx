import { useEffect, useState } from "react";
import { APP_NAME, LogoMark } from "./Logo";

const FADE_MS = 400;
const SLOW_MS = 6000;

/** Full-screen loader. Fades out once `ready` is true, then unmounts itself. */
export function SplashScreen({ ready }: { ready: boolean }) {
  const [gone, setGone] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(t);
  }, [ready]);

  // the free-tier backend can take about a minute to wake up
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), SLOW_MS);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
      style={{
        animation: `splash-in ${FADE_MS}ms ease-out`,
        opacity: ready ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-in`,
        pointerEvents: ready ? "none" : "auto",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="splash-logo flex items-center gap-4" style={{ animation: "logo-breathe 2.4s ease-in-out infinite" }}>
        <LogoMark size={72} />
        <span className="text-5xl font-semibold tracking-tight">{APP_NAME}</span>
      </div>
      <p className="text-sm text-muted">Loading your meetings...</p>
      {slow && !ready && (
        <p className="max-w-xs text-center text-xs text-muted/70">
          The server is waking up. This can take up to a minute.
        </p>
      )}
    </div>
  );
}

import { useState, type RefObject } from "react";

export function VideoPlayer({
  videoRef,
  src,
  poster,
  onTimeUpdate,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string | null;
  poster: string | null;
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  const [failed, setFailed] = useState(false);
  // bumping the key remounts the <video> so Retry re-requests the file
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black">
      {src && !failed ? (
        <video
          key={attempt}
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          controls
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onError={() => setFailed(true)}
          className="aspect-video w-full"
        />
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-3 text-sm text-muted">
          {src ? (
            <>
              <p>The recording couldn’t be loaded.</p>
              <button
                onClick={() => {
                  setFailed(false);
                  setAttempt((a) => a + 1);
                }}
                className="rounded-lg border border-line px-3 py-1.5 text-zinc-200 hover:border-accent/60"
              >
                Retry
              </button>
            </>
          ) : (
            <p>No recording available</p>
          )}
        </div>
      )}
    </div>
  );
}

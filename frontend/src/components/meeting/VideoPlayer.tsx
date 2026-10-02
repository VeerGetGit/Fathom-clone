import type { RefObject } from "react";

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
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          controls
          onTimeUpdate={onTimeUpdate}
          preload="metadata"
          className="aspect-video w-full"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center text-sm text-muted">
          No recording available
        </div>
      )}
    </div>
  );
}

import { useCallback, useRef, useState } from "react";

/**
 * Controls the <video> element. The seeded demo uses one short sample video for every
 * call, so call timestamps are scaled onto the video's real length. With a real
 * recording the two durations match and the scale is 1.
 */
export function useVideo(callDuration: number) {
  const ref = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);

  const scale = useCallback(() => {
    const d = ref.current?.duration;
    return d && isFinite(d) ? d / callDuration : 1;
  }, [callDuration]);

  const seek = useCallback(
    (callSeconds: number) => {
      const v = ref.current;
      if (!v) return;
      v.currentTime = Math.min(callSeconds * scale(), (v.duration || Infinity) - 0.1);
      void v.play().catch(() => undefined);
      v.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    [scale],
  );

  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => setCurrent(e.currentTarget.currentTime / scale()),
    [scale],
  );

  return { ref, seek, current, onTimeUpdate };
}

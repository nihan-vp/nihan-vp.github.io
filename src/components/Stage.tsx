import { useEffect, useRef, useState } from "react";
import { createStage } from "../three/stage";

/** Mounts the single persistent WebGL canvas; falls back to a pure-CSS atmosphere without WebGL. */
export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const dispose = createStage(ref.current!);
    if (!dispose) setFallback(true);
    return () => dispose?.();
  }, []);

  return (
    <>
      {fallback && <div className="stage-fallback" aria-hidden="true" />}
      <canvas ref={ref} className="stage" aria-hidden="true" />
    </>
  );
}

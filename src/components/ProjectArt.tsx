import { useEffect, useRef } from "react";
import { DRAWERS } from "../art/draw";
import { prefersReduced, isTouch } from "../core/motion";

/** A self-pausing canvas: only animates while on screen, sized to its container, DPR-capped. */
export default function ProjectArt({ kind, accent, className = "" }: { kind: keyof typeof DRAWERS; accent: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = DRAWERS[kind];
    let raf = 0;
    let on = false;
    let w = 0;
    let h = 0;
    const m = { x: 0, y: 0, sx: 0, sy: 0 };
    const t0 = performance.now();

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame(prefersReduced ? 4 : (performance.now() - t0) / 1000);
    };
    const frame = (t: number) => {
      m.sx += (m.x - m.sx) * 0.06;
      m.sy += (m.y - m.sy) * 0.06;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, t, accent, m.sx, m.sy);
    };
    const loop = () => {
      if (!on) return;
      frame((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        on = e.isIntersecting && !prefersReduced;
        cancelAnimationFrame(raf);
        if (on) loop();
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      m.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    if (!isTouch) window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [kind, accent]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

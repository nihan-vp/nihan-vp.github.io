import { useEffect, useRef } from "react";
import { gsap, isTouch } from "../core/motion";

/** Custom cursor: precise dot + lagging ring that expands (with an optional label) over interactive elements. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "none" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "none" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      document.documentElement.classList.add("cursor-live");
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    let domHover = false;
    let clayLabel = "";
    const syncRing = () => {
      const r = ring.current;
      if (!r || domHover) return;
      if (clayLabel) {
        r.classList.add("is-hover", "has-label");
        if (label.current) label.current.textContent = clayLabel;
      } else {
        r.classList.remove("is-hover", "has-label");
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a,button,[data-cursor],input,textarea");
      const r = ring.current!;
      if (t) {
        domHover = true;
        const txt = t.dataset.cursor;
        r.classList.add("is-hover");
        r.classList.toggle("has-label", !!txt);
        if (label.current) label.current.textContent = txt || "";
      } else {
        domHover = false;
        syncRing();
      }
    };
    const onClay = (e: Event) => {
      clayLabel = (e as CustomEvent<string>).detail || "";
      syncRing();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("clay-cursor", onClay);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("clay-cursor", onClay);
    };
  }, []);

  if (isTouch) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

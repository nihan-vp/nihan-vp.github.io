import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "../data/content";
import { gsap, ScrollTrigger, scrollToId, stopScroll, startScroll } from "../core/motion";
import { setSound } from "../core/audio";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [sound, setSoundState] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // Track the current chapter + page progress
  useEffect(() => {
    const triggers = CHAPTERS.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 55%",
        end: "bottom 55%",
        refreshPriority: -1, // measure after the pinned project scroller has added its spacing
        onToggle: (s) => s.isActive && setActive(i),
      })
    );
    const prog = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (s) => bar.current && (bar.current.style.transform = `scaleX(${s.progress})`),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      prog.kill();
    };
  }, []);

  // Menu open/close with scroll lock, Escape, focus management
  useEffect(() => {
    const el = menu.current!;
    if (open) {
      stopScroll();
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(".menu-link .mask > span", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: "expo.out", delay: 0.3 });
      (el.querySelector("a,button") as HTMLElement | null)?.focus();
    } else {
      startScroll();
      gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: () => void gsap.set(el, { display: "none" }) });
    }
    const key = (e: KeyboardEvent) => e.key === "Escape" && open && (setOpen(false), btn.current?.focus());
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 450);
  };

  return (
    <>
      <div className="progress" aria-hidden="true"><div ref={bar} /></div>
      <header className="nav">
        <button className="nav-mark" onClick={() => go("explore")} aria-label="Nihan Ali V P — back to top" data-magnetic>
          <span>NVP</span>
        </button>
        <div className="nav-chapter mono" aria-live="polite">
          <span>{CHAPTERS[active].no}</span>
          <i />
          <span>{CHAPTERS[active].label}</span>
        </div>
        <div className="nav-right">
          <button
            className={`sound ${sound ? "on" : ""}`}
            aria-pressed={sound}
            aria-label={sound ? "Mute atmospheric sound" : "Enable atmospheric sound (off by default)"}
            data-cursor={sound ? "Mute" : "Sound"}
            onClick={() => {
              const next = !sound;
              setSoundState(next);
              setSound(next);
            }}
          >
            <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="mono">{sound ? "On" : "Off"}</span>
          </button>
          <button
            ref={btn}
            className="menu-btn mono"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
            data-magnetic
          >
            <span>{open ? "Close" : "Index"}</span>
            <b aria-hidden="true" className={open ? "x" : ""}><i /><i /></b>
          </button>
        </div>
      </header>

      <div id="menu" ref={menu} className="menu" role="dialog" aria-modal="true" aria-label="Site index" style={{ display: "none" }}>
        <nav aria-label="Chapters">
          <ul>
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={`menu-link ${i === active ? "is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(c.id);
                  }}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="mono">{c.no}</span>
                  <span className="mask"><span>{c.label}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="menu-foot mono">Creativity first. Technology underneath.</p>
      </div>
    </>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { PROJECTS } from "../data/content";
import ProjectArt from "../components/ProjectArt";
import CaseStudy from "../components/CaseStudy";
import { gsap, ScrollTrigger, stopScroll, startScroll } from "../core/motion";

/** CHAPTER 04 — THE PROJECT UNIVERSE. Pinned horizontal journey on desktop, vertical on touch/mobile. */
export default function Projects() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 820px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: () => "+=" + dist() * 1.05,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (s) => setCur(Math.min(PROJECTS.length - 1, Math.round(s.progress * (PROJECTS.length - 1)))),
        },
      });
      // depth: art drifts slower than titles
      gsap.utils.toArray<HTMLElement>(".panel").forEach((p) => {
        gsap.fromTo(p.querySelector(".p-art"), { xPercent: 12 }, { xPercent: -12, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        gsap.fromTo(p.querySelector(".p-title"), { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  const open = useCallback((i: number) => {
    setOpenIdx(i);
    stopScroll();
  }, []);
  const close = useCallback(() => {
    setOpenIdx(null);
    startScroll();
    setTimeout(() => ScrollTrigger.refresh(), 50);
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const i = PROJECTS.findIndex((p) => p.id === id);
      if (i >= 0) open(i);
    };
    window.addEventListener("open-project", h);
    return () => window.removeEventListener("open-project", h);
  }, [open]);

  return (
    <section id="projects" data-cam="projects" className="projects" aria-labelledby="proj-h">
      <div className="projects-intro">
        <div className="chapter-head mono">
          <span>04</span>
          <i />
          <span id="proj-h">The Project Universe</span>
        </div>
        <h2 data-reveal="chars">Six worlds. Six different languages.</h2>
        <p data-reveal="fade">
          Each project has its own atmosphere, type and motion — and its own honesty rules. Artwork on these pages is interpretive; anything unverified is labelled as such.
        </p>
      </div>

      <div ref={wrap} className="hs-wrap">
        <div ref={track} className="hs-track">
          {PROJECTS.map((p, i) => (
            <article key={p.id} className={`panel ${p.fontClass}`} style={{ background: p.bg, color: p.ink, ["--accent" as string]: p.accent }} aria-label={p.title}>
              <div className="p-art"><ProjectArt kind={p.art} accent={p.accent} /></div>
              <div className="p-shade" />
              <div className="p-inner">
                <div className="p-top mono">
                  <span>{p.no} / 06</span>
                  <span>{p.category}</span>
                </div>
                <h3 className="p-title">
                  {p.id === "quran" && <span className="ar" lang="ar" dir="rtl">القرآن الكريم</span>}
                  <span className="p-name">{p.display}</span>
                </h3>
                <div className="p-bottom">
                  <p className="p-tag">{p.tagline}</p>
                  <div className="p-meta">
                    <span className="chip mono">{p.status}</span>
                    <button className="btn" data-magnetic data-cursor="Open" onClick={() => open(i)} aria-label={`Open case study: ${p.title}`}>
                      <span>Case study</span>
                      <b aria-hidden="true">↗</b>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hs-hud mono" aria-hidden="true">
          <span>{String(cur + 1).padStart(2, "0")}</span>
          <div className="hs-bar"><i style={{ transform: `scaleX(${(cur + 1) / PROJECTS.length})` }} /></div>
          <span>06</span>
        </div>
      </div>

      {openIdx !== null && (
        <CaseStudy
          key={PROJECTS[openIdx].id}
          project={PROJECTS[openIdx]}
          index={openIdx}
          total={PROJECTS.length}
          onClose={close}
          onNav={(d: 1 | -1) => setOpenIdx((openIdx + d + PROJECTS.length) % PROJECTS.length)}
        />
      )}
    </section>
  );
}

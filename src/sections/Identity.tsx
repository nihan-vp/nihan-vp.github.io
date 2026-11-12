import { useEffect, useRef } from "react";
import { gsap, prefersReduced, isMobile } from "../core/motion";
import { PROFILE } from "../data/content";

const BEATS = [
  {
    word: "Code.",
    cap: "Full-stack by trade. Web, mobile and backend — from interfaces in React to cross-platform apps in Flutter.",
    path: "M20 150 L80 150 L80 50 L140 50 L140 150 L200 150 L200 50 L260 50 L260 150 L320 150 L320 50 L380 50",
  },
  {
    word: "Circuit.",
    cap: "Electronics by instinct. PCB design, microcontrollers and IoT devices — made to be held, not only viewed.",
    path: "M20 100 L80 100 L100 50 L140 150 L180 50 L220 150 L260 50 L300 150 L320 100 L380 100",
  },
  {
    word: "Cut.",
    cap: "Video editing by eye. Rhythm, motion and story decide how an idea is shown.",
    path: "M20 100 C70 20 120 20 170 100 S270 180 320 100 S370 40 380 100",
  },
  {
    word: "Curiosity.",
    cap: "Experimentation by habit — local language models, a rescue rover, a research-stage drone. Built to be understood.",
    path: "M20 150 C100 150 100 50 200 50 C300 50 300 150 380 150",
  },
];

/** CHAPTER 02 — THE IDENTITY. Manifesto reading, then four pinned kinetic beats with an SVG that morphs between them. */
export default function Identity() {
  const beats = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".beat");
      const mob = isMobile();
      gsap.set(items, { opacity: 0 });
      gsap.set(items[0], { opacity: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: beats.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
        defaults: { ease: "none" },
      });
      items.forEach((el, i) => {
        if (i > 0) {
          tl.fromTo(
            el,
            { opacity: 0, rotationX: -55, z: -600, filter: "blur(18px)", clipPath: "inset(0 0 100% 0)" },
            { opacity: 1, rotationX: 0, z: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)", duration: 0.55 },
            i
          );
          tl.to(".glyph-path", { morphSVG: { shape: BEATS[i].path, shapeIndex: "auto" }, duration: 0.55 }, i);
        }
        if (i < items.length - 1) {
          tl.to(el, { opacity: 0, rotationX: 55, z: mob ? 200 : 420, filter: "blur(16px)", duration: 0.4 }, i + 0.62);
        }
      });
      tl.to({}, { duration: 0.3 }); // hold on last beat
    }, beats);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" data-cam="about" className="identity" aria-labelledby="about-h">
      <div className="chapter-head mono">
        <span>02</span>
        <i />
        <span id="about-h">The Identity</span>
      </div>

      <p className="manifesto" data-scrub="chars">
        {PROFILE.name} is a multidisciplinary developer from Kerala who moves between code, electronics, design and experimentation — building apps, devices and
        ideas that don't stay inside one discipline.
      </p>

      <div ref={beats} className="beats" role="list" aria-label="Four ways of working">
        <div className="beats-pin">
          <svg className="glyph" viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <path className="glyph-path" d={BEATS[0].path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="beat-stage">
            {BEATS.map((b, i) => (
              <div key={b.word} className="beat" role="listitem">
                <span className="beat-i mono">0{i + 1} / 04</span>
                <h3>{b.word}</h3>
                <p>{b.cap}</p>
              </div>
            ))}
          </div>
          <div className="beat-hint mono" aria-hidden="true">Scroll — the form changes with the thought</div>
        </div>
      </div>

      <div className="philosophy">
        <h2 data-reveal="chars">Where creativity</h2>
        <h2 data-reveal="chars" className="dim">meets technology.</h2>
        <div className="phil-grid">
          <p data-reveal="fade"><b>Build to understand.</b> Every project here began as a question — how does this work, and can it work better?</p>
          <p data-reveal="fade"><b>Show the work honestly.</b> What is built, what is research and what is only a goal are always kept apart.</p>
          <p data-reveal="fade"><b>Let the technology disappear.</b> The engineering matters most when the experience feels effortless.</p>
        </div>
        <p className="gh-line mono" data-reveal="fade">
          Currently building — {PROFILE.githubBio.building} &nbsp;·&nbsp; Learning — {PROFILE.githubBio.learning}
        </p>
      </div>
    </section>
  );
}

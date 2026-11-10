import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "../core/motion";
import { PROFILE } from "../data/content";

const Chars = ({ text }: { text: string }) => (
  <span className="mask-line" aria-hidden="true">
    {text.split("").map((c, i) => (
      <span key={i} className={c === " " ? "ch sp" : "ch"}>
        <span>{c === " " ? "\u00A0" : c}</span>
      </span>
    ))}
  </span>
);

/** CHAPTER 01 — THE AWAKENING. A 320vh scene: the camera dives into the form as the title dissolves. */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Opening sequence
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(".hero .ch > span, .hero-fade", { yPercent: 0, opacity: 1 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(".hero-name .ch > span", { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.6, ease: "expo.out", stagger: 0.045 })
        .fromTo(".hero-fade", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12 }, "-=1.1");
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Scroll-scrubbed dissolve: title → statement
  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        defaults: { ease: "none" },
      });
      tl.to(".hero-roles, .hero-top, .scroll-cue", { opacity: 0, y: -30, duration: 0.18 }, 0)
        .to(".hero-name .ch", { yPercent: (i: number) => -30 - (i % 3) * 18, opacity: 0, rotate: (i: number) => (i % 2 ? 7 : -7), duration: 0.45, stagger: 0.012 }, 0.05)
        .fromTo(".hero-statement", { opacity: 0, scale: 0.92, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2 }, 0.42)
        .fromTo(".hero-statement .st-line > span", { yPercent: 100 }, { yPercent: 0, duration: 0.2, stagger: 0.06 }, 0.42)
        .to(".hero-statement", { opacity: 0, scale: 1.08, filter: "blur(10px)", duration: 0.14 }, 0.88);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="explore" ref={root} className="hero" aria-label="Introduction">
      <div data-cam="hero" className="anchor" style={{ top: 0 }} />
      <div data-cam="heroEnd" className="anchor" style={{ top: "72%" }} />
      <div className="hero-pin">
        <div className="hero-top mono hero-fade">
          <span>Portfolio — MMXXVI</span>
          <span>{PROFILE.location}</span>
        </div>

        <h1 className="hero-name" aria-label="Nihan Ali V P">
          <Chars text="NIHAN" />
          <Chars text="ALI V P" />
        </h1>

        <ul className="hero-roles mono hero-fade" aria-label="Disciplines">
          {PROFILE.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <p className="hero-statement" aria-label={PROFILE.statement}>
          <span className="st-line"><span>I build across the</span></span>
          <span className="st-line"><span>boundaries of <em>software,</em></span></span>
          <span className="st-line"><span><em>hardware</em> and imagination.</span></span>
        </p>

        <div className="scroll-cue mono hero-fade" aria-hidden="true">
          <i />
          <span>Scroll to enter</span>
        </div>
      </div>
    </section>
  );
}

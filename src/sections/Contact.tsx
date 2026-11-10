import { useEffect, useRef } from "react";
import { LINKS } from "../data/content";
import { gsap, prefersReduced } from "../core/motion";

const ROWS = [
  { k: "LinkedIn", ...LINKS.linkedin },
  { k: "GitHub", ...LINKS.github },
  { k: "Instagram", ...LINKS.instagram },
  { k: "Portfolio", ...LINKS.portfolio },
  { k: "Company", ...LINKS.pro26 },
  { k: "Google Developer", ...LINKS.gdev },
];

/** FINAL TRANSMISSION. */
export default function Contact() {
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".fin-name", { letterSpacing: "0.14em", opacity: 0.15 }, { letterSpacing: "0.02em", opacity: 1, ease: "none", scrollTrigger: { trigger: fin.current, start: "top 95%", end: "top 30%", scrub: 0.6 } });
    }, fin);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" data-cam="contact" className="contact" aria-labelledby="ct-h">
      <div className="chapter-head mono"><span>08</span><i /><span>Final transmission</span></div>
      <h2 id="ct-h" className="ct-title" data-reveal="chars">Have an idea worth building?</h2>
      <p className="ct-sub" data-reveal="fade">
        The fastest way to reach Nihan is through the profiles below. ROC AI can also point you to the right place.
      </p>

      <ul className="ct-links">
        {ROWS.map((r) => (
          <li key={r.k}>
            <a href={r.href} target="_blank" rel="noopener noreferrer" data-cursor="Open" data-magnetic>
              <span className="mono">{r.k}</span>
              <strong className="vf">{r.label}</strong>
              <b aria-hidden="true">↗</b>
            </a>
          </li>
        ))}
      </ul>
      <p className="ct-note mono">Email and phone are not published on this site.</p>

      <div ref={fin} className="fin">
        <div className="fin-name" aria-label="Nihan Ali V P">NIHAN ALI V P</div>
        <p className="fin-tag mono">
          Built through curiosity.<br />
          Driven by experimentation.
        </p>
      </div>

      <footer className="foot mono">
        <span>© {new Date().getFullYear()} Nihan Ali V P</span>
        <span>nihanvp.in</span>
        <span>React · Three.js · GSAP · Lenis</span>
      </footer>
    </section>
  );
}

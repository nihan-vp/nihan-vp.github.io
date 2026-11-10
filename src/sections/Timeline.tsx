import { useEffect, useRef, useState } from "react";
import { TRACKS, type Track } from "../data/content";
import { gsap, prefersReduced } from "../core/motion";

const Y0 = 2022;
const Y1 = 2027; // axis end (exclusive)
const pct = (y: number, m: number) => ((y + (m - 1) / 12 - Y0) / (Y1 - Y0)) * 100;
const MONTH = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const period = (t: Track) => {
  if (!t.dated || !t.start) return "Dates not published";
  const a = `${MONTH[t.start[1]]} ${t.start[0]}`;
  const b = t.end === "present" ? "Present" : t.end ? `${MONTH[t.end[1]]} ${t.end[0]}` : "";
  return `${a} — ${b}`;
};

/** CHAPTER 05 — EXPERIENCE. A cinematic multi-lane timeline that keeps employment, freelance, independent work and research apart. */
export default function Timeline() {
  const [sel, setSel] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const now = new Date();
  const nowP = Math.min(100, pct(now.getFullYear(), now.getMonth() + 1));

  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bar",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 65%", scrub: 0.8 } }
      );
      gsap.fromTo(".now", { opacity: 0 }, { opacity: 1, scrollTrigger: { trigger: root.current, start: "40% 70%", end: "70% 60%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  const t = TRACKS[sel];
  return (
    <section id="experience" data-cam="experience" className="timeline" aria-labelledby="tl-h">
      <div className="chapter-head mono"><span>05</span><i /><span id="tl-h">Experience</span></div>
      <h2 data-reveal="chars">A progression, not a résumé.</h2>
      <p className="tl-lede" data-reveal="fade">
        Employment, freelance work, independent software, hardware experiments and research run in parallel — so each has its own lane. Solid bars carry published dates; dashed bars are real work whose dates aren't published.
      </p>

      <div ref={root} className="tl" role="group" aria-label="Interactive career timeline">
        <div className="tl-axis mono" aria-hidden="true">
          {Array.from({ length: Y1 - Y0 }, (_, i) => (
            <span key={i} style={{ left: `${(i / (Y1 - Y0)) * 100}%` }}>{Y0 + i}</span>
          ))}
        </div>
        <div className="tl-lanes">
          <div className="now mono" style={{ left: `${nowP}%` }} aria-hidden="true"><span>Today</span></div>
          {TRACKS.map((tr, i) => {
            const l = tr.start ? pct(tr.start[0], tr.start[1]) : 4;
            const r = tr.end === "present" ? nowP : tr.end ? pct(tr.end[0], tr.end[1]) : 96;
            return (
              <button key={tr.id} className={`lane ${sel === i ? "is-on" : ""}`} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-pressed={sel === i} data-cursor="View">
                <span className="lane-label mono">{tr.label}</span>
                <span className="lane-track">
                  <span
                    className={`bar ${tr.dated ? "" : "undated"}`}
                    style={{ left: `${l}%`, width: `${Math.max(2, r - l)}%`, ["--c" as string]: tr.color }}
                  >
                    <span className="bar-t">{tr.dated ? tr.title : "dates not published"}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="tl-detail" key={t.id} aria-live="polite">
          <span className="chip mono" style={{ ["--c" as string]: t.color }}>{t.kind}</span>
          <h3>{t.title}</h3>
          <p className="mono">{period(t)}</p>
          <p>{t.desc}</p>
        </div>
      </div>
    </section>
  );
}

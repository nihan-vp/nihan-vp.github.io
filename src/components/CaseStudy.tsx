import { useEffect, useRef } from "react";
import { PROJECTS, type Project } from "../data/content";
import ProjectArt from "./ProjectArt";
import { gsap, prefersReduced } from "../core/motion";

interface Props {
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}

/** Expanded case study — typography and palette inherited from the project's own identity. */
export default function CaseStudy({ project: p, index, total, onClose, onNav }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = root.current!;
    el.scrollTop = 0;
    if (!prefersReduced) {
      gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".cs-rise"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.5 });
      gsap.fromTo(el.querySelectorAll(".cs-fade"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.07, delay: 0.7 });
    }
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "Tab") {
        const f = el.querySelectorAll<HTMLElement>("button,a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose, onNav]);

  const next = (index + 1) % total;
  return (
    <div
      ref={root}
      className={`cs ${p.fontClass}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.title} case study`}
      data-lenis-prevent
      style={{ background: p.bg, color: p.ink, ["--accent" as string]: p.accent }}
    >
      <div className="cs-bar mono">
        <span>{p.no} / 0{total}</span>
        <span className="cs-cat">{p.category}</span>
        <button ref={closeBtn} className="cs-close" onClick={onClose} aria-label="Close case study" data-cursor="Close">
          Close <b aria-hidden="true">✕</b>
        </button>
      </div>

      <header className="cs-hero">
        <div className="cs-art"><ProjectArt kind={p.art} accent={p.accent} /></div>
        <div className="cs-shade" />
        <h2 className="cs-title">
          {p.id === "quran" && <span className="ar" lang="ar" dir="rtl">القرآن الكريم</span>}
          <span className="mask"><span className="cs-rise">{p.display}</span></span>
        </h2>
        <p className="cs-tag cs-fade">{p.tagline}</p>
      </header>

      <div className="cs-body">
        <p className="cs-sum cs-fade">{p.summary}</p>

        <dl className="cs-facts cs-fade">
          <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
          {p.facts.map((f) => (
            <div key={f.k}><dt className="mono">{f.k}</dt><dd>{f.v}</dd></div>
          ))}
        </dl>

        {p.maturity && (
          <div className="cs-mat cs-fade">
            <h3 className="mono">Maturity ladder — what is and isn't claimed</h3>
            <ol>
              {p.maturity.map((m) => (
                <li key={m.step} className={`m-${m.state}`}>
                  <i aria-hidden="true" />
                  <b>{m.step}</b>
                  <span>{m.note}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="cs-feat cs-fade">
          <h3 className="mono">{p.featuresLabel}</h3>
          <ol>
            {p.features.map((f, i) => (
              <li key={f}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
        </div>

        {(p.stack.length > 0 || p.stackNote) && (
          <div className="cs-stack cs-fade">
            <h3 className="mono">Technology</h3>
            {p.stack.length > 0 && (
              <ul>
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
            {p.stackNote && <p className="mono">{p.stackNote}</p>}
          </div>
        )}

        <aside className="cs-honest cs-fade" aria-label="What this page does not claim">
          <h3 className="mono">Honesty ledger</h3>
          <ul>
            {p.notAClaim.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>

        <nav className="cs-next cs-fade" aria-label="Case study navigation">
          <button onClick={() => onNav(-1)} data-cursor="Prev"><span className="mono">← Previous</span></button>
          <button onClick={() => onNav(1)} data-cursor="Next">
            <span className="mono">Next project →</span>
            <strong>{PROJECTS[next].title}</strong>
          </button>
        </nav>
      </div>
    </div>
  );
}

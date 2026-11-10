import { useRef, useState } from "react";
import { DOMAINS, SKILLS, PLATFORMS, type Tier } from "../data/content";

const TIER: Record<Tier, string> = {
  confirmed: "Confirmed — public GitHub profile or used in this site",
  brief: "Stated in project brief — repository audit pending",
  research: "Research & experimentation — not a production claim",
};

/** CHAPTER 03 — EXPERTISE. Interactive typography, not a skills grid. */
export default function Expertise() {
  const [active, setActive] = useState(0);
  const d = DOMAINS[active];
  const panel = useRef<HTMLDivElement>(null);

  return (
    <section id="expertise" data-cam="expertise" className="expertise" aria-labelledby="exp-h">
      <div className="chapter-head mono">
        <span>03</span>
        <i />
        <span id="exp-h">Expertise</span>
      </div>

      <h2 className="exp-title" data-reveal="chars">
        Five ways of making things work.
      </h2>

      {/* Domains: oversized interactive type */}
      <div className="domains">
        <ul className="domain-words" role="tablist" aria-label="Technical domains" aria-orientation="vertical">
          {DOMAINS.map((x, i) => (
            <li key={x.id}>
              <button
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={i === active}
                aria-controls="domain-panel"
                className={`dw ${i === active ? "is-on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                data-cursor="Explore"
              >
                <span className="mono dw-no">0{i + 1}</span>
                <span className="dw-word vf">{x.word}</span>
              </button>
            </li>
          ))}
        </ul>

        <div id="domain-panel" role="tabpanel" aria-labelledby={`tab-${d.id}`} ref={panel} className="domain-panel" key={d.id}>
          <h3>{d.name}</h3>
          <p className="blurb">{d.blurb}</p>
          <ol>
            {d.items.map((it, i) => (
              <li key={it} style={{ animationDelay: `${i * 55}ms` }}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {it}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Stack index */}
      <div className="stack">
        <div className="stack-head">
          <h3 data-reveal="chars">The stack, indexed.</h3>
          <ul className="legend mono" aria-label="Evidence legend">
            {(Object.keys(TIER) as Tier[]).map((t) => (
              <li key={t}>
                <i className={`dot ${t}`} />
                {TIER[t]}
              </li>
            ))}
          </ul>
        </div>

        {SKILLS.map((s, i) => (
          <div key={s.id} className="stack-row" data-reveal="fade">
            <div className="stack-label">
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <h4>{s.label}</h4>
              <small className="mono">{s.note}</small>
            </div>
            <ul className="stack-items">
              {s.items.map((it) => (
                <li key={it.n} className="vf" title={TIER[it.t]} data-cursor={it.t}>
                  <i className={`dot ${it.t}`} aria-label={TIER[it.t]} role="img" />
                  {it.n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Frameworks, libraries and platforms — typed correctly */}
      <div className="platforms">
        <h3 data-reveal="chars">Frameworks, libraries & platforms.</h3>
        <p className="mono sub" data-reveal="fade">
          Each is labelled by what it actually is. Presence here is not a claim of production use on every project.
        </p>
        <ul>
          {PLATFORMS.map((p) => (
            <li key={p.n} title={TIER[p.t]}>
              <span className="mono kind">{p.kind}</span>
              <span className="pname vf">
                <i className={`dot ${p.t}`} />
                {p.n}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

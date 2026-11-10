import { useRef, useState } from "react";
import { PRO26, LINKS } from "../data/content";

/** Dedicated company case study: UNIFIED PRO26 LLP — an editorial identity of its own (paper, ink, vermilion). */
export default function Pro26() {
  const [grp, setGrp] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const follow = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState<number | null>(null);

  const N = PRO26.groups.length;
  const pt = (i: number, r: number) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [300 + Math.cos(a) * r, 300 + Math.sin(a) * r] as const;
  };

  const onMove = (e: React.PointerEvent) => {
    const r = list.current!.getBoundingClientRect();
    if (follow.current) follow.current.style.transform = `translate(${e.clientX - r.left + 24}px, ${e.clientY - r.top - 60}px)`;
  };

  return (
    <section id="pro26" data-cam="pro26" className="pro" aria-labelledby="pro-h">
      <div className="pro-hero">
        <div className="pro-num" aria-hidden="true">26</div>
        <div className="pro-head">
          <div className="chapter-head mono"><span>06</span><i /><span id="pro-h">Company case study</span></div>
          <h2 data-reveal="chars">UNIFIED PRO26 LLP</h2>
          <p className="pro-tag" data-reveal="fade"><em>“{PRO26.tagline}”</em> — the company's own tagline.</p>
          <p className="pro-intro" data-reveal="fade">{PRO26.intro}</p>
          <div className="pro-actions" data-reveal="fade">
            <a className="btn dark" href={PRO26.site} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="Visit">
              <span>Visit pro26.in</span><b aria-hidden="true">↗</b>
            </a>
            <a className="btn ghost" href={LINKS.pro26gh.href} target="_blank" rel="noopener noreferrer" data-magnetic>
              <span>@pro-26 on GitHub</span><b aria-hidden="true">↗</b>
            </a>
          </div>
        </div>
      </div>

      <div className="pro-role" data-reveal="fade">
        <span className="mono">Nihan's role</span>
        <strong>Full-Stack Developer</strong>
        <span className="mono">Full-time · December 2025 – Present</span>
      </div>

      {/* Services constellation */}
      <div className="pro-block">
        <div className="pro-label mono"><span>A</span> Services — as publicly listed</div>
        <div className="services">
          <ul className="svc-list">
            {PRO26.groups.map((g, i) => (
              <li key={g.id}>
                <button
                  className={grp === i ? "is-on" : ""}
                  onMouseEnter={() => setGrp(i)}
                  onFocus={() => setGrp(i)}
                  onMouseLeave={() => setGrp(null)}
                  onBlur={() => setGrp(null)}
                  aria-pressed={grp === i}
                  onClick={() => setGrp(grp === i ? null : i)}
                >
                  <span className="mono">{g.name}</span>
                  <span className="svc-items">
                    {g.items.map((it) => (
                      <em key={it}>{it}</em>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <svg className="constel" viewBox="0 0 600 600" role="img" aria-label="Diagram: six service groups orbiting Pro26">
            <circle cx="300" cy="300" r="190" fill="none" stroke="currentColor" strokeOpacity=".18" strokeDasharray="2 6" />
            <circle cx="300" cy="300" r="110" fill="none" stroke="currentColor" strokeOpacity=".12" />
            {PRO26.groups.map((g, i) => {
              const [x, y] = pt(i, 190);
              const on = grp === i;
              return (
                <g key={g.id} className={on ? "on" : ""}>
                  <line x1="300" y1="300" x2={x} y2={y} stroke="currentColor" strokeOpacity={on ? 0.9 : 0.2} />
                  {g.items.map((_, k) => {
                    const a = (i / N) * Math.PI * 2 - Math.PI / 2 + (k - (g.items.length - 1) / 2) * 0.22;
                    return <circle key={k} cx={300 + Math.cos(a) * 250} cy={300 + Math.sin(a) * 250} r={on ? 7 : 4} className="sat" />;
                  })}
                  <circle cx={x} cy={y} r={on ? 20 : 12} className="node" />
                  <text x={pt(i, 288)[0]} y={pt(i, 288)[1]} textAnchor="middle" dominantBaseline="middle" className="lbl">
                    {g.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
            <circle cx="300" cy="300" r="52" className="core" />
            <text x="300" y="306" textAnchor="middle" className="core-t">PRO26</text>
          </svg>
        </div>
      </div>

      {/* Products ledger */}
      <div className="pro-block">
        <div className="pro-label mono"><span>B</span> Products — listed on pro26.in</div>
        <div className="products" ref={list} onPointerMove={onMove} onPointerLeave={() => setHov(null)}>
          <div ref={follow} className={`follower ${hov !== null ? "show" : ""}`} aria-hidden="true">
            <span>{hov !== null ? String(hov + 1).padStart(2, "0") : ""}</span>
          </div>
          {PRO26.products.map((p, i) => (
            <a key={p} href={PRO26.site} target="_blank" rel="noopener noreferrer" className="prod" onPointerEnter={() => setHov(i)} data-cursor="Open">
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <strong className="vf">{p}</strong>
              <em className="mono">Pro26 product</em>
            </a>
          ))}
        </div>
        <p className="pro-note mono">
          These are products of the company, not personal projects. Descriptions, availability and links are not restated here — see the official site for current details.
        </p>
      </div>

      {/* Training */}
      <div className="pro-block">
        <div className="pro-label mono"><span>C</span> Technical training — paid internship programmes (per pro26.in)</div>
        <ul className="interns">
          {PRO26.internships.map((x) => (
            <li key={x} className="vf">{x}</li>
          ))}
        </ul>
      </div>

      {/* Clients */}
      <div className="pro-block">
        <div className="pro-label mono"><span>D</span> Client ecosystem</div>
        <p className="pro-clients">
          Client names and logos are intentionally not reproduced here. They will be added only after being verified against the current official website — never invented, never approximated.
        </p>
        <a className="link-u" href={PRO26.site} target="_blank" rel="noopener noreferrer">See the clients Pro26 publishes ↗</a>
      </div>

      {/* Contribution */}
      <div className="pro-block">
        <div className="pro-label mono"><span>E</span> My contribution — kept separate on purpose</div>
        <div className="contrib">
          <div>
            <h4>Verified</h4>
            <p>Full-Stack Developer at UNIFIED PRO26 LLP since December 2025 (full-time). The public GitHub profile lists the role and membership of the @pro-26 organisation.</p>
          </div>
          <div>
            <h4>Individual work</h4>
            <p>Product-by-product attribution is being audited against repositories and project records. Until confirmed, no specific Pro26 product is claimed as Nihan's sole work.</p>
          </div>
          <div>
            <h4>Collaborative work</h4>
            <p>Contributions to team-built products will be listed once confirmed per repository, with the nature of the contribution stated.</p>
          </div>
          <div>
            <h4>Company capability</h4>
            <p>The services, products and training programmes above belong to Pro26 as a company, and do not describe Nihan's personal portfolio.</p>
          </div>
        </div>
        <p className="pro-note mono">No company metrics are quoted. Any future figure would be attributed to the company and checked against the live site.</p>
      </div>
    </section>
  );
}

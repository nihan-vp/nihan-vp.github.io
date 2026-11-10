import { openRoc } from "../core/interactions";
import { SUGGESTED } from "../roc/RocAI";

/** CHAPTER 07 — ROC AI: the portfolio's representative. */
export default function RocSection() {
  return (
    <section id="roc" data-cam="roc" className="roc-sec" aria-labelledby="roc-h">
      <div className="chapter-head mono"><span>07</span><i /><span>The Representative</span></div>
      <h2 id="roc-h" className="roc-big" data-reveal="chars">ROC AI</h2>
      <div className="roc-cols">
        <p data-reveal="fade">
          ROC AI is the portfolio's intelligent representative. It speaks <em>about</em> Nihan in the third person — his background, stack, experience and projects — draws only from a structured, verified knowledge base, and says so plainly when something isn't known.
        </p>
        <ul className="roc-rules mono" data-reveal="fade">
          <li>Never impersonates Nihan</li>
          <li>Never invents titles, benchmarks or contacts</li>
          <li>Cites sections and projects it draws from</li>
          <li>Validated input · rate limited</li>
        </ul>
      </div>
      <button className="btn big" onClick={() => openRoc()} data-magnetic data-cursor="Start">
        <span>Start a conversation</span><b aria-hidden="true">→</b>
      </button>
      <ul className="roc-chips" aria-label="Suggested questions">
        {SUGGESTED.slice(0, 6).map((q) => (
          <li key={q}><button onClick={() => openRoc(q)}>{q}</button></li>
        ))}
      </ul>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { compose, stream, validate, MAX_LEN } from "./engine";
import type { Ref } from "./knowledge";
import { scrollToId, stopScroll, startScroll, prefersReduced } from "../core/motion";
import { openProject } from "../core/interactions";

export const SUGGESTED = [
  "Who is Nihan Ali V P?",
  "What technologies does he use?",
  "Tell me about his experience at Pro26.",
  "What is Structo ERP?",
  "Tell me about FreightPro.",
  "What is QEVROC?",
  "Explain the AeroCor project.",
  "What hardware projects has he worked on?",
  "What is his experience with Flutter?",
  "How can I contact him?",
];

interface Msg {
  id: number;
  role: "user" | "assistant";
  text: string;
  refs?: Ref[];
  done?: boolean;
}

const KEY = "roc-ai-session-v1";
const GREETING =
  "I'm **ROC AI**, the portfolio representative for Nihan Ali V P. I can walk you through his experience, technologies, projects and Pro26 work — using only verified information. What would you like to know?";

/** Minimal safe renderer: **bold**, "- " bullets, paragraphs, bare URLs → links. No HTML injection. */
function Rich({ text }: { text: string }) {
  const inline = (s: string, k: string) =>
    s.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((p, i) => {
      if (p.startsWith("**")) return <strong key={k + i}>{p.slice(2, -2)}</strong>;
      if (/^https?:\/\//.test(p)) return <a key={k + i} href={p} target="_blank" rel="noopener noreferrer">{p.replace(/^https?:\/\/(www\.)?/, "")}</a>;
      return <span key={k + i}>{p}</span>;
    });
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (i: number) => {
    if (bullets.length) blocks.push(<ul key={"u" + i}>{bullets.map((b, j) => <li key={j}>{inline(b, `b${i}${j}`)}</li>)}</ul>);
    bullets = [];
  };
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("- ")) bullets.push(line.slice(2));
    else {
      flush(i);
      if (line.trim()) blocks.push(<p key={i}>{inline(line, "p" + i)}</p>);
    }
  });
  flush(999);
  return <>{blocks}</>;
}

export default function RocAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const id = useRef(Date.now());
  const greeted = useRef(false);

  // persist session conversation (completed messages only)
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(msgs.filter((m) => m.done !== false)));
    } catch { /* storage unavailable */ }
  }, [msgs]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: prefersReduced ? "auto" : "smooth" });
  }, [msgs, typing]);

  const reply = useCallback(async (text: string) => {
    const ans = compose(text);
    const mid = ++id.current;
    setTyping(true);
    await new Promise((r) => setTimeout(r, prefersReduced ? 50 : 650 + Math.random() * 450));
    setTyping(false);
    setMsgs((m) => [...m, { id: mid, role: "assistant", text: "", done: false }]);
    abort.current?.abort();
    const ac = (abort.current = new AbortController());
    for await (const partial of stream(ans.text, ac.signal)) {
      setMsgs((m) => m.map((x) => (x.id === mid ? { ...x, text: partial } : x)));
    }
    if (!ac.signal.aborted) setMsgs((m) => m.map((x) => (x.id === mid ? { ...x, text: ans.text, refs: ans.refs, done: true } : x)));
  }, []);

  const send = useCallback(
    (raw: string) => {
      if (typing) return;
      const v = validate(raw);
      if (!v.ok) return setErr(v.error);
      setErr("");
      setInput("");
      setMsgs((m) => [...m, { id: ++id.current, role: "user", text: v.text, done: true }]);
      reply(v.text);
    },
    [reply, typing]
  );

  // greeting on first open of an empty conversation
  useEffect(() => {
    if (!open || greeted.current || msgs.length) return;
    greeted.current = true;
    (async () => {
      const mid = ++id.current;
      setMsgs((m) => [{ id: mid, role: "assistant", text: "", done: false }, ...m]);
      const ac = new AbortController();
      const patch = (text: string, done: boolean) => setMsgs((m) => m.map((x) => (x.id === mid ? { ...x, text, done } : x)));
      for await (const partial of stream(GREETING, ac.signal)) patch(partial, false);
      patch(GREETING, true);
    })();
  }, [open, msgs.length]);

  // open from anywhere (sections / hero chips)
  useEffect(() => {
    const h = (e: Event) => {
      const q = (e as CustomEvent<string | undefined>).detail;
      setOpen(true);
      if (q) setTimeout(() => send(q), 450);
    };
    window.addEventListener("open-roc", h);
    return () => window.removeEventListener("open-roc", h);
  }, [send]);

  // scroll lock on small screens, Escape to close, focus
  useEffect(() => {
    const small = window.innerWidth < 720;
    if (open) {
      if (small) stopScroll();
      setTimeout(() => inputRef.current?.focus(), 350);
    }
    const key = (e: KeyboardEvent) => e.key === "Escape" && open && setOpen(false);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      if (small && open) startScroll();
    };
  }, [open]);

  const clear = () => {
    abort.current?.abort();
    greeted.current = false;
    setMsgs([]);
    setTyping(false);
    setErr("");
    sessionStorage.removeItem(KEY);
  };

  const copy = async (m: Msg) => {
    try {
      await navigator.clipboard.writeText(m.text.replace(/\*\*/g, ""));
      setCopied(m.id);
      setTimeout(() => setCopied(null), 1400);
    } catch { /* clipboard unavailable */ }
  };

  const follow = (r: Ref) => {
    if (r.kind === "link") return window.open(r.href, "_blank", "noopener,noreferrer");
    if (r.kind === "project") {
      setOpen(false);
      return setTimeout(() => openProject(r.id), 200);
    }
    setOpen(false);
    setTimeout(() => scrollToId(r.id), 300);
  };

  const hasUser = msgs.some((m) => m.role === "user");

  return (
    <>
      <button className={`roc-launch ${open ? "hide" : ""}`} onClick={() => setOpen(true)} aria-label="Open ROC AI assistant" aria-expanded={open} data-cursor="Ask ROC AI">
        <span className="roc-orb" aria-hidden="true"><i /></span>
        <span className="roc-launch-t"><b>ROC AI</b><small className="mono">Ask about Nihan</small></span>
      </button>

      <section className={`roc-panel ${open ? "open" : ""}`} role="dialog" aria-label="ROC AI — portfolio assistant" aria-hidden={!open} data-lenis-prevent>
        <header className="roc-head">
          <span className="roc-orb sm" aria-hidden="true"><i /></span>
          <div>
            <h2>ROC AI</h2>
            <p className="mono">Portfolio representative · not Nihan</p>
          </div>
          <div className="roc-actions">
            <button onClick={clear} aria-label="Clear conversation" title="Clear conversation" tabIndex={open ? 0 : -1}>Clear</button>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" tabIndex={open ? 0 : -1}>✕</button>
          </div>
        </header>

        <div ref={log} className="roc-log" role="log" aria-live="polite" aria-relevant="additions text">
          {msgs.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              <div className="bubble">
                <Rich text={m.text || "…"} />
                {m.done === false && <span className="caret" aria-hidden="true" />}
              </div>
              {m.role === "assistant" && m.done && (
                <div className="msg-tools">
                  {m.refs?.map((r, i) => (
                    <button key={i} className={`ref ${r.kind}`} onClick={() => follow(r)} tabIndex={open ? 0 : -1}>
                      {r.label} <span aria-hidden="true">{r.kind === "link" ? "↗" : "→"}</span>
                    </button>
                  ))}
                  <button className="copy mono" onClick={() => copy(m)} tabIndex={open ? 0 : -1}>{copied === m.id ? "Copied" : "Copy"}</button>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="msg assistant" aria-label="ROC AI is typing">
              <div className="bubble typing"><i /><i /><i /></div>
            </div>
          )}
          {!hasUser && (
            <div className="suggest" aria-label="Suggested questions">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={typing} tabIndex={open ? 0 : -1}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <form
          className="roc-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          {err && <p className="roc-err mono" role="alert">{err}</p>}
          <div className="roc-row">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => (setInput(e.target.value.slice(0, MAX_LEN)), setErr(""))}
              placeholder="Ask about Nihan's work…"
              aria-label="Message ROC AI"
              maxLength={MAX_LEN}
              autoComplete="off"
              tabIndex={open ? 0 : -1}
            />
            <button type="submit" disabled={typing || !input.trim()} aria-label="Send message" tabIndex={open ? 0 : -1}>↑</button>
          </div>
          <p className="roc-foot mono">Answers come from the verified portfolio knowledge base. Unknowns are stated as unknown.</p>
        </form>
      </section>
    </>
  );
}

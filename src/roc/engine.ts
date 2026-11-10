import { CHUNKS, type Chunk, type Ref } from "./knowledge";

/**
 * ROC AI engine — retrieval over the structured knowledge base.
 * Environment note: this site is a static deployment with no server runtime, so there are no secrets to protect and no LLM is called.
 * The architecture is deliberately API-shaped (validate → rate-limit → retrieve → compose → stream) so a server-side model can replace `compose()` later.
 */
export const MAX_LEN = 400;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const MIN_GAP_MS = 700;
const stamps: number[] = [];

export function validate(raw: string): { ok: true; text: string } | { ok: false; error: string } {
  // strip control characters and collapse whitespace
  const text = raw.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return { ok: false, error: "Please type a question." };
  if (text.length > MAX_LEN) return { ok: false, error: `Please keep questions under ${MAX_LEN} characters.` };
  const now = Date.now();
  while (stamps.length && now - stamps[0] > WINDOW_MS) stamps.shift();
  if (stamps.length && now - stamps[stamps.length - 1] < MIN_GAP_MS) return { ok: false, error: "One moment — please wait before sending another message." };
  if (stamps.length >= MAX_PER_WINDOW) return { ok: false, error: "That's a lot of questions in a minute. Please wait a moment and try again." };
  stamps.push(now);
  return { ok: true, text };
}

const STOP = new Set("a an the is are was were be been of for to in on at by with and or but do does did what whats who how tell me about his he him her she it its can could would you your i my please explain give show any some there this that from as have has had than then so if".split(" "));
const tok = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#.\- ]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((w) => w && !STOP.has(w));
const stem = (w: string) => (w.length > 4 ? w.replace(/(ing|ers|er|es|s|ed)$/, "") : w);

// document frequencies for light IDF weighting
const df = new Map<string, number>();
CHUNKS.forEach((c) => {
  new Set(tok(c.text + " " + c.title + " " + c.keys.join(" ")).map(stem)).forEach((w) => df.set(w, (df.get(w) || 0) + 1));
});
const idf = (w: string) => Math.log(1 + CHUNKS.length / (1 + (df.get(w) || 0)));

function score(q: string[], c: Chunk) {
  const keys = new Set(c.keys.flatMap((k) => tok(k)).map(stem));
  const title = new Set(tok(c.title).map(stem));
  const body = new Set(tok(c.text).map(stem));
  let s = 0;
  for (const w0 of q) {
    const w = stem(w0);
    if (keys.has(w)) s += 3 * idf(w);
    if (title.has(w)) s += 2.5 * idf(w);
    if (body.has(w)) s += 0.6 * idf(w);
  }
  return s;
}

export interface Answer {
  text: string;
  refs: Ref[];
}

const UNPUBLISHED = /(salary|age|old|birthday|born|address|live\b|home|college|university|degree|qualification|certif|cgpa|marks|girlfriend|married|religion|income|passport|aadhaar|password)/i;

const SUGGEST: Ref[] = [
  { kind: "section", id: "about", label: "About" },
  { kind: "section", id: "projects", label: "Projects" },
  { kind: "section", id: "contact", label: "Contact" },
];

export function compose(input: string): Answer {
  const lower = input.toLowerCase();

  if (/^(hi|hello|hey|namaste|salam|good (morning|afternoon|evening))\b/.test(lower) && lower.length < 24)
    return { text: "Hello — I'm **ROC AI**, the portfolio representative for Nihan Ali V P. Ask me about his experience, technologies, projects or how to contact him.", refs: [] };

  if (/nihan ai/.test(lower))
    return { text: "My name is **ROC AI**. I'm the portfolio's AI representative — I'm not Nihan himself, and I speak about him in the third person.", refs: [] };

  if (/(email|e-mail|mail id|phone|mobile number|whatsapp|call him|contact number)/.test(lower)) {
    const c = CHUNKS.find((x) => x.id === "contact")!;
    return { text: c.text, refs: c.refs || [] };
  }

  const q = tok(input);
  const ranked = CHUNKS.map((c) => ({ c, s: score(q, c) })).sort((a, b) => b.s - a.s);
  const top = ranked[0];

  if (UNPUBLISHED.test(lower) && (!top || top.s < 6))
    return { text: "That information isn't published in Nihan's portfolio, so I won't guess. I can tell you about his experience, technologies and projects — or you can reach him through his public profiles.", refs: SUGGEST };

  if (!top || top.s < 2.2)
    return {
      text: "I don't have verified information about that. I can help with Nihan's background, technologies, work at Pro26, hardware work, AI research, or any of his six major projects.",
      refs: SUGGEST,
    };

  const picks = [top.c];
  // For a close second on a *different* topic, answer both (but never more than two chunks, and never pile project dumps together)
  const second = ranked[1];
  if (second.s > top.s * 0.82 && !top.c.id.startsWith("project-") && !second.c.id.startsWith("project-") && second.c.id !== top.c.id) picks.push(second.c);

  const refs: Ref[] = [];
  picks.forEach((p) => p.refs?.forEach((r) => !refs.some((x) => JSON.stringify(x) === JSON.stringify(r)) && refs.push(r)));
  return { text: picks.map((p) => p.text).join("\n\n"), refs: refs.slice(0, 5) };
}

/** Yields the answer in small word groups, simulating a token stream. */
export async function* stream(text: string, signal: AbortSignal) {
  const parts = text.split(/(\s+)/);
  let out = "";
  for (let i = 0; i < parts.length; i += 2) {
    if (signal.aborted) return;
    out += parts.slice(i, i + 2).join("");
    yield out;
    await new Promise((r) => setTimeout(r, 14 + Math.random() * 22));
  }
}

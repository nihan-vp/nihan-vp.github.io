import { PROFILE, LINKS, PROJECTS, PRO26, SKILLS, PLATFORMS, TRACKS, DOMAINS } from "../data/content";

/**
 * ROC AI knowledge base — structured chunks derived from the same content the site renders,
 * so the assistant can never drift from what the portfolio says. Written in the third person.
 */
export type Ref =
  | { kind: "link"; label: string; href: string }
  | { kind: "project"; id: string; label: string }
  | { kind: "section"; id: string; label: string };

export interface Chunk {
  id: string;
  title: string;
  keys: string[]; // high-weight retrieval keywords
  text: string;
  refs?: Ref[];
}

const list = (a: string[]) => a.map((x) => `- ${x}`).join("\n");
const tierWord = { confirmed: "", brief: "", research: " (research / experimentation)" } as const;

const projectChunks: Chunk[] = PROJECTS.map((p) => ({
  id: `project-${p.id}`,
  title: p.title,
  keys: [p.id, ...p.title.toLowerCase().split(/\s+/), p.category.toLowerCase()],
  text:
    `**${p.title}** — ${p.category}.\n${p.summary}\n\n**${p.featuresLabel}:**\n${list(p.features)}` +
    (p.stack.length ? `\n\n**Technology:** ${p.stack.join(", ")}.` : "") +
    `\n\n**What is not claimed:**\n${list(p.notAClaim)}`,
  refs: [{ kind: "project", id: p.id, label: `Open ${p.title} case study` }],
}));

const stackByCat = SKILLS.map((s) => `**${s.label}:** ${s.items.map((i) => i.n + tierWord[i.t]).join(", ")}`).join("\n");

export const CHUNKS: Chunk[] = [
  {
    id: "profile",
    title: "Who is Nihan Ali V P",
    keys: ["who", "nihan", "about", "introduce", "background", "profile", "summary", "developer", "bio", "person"],
    text:
      `**${PROFILE.name}** is a multidisciplinary developer based in ${PROFILE.location}. ${PROFILE.positioning}\n\n` +
      `He works as a Full-Stack Developer at UNIFIED PRO26 LLP (since December 2025) and has worked as a freelance full-stack developer (February 2022 – March 2026, India, remote). ` +
      `His public GitHub profile describes him as currently building cross-platform Flutter apps and designing IoT devices, and lists Flutter, IoT, video editing, PCB design and graphic design as things to ask him about.\n\n` +
      `Disciplines: ${PROFILE.identities.join(" · ")}.`,
    refs: [{ kind: "section", id: "about", label: "Read the identity chapter" }, { kind: "link", label: "GitHub", href: LINKS.github.href }],
  },
  {
    id: "skills",
    title: "Technologies",
    keys: ["technology", "technologies", "tech", "stack", "skills", "languages", "language", "programming", "tools", "frameworks", "framework", "libraries", "use", "uses", "know", "code", "coding"],
    text:
      `Nihan's technology stack, organised by category (evidence is shown on the Expertise chapter — items marked research are experimentation, not production claims):\n\n${stackByCat}\n\n` +
      `**Frameworks, libraries & platforms:** ${PLATFORMS.map((p) => `${p.n} (${p.kind.toLowerCase()})`).join(", ")}.`,
    refs: [{ kind: "section", id: "expertise", label: "See the stack index" }],
  },
  {
    id: "domains",
    title: "Technical domains",
    keys: ["domains", "domain", "capabilities", "expertise", "areas", "specialize", "specialise", "good", "do"],
    text: DOMAINS.map((d) => `**${d.name}:** ${d.items.join(", ")}.`).join("\n"),
    refs: [{ kind: "section", id: "expertise", label: "Explore expertise" }],
  },
  {
    id: "pro26-role",
    title: "Experience at Pro26",
    keys: ["pro26", "pro", "26", "unified", "experience", "work", "job", "role", "company", "employer", "employment", "full-time", "fulltime", "career", "position"],
    text:
      `Nihan is a **Full-Stack Developer at UNIFIED PRO26 LLP** (full-time, December 2025 – present). His GitHub profile lists the role and the @pro-26 organisation.\n\n` +
      `What is verified: the role, employment type and start date. What is not yet published: product-by-product attribution of his individual versus collaborative work — so ROC AI does not claim that he personally built any specific Pro26 product.\n\n` +
      `Before that: freelance full-stack developer, February 2022 – March 2026 (India, remote).`,
    refs: [{ kind: "section", id: "pro26", label: "Pro26 case study" }, { kind: "link", label: "pro26.in", href: PRO26.site }],
  },
  {
    id: "pro26-company",
    title: "About UNIFIED PRO26 LLP",
    keys: ["pro26", "company", "services", "service", "products", "product", "clients", "internship", "internships", "training", "about", "offers", "stage", "timer", "crm", "hrms", "padvibe", "foodyo", "schoolist", "soundscape", "funterest", "qriosity", "restaurant"],
    text:
      `**UNIFIED PRO26 LLP** — "${PRO26.tagline}". ${PRO26.intro}\n\n` +
      `**Services listed:** ${PRO26.groups.flatMap((g) => g.items).join("; ")}.\n\n` +
      `**Products listed:** ${PRO26.products.join(", ")}. (These are company products; Nihan did not necessarily build them all.)\n\n` +
      `**Training:** paid internship programmes — ${PRO26.internships.join(", ")}.\n\n` +
      `Client names and metrics are not restated here because they have not been verified against the current official website.`,
    refs: [{ kind: "section", id: "pro26", label: "Pro26 chapter" }, { kind: "link", label: "pro26.in", href: PRO26.site }],
  },
  {
    id: "timeline",
    title: "Experience timeline",
    keys: ["timeline", "history", "freelance", "freelancer", "years", "since", "when", "dates", "progression"],
    text:
      `**Timeline**\n` +
      TRACKS.map((t) => `- **${t.title}** (${t.kind}) — ${t.dated ? (t.end === "present" ? "from December 2025" : "February 2022 – March 2026") : "dates not published"}. ${t.desc}`).join("\n"),
    refs: [{ kind: "section", id: "experience", label: "View the timeline" }],
  },
  {
    id: "flutter",
    title: "Flutter and mobile",
    keys: ["flutter", "dart", "mobile", "android", "ios", "app", "apps", "cross-platform", "crossplatform"],
    text:
      `Flutter and Dart are listed on Nihan's public GitHub profile, which also says he is building cross-platform Flutter apps and continuing to learn Flutter.\n\n` +
      `His mobile applications include **Al Quran Al Kareem** and **FreightPro**. The exact framework used for each of those has not been confirmed in the portfolio, so ROC AI does not state it.`,
    refs: [{ kind: "project", id: "quran", label: "Al Quran Al Kareem" }, { kind: "project", id: "freightpro", label: "FreightPro" }],
  },
  {
    id: "hardware",
    title: "Hardware projects",
    keys: ["hardware", "electronics", "pcb", "iot", "embedded", "arduino", "esp32", "raspberry", "robot", "robotics", "rover", "drone", "vision", "vx", "microcontroller", "circuit", "automation"],
    text:
      `Hardware and electronics work includes:\n` +
      `- **Trak Raptor** — a rescue rover robotics project (specifications are not published).\n` +
      `- **AeroCor** — a research-stage organ-transport drone concept. Its 150 km / 5 kg figures are targets only.\n` +
      `- **Vision X** (public GitHub repository, updated January 2026) — pairs an on-board camera, object detection and a lightweight OLED to show identified objects, phone alerts and Bluetooth pipeline status.\n` +
      `- PCB design and IoT device design, with Arduino and Raspberry Pi listed on his GitHub profile.\n\n` +
      `He also lists Verilog among his languages.`,
    refs: [{ kind: "project", id: "trak-raptor", label: "Trak Raptor" }, { kind: "project", id: "aerocor", label: "AeroCor" }, { kind: "link", label: "Vision X on GitHub", href: LINKS.vx.href }],
  },
  {
    id: "ai",
    title: "AI work",
    keys: ["ai", "artificial", "intelligence", "llm", "model", "models", "local", "inference", "gpu", "cuda", "llama", "ggml", "gguf", "smollm2", "qevroc", "research", "machine"],
    text:
      `AI is one of Nihan's research interests. Under **QEVROC** — an independent computing-research initiative — he works on C++ AI infrastructure, local language model inference with llama.cpp and GGML/GGUF, SmolLM2 experimentation, CUDA integration attempts and GPU offloading.\n\n` +
      `No benchmark results are published, QEVROC is not a commercial AI chip and no ASIC has been completed.`,
    refs: [{ kind: "project", id: "qevroc", label: "QEVROC case study" }],
  },
  {
    id: "contact",
    title: "Contact",
    keys: ["contact", "email", "mail", "phone", "reach", "hire", "linkedin", "instagram", "github", "message", "talk", "connect", "number", "call", "whatsapp", "social", "hiring"],
    text:
      `The best way to reach Nihan is through his public profiles:\n` +
      `- LinkedIn: ${LINKS.linkedin.href}\n- GitHub: ${LINKS.github.href}\n- Instagram: ${LINKS.instagram.href}\n- Portfolio: ${LINKS.portfolio.href}\n\n` +
      `An email address and phone number are **not published** on this portfolio, and ROC AI will not guess or invent one.`,
    refs: [
      { kind: "link", label: "LinkedIn", href: LINKS.linkedin.href },
      { kind: "link", label: "GitHub", href: LINKS.github.href },
      { kind: "link", label: "Instagram", href: LINKS.instagram.href },
      { kind: "section", id: "contact", label: "Contact chapter" },
    ],
  },
  {
    id: "github",
    title: "GitHub",
    keys: ["github", "repositories", "repos", "repo", "open-source", "source", "code", "public"],
    text:
      `Nihan's GitHub (nihan-vp) described him as "Full-Stack Developer at Pro26", based in Kerala, India, with 41 public repositories at the time of the portfolio audit. Examples include nihan-vp.github.io (TypeScript), vx / Vision X (HTML), and several JavaScript projects.`,
    refs: [{ kind: "link", label: "GitHub profile", href: LINKS.github.href }],
  },
  {
    id: "projects",
    title: "All projects",
    keys: ["projects", "project", "portfolio", "built", "work", "made", "showcase", "list", "all"],
    text: `Nihan's six major projects:\n${PROJECTS.map((p) => `- **${p.title}** — ${p.category}`).join("\n")}`,
    refs: PROJECTS.map((p) => ({ kind: "project", id: p.id, label: p.title }) as Ref),
  },
  {
    id: "roc",
    title: "About ROC AI",
    keys: ["roc", "assistant", "you", "yourself", "bot", "chatbot", "name", "are", "real", "human"],
    text:
      `I'm **ROC AI**, the portfolio representative for Nihan Ali V P. I'm not Nihan and I don't speak for him — I answer questions about his background, technologies, experience and projects using the verified information on this site.\n\n` +
      `This version runs entirely in your browser with a retrieval-based knowledge base: no private keys, no data sent anywhere. If I don't have verified information, I'll say so.`,
  },
  ...projectChunks,
];

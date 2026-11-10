/**
 * Single source of truth for the portfolio AND for ROC AI's knowledge base.
 *
 * Evidence tiers
 *  - confirmed : visible on the public GitHub profile (github.com/nihan-vp) or used in this very site
 *  - brief     : stated by Nihan in the project brief; repository / screenshot audit still pending
 *  - research  : exploration or experimentation — NOT a claim of production use
 */
export type Tier = "confirmed" | "brief" | "research";

export const PROFILE = {
  name: "Nihan Ali V P",
  roles: ["Full-Stack Developer", "Hardware Innovator", "Creative Technologist"],
  statement: "I build across the boundaries of software, hardware and imagination.",
  location: "Kerala, India",
  positioning:
    "A multidisciplinary developer exploring the intersection of software engineering, hardware innovation, artificial intelligence, automation and creative technology.",
  identities: [
    "Full-Stack Developer",
    "Hardware Innovator",
    "Creative Technologist",
    "Software Engineer",
    "IoT & Automation Developer",
    "PCB Designer",
    "AI Enthusiast",
    "Video Editor",
  ],
  githubBio: {
    building: "Cross-platform Flutter apps and designing IoT devices.",
    learning: "Flutter and advanced embedded systems.",
    askAbout: "Flutter, IoT, video editing, PCB design and graphic designing.",
  },
};

export const LINKS = {
  portfolio: { label: "nihanvp.in", href: "https://nihanvp.in" },
  github: { label: "github.com/nihan-vp", href: "https://github.com/nihan-vp" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/nihan-ali-vp-b902ab382" },
  instagram: { label: "@nihan_vp", href: "https://www.instagram.com/nihan_vp/" },
  gdev: { label: "Google Developer profile", href: "https://g.dev/nihanalivp" },
  pro26: { label: "pro26.in", href: "https://pro26.in/" },
  pro26gh: { label: "github.com/pro-26", href: "https://github.com/pro-26" },
  vx: { label: "Vision X (GitHub)", href: "https://github.com/nihan-vp/vx" },
};

/* ───────────── Chapters / navigation ───────────── */
export const CHAPTERS = [
  { id: "explore", label: "Explore", no: "01" },
  { id: "about", label: "About", no: "02" },
  { id: "expertise", label: "Expertise", no: "03" },
  { id: "projects", label: "Projects", no: "04" },
  { id: "experience", label: "Experience", no: "05" },
  { id: "pro26", label: "PRO26", no: "06" },
  { id: "roc", label: "ROC AI", no: "07" },
  { id: "contact", label: "Contact", no: "08" },
];

/* ───────────── Domains ───────────── */
export const DOMAINS = [
  {
    id: "software",
    name: "Software Engineering",
    word: "SOFTWARE",
    blurb: "Products that ship — web, mobile and the systems behind them.",
    items: [
      "Full-stack web development",
      "Mobile applications",
      "Backend development",
      "API integration",
      "Database systems",
      "Cloud infrastructure",
      "Application architecture",
    ],
  },
  {
    id: "hardware",
    name: "Hardware Engineering",
    word: "HARDWARE",
    blurb: "From a schematic to something you can hold.",
    items: ["Electronics", "PCB design", "Microcontrollers", "Embedded systems", "Arduino", "ESP32", "IoT systems"],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    word: "INTELLIGENCE",
    blurb: "Applied and experimental — running models locally and measuring honestly.",
    items: [
      "AI application development",
      "Local language models",
      "Model experimentation",
      "AI integration",
      "GPU computing",
      "Inference optimization",
    ],
  },
  {
    id: "creative",
    name: "Creative Technology",
    word: "CREATIVE",
    blurb: "Where engineering meets picture, motion and story.",
    items: [
      "3D experimentation",
      "Video editing",
      "Digital storytelling",
      "Interactive experiences",
      "Motion design",
      "Visual design",
    ],
  },
  {
    id: "automation",
    name: "Automation",
    word: "AUTOMATION",
    blurb: "Making systems talk to each other so people don't have to.",
    items: ["Smart home systems", "IoT automation", "Software automation", "System integration"],
  },
];

/* ───────────── Stack index ───────────── */
export interface Skill {
  n: string;
  t: Tier;
}
export const SKILLS: { id: string; label: string; note: string; items: Skill[] }[] = [
  {
    id: "lang",
    label: "Programming languages",
    note: "Listed on the public GitHub profile",
    items: [
      { n: "C", t: "confirmed" },
      { n: "C++", t: "confirmed" },
      { n: "Python", t: "confirmed" },
      { n: "Java", t: "brief" },
      { n: "Dart", t: "confirmed" },
      { n: "JavaScript", t: "confirmed" },
      { n: "TypeScript", t: "confirmed" },
    ],
  },
  {
    id: "front",
    label: "Frontend",
    note: "Web interfaces",
    items: [
      { n: "HTML", t: "confirmed" },
      { n: "CSS", t: "brief" },
      { n: "TypeScript", t: "confirmed" },
      { n: "JavaScript", t: "confirmed" },
    ],
  },
  {
    id: "back",
    label: "Backend",
    note: "Servers & data",
    items: [
      { n: "JavaScript (Node.js)", t: "confirmed" },
      { n: "Python", t: "confirmed" },
    ],
  },
  { id: "mobile", label: "Mobile", note: "Cross-platform apps", items: [{ n: "Dart (Flutter)", t: "confirmed" }] },
  { id: "hdl", label: "Hardware description", note: "Digital design", items: [{ n: "Verilog", t: "brief" }] },
  {
    id: "gpu",
    label: "Shader & GPU",
    note: "GLSL is used in this very site",
    items: [
      { n: "GLSL", t: "confirmed" },
      { n: "CUDA (integration attempts)", t: "research" },
    ],
  },
  {
    id: "markup",
    label: "Markup & documents",
    note: "Used in this site",
    items: [
      { n: "HTML", t: "confirmed" },
      { n: "SVG", t: "confirmed" },
      { n: "JSON", t: "confirmed" },
      { n: "Markdown", t: "confirmed" },
    ],
  },
  {
    id: "infra",
    label: "Configuration & infrastructure",
    note: "Delivery and deployment",
    items: [
      { n: "Docker", t: "brief" },
      { n: "Gradle", t: "confirmed" },
      { n: "GitHub Actions", t: "confirmed" },
      { n: "OpenResty / Nginx", t: "brief" },
    ],
  },
  {
    id: "3d",
    label: "3D & graphics",
    note: "Tools & web graphics",
    items: [
      { n: "Three.js / WebGL", t: "confirmed" },
      { n: "Blender", t: "confirmed" },
      { n: "Unity", t: "confirmed" },
    ],
  },
];

export const PLATFORMS: { n: string; kind: string; t: Tier }[] = [
  { n: "React", kind: "Framework", t: "confirmed" },
  { n: "Flutter", kind: "Framework", t: "confirmed" },
  { n: "Vite", kind: "Build tool", t: "confirmed" },
  { n: "Tailwind CSS", kind: "Framework", t: "confirmed" },
  { n: "Node.js", kind: "Runtime", t: "confirmed" },
  { n: "Firebase", kind: "Platform", t: "confirmed" },
  { n: "MongoDB", kind: "Database", t: "confirmed" },
  { n: "Appwrite", kind: "Platform", t: "confirmed" },
  { n: "Three.js", kind: "Library", t: "confirmed" },
  { n: "GSAP + ScrollTrigger", kind: "Library", t: "confirmed" },
  { n: "Lenis", kind: "Library", t: "confirmed" },
  { n: "SplitType", kind: "Library", t: "confirmed" },
  { n: "Docker", kind: "Tool", t: "brief" },
  { n: "REST APIs", kind: "Architecture", t: "brief" },
  { n: "llama.cpp", kind: "Inference runtime", t: "research" },
  { n: "GGML / GGUF", kind: "Model format", t: "research" },
  { n: "CUDA", kind: "GPU platform", t: "research" },
  { n: "Arduino", kind: "Hardware platform", t: "confirmed" },
  { n: "Raspberry Pi", kind: "Hardware platform", t: "confirmed" },
  { n: "Git / GitLab", kind: "Tool", t: "confirmed" },
];

/* ───────────── Projects ───────────── */
export interface Project {
  id: string;
  no: string;
  title: string;
  display: string; // text on the panel
  category: string;
  bg: string;
  ink: string;
  accent: string;
  fontClass: string;
  tagline: string;
  summary: string;
  features: string[];
  featuresLabel: string;
  stack: string[];
  stackNote?: string;
  status: string;
  facts: { k: string; v: string }[];
  notAClaim: string[];
  art: "quran" | "freight" | "structo" | "raptor" | "aerocor" | "qevroc";
  maturity?: { step: string; state: "yes" | "targets" | "none"; note: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: "quran",
    no: "01",
    title: "Al Quran Al Kareem",
    display: "Al Quran Al Kareem",
    category: "Islamic Digital Experience / Mobile Application",
    bg: "#0c1a15",
    ink: "#efe7d3",
    accent: "#c9a96a",
    fontClass: "f-quran",
    tagline: "A quiet place to read, listen, learn and return.",
    summary:
      "A digital Quran learning and study experience for mobile — Arabic text beside Malayalam and English translation, Malayalam tafseer, audio recitation, and tools designed for memorisation and revision. The design language is deliberately calm: generous space, careful Arabic typography and restrained geometric structure.",
    featuresLabel: "Capabilities (per project brief)",
    features: [
      "Quran reading with Arabic text",
      "Malayalam translation",
      "English translation",
      "Malayalam tafseer",
      "Audio recitation",
      "Memorisation & revision",
      "Ayah repetition",
      "Bookmarks",
      "Learning progress",
      "Offline functionality",
    ],
    stack: [],
    stackNote: "Technology stack will be published after the repository audit.",
    status: "Mobile application",
    facts: [
      { k: "Category", v: "Islamic digital experience" },
      { k: "Languages", v: "Arabic · Malayalam · English" },
      { k: "Platform", v: "Mobile" },
    ],
    notAClaim: [
      "No screenshots are shown. Real application screenshots will be added once supplied — none are fabricated.",
      "The artwork on this page is a visual interpretation, not the app interface.",
    ],
    art: "quran",
  },
  {
    id: "freightpro",
    no: "02",
    title: "FreightPro",
    display: "FreightPro",
    category: "Transportation / Logistics Technology",
    bg: "#14110d",
    ink: "#f3ede2",
    accent: "#ff8a1f",
    fontClass: "f-freight",
    tagline: "Moving freight is a software problem with a road attached.",
    summary:
      "A transportation and freight-related digital platform delivered as a mobile application with backend infrastructure. The product surface spans the driver experience, trip workflows, account management, subscriptions, administration, referrals and payment workflows.",
    featuresLabel: "Areas under audit (per project brief)",
    features: [
      "Driver experience",
      "Trip workflows",
      "Account management",
      "Subscription functionality",
      "Administration",
      "Referral functionality",
      "Backend infrastructure",
      "Payment workflows",
    ],
    stack: [],
    stackNote: "Implementation details are being verified against the codebase before they are listed here.",
    status: "Implemented mobile application",
    facts: [
      { k: "Category", v: "Transportation & logistics" },
      { k: "Surface", v: "Mobile app + backend" },
    ],
    notAClaim: [
      "Individual features are listed as areas of the product, not as a verified feature-by-feature inventory.",
      "No usage numbers, revenue or client claims are made.",
      "The road artwork is illustrative — not a screenshot.",
    ],
    art: "freight",
  },
  {
    id: "structo",
    no: "03",
    title: "Structo ERP",
    display: "Structo ERP",
    category: "Construction Management Software",
    bg: "#d9d6cf",
    ink: "#161513",
    accent: "#e5b800",
    fontClass: "f-structo",
    tagline: "Construction, accounted for — site by site, crew by crew.",
    summary:
      "A construction-focused enterprise management system, previously known as Logro ERP. It brings site attendance, wages, expenses and task-level project tracking into one place, with separate roles for administrators, accounts and site managers, and reports that export to PDF and Excel.",
    featuresLabel: "Capabilities (per project brief)",
    features: [
      "Admin, Account and Site Manager logins",
      "Labour attendance",
      "Wage tracking",
      "Expense management",
      "Task-based project tracking",
      "Crew management",
      "Payment tracking",
      "PDF reports",
      "Excel reports",
      "Custom business workflows",
    ],
    stack: ["React", "TypeScript", "Vite", "Node.js", "MongoDB", "Docker", "Portainer", "OpenResty"],
    stackNote: "Environment as stated in the project brief; modernisation topics below are pending detailed documentation.",
    status: "Production system (renamed from Logro ERP)",
    facts: [
      { k: "Formerly", v: "Logro ERP" },
      { k: "Roles", v: "Admin · Accounts · Site Manager" },
      { k: "Reports", v: "PDF · Excel" },
      { k: "Modernisation", v: "Shared layers · route contracts · code splitting" },
    ],
    notAClaim: [
      "No screenshots are displayed until verified application screenshots are supplied.",
      "Architecture topics (shared application layers, route contracts, code splitting, documentation) are named from the brief; no metrics are claimed.",
    ],
    art: "structo",
  },
  {
    id: "trak-raptor",
    no: "04",
    title: "Trak Raptor",
    display: "Trak Raptor",
    category: "Rescue Rover / Robotics",
    bg: "#1a0f0d",
    ink: "#f1e4dc",
    accent: "#ff4b2b",
    fontClass: "f-raptor",
    tagline: "A tracked rover, built with rescue in mind.",
    summary:
      "Trak Raptor is a rescue rover robotics project. The public record here is intentionally minimal: its mission capabilities, sensors, autonomy and deployment status are not stated on this page because they have not yet been documented for publication.",
    featuresLabel: "Documented so far",
    features: ["Rescue rover concept", "Tracked-chassis robotics project"],
    stack: [],
    stackNote: "Hardware documentation, renders and photographs will be added when supplied.",
    status: "Robotics project — status not published",
    facts: [
      { k: "Category", v: "Robotics" },
      { k: "Form", v: "Tracked rover" },
    ],
    notAClaim: [
      "No autonomous functions, sensors, payloads or field deployments are claimed.",
      "The rover drawing is an illustrative silhouette — not a render of the actual build.",
    ],
    art: "raptor",
  },
  {
    id: "aerocor",
    no: "05",
    title: "AeroCor",
    display: "AeroCor",
    category: "Organ Transportation Drone / Aerospace Research",
    bg: "#0d1822",
    ink: "#e9f0f5",
    accent: "#8fd0ff",
    fontClass: "f-aero",
    tagline: "Can a drone carry time across 150 kilometres?",
    summary:
      "AeroCor is an ambitious research and engineering project exploring aerial medical transportation. The research direction covers VTOL fixed-wing concepts, battery-electric propulsion, solar-assisted energy concepts, medical cargo transport, autonomous navigation, tracking and monitoring, and long-range operation.",
    featuresLabel: "Research directions",
    features: [
      "VTOL fixed-wing concepts",
      "Battery-electric propulsion",
      "Solar-assisted energy concepts",
      "Medical cargo transportation",
      "Autonomous navigation research",
      "Tracking and monitoring",
      "Long-range transportation concepts",
    ],
    stack: [],
    status: "Research & concept",
    facts: [
      { k: "Target range", v: "150 km one-way (research target)" },
      { k: "Target payload", v: "5 kg medical cargo, excluding container (research target)" },
    ],
    notAClaim: [
      "The 150 km range and 5 kg payload are RESEARCH TARGETS — not verified flight capabilities.",
      "No 150 km mission has been completed. No medical certification has been obtained. No real organs have been transported.",
      "Any demonstration would use safe, non-biological test payloads.",
    ],
    art: "aerocor",
    maturity: [
      { step: "Concept", state: "yes", note: "Defined mission and architecture direction" },
      { step: "Research", state: "yes", note: "Ongoing investigation of propulsion, energy and navigation concepts" },
      { step: "Simulation", state: "none", note: "Not claimed" },
      { step: "Prototype", state: "none", note: "Not claimed" },
      { step: "Tested capability", state: "none", note: "None claimed" },
      { step: "Future objectives", state: "targets", note: "150 km · 5 kg · targets only" },
    ],
  },
  {
    id: "qevroc",
    no: "06",
    title: "QEVROC",
    display: "QEVROC",
    category: "Artificial Intelligence / Computing Research",
    bg: "#0a0a0a",
    ink: "#ecebe4",
    accent: "#c8ff3d",
    fontClass: "f-qevroc",
    tagline: "Independent research into how machines think, locally.",
    summary:
      "QEVROC is an independent AI and computing research initiative. Its work centres on C++ AI infrastructure and running language models locally: experimenting with llama.cpp, the GGML / GGUF ecosystem and SmolLM2, attempting CUDA integration and GPU offloading, studying inference performance, designing an AI assistant architecture and exploring conditional computation.",
    featuresLabel: "Research areas",
    features: [
      "C++ AI infrastructure",
      "Local language model inference",
      "llama.cpp",
      "GGML / GGUF",
      "SmolLM2 experimentation",
      "CUDA integration attempts",
      "GPU offloading",
      "Inference performance",
      "AI assistant architecture",
      "Conditional computation research",
    ],
    stack: ["C++", "llama.cpp", "GGML / GGUF", "SmolLM2", "CUDA (attempts)"],
    status: "Independent research — ongoing",
    facts: [
      { k: "Brand", v: "QEVROC" },
      { k: "Nature", v: "Independent research initiative" },
      { k: "Benchmarks", v: "None published" },
    ],
    notAClaim: [
      "No benchmark numbers are shown — none are published until supported by logs or documentation.",
      "QEVROC is not a commercial AI chip and no ASIC has been completed.",
    ],
    art: "qevroc",
  },
];

/* ───────────── Pro26 ───────────── */
export const PRO26 = {
  legal: "UNIFIED PRO26 LLP",
  tagline: "From Students to Professionals",
  site: "https://pro26.in/",
  intro:
    "UNIFIED PRO26 LLP provides software and hardware solutions, and runs paid internship training in Kerala for engineering students across web, mobile, AI/ML and IoT.",
  role: "Full-Stack Developer · Full-time · December 2025 – Present",
  groups: [
    { id: "software", name: "Software", items: ["Custom software development", "Website development", "SEO"] },
    { id: "mobile", name: "Mobile", items: ["Android and iOS applications"] },
    { id: "hardware", name: "Hardware & IoT", items: ["IoT and embedded systems", "Hardware engineering"] },
    { id: "cloud", name: "Cloud & Infrastructure", items: ["Cloud hosting"] },
    { id: "design", name: "Design", items: ["3D design and printing", "UI/UX design", "Product design"] },
    { id: "advisory", name: "Advisory", items: ["Technical consulting"] },
  ],
  products: [
    "Professional Stage Timer",
    "Restaurant Management System",
    "Schoolist",
    "CRM",
    "HRMS",
    "PadVibe",
    "Foodyo",
    "Project Soundscape",
    "Funterest",
    "Qriosity",
  ],
  internships: [
    "Software development",
    "Web development",
    "Mobile app development",
    "IoT & embedded systems",
    "AI / machine learning",
    "Backend development",
    "DevOps launchpad",
  ],
};

/* ───────────── Timeline ───────────── */
export interface Track {
  id: string;
  label: string;
  kind: "Employment" | "Freelance" | "Independent" | "Hardware" | "Research";
  title: string;
  desc: string;
  start?: [number, number]; // year, month (1-12)
  end?: [number, number] | "present";
  dated: boolean;
  color: string;
}
export const TRACKS: Track[] = [
  {
    id: "pro26",
    label: "Employment",
    kind: "Employment",
    title: "UNIFIED PRO26 LLP",
    desc: "Full-Stack Developer, full-time. Building software for a company that spans software, hardware, IoT and training.",
    start: [2025, 12],
    end: "present",
    dated: true,
    color: "#efe7d3",
  },
  {
    id: "freelance",
    label: "Freelance",
    kind: "Freelance",
    title: "Freelance Full-Stack Developer",
    desc: "Independent client work, India · Remote. February 2022 – March 2026.",
    start: [2022, 2],
    end: [2026, 3],
    dated: true,
    color: "#ff8a1f",
  },
  {
    id: "indie",
    label: "Independent software",
    kind: "Independent",
    title: "Personal & independent software projects",
    desc: "Al Quran Al Kareem, FreightPro and Structo ERP among them. Individual dates are not published.",
    dated: false,
    color: "#c9a96a",
  },
  {
    id: "hardware",
    label: "Hardware experiments",
    kind: "Hardware",
    title: "Electronics, PCB & robotics",
    desc: "Trak Raptor, PCB design and IoT devices — including the public Vision X repository (last updated January 2026).",
    dated: false,
    color: "#ff4b2b",
  },
  {
    id: "research",
    label: "AI & aerospace research",
    kind: "Research",
    title: "QEVROC · AeroCor",
    desc: "Independent computing research on local inference and a research-stage aerial medical transport concept. Dates are not published.",
    dated: false,
    color: "#c8ff3d",
  },
];

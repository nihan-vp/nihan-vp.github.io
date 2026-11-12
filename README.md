# Nihan Ali V P — Immersive Portfolio

Where creativity meets technology. A scroll-directed WebGL experience.

## Stack
React 19 · Vite · TypeScript · Three.js (custom GLSL) · GSAP + ScrollTrigger (+ MorphSVG) · Lenis · SplitType · Tailwind (base only; the visual system is hand-written CSS).

## Architecture
```
src/
  core/        motion.ts (Lenis↔GSAP sync, reveal engine) · interactions.ts · audio.ts (opt-in WebAudio)
  three/       stage.ts (single persistent renderer) · choreography.ts (scroll→camera keyframes) · shaders.ts (GLSL)
  art/         draw.ts — six generative project identities (2D canvas, self-pausing)
  sections/    Hero · Identity · Expertise · Projects · Timeline · Pro26 · RocSection · Contact
  components/  Loader · Nav · Cursor · Stage · ProjectArt · CaseStudy
  roc/         knowledge.ts · engine.ts · RocAI.tsx  — ROC AI
  data/        content.ts — the single source of truth for the UI *and* ROC AI
  styles/      base.css · scenes.css · chat.css
```

### Camera choreography
Every `[data-cam]` element is an anchor. Camera, form, light colour, dust and canvas opacity are a smooth blend between
neighbouring keyframes as a pure function of `scrollY` (not event order), then damped each frame. The renderer pauses when
the tab is hidden or when opaque chapters (Projects, Pro26) hide the canvas.

### Performance / accessibility
Mobile: fewer sphere segments, 700 dust particles, DPR cap 1.5, simplified layouts, no pinned horizontal scroller.
`prefers-reduced-motion` disables scrubbed scenes and uses static alternatives. WebGL failure falls back to a CSS atmosphere.
Sound is off by default and only created after the visitor opts in. All GPU resources are disposed on teardown.

## Content audit (what is verified, what is not)
**Verified from the public GitHub profile (nihan-vp):** Full-Stack Developer at Pro26, Kerala, India, @pro-26 org,
nihanvp.in, Instagram `nihan_vp`, LinkedIn `nihan-ali-vp-b902ab382`, Google Developer profile, 41 public repositories,
tech badges (C, C++, Dart, HTML, JavaScript, Python, Flutter, Node.js, MongoDB, Firebase, Appwrite, Arduino, Raspberry Pi, Unity,
Blender, Gradle, GitHub Actions…), repositories such as `vx` (Vision X) and `nihan-vp.github.io` (TypeScript).
**From pro26.in public metadata (via search snippets):** legal name, tagline "From Students to Professionals", paid
internship programmes (software, web, mobile, IoT/embedded, AI/ML, backend, DevOps).

**Not verified — deliberately not published as fact:**
- `pro26.in` could not be fetched from the build environment, so the client roster/logos, product descriptions and links,
  and company metrics are **not** shown. Service and product names come from the project brief.
- Project screenshots, repositories and logs for Quran app, FreightPro, Structo ERP, Trak Raptor, AeroCor and QEVROC were not
  accessible; case studies use interpretive generative art, labelled as such, and list only brief-level facts.
- Email and phone: none are published. (A mailto address appears in the GitHub README template but looks like a placeholder, so it is not used.)
- Languages/formats from the "to investigate" list (Kotlin, SQL, YAML, CUDA C++, GLTF, STL…) have no evidence and are omitted.
- AeroCor 150 km / 5 kg are research **targets**; no flight, certification or organ transport is claimed. QEVROC shows no benchmarks and is not a chip/ASIC.

To add evidence: edit `src/data/content.ts` — ROC AI and the UI update together.

## ROC AI — limitation
This is a static deployment with no server runtime, so no LLM or secret-bearing API can be called safely. ROC AI is a
retrieval-based assistant over the structured knowledge base (`src/roc`), with input validation (400 chars, control
characters stripped), client-side rate limiting (10/min, 700 ms gap), streaming output, session history, copy/clear,
project and section references. `engine.compose()` is the seam where a server-side model proxy can be plugged in; keys must live only on that server.

## Develop
```
npm install
npm run dev
npm run build
```

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Lenis from "lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

export { gsap, ScrollTrigger, SplitType };

export const prefersReduced =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
export const isMobile = () => window.innerWidth < 820;

export let lenis: Lenis | null = null;
let tickerFn: ((t: number) => void) | null = null;

/** Centralised scroll engine: Lenis driven by GSAP's ticker, synced with ScrollTrigger. */
export function initScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: prefersReduced ? 1 : 0.09, smoothWheel: !prefersReduced, wheelMultiplier: 0.95 });
  lenis.on("scroll", ScrollTrigger.update);
  tickerFn = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroyScroll() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  lenis?.destroy();
  lenis = null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: prefersReduced ? 0 : 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView();
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

/* ─────────── Global text/reveal animations (data-attribute driven) ─────────── */
const splits: SplitType[] = [];

export function initReveals(root: ParentNode = document) {
  // Character-level masked rise
  root.querySelectorAll<HTMLElement>("[data-reveal='chars']").forEach((el) => {
    const s = new SplitType(el, { types: "lines,words,chars", tagName: "span" });
    splits.push(s);
    el.classList.add("is-split");
    if (prefersReduced) return;
    gsap.fromTo(
      s.chars,
      { yPercent: 115, rotate: 6 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.025,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });

  // Scroll-scrubbed character opacity (manifesto reading)
  root.querySelectorAll<HTMLElement>("[data-scrub='chars']").forEach((el) => {
    const s = new SplitType(el, { types: "words,chars", tagName: "span" });
    splits.push(s);
    if (prefersReduced) return;
    gsap.fromTo(
      s.chars,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
      }
    );
  });

  // Fade + lift
  root.querySelectorAll<HTMLElement>("[data-reveal='fade']").forEach((el) => {
    if (prefersReduced) return;
    gsap.fromTo(
      el,
      { y: 42, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      }
    );
  });

  // Clip-path wipe
  root.querySelectorAll<HTMLElement>("[data-reveal='clip']").forEach((el) => {
    if (prefersReduced) return;
    gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });
}

export function killReveals() {
  splits.forEach((s) => s.revert());
  splits.length = 0;
}

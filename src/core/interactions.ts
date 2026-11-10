import { gsap, isTouch, prefersReduced } from "./motion";

/** Magnetic pull for [data-magnetic] elements (desktop pointers only). Returns a cleanup fn. */
export function initMagnetic(root: ParentNode = document) {
  if (isTouch || prefersReduced) return () => {};
  const cleanups: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    if ((el as HTMLElement & { _mag?: boolean })._mag) return;
    (el as HTMLElement & { _mag?: boolean })._mag = true;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => cleanups.forEach((c) => c());
}

export const openProject = (id: string) => window.dispatchEvent(new CustomEvent("open-project", { detail: id }));
export const openRoc = (question?: string) => window.dispatchEvent(new CustomEvent("open-roc", { detail: question }));

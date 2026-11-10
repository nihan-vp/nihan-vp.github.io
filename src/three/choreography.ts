/**
 * Camera choreography.
 * Each [data-cam] element in the page is an anchor; the camera/object/light state is a
 * continuous blend between neighbouring keyframes as a pure function of scroll position.
 * Because the state is derived from scrollY (not event order) it is robust to anchor jumps.
 */
export interface KF {
  cam: [number, number, number]; // camera position
  look: [number, number]; // look-at x,y
  obj: [number, number, number]; // object x,y,scale
  spin: number; // extra Y rotation (radians)
  dist: number; // displacement amplitude
  twist: number;
  spread: number; // dust field radius multiplier
  ring: number; // ring opacity
  ray: number; // backdrop god-ray amount
  op: number; // canvas opacity
  dark: string;
  light: string;
  rim: string;
}

export const KEYFRAMES: Record<string, KF> = {
  hero: {
    cam: [0, 0.2, 7.4], look: [0, 0], obj: [1.7, -0.1, 1.55], spin: 0, dist: 0.32, twist: 0.4,
    spread: 1, ring: 0.5, ray: 0.9, op: 1, dark: "#0c0b0a", light: "#efe6d6", rim: "#e8873a",
  },
  heroEnd: {
    cam: [0.4, 0.5, 3.3], look: [0.3, 0.1], obj: [0.2, -0.2, 2.0], spin: 2.2, dist: 0.62, twist: 1.5,
    spread: 0.7, ring: 0.15, ray: 1.2, op: 1, dark: "#0a0908", light: "#f3e8d4", rim: "#ff9a4d",
  },
  about: {
    cam: [-1.5, 0.3, 9.5], look: [0, 0], obj: [3.6, 0.3, 1.25], spin: 3.4, dist: 0.4, twist: 0.9,
    spread: 1.3, ring: 0.3, ray: 0.35, op: 0.55, dark: "#0d0c0b", light: "#d9cfbf", rim: "#a9814f",
  },
  expertise: {
    cam: [3.6, 1.2, 8.0], look: [-0.5, 0], obj: [-2.9, -0.2, 1.4], spin: 5.0, dist: 0.5, twist: 2.0,
    spread: 1.1, ring: 0.7, ray: 0.5, op: 0.8, dark: "#0c0b0a", light: "#e7dccb", rim: "#d9573a",
  },
  projects: {
    cam: [0, 0, 9], look: [0, 0], obj: [0, 0, 1.2], spin: 6.0, dist: 0.3, twist: 0.5,
    spread: 1, ring: 0.2, ray: 0.2, op: 0, dark: "#0c0b0a", light: "#e7dccb", rim: "#d9573a",
  },
  pro26: {
    cam: [0, 0, 9], look: [0, 0], obj: [0, 0, 1.2], spin: 6.5, dist: 0.3, twist: 0.5,
    spread: 1, ring: 0.2, ray: 0.2, op: 0, dark: "#0c0b0a", light: "#e7dccb", rim: "#d9573a",
  },
  experience: {
    cam: [-3.2, -0.6, 8.2], look: [0.4, 0], obj: [3.1, 0.1, 1.5], spin: 7.8, dist: 0.45, twist: 1.1,
    spread: 1.2, ring: 0.6, ray: 0.45, op: 0.75, dark: "#0b0c0b", light: "#dcdccb", rim: "#8fa88a",
  },
  roc: {
    cam: [0.6, 0.4, 6.2], look: [0, 0], obj: [-2.6, 0, 1.35], spin: 9.2, dist: 0.55, twist: 1.8,
    spread: 0.9, ring: 0.9, ray: 0.55, op: 0.85, dark: "#0b0b0c", light: "#d8dce2", rim: "#9fb6cc",
  },
  contact: {
    cam: [0, -0.2, 6.6], look: [0, 0.2], obj: [3.4, -0.2, 1.35], spin: 11.0, dist: 0.38, twist: 0.7,
    spread: 0.8, ring: 0.4, ray: 1.1, op: 0.85, dark: "#0b0a09", light: "#f2e7d2", rim: "#ff9a4d",
  },
};

/* ───────── numeric vector helpers ───────── */
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const KEYS = ["cam", "look", "obj", "spin", "dist", "twist", "spread", "ring", "ray", "op", "dark", "light", "rim"] as const;

export function flatten(k: KF): number[] {
  return [...k.cam, ...k.look, ...k.obj, k.spin, k.dist, k.twist, k.spread, k.ring, k.ray, k.op, ...hex(k.dark), ...hex(k.light), ...hex(k.rim)];
}
export const VEC_LEN = flatten(KEYFRAMES.hero).length;

const VECS: Record<string, number[]> = Object.fromEntries(Object.entries(KEYFRAMES).map(([k, v]) => [k, flatten(v)]));
export const smooth = (t: number) => t * t * (3 - 2 * t);

export interface Anchor {
  name: string;
  y: number;
}

/** Sample the blended state at scroll position y. */
export function sample(y: number, anchors: Anchor[], out: number[]) {
  if (!anchors.length) {
    out.splice(0, out.length, ...VECS.hero);
    return;
  }
  let i = 0;
  while (i < anchors.length - 1 && y >= anchors[i + 1].y) i++;
  const a = anchors[i];
  const b = anchors[Math.min(i + 1, anchors.length - 1)];
  const span = Math.max(1, b.y - a.y);
  const t = a === b ? 0 : smooth(Math.min(1, Math.max(0, (y - a.y) / span)));
  const va = VECS[a.name] ?? VECS.hero;
  const vb = VECS[b.name] ?? VECS.hero;
  for (let k = 0; k < VEC_LEN; k++) out[k] = va[k] + (vb[k] - va[k]) * t;
}

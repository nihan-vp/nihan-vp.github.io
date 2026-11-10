/** Six generative 2D compositions — one distinct visual identity per project. Illustrative art, never screenshots. */
export type Drawer = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string, mx: number, my: number) => void;

const TAU = Math.PI * 2;
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const vnoise = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
};
const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* 01 — Quran: calm, geometric, lit from within */
const khatam = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) => {
  for (let k = 0; k < 2; k++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot + (k * Math.PI) / 4);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
};
export const quran: Drawer = (ctx, w, h, t, accent, mx, my) => {
  const cx = w * 0.62 + mx * 12;
  const cy = h * 0.5 + my * 8;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
  g.addColorStop(0, alpha(accent, 0.18));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const step = Math.max(70, w / 14);
  ctx.lineWidth = 1;
  for (let x = step / 2; x < w; x += step) {
    for (let y = step / 2; y < h; y += step) {
      const d = Math.hypot(x - cx, y - cy) / (Math.max(w, h) * 0.6);
      const a = Math.max(0, 0.16 - d * 0.14);
      if (a < 0.01) continue;
      ctx.strokeStyle = alpha(accent, a);
      khatam(ctx, x, y, step * 0.26, 0);
    }
  }
  const base = Math.min(w, h) * 0.36;
  for (let i = 0; i < 7; i++) {
    const r = base * (0.18 + i * 0.14) * (1 + Math.sin(t * 0.4 + i) * 0.012);
    ctx.strokeStyle = alpha(accent, 0.7 - i * 0.08);
    ctx.lineWidth = i === 0 ? 1.6 : 1;
    khatam(ctx, cx, cy, r, t * 0.05 * (i % 2 ? 1 : -1) + i * 0.06);
  }
  ctx.strokeStyle = alpha(accent, 0.35);
  ctx.beginPath();
  ctx.arc(cx, cy, base * 1.05, 0, TAU);
  ctx.stroke();
};

/* 02 — FreightPro: depth, speed, the road ahead */
export const freight: Drawer = (ctx, w, h, t, accent, mx) => {
  const hz = h * 0.52;
  const vx = w * 0.55 + mx * 20;
  const sky = ctx.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "rgba(20,17,13,0)");
  sky.addColorStop(1, alpha(accent, 0.22));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, hz);
  // skyline layers
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = `rgba(${28 + layer * 10},${22 + layer * 7},${16 + layer * 4},1)`;
    const off = (t * (4 + layer * 6)) % 200;
    for (let x = -200; x < w + 200; x += 46 + layer * 10) {
      const bw = 30 + hash(x + layer * 9 + Math.floor((off + x) / 200)) * 26;
      const bh = 20 + hash(Math.floor((x - off) / 46) + layer * 31) * (60 + layer * 30);
      ctx.fillRect(x - off * 0.3, hz - bh, bw, bh);
    }
  }
  ctx.fillStyle = "#0e0c09";
  ctx.beginPath();
  ctx.moveTo(vx - 2, hz);
  ctx.lineTo(w * 1.25, h);
  ctx.lineTo(-w * 0.25, h);
  ctx.closePath();
  ctx.fill();
  // shoulder lines
  ctx.strokeStyle = alpha("#f3ede2", 0.55);
  ctx.lineWidth = 2;
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(vx + s * 2, hz);
    ctx.lineTo(vx + s * w * 0.72, h);
    ctx.stroke();
  });
  // lane dashes
  for (let i = 0; i < 14; i++) {
    const z = (i / 14 + t * 0.28) % 1;
    const p = z * z;
    const y1 = hz + (h - hz) * p;
    const y2 = hz + (h - hz) * Math.min(1, (z + 0.035) * (z + 0.035));
    const wd = 1 + p * 16;
    ctx.fillStyle = alpha(accent, 0.2 + p * 0.8);
    ctx.beginPath();
    ctx.moveTo(vx - wd / 2, y1);
    ctx.lineTo(vx + wd / 2, y1);
    ctx.lineTo(vx + wd * 0.9, y2);
    ctx.lineTo(vx - wd * 0.9, y2);
    ctx.fill();
  }
  // speed streaks
  for (let i = 0; i < 26; i++) {
    const s = hash(i * 3.3);
    const z = (s + t * (0.5 + hash(i) * 0.4)) % 1;
    const side = i % 2 ? 1 : -1;
    const x0 = vx + side * (30 + s * w * 0.55) * z * z * 2.2;
    const y0 = hz + (h - hz) * z * z;
    ctx.strokeStyle = alpha("#f3ede2", 0.05 + z * 0.18);
    ctx.lineWidth = 1 + z * 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + side * z * 70, y0 + z * 40);
    ctx.stroke();
  }
  const gl = ctx.createRadialGradient(vx, hz, 0, vx, hz, w * 0.3);
  gl.addColorStop(0, alpha(accent, 0.5));
  gl.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, w, h);
};

/* 03 — Structo: architecture rising, in isometric restraint */
export const structo: Drawer = (ctx, w, h, t, accent, mx, my) => {
  const n = 7;
  const s = Math.min(w, h * 1.4) / 14;
  const ox = w * 0.6 + mx * 10;
  const oy = h * 0.34 + my * 6;
  ctx.lineWidth = 1;
  for (let sum = 0; sum < n * 2 - 1; sum++) {
    for (let i = 0; i < n; i++) {
      const j = sum - i;
      if (j < 0 || j >= n) continue;
      const seed = hash(i * 7 + j * 13);
      const cycle = (t * 0.12 + seed) % 1;
      const grow = Math.min(1, cycle * 2.2);
      const hgt = (0.3 + seed * 2.6) * s * grow;
      const x = ox + (i - j) * s;
      const y = oy + (i + j) * s * 0.5;
      const hot = (i * 3 + j) % 11 === 4;
      const top = hot ? accent : "#f1efe9";
      const L = hot ? alpha(accent, 0.65) : "#bdb9af";
      const R = hot ? alpha(accent, 0.4) : "#a29e94";
      ctx.fillStyle = L;
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.lineTo(x, y + s * 0.5);
      ctx.lineTo(x, y + s * 0.5 - hgt);
      ctx.lineTo(x - s, y - hgt);
      ctx.fill();
      ctx.fillStyle = R;
      ctx.beginPath();
      ctx.moveTo(x + s, y);
      ctx.lineTo(x, y + s * 0.5);
      ctx.lineTo(x, y + s * 0.5 - hgt);
      ctx.lineTo(x + s, y - hgt);
      ctx.fill();
      ctx.fillStyle = top;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.5 - hgt);
      ctx.lineTo(x + s, y - hgt);
      ctx.lineTo(x, y + s * 0.5 - hgt);
      ctx.lineTo(x - s, y - hgt);
      ctx.fill();
      ctx.strokeStyle = "rgba(22,21,19,0.5)";
      ctx.stroke();
    }
  }
};

/* 04 — Trak Raptor: terrain, tracks, a beacon */
export const raptor: Drawer = (ctx, w, h, t, accent) => {
  const ground = (x: number) => h * 0.7 + (vnoise(x * 0.006 + t * 0.35) - 0.5) * h * 0.14 + Math.sin(x * 0.02 + t) * 3;
  for (let l = 0; l < 3; l++) {
    ctx.fillStyle = `rgba(${40 - l * 9},${22 - l * 5},${18 - l * 4},1)`;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 12) ctx.lineTo(x, h * (0.5 + l * 0.08) + (vnoise(x * 0.004 + l * 20 + t * (0.05 + l * 0.04)) - 0.5) * h * 0.2);
    ctx.lineTo(w, h);
    ctx.fill();
  }
  ctx.fillStyle = "#120a08";
  ctx.strokeStyle = alpha(accent, 0.7);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, ground(x));
  ctx.lineTo(w, h);
  ctx.fill();
  ctx.beginPath();
  for (let x = 0; x <= w; x += 6) (x === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x, ground(x));
  ctx.stroke();
  // rover
  const rx = w * 0.58;
  const y1 = ground(rx - 40);
  const y2 = ground(rx + 40);
  const ry = (y1 + y2) / 2;
  const ang = Math.atan2(y2 - y1, 80);
  const u = Math.min(w, h * 1.5) / 520;
  ctx.save();
  ctx.translate(rx, ry);
  ctx.rotate(ang);
  ctx.scale(u * 1.7, u * 1.7);
  ctx.fillStyle = "#e8d8cc";
  ctx.beginPath();
  ctx.roundRect(-70, -28, 140, 28, 12); // tracks
  ctx.fill();
  ctx.fillStyle = "#1a0f0d";
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(i * 18, -14, 8, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = "#2a1a16";
  ctx.beginPath();
  ctx.roundRect(-46, -58, 92, 32, 6);
  ctx.fill();
  ctx.strokeStyle = alpha(accent, 0.9);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-30, -70, 36, 14);
  ctx.beginPath();
  ctx.moveTo(40, -58);
  ctx.lineTo(52, -92);
  ctx.stroke();
  const blink = 0.35 + 0.65 * (Math.sin(t * 4) > 0 ? 1 : 0.2);
  ctx.fillStyle = alpha(accent, blink);
  ctx.beginPath();
  ctx.arc(52, -94, 5, 0, TAU);
  ctx.fill();
  ctx.restore();
  const glow = ctx.createRadialGradient(rx + 52 * u * 1.7, ry - 94 * u * 1.7, 0, rx + 52 * u * 1.7, ry - 94 * u * 1.7, 140);
  glow.addColorStop(0, alpha(accent, 0.25 * blink));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
};

/* 05 — AeroCor: topography, cloud, a route that is still only a target */
export const aerocor: Drawer = (ctx, w, h, t, accent, mx) => {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, alpha(accent, 0.12));
  sky.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const rows = 26;
  for (let k = 0; k < rows; k++) {
    const y0 = h * 0.45 + k * (h * 0.022);
    ctx.beginPath();
    ctx.fillStyle = "#0d1822";
    ctx.strokeStyle = alpha(accent, 0.12 + (k / rows) * 0.45);
    ctx.lineWidth = 1;
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 8) {
      const amp = (vnoise(x * 0.005 + k * 0.7 + t * 0.03) - 0.5) * h * 0.2 * (0.3 + k / rows);
      ctx.lineTo(x, y0 + amp);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  // clouds
  for (let i = 0; i < 5; i++) {
    const cx = ((hash(i) * w * 1.4 + t * (8 + i * 3)) % (w * 1.4)) - w * 0.2;
    const cy = h * (0.12 + hash(i + 9) * 0.3);
    const r = 90 + hash(i + 4) * 120;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(233,240,245,0.12)");
    g.addColorStop(1, "rgba(233,240,245,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  // route (target only)
  const ax = w * 0.1,
    ay = h * 0.78,
    bx = w * 0.9,
    by = h * 0.3,
    qx = w * 0.45 + mx * 15,
    qy = h * 0.06;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = -t * 14;
  ctx.strokeStyle = alpha("#e9f0f5", 0.7);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(qx, qy, bx, by);
  ctx.stroke();
  ctx.setLineDash([]);
  const p = (t * 0.07) % 1;
  const px = (1 - p) * (1 - p) * ax + 2 * (1 - p) * p * qx + p * p * bx;
  const py = (1 - p) * (1 - p) * ay + 2 * (1 - p) * p * qy + p * p * by;
  const dx = 2 * (1 - p) * (qx - ax) + 2 * p * (bx - qx);
  const dy = 2 * (1 - p) * (qy - ay) + 2 * p * (by - qy);
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(Math.atan2(dy, dx));
  ctx.fillStyle = "#e9f0f5";
  ctx.beginPath(); // simple fixed-wing glyph
  ctx.moveTo(14, 0);
  ctx.lineTo(-10, -3);
  ctx.lineTo(-10, 3);
  ctx.fill();
  ctx.fillRect(-4, -16, 3, 32);
  ctx.fillRect(-12, -6, 2, 12);
  ctx.restore();
  ctx.fillStyle = accent;
  [[ax, ay], [bx, by]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, TAU);
    ctx.fill();
  });
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillStyle = alpha("#e9f0f5", 0.8);
  ctx.fillText("ORIGIN", ax - 4, ay + 22);
  ctx.fillText("150 KM · TARGET, NOT ACHIEVED", bx - 190, by - 14);
};

/* 06 — QEVROC: abstract computational structure */
export const qevroc: Drawer = (ctx, w, h, t, accent, mx, my) => {
  const cols = Math.max(14, Math.floor(w / 46));
  const cell = w / cols;
  const rows = Math.ceil(h / cell);
  const hx = w * (0.5 + 0.32 * Math.sin(t * 0.37)) + mx * 30;
  const hy = h * (0.5 + 0.3 * Math.sin(t * 0.53 + 1)) + my * 30;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cell;
      const y = j * cell;
      const d = Math.hypot(x + cell / 2 - hx, y + cell / 2 - hy) / (Math.min(w, h) * 0.55);
      const n = vnoise(i * 0.7 + j * 1.3 + t * 0.9);
      const e = Math.max(0, 1 - d) * (0.5 + n * 0.6);
      const s = cell * (0.18 + e * 0.7);
      if (e > 0.42) {
        ctx.fillStyle = alpha(accent, Math.min(0.95, e));
        ctx.fillRect(x + (cell - s) / 2, y + (cell - s) / 2, s, s);
      } else {
        ctx.strokeStyle = alpha("#ecebe4", 0.07 + e * 0.3);
        ctx.strokeRect(x + (cell - s) / 2, y + (cell - s) / 2, s, s);
      }
    }
  }
  const sx = (t * 90) % (w + 80);
  const sg = ctx.createLinearGradient(sx - 80, 0, sx, 0);
  sg.addColorStop(0, "rgba(0,0,0,0)");
  sg.addColorStop(1, alpha(accent, 0.18));
  ctx.fillStyle = sg;
  ctx.fillRect(sx - 80, 0, 80, h);
};

export const DRAWERS = { quran, freight, structo, raptor, aerocor, qevroc };

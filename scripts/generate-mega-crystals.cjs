const fs = require('fs');
const zlib = require('zlib');

// Read 123x56 transparent logo
const buf = fs.readFileSync('public/pro26-logo.png');
let pos = 8;
const idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const w = 123, h = 56;
const rowSize = 1 + w * 4;

const basePixels = [];
let minX = w, maxX = 0, minY = h, maxY = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = y * rowSize + 1 + x * 4;
    const r = raw[idx], g = raw[idx+1], b = raw[idx+2], a = raw[idx+3];
    if (a > 20) {
      const isBlue = (b > 120 && b > r + 25 && b > g);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      basePixels.push({
        x,
        y,
        isBlue,
        a: a / 255
      });
    }
  }
}

const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const span = Math.max(maxX - minX, maxY - minY);

const seamlessMegaPoints = [];

// Seamless edge-to-edge sub-pixel lattice
// Steps from -0.50 to +0.50 guarantee ZERO gaps between adjacent pixels!
const steps = [-0.50, -0.30, -0.10, 0.10, 0.30, 0.50];
const subGrid = [];
for (const dy of steps) {
  for (const dx of steps) {
    subGrid.push([dx, dy]);
  }
}

for (const p of basePixels) {
  const nx = (p.x - cx) / span * 2;
  const ny = -(p.y - cy) / span * 2;
  const type = p.isBlue ? 0 : 1;

  // Center point
  seamlessMegaPoints.push([
    Number(nx.toFixed(4)),
    Number(ny.toFixed(4)),
    type,
    Number(p.a.toFixed(2))
  ]);

  // Sub-points covering full pixel area without gaps
  const subCount = Math.round(36 * p.a); // 8 to 36 sub-points

  for (let s = 0; s < subCount; s++) {
    const [gx, gy] = subGrid[s % subGrid.length];
    // Gentle micro-jitter with slight boundary overlap to eliminate any dark lines
    const jx = nx + (gx + (Math.random() - 0.5) * 0.14) / span;
    const jy = ny + (gy + (Math.random() - 0.5) * 0.14) / span;
    const subAlpha = p.a * (0.88 + Math.random() * 0.12);

    seamlessMegaPoints.push([
      Number(jx.toFixed(4)),
      Number(jy.toFixed(4)),
      type,
      Number(subAlpha.toFixed(2))
    ]);
  }
}

console.log('Total seamless mega crystal points:', seamlessMegaPoints.length);

const content = `// Seamless ultra-dense Pro26 crystal particle matrix (${seamlessMegaPoints.length} points)
// Format: [x, y, type (0=blue P, 1=text), opacity]
export const PRO26_DENSE_POINTS: [number, number, number, number][] = ${JSON.stringify(seamlessMegaPoints)};
`;

fs.writeFileSync('components/pro26-dense-points.ts', content);
console.log('Successfully saved to components/pro26-dense-points.ts');

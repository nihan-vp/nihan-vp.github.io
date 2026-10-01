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
    if (a > 30) {
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

const ultraDensePoints = [];

// For edge-to-edge rendering, 4 sub-points per pixel creates an ultra-dense solid particle matrix
for (const p of basePixels) {
  const nx = (p.x - cx) / span * 2;
  const ny = -(p.y - cy) / span * 2;

  // Base point
  ultraDensePoints.push([
    Number(nx.toFixed(4)),
    Number(ny.toFixed(4)),
    p.isBlue ? 0 : 1,
    Number(p.a.toFixed(2))
  ]);

  // Sub-points jittered within sub-pixel radius
  const offsets = [
    [-0.35, -0.35],
    [0.35, -0.35],
    [-0.35, 0.35],
    [0.35, 0.35]
  ];

  for (const [dx, dy] of offsets) {
    const jx = nx + (dx + (Math.random() - 0.5) * 0.3) / span;
    const jy = ny + (dy + (Math.random() - 0.5) * 0.3) / span;
    ultraDensePoints.push([
      Number(jx.toFixed(4)),
      Number(jy.toFixed(4)),
      p.isBlue ? 0 : 1,
      Number((p.a * (0.75 + Math.random() * 0.25)).toFixed(2))
    ]);
  }
}

const content = `// Ultra-dense Pro26 logo particle cloud (${ultraDensePoints.length} points)
// Format: [x, y, type (0=blue P, 1=text), opacity]
export const PRO26_DENSE_POINTS: [number, number, number, number][] = ${JSON.stringify(ultraDensePoints)};
`;

fs.writeFileSync('components/pro26-dense-points.ts', content);
console.log('Saved ultra-dense points:', ultraDensePoints.length);

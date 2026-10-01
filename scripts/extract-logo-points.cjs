const fs = require('fs');
const zlib = require('zlib');

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

const particles = [];
let minX = w, maxX = 0, minY = h, maxY = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = y * rowSize + 1 + x * 4;
    const r = raw[idx], g = raw[idx+1], b = raw[idx+2], a = raw[idx+3];
    if (a > 50) {
      const isBlue = (b > 120 && b > r + 25 && b > g);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      particles.push({
        x,
        y,
        isBlue,
        a: a / 255
      });
    }
  }
}

// Center and normalize coordinates
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const span = Math.max(maxX - minX, maxY - minY);

// We can pack into a compact flat array: [x, y, isBlue, opacity]
const pointsArray = [];
for (let p of particles) {
  const nx = Number(((p.x - cx) / span * 2).toFixed(4));
  const ny = Number((-(p.y - cy) / span * 2).toFixed(4));
  pointsArray.push([nx, ny, p.isBlue ? 0 : 1, Number(p.a.toFixed(2))]);
}

const fileContent = `// Auto-generated Pro26 logo point cloud data
// Format: [x, y, type (0=blue P, 1=text), opacity]
export const PRO26_LOGO_POINTS: [number, number, number, number][] = ${JSON.stringify(pointsArray)};
`;

fs.writeFileSync('components/pro26-logo-points.ts', fileContent);
console.log('Saved points to components/pro26-logo-points.ts! Total points:', pointsArray.length);

const fs = require('fs');
const zlib = require('zlib');

// 1. Read 123x56 logo
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

// Extract alpha channel and color channel into float buffers
const alphaMap = new Float32Array(w * h);
const isBlueMap = new Uint8Array(w * h);

let minX = w, maxX = 0, minY = h, maxY = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = y * rowSize + 1 + x * 4;
    const r = raw[idx], g = raw[idx+1], b = raw[idx+2], a = raw[idx+3];
    const normA = a / 255;
    alphaMap[y * w + x] = normA;
    if (a > 30) {
      const isBlue = (b > 120 && b > r + 25 && b > g);
      isBlueMap[y * w + x] = isBlue ? 1 : 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Continuous Bilinear Interpolation Function
function sampleAlpha(fx, fy) {
  if (fx < 0 || fx >= w - 1 || fy < 0 || fy >= h - 1) return 0;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const s = fx - x0;
  const t = fy - y0;

  const a00 = alphaMap[y0 * w + x0];
  const a10 = alphaMap[y0 * w + x1];
  const a01 = alphaMap[y1 * w + x0];
  const a11 = alphaMap[y1 * w + x1];

  const top = a00 * (1 - s) + a10 * s;
  const bot = a01 * (1 - s) + a11 * s;
  const val = top * (1 - t) + bot * t;

  // Smooth sigmoidal curve to sharpen the letter curves while keeping anti-aliasing
  if (val <= 0.15) return 0;
  if (val >= 0.75) return 1.0;
  return (val - 0.15) / 0.60;
}

// Bounding box with slight margin
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const span = Math.max(maxX - minX, maxY - minY);

const TARGET_POINTS = 28000;
const points = [];

let attempts = 0;
const maxAttempts = TARGET_POINTS * 30;

while (points.length < TARGET_POINTS && attempts < maxAttempts) {
  attempts++;
  // Continuous random coordinates across the bounding box
  const rx = minX - 0.5 + Math.random() * (maxX - minX + 1.0);
  const ry = minY - 0.5 + Math.random() * (maxY - minY + 1.0);

  const density = sampleAlpha(rx, ry);
  if (density <= 0) continue;

  // Rejection sampling
  if (Math.random() < density) {
    const nx = (rx - cx) / span * 2;
    const ny = -(ry - cy) / span * 2;
    // Blue icon is x < 38.5, text is x >= 38.5
    const type = rx < 38.5 ? 0 : 1;

    points.push([
      Number(nx.toFixed(4)),
      Number(ny.toFixed(4)),
      type,
      Number(density.toFixed(2))
    ]);
  }
}

console.log('Sampled continuous points:', points.length);

// Generate test PNG image (800x364) to visually verify that ALL squares are gone
const imgW = 800, imgH = 364;
const imgPixels = Buffer.alloc(imgW * imgH * 4);

for (const [nx, ny, type] of points) {
  const px = Math.round((nx / 2) * span + cx) * (imgW / w);
  const py = Math.round((-ny / 2) * span + cy) * (imgH / h);
  const ix = Math.round(px);
  const iy = Math.round(py);
  if (ix >= 0 && ix < imgW && iy >= 0 && iy < imgH) {
    const idx = (iy * imgW + ix) * 4;
    if (type === 0) {
      imgPixels[idx] = 13;
      imgPixels[idx+1] = 137;
      imgPixels[idx+2] = 232;
      imgPixels[idx+3] = 255;
    } else {
      imgPixels[idx] = 255;
      imgPixels[idx+1] = 255;
      imgPixels[idx+2] = 255;
      imgPixels[idx+3] = 255;
    }
  }
}

function createPNG(w, h, data) {
  function crc32(b) {
    let table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    let crc = 0xffffffff;
    for (let i = 0; i < b.length; i++) crc = table[(crc ^ b[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function chunk(type, chunkData) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(chunkData.length, 0);
    const toCrc = Buffer.concat([typeBuf, chunkData]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([lenBuf, toCrc, crcBuf]);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const rowBytes = 1 + w * 4;
  const filtered = Buffer.alloc(h * rowBytes);
  for (let y = 0; y < h; y++) {
    filtered[y * rowBytes] = 0;
    data.copy(filtered, y * rowBytes + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = zlib.deflateSync(filtered, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

fs.writeFileSync('public/test-points-preview.png', createPNG(imgW, imgH, imgPixels));
console.log('Saved test-points-preview.png');

const content = `// Continuous Monte Carlo sampled Pro26 crystal points (${points.length} points)
// Format: [x, y, type (0=blue P, 1=text), opacity]
export const PRO26_DENSE_POINTS: [number, number, number, number][] = ${JSON.stringify(points)};
`;

fs.writeFileSync('components/pro26-dense-points.ts', content);
console.log('Saved continuous points to components/pro26-dense-points.ts');

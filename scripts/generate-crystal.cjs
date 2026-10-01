const fs = require('fs');
const zlib = require('zlib');

const w = 128, h = 128;
const pixels = Buffer.alloc(w * h * 4);

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  const idx = (y * w + x) * 4;
  const srcA = a / 255;
  const dstA = pixels[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) return;
  pixels[idx] = Math.round((r * srcA + pixels[idx] * dstA * (1 - srcA)) / outA);
  pixels[idx+1] = Math.round((g * srcA + pixels[idx+1] * dstA * (1 - srcA)) / outA);
  pixels[idx+2] = Math.round((b * srcA + pixels[idx+2] * dstA * (1 - srcA)) / outA);
  pixels[idx+3] = Math.round(outA * 255);
}

const cx = 64, cy = 64;

// 8-point faceted diamond crystal geometry
const N = 8;
const outerPts = [];
const innerPts = [];
for (let i = 0; i < N; i++) {
  const angle = (i * Math.PI * 2) / N - Math.PI / 2;
  outerPts.push([cx + Math.cos(angle) * 46, cy + Math.sin(angle) * 46]);
  innerPts.push([cx + Math.cos(angle) * 22, cy + Math.sin(angle) * 22]);
}

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Highly brilliant, luminous crystalline facets (Swarovski / Diamond grade)
const facetAlphas = [245, 195, 230, 180, 220, 175, 240, 210];
const facetVals = [255, 245, 255, 240, 250, 235, 255, 248];

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);

    // 1. Central Table Facet (Intense diamond core)
    if (pointInPoly(x, y, innerPts)) {
      const coreT = Math.max(0, 1 - dist / 22);
      const alpha = Math.round(210 + 45 * Math.pow(coreT, 1.5));
      setPixel(x, y, 255, 255, 255, alpha);
      continue;
    }

    // 2. Outer Facets (Brilliant prism reflections)
    for (let i = 0; i < N; i++) {
      const nextI = (i + 1) % N;
      const quad = [
        innerPts[i],
        outerPts[i],
        outerPts[nextI],
        innerPts[nextI]
      ];
      if (pointInPoly(x, y, quad)) {
        const val = facetVals[i];
        const alpha = facetAlphas[i];
        setPixel(x, y, val, val, val, alpha);
        break;
      }
    }

    // 3. Ultra-Sharp Diamond Diffraction Spikes (4-point primary + 4-point secondary micro-spikes)
    // Primary spikes: horizontal & vertical
    const spikeX = Math.abs(dx);
    const spikeY = Math.abs(dy);
    if (dist < 62) {
      const hSpike = Math.exp(-spikeY * 1.6) * Math.max(0, 1 - spikeX / 62);
      const vSpike = Math.exp(-spikeX * 1.6) * Math.max(0, 1 - spikeY / 62);
      const primarySpike = Math.max(hSpike, vSpike);
      if (primarySpike > 0.04) {
        setPixel(x, y, 255, 255, 255, Math.round(primarySpike * 255));
      }

      // Diagonal micro-spikes (45 degrees)
      const diag1 = Math.abs(dx - dy) * 0.7071;
      const diag2 = Math.abs(dx + dy) * 0.7071;
      const dSpike1 = Math.exp(-diag1 * 1.9) * Math.max(0, 1 - dist / 42);
      const dSpike2 = Math.exp(-diag2 * 1.9) * Math.max(0, 1 - dist / 42);
      const diagSpike = Math.max(dSpike1, dSpike2);
      if (diagSpike > 0.05) {
        setPixel(x, y, 255, 255, 255, Math.round(diagSpike * 210));
      }
    }
  }
}

// Crisp Facet Bevel Lines (Laser cut crystal grooves)
function drawLine(p1, p2, alpha = 255) {
  const steps = Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 2.5);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const px = Math.round(p1[0] + (p2[0] - p1[0]) * t);
    const py = Math.round(p1[1] + (p2[1] - p1[1]) * t);
    setPixel(px, py, 255, 255, 255, alpha);
  }
}

for (let i = 0; i < N; i++) {
  const nextI = (i + 1) % N;
  drawLine(outerPts[i], outerPts[nextI], 255);
  drawLine(innerPts[i], innerPts[nextI], 255);
  drawLine(innerPts[i], outerPts[i], 240);
}

// Central Blazing Diamond Hotspot
for (let dy = -5; dy <= 5; dy++) {
  for (let dx = -5; dx <= 5; dx++) {
    const d = Math.hypot(dx, dy);
    if (d <= 5) {
      const a = Math.round(Math.pow(1 - d / 5.5, 1.2) * 255);
      setPixel(cx + dx, cy + dy, 255, 255, 255, a);
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

fs.writeFileSync('public/crystal-particle.png', createPNG(w, h, pixels));
console.log('Saved refined crystal-particle.png');

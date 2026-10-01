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
const compressed = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(compressed);
const w = 123;
const h = 56;
const rowSize = 1 + w * 4;

const src = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  raw.copy(src, y * w * 4, y * rowSize + 1, (y + 1) * rowSize);
}

// 4x upscale with smooth bilinear filtering
const scale = 4;
const outW = w * scale;
const outH = h * scale;
const dst = Buffer.alloc(outW * outH * 4);

for (let y = 0; y < outH; y++) {
  const v = (y / scale);
  const y0 = Math.floor(v);
  const y1 = Math.min(h - 1, y0 + 1);
  const fy = v - y0;

  for (let x = 0; x < outW; x++) {
    const u = (x / scale);
    const x0 = Math.floor(u);
    const x1 = Math.min(w - 1, x0 + 1);
    const fx = u - x0;

    const idx00 = (y0 * w + x0) * 4;
    const idx10 = (y0 * w + x1) * 4;
    const idx01 = (y1 * w + x0) * 4;
    const idx11 = (y1 * w + x1) * 4;

    const outIdx = (y * outW + x) * 4;

    for (let c = 0; c < 4; c++) {
      const top = src[idx00 + c] * (1 - fx) + src[idx10 + c] * fx;
      const bot = src[idx01 + c] * (1 - fx) + src[idx11 + c] * fx;
      dst[outIdx + c] = Math.round(top * (1 - fy) + bot * fy);
    }
  }
}

// Create PNG encoder
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

fs.writeFileSync('public/pro26-logo-hd.png', createPNG(outW, outH, dst));

// Also generate a blurred version for Depth-of-Field
const blurDst = Buffer.alloc(outW * outH * 4);
const r = 3;
for (let y = 0; y < outH; y++) {
  for (let x = 0; x < outW; x++) {
    let sumR = 0, sumG = 0, sumB = 0, sumA = 0, count = 0;
    for (let dy = -r; dy <= r; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= outH) continue;
      for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= outW) continue;
        const idx = (ny * outW + nx) * 4;
        sumR += dst[idx];
        sumG += dst[idx+1];
        sumB += dst[idx+2];
        sumA += dst[idx+3];
        count++;
      }
    }
    const outIdx = (y * outW + x) * 4;
    blurDst[outIdx] = Math.round(sumR / count);
    blurDst[outIdx+1] = Math.round(sumG / count);
    blurDst[outIdx+2] = Math.round(sumB / count);
    blurDst[outIdx+3] = Math.round(sumA / count);
  }
}
fs.writeFileSync('public/pro26-logo-dof.png', createPNG(outW, outH, blurDst));
console.log('Generated HD textures: 492x224');

const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/pro26-logo-raw.png');
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

const blueColors = [];
const textColors = [];

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = y * rowSize + 1 + x * 4;
    const r = raw[idx], g = raw[idx+1], b = raw[idx+2], a = raw[idx+3];
    if (r > 240 && g > 240 && b > 240) continue; // background

    const isBlue = (b > 120 && b > r + 30 && b > g);
    if (isBlue) {
      blueColors.push({ r, g, b });
    } else {
      textColors.push({ r, g, b });
    }
  }
}

console.log('Sample blue pixels (first 5):', blueColors.slice(0, 5));
console.log('Sample text pixels (first 5):', textColors.slice(0, 5));

// Find modal/average RGB
let bR = 0, bG = 0, bB = 0;
for (const p of blueColors) { bR += p.r; bG += p.g; bB += p.b; }
console.log('Avg blue:', Math.round(bR/blueColors.length), Math.round(bG/blueColors.length), Math.round(bB/blueColors.length));

let tR = 0, tG = 0, tB = 0;
for (const p of textColors) { tR += p.r; tG += p.g; tB += p.b; }
console.log('Avg text:', Math.round(tR/textColors.length), Math.round(tG/textColors.length), Math.round(tB/textColors.length));

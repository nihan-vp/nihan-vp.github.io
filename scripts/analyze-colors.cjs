const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  let pos = 8;
  const chunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') chunks.push(buf.subarray(pos + 8, pos + 8 + len));
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(chunks));
  const bpp = 4;
  const rowBytes = w * bpp;
  const pixels = Buffer.alloc(w * h * bpp);
  let srcPos = 0;

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < h; y++) {
    const filter = decompressed[srcPos++];
    for (let x = 0; x < rowBytes; x++) {
      const cur = decompressed[srcPos++];
      const left = x >= bpp ? pixels[y * rowBytes + x - bpp] : 0;
      const up = y > 0 ? pixels[(y - 1) * rowBytes + x] : 0;
      const upLeft = (y > 0 && x >= bpp) ? pixels[(y - 1) * rowBytes + x - bpp] : 0;
      let val = 0;
      if (filter === 0) val = cur;
      else if (filter === 1) val = (cur + left) & 0xff;
      else if (filter === 2) val = (cur + up) & 0xff;
      else if (filter === 3) val = (cur + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) val = (cur + paeth(left, up, upLeft)) & 0xff;
      pixels[y * rowBytes + x] = val;
    }
  }
  return { w, h, pixels };
}

const { w, h, pixels } = decodePng('public/pro26-logo-raw.png');
const colorCounts = {};
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];
    if (a < 10 || (r > 240 && g > 240 && b > 240)) continue; // ignore transparent or white background
    const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }
}
const sorted = Object.entries(colorCounts).sort((a,b) => b[1] - a[1]);
console.log('Top non-white non-transparent colors:');
console.log(sorted.slice(0, 20));

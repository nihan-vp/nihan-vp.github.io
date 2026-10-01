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
const compressed = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(compressed);
const width = 123;
const height = 56;
const rowSize = 1 + width * 4;

const rgba = Buffer.alloc(width * height * 4);
let prevRow = Buffer.alloc(width * 4);

for (let y = 0; y < height; y++) {
  const filterType = raw[y * rowSize];
  const currentRow = Buffer.alloc(width * 4);
  const srcRow = raw.subarray(y * rowSize + 1, (y + 1) * rowSize);

  for (let x = 0; x < width * 4; x++) {
    const a = x >= 4 ? currentRow[x - 4] : 0;
    const b = prevRow[x];
    const c = x >= 4 ? prevRow[x - 4] : 0;
    let val = srcRow[x];

    if (filterType === 0) {}
    else if (filterType === 1) val = (val + a) & 0xff;
    else if (filterType === 2) val = (val + b) & 0xff;
    else if (filterType === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
    else if (filterType === 4) {
      const p = a + b - c;
      const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      val = (val + pr) & 0xff;
    }
    currentRow[x] = val;
    rgba[y * width * 4 + x] = val;
  }
  prevRow = currentRow;
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

// Crisp anti-aliased extraction
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < rgba.length; i += 4) {
  const r = rgba[i];
  const g = rgba[i+1];
  const b = rgba[i+2];

  // Check if pixel is part of the blue logo mark
  const isBlue = (b > 130 && b > r + 30 && b > g);

  if (isBlue) {
    // Retain exact blue mark
    out[i] = r;
    out[i+1] = g;
    out[i+2] = b;
    // Edge antialiasing against white
    const brightness = (r + g + b) / 3;
    out[i+3] = 255;
  } else {
    // Text or background
    // Original text is black (0,0,0), background is white (255,255,255)
    const brightness = (r + g + b) / 3;
    if (brightness > 240) {
      // Background white -> transparent
      out[i] = 0;
      out[i+1] = 0;
      out[i+2] = 0;
      out[i+3] = 0;
    } else {
      // Text pixel (black to dark gray with antialiasing)
      // On dark theme: render text as crisp white/ice-blue with preserved antialiasing
      const alpha = Math.min(255, Math.round((255 - brightness) / 240 * 255));
      out[i] = 255;
      out[i+1] = 255;
      out[i+2] = 255;
      out[i+3] = alpha;
    }
  }
}

fs.writeFileSync('public/pro26-logo.png', createPNG(width, height, out));
console.log('Saved refined public/pro26-logo.png');

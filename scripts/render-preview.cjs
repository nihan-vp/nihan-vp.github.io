const fs = require('fs');
const zlib = require('zlib');

const fileContent = fs.readFileSync('components/pro26-dense-points.ts', 'utf8');
const jsonMatch = fileContent.match(/\[\[.*\]\]/s);
const points = JSON.parse(jsonMatch[0]);

const imgW = 900, imgH = 400;
const imgPixels = Buffer.alloc(imgW * imgH * 4);

// Fill with dark background #050811
for (let i = 0; i < imgW * imgH; i++) {
  imgPixels[i*4] = 5;
  imgPixels[i*4+1] = 8;
  imgPixels[i*4+2] = 17;
  imgPixels[i*4+3] = 255;
}

const cx = imgW / 2;
const cy = imgH / 2;
const scale = 170;

for (const [nx, ny, type] of points) {
  const px = Math.round(cx + nx * scale);
  const py = Math.round(cy - ny * scale);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ix = px + dx;
      const iy = py + dy;
      if (ix >= 0 && ix < imgW && iy >= 0 && iy < imgH) {
        const idx = (iy * imgW + ix) * 4;
        if (type === 0) {
          imgPixels[idx] = 13;
          imgPixels[idx+1] = 137;
          imgPixels[idx+2] = 232;
        } else {
          imgPixels[idx] = 255;
          imgPixels[idx+1] = 255;
          imgPixels[idx+2] = 255;
        }
      }
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

fs.writeFileSync('public/test-dark-preview.png', createPNG(imgW, imgH, imgPixels));
console.log('Saved public/test-dark-preview.png successfully');

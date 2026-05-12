// Quick script to generate simple PNG icons for development
// Run: node scripts/generate-icons.js

const { writeFileSync } = require('fs');

// Minimal 1x1 transparent PNG as base (we'll use SVG icon in production)
// For dev, Chrome accepts SVG in some places, but manifest needs PNGs

// Create a simple colored square PNG using raw bytes
function createPNG(size) {
  // Simple approach: create a minimal valid PNG
  // Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);
  
  // IDAT chunk (raw pixel data with zlib)
  const rawData = Buffer.alloc(size * (size * 3 + 1)); // +1 for filter byte per row
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    rawData[rowStart] = 0; // no filter
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 3;
      // Indigo gradient
      rawData[px] = 99;     // R
      rawData[px + 1] = 102; // G  
      rawData[px + 2] = 241; // B (#6366F1)
    }
  }
  
  // Simple zlib wrapper (stored/no compression for simplicity)
  const zlibData = deflateRaw(rawData);
  const idat = createChunk('IDAT', zlibData);
  
  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function deflateRaw(data) {
  // Use Node's zlib
  const zlib = require('zlib');
  return zlib.deflateSync(data);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const sizes = [16, 32, 48, 128];
for (const size of sizes) {
  const png = createPNG(size);
  writeFileSync(`public/icons/icon${size}.png`, png);
  console.log(`Created icon${size}.png`);
}

const sharp = require('sharp');
const path = require('path');

const SOURCE = 'C:\\Users\\Deepak S\\.gemini\\antigravity\\brain\\412edb32-fbef-4269-8d04-247dc61e6cfa\\sideflow_icon_final_1778560286040.png';
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'icons');

const SIZES = [16, 32, 48, 128];

async function generateIcons() {
  for (const size of SIZES) {
    await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(OUT_DIR, `icon${size}.png`));
    console.log(`✓ icon${size}.png`);
  }
  console.log('Done!');
}

generateIcons().catch(console.error);

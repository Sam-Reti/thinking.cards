import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('icon-src.svg');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`  Generated ${size}x${size}`);
}

// Also generate favicon
await sharp(svg)
  .resize(32, 32)
  .png()
  .toFile('public/favicon.ico');
console.log('  Generated favicon.ico');

console.log('Done!');

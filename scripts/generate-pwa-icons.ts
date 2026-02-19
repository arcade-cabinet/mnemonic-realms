import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sizes = [192, 512];
const assetsDir = 'assets';

// Create simple placeholder icons with game title
for (const size of sizes) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1a1a2e"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${size / 8}"
        font-weight="bold"
        fill="#ffffff"
        text-anchor="middle"
        dominant-baseline="middle"
      >MR</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(assetsDir, `icon-${size}.png`));

  console.log(`Created icon-${size}.png`);
}

// Create placeholder screenshot
const screenshotSvg = `
  <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#1a1a2e"/>
    <text
      x="50%"
      y="50%"
      font-family="Arial, sans-serif"
      font-size="64"
      font-weight="bold"
      fill="#ffffff"
      text-anchor="middle"
      dominant-baseline="middle"
    >Mnemonic Realms</text>
  </svg>
`;

await sharp(Buffer.from(screenshotSvg))
  .png()
  .toFile(join(assetsDir, 'screenshot-wide.png'));

console.log('Created screenshot-wide.png');
console.log('PWA icons generated successfully');

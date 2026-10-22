import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const images = ['gothic-archive', 'gothic-cathedral', 'gothic-cathedral-game', 'gothic-cathedral-game-mobile', 'reading-desk'];
for (const image of images) {
  const file = `public/images/${image}.webp`;
  const bytes = await readFile(file);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `${file}: missing WebP header`);
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `${file}: invalid WebP image`);
}
const preview = await readFile('public/social-preview.jpg');
assert.equal(preview.readUInt16BE(0), 0xffd8, 'Social preview must be a JPEG');
console.log('All six required photographic assets are present and valid.');

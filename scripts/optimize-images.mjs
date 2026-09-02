/**
 * One-off image optimizer for PhonicsQuest.
 *
 * The mascot/decorative PNGs were authored at 1024×1024 (~1.6 MB each) but are
 * only ever displayed at ≤140 px. On phones the browser had to download tens of
 * megabytes up front (the mascot set is eagerly preloaded) and decode/downscale
 * 1024² RGBA bitmaps on every render — the main cause of the reported lag.
 *
 * This downscales the oversized PNGs to a sensible max edge (generous 2×+ retina
 * headroom for the largest 140 px display) and re-compresses them. Story JPGs and
 * the PWA icons are already appropriately sized and are left untouched.
 *
 * Run with:  node scripts/optimize-images.mjs
 */
import { Jimp } from 'jimp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const MAX_EDGE = 320; // px — > 2× the largest on-screen size (140px result mascot)
const ROOT = 'public/images';

/** Collect PNGs in public/images (top level) and public/images/mascot. */
async function collect() {
  const dirs = [ROOT, join(ROOT, 'mascot')];
  const out = [];
  for (const dir of dirs) {
    let entries;
    try {
      entries = await readdir(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (!name.toLowerCase().endsWith('.png')) continue;
      out.push(join(dir, name));
    }
  }
  return out;
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
let before = 0,
  after = 0,
  changed = 0;

for (const file of await collect()) {
  const img = await Jimp.read(file);
  const { width, height } = img.bitmap;
  if (Math.max(width, height) <= MAX_EDGE) continue; // already small enough

  const sizeBefore = (await stat(file)).size;
  if (width >= height) img.resize({ w: MAX_EDGE });
  else img.resize({ h: MAX_EDGE });
  await img.write(file);

  const sizeAfter = (await stat(file)).size;
  before += sizeBefore;
  after += sizeAfter;
  changed++;
  console.log(
    `${file}: ${width}×${height} ${kb(sizeBefore)} → ${img.bitmap.width}×${img.bitmap.height} ${kb(sizeAfter)}`,
  );
}

console.log(
  `\n${changed} images optimized: ${kb(before)} → ${kb(after)} (saved ${kb(before - after)})`,
);

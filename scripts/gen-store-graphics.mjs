// Generates Play Store graphic placeholders from the app icon + brand colors.
// Run: node scripts/gen-store-graphics.mjs
// Output: play-store/assets/*.png
import { Jimp, loadFont, measureText } from 'jimp'
import {
  SANS_128_WHITE, SANS_64_WHITE, SANS_32_WHITE, SANS_16_WHITE,
} from 'jimp/fonts'
import { mkdirSync } from 'node:fs'

const BRAND = 0x6c63ffff      // #6c63ff
const BRAND_DARK = 0x5147e0ff // a deeper shade for banding
const ICON = 'public/icons/icon-512.png'
const OUT = 'play-store/assets'
mkdirSync(OUT, { recursive: true })

const _f128 = await loadFont(SANS_128_WHITE)
const f64 = await loadFont(SANS_64_WHITE)
const f32 = await loadFont(SANS_32_WHITE)
const f16 = await loadFont(SANS_16_WHITE)

const centerX = (font, text, width) => Math.round((width - measureText(font, text)) / 2)

// ---- Feature graphic: 1024 x 500 ----
{
  const w = 1024, h = 500
  const img = new Jimp({ width: w, height: h, color: BRAND })
  // subtle left band for depth
  const band = new Jimp({ width: 430, height: h, color: BRAND_DARK })
  img.composite(band, 0, 0)

  const icon = await Jimp.read(ICON)
  icon.resize({ w: 300, h: 300 })
  img.composite(icon, 65, (h - 300) / 2)

  img.print({ font: f64, x: 440, y: 175, text: 'PhonicsQuest' })
  img.print({ font: f32, x: 442, y: 255, text: 'Early Reading + Primary English' })
  img.print({ font: f16, x: 442, y: 305, text: 'Blend  -  Spell  -  Read  -  Excel' })

  await img.write(`${OUT}/feature-graphic-1024x500.png`)
  console.log('✓ feature-graphic-1024x500.png')
}

// ---- Phone screenshots: 1080 x 1920 ----
const screens = [
  { title: 'Blend It!', sub: 'Push sounds together to read whole words' },
  { title: 'Primary English Quest', sub: 'Grammar, vocabulary & PSLE-style practice' },
  { title: 'Track Progress', sub: 'Earn stars and watch mastery grow' },
]

for (let i = 0; i < screens.length; i++) {
  const { title, sub } = screens[i]
  const w = 1080, h = 1920
  const img = new Jimp({ width: w, height: h, color: BRAND })

  // top brand band
  const top = new Jimp({ width: w, height: 520, color: BRAND_DARK })
  img.composite(top, 0, 0)

  const icon = await Jimp.read(ICON)
  icon.resize({ w: 360, h: 360 })
  img.composite(icon, (w - 360) / 2, 90)

  img.print({ font: f64, x: centerX(f64, title, w), y: 560, text: title })
  img.print({ font: f32, x: centerX(f32, sub, w), y: 680, text: sub })

  // placeholder note near bottom so it's obvious these must be replaced
  const note = 'Placeholder - replace with a real gameplay screenshot'
  img.print({ font: f16, x: centerX(f16, note, w), y: 1820, text: note })

  const name = `screenshot-${i + 1}-1080x1920.png`
  await img.write(`${OUT}/${name}`)
  console.log(`✓ ${name}`)
}

console.log('\nDone. Files in', OUT)

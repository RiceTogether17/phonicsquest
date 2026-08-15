import { chromium } from '@playwright/test';
const dir = '/tmp/claude-0/-home-user-phonicsquest/90b6e69c-e923-5dd3-bc5a-b9c7a48d9064/scratchpad';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
await page.goto(process.argv[2], { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('#btn-add-profile').first().click();
await page.fill('#cp-name-input', 'Aisha');
await page.click('[data-level="primary"]');
await page.waitForTimeout(250);
await page.click('[data-grade="P4"]');
await page.click('#cp-confirm-btn');
await page.waitForTimeout(900);
await page.evaluate(() => {
  const id = localStorage.getItem('phonicsquest_active_profile');
  const key = 'phonicsquest_profile_' + id;
  const st = JSON.parse(localStorage.getItem(key) || '{}');
  st.onboardingComplete = true;
  localStorage.setItem(key, JSON.stringify(st));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1300);
await page.evaluate(() => document.getElementById('home-tab-learn')?.click());
await page.waitForTimeout(600);

for (const id of ['btn-visual-text','btn-open-comprehension','btn-synthesis','btn-situational-writing','btn-comprehension-cloze']) {
  const ok = await page.evaluate((x) => { const b = document.getElementById(x); if (!b) return false; b.click(); return true; }, id);
  if (!ok) { console.log(id, 'NOT FOUND'); continue; }
  await page.waitForTimeout(1500);
  console.log(id, JSON.stringify(await page.evaluate(() => {
    const el = document.getElementById('primary-placeholder-content');
    if (!el || !el.innerText.trim()) return 'empty';
    return {
      details: el.querySelectorAll('details').length,
      modelAnswerToggles: [...el.querySelectorAll('summary')].filter(x => /model answer/i.test(x.textContent)).length,
      inputs: el.querySelectorAll('input, textarea, select').length,
      buttons: [...el.querySelectorAll('button')].map(b => b.textContent.replace(/\s+/g,' ').trim().slice(0,32)).slice(0,6),
    };
  })));
  await page.evaluate(() => document.querySelector('[data-placeholder-close]')?.click());
  await page.waitForTimeout(700);
  await page.evaluate(() => document.getElementById('home-tab-learn')?.click());
  await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('#home-quests-section details').forEach(d => { d.open = true; }));
  await page.waitForTimeout(200);
}
console.log('ERRORS:', errs.slice(0,3));
await browser.close();

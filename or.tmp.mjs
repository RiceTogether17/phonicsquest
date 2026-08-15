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
await page.waitForTimeout(500);
await page.evaluate(() => document.querySelectorAll('#home-quests-section details').forEach(d => { d.open = true; }));
await page.waitForTimeout(300);
await page.evaluate(() => document.getElementById('btn-open-comprehension')?.click());
await page.waitForTimeout(1800);

// The first question: read the stem, answer it, check, self-mark.
console.log('Q1:', await page.evaluate(() => document.querySelector('.ptg-q-stem')?.textContent.trim()));
await page.evaluate(() => {
  const t = document.querySelector('.open-response__input');
  t.value = 'There were three people, Sarah and her mum and dad';
  t.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.evaluate(() => document.querySelector('[data-or-check]')?.click());
await page.waitForTimeout(400);
console.log('RESULT:', JSON.stringify((await page.locator('[data-or-result]').first().innerText()).replace(/\n+/g, ' | ')));
console.log('LOCKED:', await page.evaluate(() => {
  const t = document.querySelector('.open-response__input');
  return { readOnly: t.readOnly, checkDisabled: document.querySelector('[data-or-check]').disabled };
}));
await page.locator('.open-response').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: `${dir}/or-checked.png`, clip: await page.locator('.open-response').first().boundingBox() });

await page.evaluate(() => document.querySelector('[data-or-mark="partly"]')?.click());
await page.waitForTimeout(500);
console.log('RECORDED:', JSON.stringify(await page.evaluate(() => {
  const id = localStorage.getItem('phonicsquest_active_profile');
  const st = JSON.parse(localStorage.getItem('phonicsquest_profile_' + id) || '{}');
  return {
    mastery: st.questMastery?.['open-comprehension'] || null,
    picked: document.querySelectorAll('.open-response__mark-btn--picked').length,
  };
})));

// Empty answer must not lock the box.
await page.evaluate(() => {
  const boxes = document.querySelectorAll('.open-response');
  const b = boxes[1];
  b.querySelector('[data-or-check]').click();
});
await page.waitForTimeout(300);
console.log('EMPTY:', JSON.stringify(await page.evaluate(() => {
  const b = document.querySelectorAll('.open-response')[1];
  return {
    msg: b.querySelector('[data-or-result]').innerText.trim().slice(0, 60),
    stillEditable: !b.querySelector('.open-response__input').readOnly,
  };
})));
console.log('ERRORS:', errs.slice(0, 3));
await browser.close();

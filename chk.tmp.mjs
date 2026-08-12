import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const dir = '/tmp/claude-0/-home-user-phonicsquest/90b6e69c-e923-5dd3-bc5a-b9c7a48d9064/scratchpad';
const grade = process.argv[3] || 'P4';
await page.goto(process.argv[2], { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('#btn-add-profile').first().click();
await page.fill('#cp-name-input', 'Aisha');
if (grade === 'K1') { await page.click('[data-level="preschool"]').catch(() => {}); }
else { await page.click('[data-level="primary"]'); await page.waitForTimeout(250); await page.click(`[data-grade="${grade}"]`); }
await page.click('#cp-confirm-btn');
await page.waitForTimeout(900);
await page.evaluate(() => { window.store?.set?.('onboardingComplete', true); });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1300);
await page.locator('#home-tab-learn').click();
await page.waitForTimeout(700);
console.log(grade, JSON.stringify(await page.evaluate(() => {
  const panel = document.getElementById('home-panel-learn');
  const core = document.getElementById('home-core-section');
  const quests = document.getElementById('home-quests-section');
  const y = (el) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  return {
    panelHeight: Math.round(panel.getBoundingClientRect().height),
    parentDisplay: getComputedStyle(panel).display,
    coreY: y(core), coreH: core ? Math.round(core.getBoundingClientRect().height) : null,
    questsY: y(quests),
    toggle: !!document.querySelector('.early-reading-toggle'),
    bodyHidden: document.querySelector('.early-reading-body')?.hidden ?? null,
  };
}), null, 1));
await page.screenshot({ path: `${dir}/f01-learn-${grade}.png`, fullPage: true });
await browser.close();

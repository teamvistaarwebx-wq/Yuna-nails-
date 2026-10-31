#!/usr/bin/env node
// Screenshots of the local preview at 375 px (phone) and 1440 px (desktop), plus key interaction states.
// Usage: node scripts/preview/shoot.mjs [baseUrl] [outDir]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2] || 'http://localhost:4600';
const out = process.argv[3] || 'preview/screens';
fs.mkdirSync(out, { recursive: true });

const PAGES = [
  ['home', '/'], ['landing', '/pages/landing'], ['product', '/products/rose-french'], ['kit', '/products/nail-care-kit'],
  ['collection', '/collections/all'], ['size-guide', '/pages/size-guide'], ['faq', '/pages/faq'], ['about', '/pages/about'],
  ['contact', '/pages/contact'], ['track-order', '/pages/track-order'], ['cart-empty', '/cart'], ['404', '/nope'], ['components', '/pages/components'],
];

const browser = await chromium.launch();
for (const [w, h, tag] of [[375, 812, 'm'], [1440, 900, 'd']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'm' ? 2 : 1, isMobile: tag === 'm', hasTouch: tag === 'm' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${base}/cart/clear`);
  for (const [name, url] of PAGES) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${name}-${tag}.jpg`, fullPage: true, type: 'jpeg', quality: 78 });
  }

  // Flow: product page → tap Add to bag with no size (error) → Size me later → bundle 2 → add → drawer.
  await page.goto(`${base}/products/rose-french`, { waitUntil: 'networkidle' });
  // aria-disabled buttons stay tappable for shoppers; Playwright needs force to tap them.
  await page.click('[data-add]', { force: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/flow-1-no-size-${tag}.jpg`, type: 'jpeg', quality: 78 });
  await page.check('[data-product-root] [data-size-later]');
  await page.check('[data-product-root] input[data-tier][data-qty="2"]');
  await page.waitForTimeout(200);
  await page.locator('[data-bundle-selector]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/flow-2-size-later-2-sets-${tag}.jpg`, type: 'jpeg', quality: 78 });
  await page.click('[data-add]');
  await page.waitForSelector('#CartDrawer[open]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/flow-3-drawer-${tag}.jpg`, type: 'jpeg', quality: 78 });

  // Quick add from the collection grid.
  await page.goto(`${base}/collections/all`, { waitUntil: 'networkidle' });
  await page.locator('[data-quick-add]').nth(2).click();
  await page.waitForSelector('#SizeSheet[open]');
  await page.check('#sheet-size-2');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/flow-4-quick-add-${tag}.jpg`, type: 'jpeg', quality: 78 });
  await page.click('[data-sheet-add]');
  await page.waitForSelector('#CartDrawer[open]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/flow-5-drawer-3-sets-${tag}.jpg`, type: 'jpeg', quality: 78 });

  // Sticky bar on phones after scrolling past the buttons.
  if (tag === 'm') {
    await page.goto(`${base}/products/burgundy-gloss`, { waitUntil: 'networkidle' });
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/flow-6-sticky-bar-${tag}.jpg`, type: 'jpeg', quality: 78 });
  }
  await page.goto(`${base}/cart/clear`);
  console.log(`${tag}: ${errors.length ? errors.join('\n') : 'no console errors'}`);
  await ctx.close();
}
await browser.close();

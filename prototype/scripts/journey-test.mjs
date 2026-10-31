#!/usr/bin/env node
// End-to-end click test of the main journey through the shell and phone frame, plus quick add and the kit switch.
// Usage: node scripts/journey-test.mjs [baseUrl] [outDir]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://127.0.0.1:5173';
const out = process.argv[3] || 'screens/journey';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const results = [];
const check = (name, ok) => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}`); };
const frame = () => page.frameLocator('#frame');
const shot = (n) => page.screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 80 });
const journey = async () => (await page.locator('.tb__journey b').textContent().catch(() => '')) || '';
const stateSel = async () => page.locator('#stateSel').inputValue().catch(() => '');

await page.addInitScript(() => { try { localStorage.setItem('yuna-proto-prefs', JSON.stringify({ device: 'phone', mode: 'styled', notes: false })); } catch (e) {} });
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
check('screen map lists every screen', (await page.locator('.card').count()) >= 19);
await shot('00-map');

await page.click('[data-start]');
await frame().locator('#ad-card').waitFor();
check('journey starts on the ad (1/6)', (await journey()) === '1/6');
await shot('01-ad');

await frame().locator('[data-action="ad-shop"]').click();
await frame().locator('#hook').waitFor();
await page.waitForTimeout(200);
check('Shop now opens the landing page (2/6)', (await journey()) === '2/6');
await shot('02-landing');

await frame().locator('#hook .btn').click();
await frame().locator('#size-group').waitFor();
await page.waitForTimeout(200);
check('landing button opens the product page (3/6)', (await journey()) === '3/6');
check('no size is pre-selected', (await frame().locator('#size-group .chip.is-selected').count()) === 0);

// aria-disabled stays tappable for shoppers; Playwright needs force.
await frame().locator('#buy [data-action="pdp-add"]').click({ force: true });
await frame().locator('.field-error').waitFor();
check('Add without a size shows the polite note', (await frame().locator('.field-error').textContent()).includes('Please choose your size'));
check('toolbar state follows: error', (await stateSel()) === 'error');
await shot('03-no-size-error');

await frame().locator('#size-group [data-size="M"]').click();
await page.waitForTimeout(150);
check('picking M sets state "size"', (await stateSel()) === 'size');
check('journey moves to Add to bag (4/6)', (await journey()) === '4/6');

await frame().locator('[data-tier][data-qty="2"], [data-action="set-qty"][data-qty="2"]').first().click();
await page.waitForTimeout(150);
check('2 sets hides Buy now', (await frame().locator('[data-action="pdp-buy"]').count()) === 0);
await frame().locator('[data-action="set-qty"][data-qty="1"]').click();
await page.waitForTimeout(150);
check('1 set shows Buy now again', (await frame().locator('[data-action="pdp-buy"]').count()) === 1);

await frame().locator('#buy [data-action="pdp-add"]').click();
await frame().locator('#drawer').waitFor();
check('Add to bag opens the drawer', true);
check('nudge for 1 set offers the free remover', (await frame().locator('#nudge').textContent()).includes('free nail glue remover'));
await page.waitForTimeout(350);
await shot('04-drawer-one');

await frame().locator('#drawer [data-action="qty"][data-delta="1"]').click();
await page.waitForTimeout(150);
check('quantity + updates the nudge to the 3rd set', (await frame().locator('#nudge').textContent()).includes('3rd set'));
check('free remover line appears with 2 sets', (await frame().locator('#free-remover').count()) === 1);
await frame().locator('#drawer [data-action="qty"][data-delta="1"]').click();
await page.waitForTimeout(150);
check('3 sets shows the saving', (await frame().locator('.sum__save').count()) === 1);
await shot('05-drawer-three');

await frame().locator('#checkout-btn').click();
await frame().locator('#gokwik').waitFor();
await page.waitForTimeout(200);
check('checkout opens the GoKwik placeholder (6/6)', (await journey()) === '6/6');
await shot('06-checkout');

// Quick add from the collection.
await page.goto(`${base}/#/collection`, { waitUntil: 'networkidle' });
await frame().locator('[data-action="quick-add"][data-handle="peach-whisper"]').click();
await frame().locator('#sheet').waitFor();
check('Quick add opens the size sheet', (await stateSel()) === 'sheet');
await frame().locator('#sheet [data-action="pick-later"]').click();
await frame().locator('#sheet [data-action="sheet-add"]').click();
await frame().locator('#sheet-added').waitFor();
check('item added shows a confirmation', (await stateSel()) === 'added');
await frame().locator('#drawer').waitFor({ timeout: 3000 });
check('then the bag opens', true);
check('the line says Size to confirm on WhatsApp', (await frame().locator('.line__flag').count()) >= 1);
await page.waitForTimeout(350);
await shot('07-quick-add-drawer');

// One kit switch drives the kit page, the homepage slot and the bag add-on.
await page.goto(`${base}/#/kit?state=launched`, { waitUntil: 'networkidle' });
await frame().locator('#kit-buy').waitFor();
await frame().locator('a[href="#/home"]').first().click();
await frame().locator('#kit-slot').waitFor();
check('homepage kit slot follows the launched switch', (await frame().locator('#kit-slot').textContent()).includes('Shop the kit'));
await frame().locator('#bag-btn').click();
await frame().locator('#drawer').waitFor();
check('bag kit add-on follows the switch', (await frame().locator('#addon-kit').textContent()).includes('Add') || (await frame().locator('#addon-kit').textContent()).includes('Added'));

// Dead ends show a toast.
await frame().locator('#drawer [data-action="close-drawer"]').click();
await frame().locator('#site-footer [data-todo]').first().click();
await page.locator('.toast').waitFor({ timeout: 2000 });
check('dead ends show a toast', true);

await browser.close();
console.log(results.join('\n'));
console.log(errors.length ? `Page errors:\n${errors.join('\n')}` : 'No page errors.');

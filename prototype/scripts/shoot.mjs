#!/usr/bin/env node
// Screenshots of prototype screens at 375 and 1440 px, plus an overflow check.
// Usage: node scripts/shoot.mjs [baseUrl] [outDir] [screen[:state],...]
//   Screens are opened directly (screen.html) at each width, so the shot shows the screen itself.
//   "map" shoots the screen map; "shell:<screen>" shoots the shell with the phone frame and toolbar.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2] || 'http://127.0.0.1:5173';
const out = process.argv[3] || 'screens';
const list = (process.argv[4] || 'map,tokens').split(',');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const mode of ['styled', 'wireframe']) {
  for (const [w, h, tag] of [[375, 812, 'm'], [1440, 900, 'd']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'm' ? 2 : 1 });
    await ctx.addInitScript((m) => { try { localStorage.setItem('yuna-proto-prefs', JSON.stringify({ mode: m, notes: true, device: 'phone' })); } catch (e) {} }, mode);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push(`${mode} ${tag}: ${e.message}`));
    for (const item of list) {
      const [name, state] = item.split(':');
      let url;
      if (name === 'map') url = `${base}/`;
      else if (name === 'shell') url = `${base}/#/${state}`;
      else url = `${base}/screen.html#/${name}${state ? `?state=${state}` : ''}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) problems.push(`${mode} ${tag} ${item}: overflows by ${over}px`);
      const file = `${out}/${item.replace(':', '--')}-${mode}-${tag}.jpg`;
      await page.screenshot({ path: file, fullPage: name !== 'shell', type: 'jpeg', quality: 80 });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(problems.length ? problems.join('\n') : 'No overflow, no page errors.');

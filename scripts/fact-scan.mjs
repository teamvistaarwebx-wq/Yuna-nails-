#!/usr/bin/env node
// Find every place a business fact appears, and where values disagree (Phase 0, step 4).
//
// Usage:
//   node scripts/fact-scan.mjs <theme-dir> [--urls urls.txt] [--out reports/fact-scan.md]
//
// <theme-dir> is scanned file by file (Liquid, JSON templates, settings, locales).
// --urls is a text file with one URL per line. Each page is rendered in Chromium and
// its visible text scanned, because product descriptions and pages live in Shopify
// admin, not in the theme.

import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

// Each fact: a pattern that marks a line as relevant, and an optional extractor that
// returns every value on that line, used to spot conflicts. Set noConflict for facts
// that naturally have many values (e.g. prices).
const g = (re) => new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
const all = (line, re, fn = (m) => m[0]) => [...line.matchAll(g(re))].map(fn).map((v) => v.toLowerCase().replace(/\s+/g, ' ').trim()).filter(Boolean);
const RUPEE = /(?:₹|rs\.?|inr)\s*(\d[\d,]*)/i;
const rupees = (line) => all(line, RUPEE, (m) => `rs ${m[1]}`);

const FACTS = {
  'Apply time': {
    re: /\b\d+\s*(?:-|–|to)?\s*\d*\s*(?:min|mins|minutes)\b/i,
    values: (line) => all(line, /\b\d+\s*(?:-|–|to)?\s*\d*\s*(?=min)/i, (m) => `${m[0].trim()} min`),
  },
  'Cost per wear': { re: /(?:cost|price)\s*(?:per|\/)\s*wear|per\s+wear/i, values: rupees },
  'Wear count / reuse': {
    re: /\b\d+\s*\+?\s*(?:wears|times|uses)\b|reusable|re-usable/i,
    values: (line) => all(line, /\b\d+\s*\+?\s*(?:wears|times|uses)\b/i),
  },
  'Size advice (between sizes)': {
    re: /(?:size|go)\s*(?:up|down)|larger\s+size|smaller\s+size|bigger\s+size|between\s+(?:two\s+)?sizes|choose\s+the\s+(?:larger|smaller|bigger)/i,
    values: (line) => all(line, /(?:size|go)\s*(?:up|down)|\b(?:larger|bigger|smaller)\b/i, (m) => (/up|larger|bigger/i.test(m[0]) ? 'larger' : 'smaller')),
  },
  'Bundle / percentage offers': {
    re: /\b\d{1,2}\s*%\s*off|\bbuy\s*\d|\b[2-5]\s*sets?\b|\bquantity\s*break/i,
    values: (line) => all(line, /\b\d{1,2}\s*%\s*off|\bbuy\s*\d|\b[2-5]\s*sets?\b/i),
    noConflict: true,
  },
  '5-set offer (to remove)': { re: /\b5\s*sets?\b|\bbuy\s*5\b|25\s*%\s*off/i },
  'Rupee amounts': { re: RUPEE, values: rupees, noConflict: true },
  'Shipping rule': {
    re: /free\s+(?:shipping|delivery)|shipping\s+(?:charge|fee)|delivery\s+(?:charge|fee)/i,
    values: (line) => all(line, /free\s+(?:shipping|delivery)[^.<\n]{0,40}/i),
  },
  'Dispatch / delivery time': {
    re: /dispatch|ships?\s+(?:in|within)|\b\d+\s*(?:-|–|to)\s*\d+\s*(?:hours|hrs|days|business days)\b|made\s+to\s+order/i,
    values: (line) => all(line, /\b\d+\s*(?:-|–|to)\s*\d+\s*(?:hours|hrs|days)\b/i, (m) => m[0].replace(/\s*(?:–|to)\s*/, '-').replace(/hrs/, 'hours')),
  },
  'COD': { re: /\bcod\b|cash\s+on\s+delivery/i, values: rupees },
  'Size exchange / promise': {
    re: /exchange|happiness\s+promise|return/i,
    values: (line) => all(line, /\b\d+\s*(?:hours|hrs|days)\b/i),
  },
  'In the box (glue, tabs, remover)': { re: /adhesive|\btabs?\b|glue|remover|nail\s+file|cuticle/i },
  'Sizes (XS–L)': { re: /\b(?:xs|xxs|xl)\b|\bsize\s*chart/i },
  'Newsletter / welcome offer': { re: /newsletter|subscribe|welcome\s+(?:offer|discount)|10\s*%/i },
  'Strike-through / "Rs off"': { re: /compare_at_price|(?:₹|rs\.?)\s*\d+\s*off/i },
};

function parseArgs(argv) {
  const a = { dir: argv[0], out: 'reports/fact-scan.md' };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--urls') a.urls = argv[++i];
    else if (argv[i] === '--out') a.out = argv[++i];
  }
  return a;
}

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(liquid|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

function excerpt(line, idx) {
  const start = Math.max(0, idx - 60);
  return line.slice(start, start + 150).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');
}

function scanText(source, text, hits) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const [fact, def] of Object.entries(FACTS)) {
      const m = line.match(def.re);
      if (!m) continue;
      const values = def.values ? [...new Set(def.values(line))] : [];
      (hits[fact] ??= []).push({ source, line: i + 1, values, text: excerpt(line, m.index ?? 0) });
    }
  });
}

async function renderPages(urlFile) {
  // require() (not import) so the Playwright preinstalled globally in the container is found.
  const { chromium } = createRequire(import.meta.url)('playwright');
  const urls = (await fs.readFile(urlFile, 'utf8')).split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true });
  const out = [];
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      // Includes hidden text (tabs, accordions, drawers), which is where conflicts hide.
      const text = await page.evaluate(() => document.body.textContent.replace(/[ \t]+/g, ' ').split(/\n+/).map((s) => s.trim()).filter(Boolean).join('\n'));
      out.push({ url, text });
      console.log(`Rendered ${url}`);
    } catch (e) {
      console.warn(`Failed ${url}: ${e.message}`);
    }
  }
  await browser.close();
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.dir) {
    console.error('Usage: node scripts/fact-scan.mjs <theme-dir> [--urls urls.txt] [--out file.md]');
    process.exit(1);
  }
  const hits = {};
  for (const f of await walk(args.dir)) scanText(path.relative(args.dir, f), await fs.readFile(f, 'utf8'), hits);
  if (args.urls) for (const { url, text } of await renderPages(args.urls)) scanText(url, text, hits);

  const lines = ['# Business fact scan', '', `Theme: \`${args.dir}\`${args.urls ? `; pages from \`${args.urls}\`` : ''}.`, ''];
  lines.push('Values are pulled out automatically to spot conflicts. Read every hit before acting: a match is a lead, not a verdict.', '');
  lines.push('## Summary', '', '| Fact | Places | Distinct values | Conflict? |', '| --- | --- | --- | --- |');
  for (const fact of Object.keys(FACTS)) {
    const h = hits[fact] ?? [];
    const values = [...new Set(h.flatMap((x) => x.values))];
    const conflict = FACTS[fact].values && !FACTS[fact].noConflict && values.length > 1 ? '**check**' : '';
    lines.push(`| ${fact} | ${h.length} | ${values.slice(0, 8).join(', ')}${values.length > 8 ? ', …' : ''} | ${conflict} |`);
  }
  for (const fact of Object.keys(FACTS)) {
    const h = hits[fact] ?? [];
    lines.push('', `## ${fact} (${h.length})`, '');
    if (!h.length) { lines.push('No mentions.'); continue; }
    lines.push('| Where | Value | Text |', '| --- | --- | --- |');
    for (const x of h.slice(0, 80)) lines.push(`| \`${x.source}:${x.line}\` | ${x.values.join(', ')} | ${x.text} |`);
    if (h.length > 80) lines.push(`| … ${h.length - 80} more | | |`);
  }
  await fs.mkdir(path.dirname(args.out), { recursive: true });
  await fs.writeFile(args.out, lines.join('\n') + '\n');
  console.log(`Wrote ${args.out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
// Inventory of a pulled Shopify OS 2.0 theme (Phase 0, steps 2 and 5).
//
// Usage: node scripts/theme-inventory.mjs <theme-dir> [--out reports/theme-inventory.md]
//
// Lists templates (and the sections each uses), sections, snippets, app embeds,
// app blocks, external scripts in layouts, the largest assets, and every file
// that mentions the bundle discount, the try-on or the beta size finder.

import fs from 'node:fs/promises';
import path from 'node:path';

const themeDir = process.argv[2];
const outIdx = process.argv.indexOf('--out');
const outPath = outIdx > 0 ? process.argv[outIdx + 1] : 'reports/theme-inventory.md';
if (!themeDir) {
  console.error('Usage: node scripts/theme-inventory.mjs <theme-dir> [--out file.md]');
  process.exit(1);
}

// Things Phase 0 must trace. Patterns are case-insensitive.
const TRACE = {
  'Bundle discount ("Yuna Quantity Breaks")': /quantity[\s_-]*break|qty[\s_-]*break|volume[\s_-]*discount|bundle|buy\s*[2-5]|tiered/i,
  'Try-on (AR)': /try[\s_-]*on|virtual[\s_-]*try|\bar[\s_-]+(view|try)|camweara|perfect[\s_-]*corp|mirrar/i,
  'Beta size finder / measurement': /size[\s_-]*(finder|me|guide|chart|tool)|measure|camera|beta/i,
  'Popups / newsletter': /popup|pop-up|newsletter|klaviyo|privy|wheelio|modal/i,
  'Save for later (cart)': /save[\s_-]*(it\s*)?for[\s_-]*later|wishlist/i,
  'WhatsApp / chat': /whatsapp|wa\.me|chat[\s_-]*(widget|button|bubble)|tidio|crisp|zoko|interakt|wati/i,
  'Reviews (Judge.me etc.)': /judge\.?me|jdgm|loox|stamped|okendo|yotpo/i,
  'GoKwik / checkout': /gokwik|gk-|kwik|checkout/i,
  'Tracking / pixels': /gtag|googletagmanager|fbq|facebook|meta[\s_-]*pixel|clarity|hotjar|shiprocket|aftership/i,
};

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// Shopify JSON templates may begin with a /* … */ comment; strip it before parsing.
function parseThemeJson(text) {
  return JSON.parse(text.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
}

const rel = (p) => path.relative(themeDir, p);
const kb = (b) => (b / 1024).toFixed(1);

async function main() {
  const files = await walk(themeDir);
  const byDir = (d) => files.filter((f) => rel(f).split(path.sep)[0] === d).sort();
  const lines = [`# Theme inventory`, '', `Source: \`${themeDir}\`, ${files.length} files.`, ''];

  // Templates and the section types each one uses.
  const templates = byDir('templates');
  lines.push(`## Templates (${templates.length})`, '', '| Template | Sections used (in order) | App blocks |', '| --- | --- | --- |');
  const sectionUse = {};
  const appBlocks = [];
  for (const t of templates) {
    if (!t.endsWith('.json')) {
      lines.push(`| ${rel(t)} | (Liquid template) | |`);
      continue;
    }
    try {
      const json = parseThemeJson(await fs.readFile(t, 'utf8'));
      const order = json.order ?? Object.keys(json.sections ?? {});
      const used = [];
      const apps = [];
      for (const id of order) {
        const s = json.sections?.[id];
        if (!s) continue;
        used.push(s.disabled ? `~~${s.type}~~` : s.type);
        (sectionUse[s.type] ??= new Set()).add(rel(t));
        for (const [bid, b] of Object.entries(s.blocks ?? {})) {
          if (String(b.type).startsWith('shopify://apps/')) {
            apps.push(b.type.replace('shopify://apps/', ''));
            appBlocks.push({ file: rel(t), section: s.type, block: bid, type: b.type, disabled: !!b.disabled });
          }
        }
      }
      lines.push(`| ${rel(t)} | ${used.join(', ')} | ${[...new Set(apps)].join(', ')} |`);
    } catch (e) {
      lines.push(`| ${rel(t)} | parse error: ${e.message} | |`);
    }
  }

  // Sections, with where they are used. Also include section groups (header/footer).
  const sections = byDir('sections');
  for (const g of sections.filter((f) => f.endsWith('.json'))) {
    try {
      const json = parseThemeJson(await fs.readFile(g, 'utf8'));
      for (const s of Object.values(json.sections ?? {})) (sectionUse[s.type] ??= new Set()).add(rel(g));
    } catch { /* ignore */ }
  }
  lines.push('', `## Sections (${sections.filter((f) => f.endsWith('.liquid')).length} Liquid, ${sections.filter((f) => f.endsWith('.json')).length} groups)`, '', '| Section | Used in |', '| --- | --- |');
  for (const s of sections.filter((f) => f.endsWith('.liquid'))) {
    const type = path.basename(s, '.liquid');
    const used = sectionUse[type] ? [...sectionUse[type]].join(', ') : '**unused**';
    lines.push(`| ${type} | ${used} |`);
  }

  // Snippets, with how many files render them.
  const snippets = byDir('snippets');
  const liquidFiles = files.filter((f) => f.endsWith('.liquid'));
  const liquidText = Object.fromEntries(await Promise.all(liquidFiles.map(async (f) => [f, await fs.readFile(f, 'utf8')])));
  lines.push('', `## Snippets (${snippets.length})`, '', '| Snippet | Rendered by (files) |', '| --- | --- |');
  for (const s of snippets) {
    const name = path.basename(s, '.liquid');
    const re = new RegExp(`(render|include)\\s+['"]${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    const count = Object.values(liquidText).filter((t) => re.test(t)).length;
    lines.push(`| ${name} | ${count || '**0**'} |`);
  }

  // App embeds (theme app extensions switched on in Theme settings → App embeds).
  lines.push('', '## App embeds (config/settings_data.json)', '');
  try {
    const data = parseThemeJson(await fs.readFile(path.join(themeDir, 'config/settings_data.json'), 'utf8'));
    const current = typeof data.current === 'string' ? data.presets?.[data.current] : data.current;
    const embeds = Object.entries(current?.blocks ?? {}).filter(([, b]) => String(b.type).startsWith('shopify://apps/'));
    if (!embeds.length) lines.push('None found.');
    else {
      lines.push('| App embed | Enabled | Settings |', '| --- | --- | --- |');
      for (const [, b] of embeds) {
        lines.push(`| ${b.type.replace('shopify://apps/', '')} | ${b.disabled ? 'no' : 'yes'} | ${Object.keys(b.settings ?? {}).join(', ')} |`);
      }
    }
  } catch (e) {
    lines.push(`Could not read settings_data.json: ${e.message}`);
  }

  lines.push('', '## App blocks inside templates', '');
  if (!appBlocks.length) lines.push('None found.');
  else {
    lines.push('| Template | Section | App block | Enabled |', '| --- | --- | --- | --- |');
    for (const a of appBlocks) lines.push(`| ${a.file} | ${a.section} | ${a.type.replace('shopify://apps/', '')} | ${a.disabled ? 'no' : 'yes'} |`);
  }

  // Script and stylesheet tags in layouts (legacy app installs often live here).
  lines.push('', '## External scripts and styles in layouts and snippets', '');
  const ext = [];
  for (const [f, text] of Object.entries(liquidText)) {
    for (const m of text.matchAll(/<script[^>]*\bsrc=["']([^"']+)["'][^>]*>|<link[^>]*\bhref=["'](https?:)?\/\/([^"']+)["'][^>]*>/gi)) {
      const src = m[1] ?? `//${m[3]}`;
      if (/^(https?:)?\/\//.test(src)) {
        ext.push({ file: rel(f), src, async: /\b(async|defer)\b/i.test(m[0]) || /type=["']module/i.test(m[0]) });
      }
    }
  }
  if (!ext.length) lines.push('None found.');
  else {
    lines.push('| File | URL | async/defer |', '| --- | --- | --- |');
    for (const e of ext) lines.push(`| ${e.file} | ${e.src} | ${e.async ? 'yes' : '**no (blocking)**'} |`);
  }

  // Largest assets.
  const assets = byDir('assets');
  const sized = await Promise.all(assets.map(async (a) => ({ a, size: (await fs.stat(a)).size })));
  sized.sort((x, y) => y.size - x.size);
  lines.push('', `## Largest assets (${assets.length} total, ${kb(sized.reduce((s, x) => s + x.size, 0))} KB)`, '', '| Asset | KB |', '| --- | --- |');
  for (const { a, size } of sized.slice(0, 20)) lines.push(`| ${rel(a)} | ${kb(size)} |`);

  // Trace: every file that mentions each feature, with the first matching line.
  lines.push('', '## Feature trace', '');
  const textFiles = files.filter((f) => /\.(liquid|json|js|css)$/.test(f));
  for (const [label, re] of Object.entries(TRACE)) {
    lines.push(`### ${label}`, '');
    let hits = 0;
    for (const f of textFiles) {
      const text = liquidText[f] ?? (await fs.readFile(f, 'utf8'));
      const fileLines = text.split('\n');
      const idx = fileLines.findIndex((l) => re.test(l));
      if (idx < 0) continue;
      const total = fileLines.filter((l) => re.test(l)).length;
      const line = fileLines[idx];
      const m = line.match(re);
      const start = Math.max(0, (m?.index ?? 0) - 50);
      const excerpt = line.slice(start, start + 130).trim().replace(/\|/g, '\\|').replace(/`/g, "'");
      lines.push(`- \`${rel(f)}:${idx + 1}\` (${total} lines): ${excerpt}`);
      if (++hits >= 40) { lines.push('- … (truncated at 40 files)'); break; }
    }
    if (!hits) lines.push('- No mentions in theme files.');
    lines.push('');
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, lines.join('\n') + '\n');
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

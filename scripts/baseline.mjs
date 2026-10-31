#!/usr/bin/env node
// Mobile speed baseline for yunanails.in (Phase 0) and for preview themes (Phase 3+).
//
// Usage:
//   node scripts/baseline.mjs --product <handle> [--collection all] [--runs 3]
//        [--base https://yunanails.in] [--preview-theme <id>] [--label baseline]
//        [--ua instagram-android|instagram-ios]
//
// Lighthouse default mobile profile: emulated mid-range phone, simulated slow 4G,
// 4x CPU slowdown. Each page runs --runs times; the run with the median LCP is kept.
//
// --ua only swaps the user-agent string. It shows whether the server or apps
// serve different code to Instagram, but it is NOT a measurement inside the
// Instagram in-app browser. That needs a real phone (see docs/phase0-audit.md).

import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createRequire } from 'node:module';

const LH_VERSION = createRequire(import.meta.url)('lighthouse/package.json').version;

const UAS = {
  'instagram-android':
    'Mozilla/5.0 (Linux; Android 13; SM-A346E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.100 Mobile Safari/537.36 Instagram 352.0.0.38.100 Android (33/13; 420dpi; 1080x2340; samsung; SM-A346E; a34x; mt6877; en_IN; 650000000)',
  'instagram-ios':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 352.0.0.38.100 (iPhone14,5; iOS 17_6; en_IN; en-IN; scale=3.00; 1170x2532; 650000000)',
};

function parseArgs(argv) {
  const args = { base: 'https://yunanails.in', runs: 3, collection: 'all', label: 'baseline' };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    const val = argv[i + 1];
    if (['product', 'collection', 'base', 'preview-theme', 'label', 'ua', 'runs', 'out', 'pages'].includes(key)) {
      args[key] = val;
      i++;
    }
  }
  args.runs = Number(args.runs);
  return args;
}

function pageList(args) {
  const pages = [
    ['home', '/'],
    ['collection', `/collections/${args.collection}`],
  ];
  if (args.product) pages.push(['product', `/products/${args.product}`]);
  else console.warn('No --product handle given: skipping the product page.');
  pages.push(['cart', '/cart']);
  // --pages "landing=/pages/landing,kit=/products/nail-care-kit" adds or overrides pages.
  if (args.pages) {
    for (const pair of args.pages.split(',')) {
      const [name, p] = pair.split('=');
      const idx = pages.findIndex(([n]) => n === name);
      if (idx >= 0) pages[idx] = [name, p];
      else pages.push([name, p]);
    }
  }
  return pages.map(([name, p]) => {
    const url = new URL(p, args.base);
    if (args['preview-theme']) url.searchParams.set('preview_theme_id', args['preview-theme']);
    return { name, url: url.toString() };
  });
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) / 2)];
};
const kb = (b) => Math.round(b / 1024);
const sec = (ms) => (ms / 1000).toFixed(2);

function summarise(lhr) {
  const a = lhr.audits;
  const requests = a['network-requests']?.details?.items ?? [];
  const firstParty = new URL(lhr.finalDisplayedUrl).hostname.replace(/^www\./, '');

  // Bytes per host, split by resource type, so each app's weight is visible.
  const byHost = {};
  for (const r of requests) {
    let host;
    try { host = new URL(r.url).hostname; } catch { continue; }
    const h = (byHost[host] ??= { host, requests: 0, bytes: 0, scriptBytes: 0 });
    h.requests++;
    h.bytes += r.transferSize ?? 0;
    if (r.resourceType === 'Script') h.scriptBytes += r.transferSize ?? 0;
  }

  const thirdParty = (a['third-party-summary']?.details?.items ?? []).map((i) => ({
    entity: typeof i.entity === 'string' ? i.entity : i.entity?.text ?? String(i.entity),
    transferKB: kb(i.transferSize ?? 0),
    mainThreadMs: Math.round(i.mainThreadTime ?? 0),
    blockingMs: Math.round(i.blockingTime ?? 0),
  }));

  const renderBlocking = (a['render-blocking-resources']?.details?.items ?? []).map((i) => ({
    url: i.url,
    wastedMs: Math.round(i.wastedMs ?? 0),
  }));

  const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
    ?? a['largest-contentful-paint-element']?.details?.items?.[0]?.node;

  const videos = requests
    .filter((r) => r.resourceType === 'Media' || /\.(mp4|webm|m3u8)(\?|$)/i.test(r.url))
    .map((r) => ({ url: r.url, transferKB: kb(r.transferSize ?? 0) }));

  return {
    url: lhr.finalDisplayedUrl,
    score: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    lcpMs: a['largest-contentful-paint']?.numericValue,
    fcpMs: a['first-contentful-paint']?.numericValue,
    tbtMs: a['total-blocking-time']?.numericValue,
    cls: a['cumulative-layout-shift']?.numericValue,
    speedIndexMs: a['speed-index']?.numericValue,
    requests: requests.length,
    transferKB: kb(requests.reduce((s, r) => s + (r.transferSize ?? 0), 0)),
    lcpElement: lcpEl ? { selector: lcpEl.selector, snippet: lcpEl.snippet } : null,
    firstParty,
    hosts: Object.values(byHost).sort((x, y) => y.bytes - x.bytes),
    thirdParty,
    renderBlocking,
    videos,
    warnings: lhr.runWarnings,
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const pages = pageList(args);
  const flags = ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'];
  if (process.env.HTTPS_PROXY) flags.push(`--proxy-server=${process.env.HTTPS_PROXY}`);
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium',
    chromeFlags: flags,
  });

  const config = {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance'],
      ...(args.ua ? { emulatedUserAgent: UAS[args.ua] ?? args.ua } : {}),
    },
  };

  const results = [];
  try {
    for (const page of pages) {
      const runs = [];
      for (let i = 0; i < args.runs; i++) {
        process.stdout.write(`${page.name} run ${i + 1}/${args.runs}… `);
        const { lhr } = await lighthouse(page.url, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
        if (lhr.runtimeError) {
          console.log(`error: ${lhr.runtimeError.code}`);
          continue;
        }
        const s = summarise(lhr);
        console.log(`LCP ${sec(s.lcpMs)} s, ${s.requests} requests, ${s.transferKB} KB`);
        runs.push(s);
      }
      if (!runs.length) {
        results.push({ name: page.name, url: page.url, error: 'all runs failed' });
        continue;
      }
      const m = median(runs.map((r) => r.lcpMs));
      const chosen = runs.find((r) => r.lcpMs === m);
      results.push({ name: page.name, ...chosen, lcpRunsMs: runs.map((r) => Math.round(r.lcpMs)) });
    }
  } finally {
    await chrome.kill();
  }

  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const label = [args.label, args.ua, args['preview-theme'] && `theme-${args['preview-theme']}`].filter(Boolean).join('-');
  const outDir = args.out || 'reports';
  await fs.mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, `speed-${label}-${stamp}.json`);
  await fs.writeFile(jsonPath, JSON.stringify({ args, results }, null, 2));
  const mdPath = jsonPath.replace(/\.json$/, '.md');
  await fs.writeFile(mdPath, toMarkdown(args, results));
  console.log(`\nWrote ${jsonPath}\nWrote ${mdPath}`);
}

function toMarkdown(args, results) {
  const lines = [];
  lines.push(`# Speed: ${args.label}${args.ua ? ` (UA: ${args.ua}, emulated only)` : ''}`);
  lines.push('');
  lines.push(`Lighthouse ${LH_VERSION} mobile profile, simulated slow 4G, 4x CPU. Median LCP of ${args.runs} runs. Budget: LCP ≤ 2.5 s.`);
  lines.push('');
  lines.push('| Page | Score | LCP | FCP | TBT | CLS | Requests | Transfer | LCP runs |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    if (r.error) { lines.push(`| ${r.name} | — | ${r.error} | | | | | | |`); continue; }
    const flag = r.lcpMs > 2500 ? ' ❌' : ' ✅';
    lines.push(`| ${r.name} | ${r.score} | ${sec(r.lcpMs)} s${flag} | ${sec(r.fcpMs)} s | ${Math.round(r.tbtMs)} ms | ${r.cls.toFixed(3)} | ${r.requests} | ${r.transferKB} KB | ${r.lcpRunsMs.map(sec).join(' / ')} |`);
  }
  for (const r of results) {
    if (r.error) continue;
    lines.push('', `## ${r.name}`, '', r.url, '');
    if (r.lcpElement) lines.push(`LCP element: \`${r.lcpElement.selector}\``, '');
    if (r.videos.length) {
      lines.push('Video downloaded during load:', '');
      for (const v of r.videos) lines.push(`- ${v.transferKB} KB: ${v.url}`);
      lines.push('');
    }
    if (r.thirdParty.length) {
      lines.push('| Third party | Transfer | Main thread | Blocking |', '| --- | --- | --- | --- |');
      for (const t of r.thirdParty) lines.push(`| ${t.entity} | ${t.transferKB} KB | ${t.mainThreadMs} ms | ${t.blockingMs} ms |`);
      lines.push('');
    }
    lines.push('| Host | Requests | Transfer | Of which script |', '| --- | --- | --- | --- |');
    for (const h of r.hosts.slice(0, 25)) lines.push(`| ${h.host} | ${h.requests} | ${kb(h.bytes)} KB | ${kb(h.scriptBytes)} KB |`);
    if (r.renderBlocking.length) {
      lines.push('', 'Render-blocking:', '');
      for (const b of r.renderBlocking) lines.push(`- ${b.wastedMs} ms: ${b.url}`);
    }
  }
  return lines.join('\n') + '\n';
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

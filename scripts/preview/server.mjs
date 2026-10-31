#!/usr/bin/env node
// Local preview of the theme with sample data and a working in-memory cart.
// Usage: node scripts/preview/server.mjs [port]   then open http://localhost:4600
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import * as R from './renderer.mjs';
import * as M from './mock-data.mjs';

R.setOverrides(JSON.parse(fs.readFileSync(new URL('./preview-settings.json', import.meta.url))));
const PORT = Number(process.argv[2] || 4600);
let lines = []; // { key, id, quantity, properties }

function cartObject() {
  const settings = R.globalSettings();
  const items = lines.map((l) => {
    const { v, p } = M.variantById[l.id];
    return {
      key: l.key, id: v.id, product_id: p.id, url: `${p.url}?variant=${v.id}`, quantity: l.quantity, properties: l.properties || {},
      image: p.featured_media ? p.featured_media.preview_image : null, product: p, variant: v, title: `${p.title} - ${v.title}`,
      options_with_values: [{ name: settings.size_option_name, value: v.title }],
      final_line_price: v.price * l.quantity, original_line_price: v.price * l.quantity, final_price: v.price,
    };
  });
  return {
    items, item_count: items.reduce((s, i) => s + i.quantity, 0), total_price: items.reduce((s, i) => s + i.final_line_price, 0),
    total_discount: 0, currency: { iso_code: 'INR' }, note: '',
  };
}
const BANNER = '<div style="font:12px/1.4 system-ui;background:#fff8;color:#3D0B0E;text-align:center;padding:6px 12px;border-bottom:1px dashed #3D0B0E33">Local preview · sample products and photos · open items show as [[TO CONFIRM]]</div>';
const page = async (opts) => (await R.renderPage({ ...opts, cart: cartObject() })).replace(/<body([^>]*)>/, `<body$1>${BANNER}`);
const send = (res, code, body, type = 'text/html; charset=utf-8') => { res.writeHead(code, { 'Content-Type': type }); res.end(body); };
const body = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => ok(b)); });
async function drawerSections() { return { 'cart-drawer': await R.renderSectionById('cart-drawer', { cart: cartObject(), routes: { cart_url: '/cart', all_products_collection_url: '/collections/all' } }) }; }
const info = (title, text) => `<!doctype html><meta name=viewport content="width=device-width"><body style="font:16px/1.5 system-ui;padding:24px;color:#3D0B0E;background:#F4EAE0"><h1 style="font-weight:400">${title}</h1><p>${text}</p><p><a href="/">Back to the store</a></p>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = decodeURIComponent(url.pathname);
  try {
    if (p.startsWith('/assets/')) {
      const file = path.join(R.THEME, 'assets', path.basename(p));
      const type = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream';
      return send(res, 200, fs.readFileSync(file), type);
    }
    if (req.method === 'POST' && p === '/cart/add.js') {
      const b = JSON.parse(await body(req));
      for (const it of b.items) {
        const props = it.properties || {};
        const key = `${it.id}:${JSON.stringify(props)}`;
        const existing = lines.find((l) => l.key === key);
        if (existing) existing.quantity += it.quantity || 1; else lines.push({ key, id: Number(it.id), quantity: it.quantity || 1, properties: props });
      }
      return send(res, 200, JSON.stringify({ items: b.items, sections: await drawerSections() }), 'application/json');
    }
    if (req.method === 'POST' && p === '/cart/change.js') {
      const b = JSON.parse(await body(req));
      const l = lines.find((x) => x.key === b.id);
      if (l) l.quantity = b.quantity;
      lines = lines.filter((x) => x.quantity > 0);
      return send(res, 200, JSON.stringify({ ...cartObject(), sections: await drawerSections() }), 'application/json');
    }
    if (p === '/cart/clear') { lines = []; res.writeHead(302, { Location: '/' }); return res.end(); }
    const permalink = p.match(/^\/cart\/(\d+):(\d+)$/);
    if (permalink) return send(res, 200, info('Checkout (preview)', `Buy now would open checkout with only this set: variant ${permalink[1]} × ${permalink[2]}${url.searchParams.get('attributes[Size]') ? `, Size: ${url.searchParams.get('attributes[Size]')}` : ''}. On the store this is GoKwik or Shopify checkout.`));
    if ((req.method === 'POST' && p === '/cart') || p === '/checkout') return send(res, 200, info('Checkout (preview)', 'On the store, this opens GoKwik (or Shopify checkout until GoKwik is live) with everything in the bag.'));
    if (req.method === 'POST') { res.writeHead(302, { Location: req.headers.referer || '/' }); return res.end(); }

    if (p === '/search/suggest') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const found = M.products.filter((x) => x.title.toLowerCase().includes(q) || x.metafields.custom.shape.value.toLowerCase().includes(q));
      return send(res, 200, await R.renderSectionById('predictive-search', { predictive_search: { performed: true, terms: q, resources: { products: found } }, routes: { search_url: '/search' } }));
    }
    if (p === '/' ) return send(res, 200, await page({ template: 'index', pageType: 'index', title: 'Yuna Nails' }));
    if (p === '/products/nail-care-kit') return send(res, 200, await page({ template: 'product.kit', suffix: 'kit', pageType: 'product', objects: { product: M.kit }, title: 'Nail care kit' }));
    let m = p.match(/^\/products\/([^/]+)$/);
    if (m && M.productByHandle[m[1]]) return send(res, 200, await page({ template: 'product', pageType: 'product', objects: { product: M.productByHandle[m[1]] }, title: M.productByHandle[m[1]].title }));
    m = p.match(/^\/collections\/([^/]+)$/);
    if (m) { const c = M.collections[m[1]] || M.collections.all; return send(res, 200, await page({ template: 'collection', pageType: 'collection', objects: { collection: c }, title: c.title })); }
    if (p === '/collections') return send(res, 200, await page({ template: 'list-collections', pageType: 'list-collections', title: 'Collections' }));
    if (p === '/cart') return send(res, 200, await page({ template: 'cart', pageType: 'cart', title: 'Your bag' }));
    if (p === '/search') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const results = M.products.filter((x) => x.title.toLowerCase().includes(q)).map((x) => ({ ...x, object_type: 'product' }));
      return send(res, 200, await page({ template: 'search', pageType: 'search', objects: { search: { performed: !!q, terms: q, results, results_count: results.length } }, title: 'Search' }));
    }
    m = p.match(/^\/pages\/([^/]+)$/);
    if (m && M.pages[m[1]]) { const pg = M.pages[m[1]]; return send(res, 200, await page({ template: `page.${pg.template_suffix}`, suffix: pg.template_suffix, pageType: 'page', objects: { page: pg }, title: pg.title })); }
    return send(res, 404, await page({ template: '404', pageType: '404', title: 'Page not found' }));
  } catch (err) {
    console.error(err);
    return send(res, 500, `<pre>${String(err.stack || err).replace(/</g, '&lt;')}</pre>`);
  }
});
server.listen(PORT, () => console.log(`Preview on http://localhost:${PORT}`));

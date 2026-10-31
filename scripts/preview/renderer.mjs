// Renders the theme in theme/ with liquidjs, close enough to Shopify to review layout and behaviour locally.
// Shopify-only tags (schema, form, section, sections, paginate) and filters are shimmed below.
import fs from 'node:fs';
import path from 'node:path';
import { Liquid, Tag, Hash } from 'liquidjs';
import * as M from './mock-data.mjs';

export const THEME = path.resolve('theme');
const read = (p) => fs.readFileSync(path.join(THEME, p), 'utf8');
const stripComment = (s) => s.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');

const engine = new Liquid({
  root: [path.join(THEME, 'snippets')],
  partials: [path.join(THEME, 'snippets')],
  extname: '.liquid',
  dynamicPartials: true,
  relativeReference: false,
  cache: false,
});

/* ---------- Tags ---------- */
class SchemaTag extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid);
    while (remain.length) { const t = remain.shift(); if (t.name === 'endschema') return; }
  }
  * render() {}
}
engine.registerTag('schema', SchemaTag);

function blockTag(endName, onRender) {
  return class extends Tag {
    constructor(token, remain, liquid, parser) {
      super(token, remain, liquid);
      this.args = token.args;
      this.tpls = [];
      const stream = parser.parseStream(remain)
        .on(`tag:${endName}`, () => stream.stop())
        .on('template', (t) => this.tpls.push(t))
        .on('end', () => { throw new Error(`${endName} missing`); });
      stream.start();
    }
    * render(ctx, emitter) { yield* onRender.call(this, ctx, emitter); }
  };
}
engine.registerTag('form', blockTag('endform', function* (ctx, emitter) {
  const m = this.args.match(/^\s*(['"])([^'"]+)\1\s*,?\s*(.*)$/s);
  const type = m ? m[2] : 'form';
  const h = m && m[3] ? yield new Hash(m[3]).render(ctx) : {};
  const action = type === 'customer' || type === 'contact' ? '/contact' : `/account/${type}`;
  emitter.write(`<form method="post" action="${action}" accept-charset="UTF-8"${h.id ? ` id="${h.id}"` : ''}${h.class ? ` class="${h.class}"` : ''}><input type="hidden" name="form_type" value="${type}">`);
  ctx.push({ form: { 'posted_successfully?': false, errors: null } });
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
  ctx.pop();
  emitter.write('</form>');
}));
engine.registerTag('paginate', blockTag('endpaginate', function* (ctx, emitter) {
  ctx.push({ paginate: { pages: 1, parts: [], current_page: 1, items: 0 } });
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
  ctx.pop();
}));
engine.registerTag('section', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/^['"]|['"]$/g, ''); }
  * render(ctx, emitter) { emitter.write(yield renderSection(this.name, this.name, {}, ctx.getAll())); }
});
engine.registerTag('sections', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/^['"]|['"]$/g, ''); }
  * render(ctx, emitter) {
    const group = JSON.parse(stripComment(read(`sections/${this.name}.json`)));
    for (const id of group.order) emitter.write(yield renderSection(group.sections[id].type, `${this.name}__${id}`, group.sections[id], ctx.getAll()));
  }
});

/* ---------- Filters ---------- */
const kw = (args) => Object.fromEntries(args.filter(Array.isArray));
let MONEY = 'Rs {{amount}}';
export function money(cents, trailing = true) {
  const n = Number(cents) || 0;
  const [whole, dec] = (n / 100).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const amount = !trailing && dec === '00' ? grouped : `${grouped}.${dec}`;
  return MONEY.replace(/\{\{\s*\w+\s*\}\}/, amount);
}
const hex = (c) => { const h = String(c).replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');

engine.registerFilter('divided_by', (a, b) => (Number.isInteger(Number(a)) && Number.isInteger(Number(b)) ? Math.floor(a / b) : a / b));
engine.registerFilter('money', (c) => money(c));
engine.registerFilter('money_without_trailing_zeros', (c) => money(c, false));
engine.registerFilter('money_without_currency', (c) => (Number(c) / 100).toFixed(2));
engine.registerFilter('color_mix', (a, b, w) => { const x = hex(a); const y = hex(b); const t = Number(w) / 100; return toHex(x.map((v, i) => v * t + y[i] * (1 - t))); });
engine.registerFilter('color_modify', (c, prop, v) => (prop === 'alpha' ? `rgba(${hex(c).join(', ')}, ${v})` : c));
engine.registerFilter('asset_url', (name) => `/assets/${name}`);
engine.registerFilter('stylesheet_tag', (url) => `<link href="${url}" rel="stylesheet" type="text/css" media="all">`);
engine.registerFilter('preload_tag', (url, ...args) => { const o = kw(args); return `<link href="${url}" rel="preload" as="${o.as}" type="${o.type || ''}" crossorigin="anonymous">`; });
engine.registerFilter('image_url', (img) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.src || '';
});
engine.registerFilter('image_tag', (src, ...args) => {
  const o = kw(args);
  const attrs = [`src="${src}"`, `alt="${esc(o.alt ?? '')}"`];
  if (o.loading) attrs.push(`loading="${o.loading}"`);
  if (o.fetchpriority && o.fetchpriority !== 'auto') attrs.push(`fetchpriority="${o.fetchpriority}"`);
  if (o.class) attrs.push(`class="${o.class}"`);
  if (o.sizes) attrs.push(`sizes="${o.sizes}"`);
  attrs.push('width="1600" height="2000"');
  return `<img ${attrs.join(' ')}>`;
});
engine.registerFilter('placeholder_svg_tag', (_name, cls) => `<svg class="${cls || ''}" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="500"/></svg>`);
engine.registerFilter('payment_type_svg_tag', (t) => `<svg viewBox="0 0 38 24" role="img" aria-label="${t}"><rect width="38" height="24" rx="3" fill="currentColor" opacity=".15"/><text x="19" y="15" text-anchor="middle" font-size="8" fill="currentColor" font-family="system-ui">${t.toUpperCase().slice(0, 4)}</text></svg>`);
engine.registerFilter('format_address', (a) => String(a || ''));
engine.registerFilter('default_errors', () => 'Please check the form.');
engine.registerFilter('default_pagination', () => '');
engine.registerFilter('format_code', (c) => c);
engine.registerFilter('t', (k) => k);

/* ---------- Settings resolution ---------- */
const schemaOf = (file) => { const m = read(file).match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); return m ? JSON.parse(m[1]) : {}; };
function resolveValue(type, value) {
  if (value === undefined || value === null || value === '') return type === 'checkbox' ? false : null;
  switch (type) {
    case 'collection': return M.collections[value] || null;
    case 'product': return M.productByHandle[value] || null;
    case 'link_list': return M.menus[value] || { links: [] };
    case 'image_picker': return typeof value === 'object' ? value : M.image(String(value), '#E9DDD2');
    case 'video': return null;
    default: return value;
  }
}
function resolveSettings(defs, given = {}) {
  const out = {};
  for (const d of defs || []) {
    if (!d.id) continue;
    const v = Object.prototype.hasOwnProperty.call(given, d.id) ? given[d.id] : d.default;
    out[d.id] = resolveValue(d.type, v);
  }
  return out;
}
let GLOBAL_OVERRIDES = {};
export function globalSettings() {
  const schema = JSON.parse(read('config/settings_schema.json'));
  return resolveSettings(schema.flatMap((g) => g.settings || []), GLOBAL_OVERRIDES);
}
export function setOverrides(o) { GLOBAL_OVERRIDES = o.settings || {}; SECTION_OVERRIDES = o.sections || {}; if (o.money_format) MONEY = o.money_format; }
let SECTION_OVERRIDES = {};

// Shopify keeps these visible inside snippets; liquidjs's render isolates them unless passed as globals.
const GLOBAL_KEYS = ['settings', 'shop', 'routes', 'cart', 'request', 'template', 'collections', 'canonical_url', 'page_title', 'customer'];
const globalsOf = (scope) => Object.fromEntries(GLOBAL_KEYS.filter((k) => k in scope).map((k) => [k, scope[k]]));

export async function renderSection(type, id, data, scope) {
  const file = `sections/${type}.liquid`;
  const schema = schemaOf(file);
  const over = SECTION_OVERRIDES[id] || SECTION_OVERRIDES[type] || {};
  const settings = resolveSettings(schema.settings, { ...(data.settings || {}), ...over });
  const blockDefs = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b]));
  const blocks = (data.block_order || Object.keys(data.blocks || {})).map((bid) => {
    const b = data.blocks[bid];
    return { id: bid, type: b.type, settings: resolveSettings(blockDefs[b.type]?.settings, b.settings), shopify_attributes: '' };
  });
  const section = { id, settings, blocks };
  const html = await engine.parseAndRender(read(file), { ...scope, section }, { globals: globalsOf(scope) });
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

export async function renderTemplate(name, scope) {
  const tpl = JSON.parse(stripComment(read(`templates/${name}.json`)));
  let out = '';
  for (const id of tpl.order) {
    const s = tpl.sections[id];
    if (s.disabled) continue;
    out += await renderSection(s.type, `template--${name}__${id}`, s, { ...scope, __template: name });
  }
  return out;
}

export async function renderPage({ template, suffix, pageType, objects = {}, cart, title }) {
  const settings = globalSettings();
  const scope = {
    settings, cart, ...objects,
    shop: { name: 'Yuna Nails', url: '/', description: 'Hand-painted press-on nails, made to order.', money_format: MONEY, enabled_payment_types: ['visa', 'master', 'upi', 'rupay'], customer_accounts_enabled: true, password_message: '' },
    routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', search_url: '/search', predictive_search_url: '/search/suggest', all_products_collection_url: '/collections/all', account_url: '/account', account_register_url: '/account/register', account_logout_url: '/account/logout', account_addresses_url: '/account/addresses', product_recommendations_url: '/recommendations/products' },
    request: { locale: { iso_code: 'en' }, page_type: pageType, design_mode: false },
    template: { name: pageType, suffix: suffix || null, directory: null },
    page_title: title || 'Yuna Nails', canonical_url: 'https://yunanails.in/', current_page: 1, content_for_header: '',
    collections: Object.assign(Object.values(M.collections), M.collections),
    recommendations: { performed: true, products_count: 4, products: M.products.slice(2, 6) },
  };
  scope.content_for_layout = await renderTemplate(template, scope);
  return engine.parseAndRender(read('layout/theme.liquid'), scope, { globals: globalsOf(scope) });
}

export async function renderSectionById(type, scope) {
  return renderSection(type, type, {}, { settings: globalSettings(), ...scope });
}

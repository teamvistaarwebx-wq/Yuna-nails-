// Sample data for the local preview only. Layout review, not content.
// Product names are placeholders; prices sit inside the confirmed Rs 999–2,499 range.
// No ratings and no reviews are invented: those stay empty, as on a fresh theme.

export const TONES = ['#E9D3C5', '#F2C9C4', '#6E1F2A', '#7A7140', '#E8B4B8', '#B8D4E3', '#EFE7DE', '#9E1B25'];

export function placeholder(label, tone = '#E9DDD2', ratio = 0.8) {
  const w = 800;
  const h = Math.round(w / ratio);
  const dark = isDark(tone);
  const ink = dark ? 'rgba(255,255,255,.75)' : 'rgba(61,11,14,.55)';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tone}"/><stop offset="1" stop-color="${shade(tone, dark ? 0.25 : -0.08)}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><g fill="none" stroke="${ink}" stroke-width="3" opacity=".55"><path d="M${w * 0.32} ${h} C ${w * 0.3} ${h * 0.7}, ${w * 0.36} ${h * 0.55}, ${w * 0.42} ${h * 0.5}"/><path d="M${w * 0.42} ${h * 0.5} C ${w * 0.47} ${h * 0.3}, ${w * 0.55} ${h * 0.3}, ${w * 0.56} ${h * 0.45}"/><ellipse cx="${w * 0.5}" cy="${h * 0.36}" rx="${w * 0.035}" ry="${w * 0.06}" fill="${ink}" opacity=".5"/></g><text x="24" y="${h - 28}" font-family="system-ui,sans-serif" font-size="26" fill="${ink}">${escapeXml(label)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function isDark(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}
function shade(hex, amt) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const out = c.map((v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)))));
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
function escapeXml(s) { return String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }

export function image(label, tone, ratio = 0.8) {
  return { __image: true, src: placeholder(label, tone, ratio), alt: '', width: 1600, height: Math.round(1600 / ratio), aspect_ratio: ratio, __label: label, __tone: tone };
}

const SIZES = ['XS', 'S', 'M', 'L'];
const RAW = [
  ['Milky nude almond', 99900, 'Almond', 'Short'],
  ['Rosé French', 129900, 'Almond', 'Medium'],
  ['Burgundy gloss', 149900, 'Square', 'Medium'],
  ['Olive chrome tips', 129900, 'Coffin', 'Long'],
  ['Blush cat-eye', 179900, 'Oval', 'Medium'],
  ['Sky micro French', 129900, 'Almond', 'Short'],
  ['Pearl glaze', 149900, 'Oval', 'Short'],
  ['Cherry square', 249900, 'Square', 'Long'],
];

let vid = 4000;
export const products = RAW.map(([title, price, shape, length], i) => {
  const handle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const tone = TONES[i % TONES.length];
  const variants = SIZES.map((s) => ({ id: ++vid, title: s, options: [s], option1: s, available: true, price, compare_at_price: null }));
  const media = [
    { media_type: 'image', alt: `${title}, worn`, preview_image: image('Hand photo 4:5', tone) },
    { media_type: 'image', alt: `${title}, set of 10`, preview_image: image('Plate shot 4:5', '#EFE4DA') },
    { media_type: 'image', alt: `${title} on three skin tones`, preview_image: image('Three skin tones 1:1', tone, 1) },
  ];
  return {
    id: 100 + i, title, handle, url: `/products/${handle}`, price, price_min: price, price_max: price, price_varies: false,
    compare_at_price_min: 0, available: true, options: ['Size'],
    options_with_values: [{ name: 'Size', position: 1, values: SIZES }],
    variants, selected_or_first_available_variant: variants[0], first_available_variant: variants[0],
    featured_media: media[0], media, images: media.map((m) => m.preview_image), featured_image: media[0].preview_image,
    description: '<p>[Product description from Shopify admin]</p>',
    metafields: { custom: { shape: { value: shape }, length: { value: length } }, reviews: {} },
    __tone: tone,
  };
});

export const kit = {
  id: 900, title: 'Nail care kit', handle: 'nail-care-kit', url: '/products/nail-care-kit', price: 0, price_min: 0, price_varies: false,
  available: false, options: ['Title'], options_with_values: [{ name: 'Title', position: 1, values: ['Default'] }],
  variants: [{ id: 9001, title: 'Default', options: ['Default'], available: false, price: 0 }],
  media: [], featured_media: null, description: '<p>[Kit description]</p>', metafields: { custom: {}, reviews: {} },
};
kit.selected_or_first_available_variant = kit.variants[0];

export const productByHandle = Object.fromEntries([...products, kit].map((p) => [p.handle, p]));
export const variantById = Object.fromEntries([...products, kit].flatMap((p) => p.variants.map((v) => [v.id, { v, p }])));

function collection(handle, title, list) {
  const filters = [{
    type: 'list', label: 'Shape', param_name: 'filter.p.m.custom.shape',
    values: ['Almond', 'Square', 'Oval', 'Coffin'].map((v) => ({ label: v, value: v, count: list.filter((p) => p.metafields.custom.shape.value === v).length, active: false, url_to_add: '#', url_to_remove: '#', param_name: 'filter.p.m.custom.shape' })),
    active_values: [],
  }];
  return {
    handle, title, url: `/collections/${handle}`, products: list, products_count: list.length, all_products_count: list.length,
    description: '', filters, sort_by: 'manual', default_sort_by: 'manual',
    sort_options: [{ name: 'Featured', value: 'manual' }, { name: 'Price, low to high', value: 'price-ascending' }, { name: 'Price, high to low', value: 'price-descending' }, { name: 'Newest', value: 'created-descending' }],
    featured_image: image(`${title} 4:5`, list[0] ? list[0].__tone : '#E9DDD2'),
  };
}
export const collections = {
  all: collection('all', 'All sets', products),
  bestsellers: collection('bestsellers', 'Bestsellers', products.slice(0, 4)),
};

const link = (title, url, links = []) => ({ title, url, links, current: false });
export const menus = {
  'main-menu': { links: [
    link('Shop all', '/collections/all'), link('Collections', '/collections'), link('Nail care kit', '/products/nail-care-kit'),
    link('Custom orders', '/pages/contact'), link('Size guide', '/pages/size-guide'), link('Our story', '/pages/about'), link('Help', '/pages/faq'),
  ] },
  'footer-shop': { links: [link('Shop all', '/collections/all'), link('Bestsellers', '/collections/bestsellers'), link('Nail care kit', '/products/nail-care-kit'), link('Custom orders', '/pages/contact')] },
  'footer-help': { links: [link('Size guide', '/pages/size-guide'), link('FAQ', '/pages/faq'), link('Track order', '/pages/track-order'), link('Contact', '/pages/contact')] },
  'footer-policies': { links: [link('Shipping', '/policies/shipping-policy'), link('Refunds and exchanges', '/policies/refund-policy'), link('Privacy', '/policies/privacy-policy'), link('Terms', '/policies/terms-of-service')] },
};

export const pages = {
  landing: { title: 'Salon nails at home', handle: 'landing', template_suffix: 'landing', content: '' },
  'size-guide': { title: 'Size guide', handle: 'size-guide', template_suffix: 'size-guide', content: '' },
  faq: { title: 'Questions', handle: 'faq', template_suffix: 'faq', content: '' },
  about: { title: 'Our story', handle: 'about', template_suffix: 'about', content: '' },
  contact: { title: 'Contact', handle: 'contact', template_suffix: 'contact', content: '' },
  'track-order': { title: 'Track order', handle: 'track-order', template_suffix: 'track-order', content: '' },
  components: { title: 'Components', handle: 'components', template_suffix: 'components', content: '' },
};

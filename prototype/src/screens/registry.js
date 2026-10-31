// Every screen in the prototype: id, title, brief section, priority, states, and the build step it lands in.
// The index page, the toolbar's state switcher and the router all read this list.

export const screens = [
  // Journey start (not a store page)
  { id: 'ad', title: 'Instagram ad (fictional)', brief: '4 (Traffic)', priority: 0, step: 2,
    summary: 'A reel-style ad card with one "Shop now" button. Where the journey starts.',
    states: [{ id: 'default', label: 'Ad' }] },

  // Priority 1
  { id: 'landing', title: 'Ad landing page', brief: '9.1', priority: 1, step: 2,
    summary: 'Hook, choose and proof in one scroll. Poster first, video after.',
    states: [{ id: 'poster', label: 'Video poster' }, { id: 'playing', label: 'Video playing' }] },
  { id: 'product', title: 'Product page', brief: '9.2', priority: 1, step: 2,
    summary: 'No size pre-selected, Size me later, sets above Add to bag, Buy now for one set.',
    states: [
      { id: 'no-size', label: 'No size chosen' },
      { id: 'error', label: 'Tapped add without a size' },
      { id: 'size', label: 'Size chosen' },
      { id: 'size-later', label: 'Size me later' },
      { id: 'two-sets', label: '2 sets' },
      { id: 'three-sets', label: '3 sets' },
      { id: 'addon', label: 'Glue remover add-on on' },
    ] },
  { id: 'kit', title: 'Nail care kit page', brief: '9.3', priority: 1, step: 2,
    summary: 'Coming soon with an inline notify-me form, or launched.',
    states: [{ id: 'coming-soon', label: 'Coming soon' }, { id: 'launched', label: 'Launched' }] },
  { id: 'collection', title: 'Collection with quick add', brief: '9.4', priority: 1, step: 2,
    summary: 'Hand photo first, Quick add on every card, size sheet without leaving the grid.',
    states: [{ id: 'grid', label: 'Grid' }, { id: 'sheet', label: 'Quick-add sheet open' }, { id: 'added', label: 'Item added' }] },
  { id: 'cart', title: 'Cart drawer', brief: '9.5', priority: 1, step: 2,
    summary: 'Gift bar, lines, nudge, add-ons, savings, one checkout button.',
    states: [
      { id: 'empty', label: 'Empty' },
      { id: 'one', label: '1 set' },
      { id: 'two', label: '2 sets' },
      { id: 'three', label: '3 sets' },
      { id: 'gift', label: 'Gift threshold reached' },
      { id: 'kit-soon', label: 'Kit add-on: coming soon' },
      { id: 'kit-live', label: 'Kit add-on: available' },
      { id: 'size-later', label: 'Line: size to confirm' },
    ] },
  { id: 'checkout', title: 'Checkout placeholder', brief: '11', priority: 1, step: 2,
    summary: 'Where GoKwik takes over. Outside our scope.',
    states: [{ id: 'default', label: 'Placeholder' }] },

  // Priority 2
  { id: 'home', title: 'Homepage', brief: '9.7', priority: 2, step: 3,
    summary: 'Eight sections: hero, bestsellers, kit, moods, build your set, how to apply, real hands, Instagram.',
    states: [{ id: 'default', label: 'Default' }] },
  { id: 'header', title: 'Header and menu', brief: '9.8', priority: 2, step: 3,
    summary: 'Announcement, logo, search, bag. Menu and predictive search.',
    states: [{ id: 'default', label: 'Default' }, { id: 'menu', label: 'Menu open' }, { id: 'search', label: 'Search with results' }] },
  { id: 'footer', title: 'Footer', brief: '9.8', priority: 2, step: 3,
    summary: 'Shop, help, policies, socials, inline 10% sign-up, payment icons.',
    states: [{ id: 'default', label: 'Default' }] },
  { id: 'size-sheet', title: 'Size sheet', brief: '9.6', priority: 2, step: 3,
    summary: 'Bottom sheet: chart in mm, between-sizes line, Size me later.',
    states: [{ id: 'default', label: 'Open' }] },
  { id: 'size-guide', title: 'Size guide', brief: '9.6', priority: 2, step: 3,
    summary: 'How to measure, chart, WhatsApp custom sizing, free exchange.',
    states: [{ id: 'default', label: 'Default' }] },

  // Priority 3
  { id: 'about', title: 'About', brief: '9.9', priority: 3, step: 4, summary: "Sanprita's story, hand-painted, made to order.", states: [{ id: 'default', label: 'Default' }] },
  { id: 'faq', title: 'FAQ', brief: '9.9', priority: 3, step: 4, summary: 'Single source for the business facts.', states: [{ id: 'default', label: 'Default' }] },
  { id: 'contact', title: 'Contact', brief: '9.9', priority: 3, step: 4, summary: 'WhatsApp first, then email.', states: [{ id: 'default', label: 'Default' }] },
  { id: 'track', title: 'Track order', brief: '9.9', priority: 3, step: 4, summary: 'Order lookup and help.', states: [{ id: 'default', label: 'Default' }] },
  { id: '404', title: '404', brief: '9.9', priority: 3, step: 4, summary: 'A calm way back.', states: [{ id: 'default', label: 'Default' }] },
  { id: 'empty-cart', title: 'Empty cart page', brief: '9.9', priority: 3, step: 4, summary: 'Bestsellers and the kit teaser.', states: [{ id: 'default', label: 'Default' }] },

  // System
  { id: 'tokens', title: 'Design tokens', brief: '3, 12', priority: 9, step: 1,
    summary: 'Colours, type, spacing, buttons and annotation tags. Flip Wireframe and Styled to compare.',
    states: [{ id: 'default', label: 'Default' }] },
];

export const PRIORITY_LABELS = {
  0: 'Journey start',
  1: 'Priority 1: the buying path',
  2: 'Priority 2: home, navigation and sizing',
  3: 'Priority 3: support pages',
  9: 'System',
};

// The main flow walked by "Start the journey".
export const JOURNEY = [
  { id: 'ad', label: 'Instagram ad' },
  { id: 'landing', label: 'Landing page' },
  { id: 'product', label: 'Product page' },
  { id: 'product', state: 'size', label: 'Add to bag' },
  { id: 'cart', state: 'one', label: 'Cart drawer' },
  { id: 'checkout', label: 'GoKwik placeholder' },
];

export const BUILT_STEP = 1; // screens with step <= BUILT_STEP are built
export const byId = (id) => screens.find((s) => s.id === id);

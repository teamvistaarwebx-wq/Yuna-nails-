// Actions shared by every screen: bag, size sheet, menu, search and the inline forms.
import { rt, ui, action } from './runtime.js';
import { addToCart, changeQty, removeLine, summary } from './cart.js';
import { searchResults } from '../components/layout.js';

const changed = () => { if (rt.onCartChange) rt.onCartChange(summary()); rt.rerender(); };

export function openDrawer() {
  ui.sheet = null; ui.menu = false; ui.search = false;
  ui.drawer = true; ui.drawerAnimate = true;
  rt.rerender();
  ui.drawerAnimate = false;
}

/* Bag */
action('open-drawer', openDrawer);
action('close-drawer', () => { ui.drawer = false; rt.rerender(); });
action('close-drawer-go', (el, e) => { e.preventDefault(); ui.drawer = false; rt.go(el.dataset.to, el.dataset.state || null); });
action('qty', (el) => { changeQty(Number(el.dataset.id), Number(el.dataset.delta)); changed(); });
action('remove-line', (el) => { removeLine(Number(el.dataset.id)); changed(); });
action('add-kit', () => { addToCart('kit'); changed(); });
action('checkout', () => { ui.drawer = false; rt.go('checkout'); });

/* Size sheet (quick add and size chart) */
action('quick-add', (el) => { ui.sheet = { handle: el.dataset.handle, size: null, later: false, error: false, added: false, chart: false }; if (rt.onSheet) rt.onSheet('sheet'); rt.rerender(); });
action('open-size-chart', (el) => { ui.sheet = { handle: el.dataset.handle || null, size: rt.pdpSize ? rt.pdpSize() : null, later: false, error: false, added: false, chart: true }; rt.rerender(); });
action('close-sheet', () => { ui.sheet = null; if (rt.onSheet) rt.onSheet(null); rt.rerender(); });
action('close-sheet-go', (el, e) => { e.preventDefault(); ui.sheet = null; rt.go(el.dataset.to); });
action('pick-size', (el) => {
  if (el.dataset.scope === 'sheet' && ui.sheet) { Object.assign(ui.sheet, { size: el.dataset.size, later: false, error: false }); rt.rerender(); return; }
  if (rt.scope && rt.scope.pickSize) rt.scope.pickSize(el.dataset.size);
});
action('pick-later', (el) => {
  if (el.dataset.scope === 'sheet' && ui.sheet) { Object.assign(ui.sheet, { size: null, later: true, error: false }); rt.rerender(); return; }
  if (rt.scope && rt.scope.pickLater) rt.scope.pickLater();
});
action('sheet-add', () => {
  const s = ui.sheet;
  if (!s) return;
  if (!s.size && !s.later) { s.error = true; rt.rerender(); return; }
  addToCart(s.handle, { size: s.size, later: s.later });
  s.added = true;
  if (rt.onSheet) rt.onSheet('added');
  rt.rerender();
  // A short confirmation, then the bag opens (brief 9.4).
  setTimeout(() => { if (ui.sheet && ui.sheet.added) { if (rt.onSheet) rt.onSheet(null); openDrawer(); } }, 900);
});

/* Hero video (the screen on show sets rt.videoToggle) */
action('toggle-video', () => { if (rt.videoToggle) rt.videoToggle(); });

/* Menu and search */
action('open-menu', () => { ui.menu = true; rt.rerender(); });
action('close-menu', () => { ui.menu = false; rt.rerender(); });
action('close-menu-go', () => { ui.menu = false; });
action('open-search', () => { ui.search = true; rt.rerender(); setTimeout(() => { const q = document.getElementById('q'); if (q) q.focus(); }, 30); });
action('close-search', () => { ui.search = false; ui.query = ''; rt.rerender(); });
action('close-search-go', () => { ui.search = false; ui.query = ''; });
action('search-fill', (el) => { ui.query = el.dataset.q; rt.rerender(); });
action('search', (el) => { ui.query = el.value; const body = document.getElementById('search-body'); if (body) body.innerHTML = searchResults(ui.query); });

/* Inline forms (no popups; nothing is sent from the prototype) */
action('notify', (form) => { form.outerHTML = '<p class="form-ok" role="status">Thank you. We\'ll email you when the kit launches. (Prototype: nothing is sent.)</p>'; });
action('signup', (form) => { form.outerHTML = '<p class="form-ok" role="status" style="color:var(--color-text)">Thank you for joining. Your welcome code would arrive by email. (Prototype: nothing is sent.)</p>'; });
action('contact', (form) => { form.outerHTML = '<p class="form-ok" role="status">Thank you. We\'ll reply soon. (Prototype: nothing is sent.)</p>'; });
action('track', () => rt.toast('Opens the existing order tracking app (not in prototype)'));

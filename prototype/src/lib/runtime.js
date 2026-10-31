// Shared runtime for every screen: one action registry (delegated events) and one UI store.
// app.js wires go / setState / rerender / toast into `rt` at start-up.
import { settings } from '../../data/settings.js';

export const rt = {
  actions: {},
  toast: () => {},
  go: () => {},
  setState: () => {},
  rerender: () => {},
};

// Register a handler for elements with data-action="name" (click), data-input="name" (input) or data-submit="name" (forms).
export const action = (name, fn) => { rt.actions[name] = fn; };

// UI state that lives across screens in one session.
export const ui = {
  drawer: false,          // cart drawer open
  drawerAnimate: false,   // slide in on the next render only
  sheet: null,            // { handle, size, later, error, added, chart }
  menu: false,
  search: false,
  query: '',
  kitComingSoon: settings.kitComingSoon, // one switch: kit page, homepage slot, cart add-on
  removerVisible: settings.remover.exists, // the prototype can show it for review
};

export function resetOverlays() {
  ui.drawer = false; ui.drawerAnimate = false; ui.sheet = null; ui.menu = false; ui.search = false; ui.query = '';
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

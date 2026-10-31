// Screen runtime (inside the device frame). Routes "#/<screen>?state=<state>" to a screen module,
// applies the mode and notes set by the toolbar, draws note pins, and turns dead ends into a toast.
import { byId, BUILT_STEP } from './screens/registry.js';

const app = document.getElementById('app');
const root = document.documentElement;
const modules = import.meta.glob(['./screens/*.js', '!./screens/registry.js']);

/* ---------- Route ---------- */
function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [id = 'tokens', query = ''] = h.split('?');
  const q = new URLSearchParams(query);
  return { id: id || 'tokens', state: q.get('state'), journey: q.get('journey') };
}
let route = parse();

/* ---------- Toast (shown by the shell, so it sits outside the device frame too) ---------- */
export function toast(text) {
  if (window.parent !== window) { window.parent.postMessage({ type: 'proto:toast', text }, location.origin); return; }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  document.getElementById('toastHost').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Navigation helpers for screens ---------- */
export function go(id, state = null) {
  const q = new URLSearchParams();
  if (state) q.set('state', state);
  if (route.journey !== null) q.set('journey', route.journey);
  location.hash = `#/${id}${q.toString() ? `?${q}` : ''}`;
}
function tellShell() {
  if (window.parent !== window) window.parent.postMessage({ type: 'proto:route', id: route.id, state: route.state }, location.origin);
}
// A screen calls setState when a click changes its state (e.g. a size is picked); the toolbar follows.
export function setState(state, { rerender = true } = {}) {
  route.state = state;
  const q = new URLSearchParams();
  if (state) q.set('state', state);
  if (route.journey !== null) q.set('journey', route.journey);
  history.replaceState(null, '', `#/${route.id}${q.toString() ? `?${q}` : ''}`);
  tellShell();
  if (rerender) render();
}

/* ---------- Notes: numbered pins with one-line reasons ---------- */
let openPop = null;
function drawNotes(notes = []) {
  app.querySelectorAll('.pin, .pin-pop').forEach((el) => el.remove());
  notes.forEach((n, i) => {
    const target = app.querySelector(n.target);
    if (!target) return;
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'pin';
    pin.textContent = i + 1;
    pin.setAttribute('aria-label', `Note ${i + 1}: ${n.text}`);
    pin.style.cssText = n.pos || '';
    pin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (openPop) { const same = openPop.dataset.for === String(i); openPop.remove(); openPop = null; if (same) return; }
      const pop = document.createElement('div');
      pop.className = 'pin-pop';
      pop.dataset.for = String(i);
      pop.innerHTML = `<b>${i + 1}</b> ${n.text}`;
      target.appendChild(pop);
      openPop = pop;
    });
    target.appendChild(pin);
  });
}
document.addEventListener('click', (e) => {
  if (openPop && !e.target.closest('.pin-pop')) { openPop.remove(); openPop = null; }
});

/* ---------- Dead ends ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-todo], a[href="#"]');
  if (!el) return;
  e.preventDefault();
  toast(el.dataset.todo || 'Not in prototype yet');
});

/* ---------- Render ---------- */
let current = null;
async function render() {
  const def = byId(route.id);
  let mod;
  if (def && def.step <= BUILT_STEP && modules[`./screens/${def.id}.js`]) mod = await modules[`./screens/${def.id}.js`]();
  else mod = await modules['./screens/_stub.js']();
  const states = def ? def.states : [];
  const state = route.state && states.some((s) => s.id === route.state) ? route.state : (states[0] && states[0].id) || 'default';
  document.title = def ? def.title : 'Not found';
  if (current && current.destroy) current.destroy();
  current = mod;
  app.innerHTML = '';
  const out = (await mod.render({ root: app, def, state, go, setState, toast })) || {};
  drawNotes(out.notes);
}

window.addEventListener('hashchange', () => { route = parse(); tellShell(); render(); });
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data || e.data.type !== 'proto:set') return;
  root.dataset.mode = e.data.mode;
  if (e.data.notes) root.dataset.notes = 'on'; else delete root.dataset.notes;
  if (e.data.state && e.data.state !== route.state) { route.state = e.data.state; render(); }
});
render();

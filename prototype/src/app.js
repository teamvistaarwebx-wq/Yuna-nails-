// Screen runtime (inside the device frame). Routes "#/<screen>?state=<state>&…" to a screen module, applies the
// mode and notes set by the toolbar, draws note pins, runs delegated actions and turns dead ends into a toast.
import { byId, BUILT_STEP } from './screens/registry.js';
import { rt, ui, resetOverlays } from './lib/runtime.js';
import './lib/actions.js';

const app = document.getElementById('app');
const root = document.documentElement;
const modules = import.meta.glob(['./screens/*.js', '!./screens/registry.js']);

/* ---------- Route ---------- */
function parse() {
  const h = location.hash.replace(/^#\/?/, '');
  const [id = 'home', query = ''] = h.split('?');
  const q = new URLSearchParams(query);
  return { id: id || 'home', state: q.get('state'), journey: q.get('journey'), params: q };
}
let route = parse();

/* ---------- Toast (shown by the shell so it sits above the frame) ---------- */
function toast(text) {
  if (window.parent !== window) { window.parent.postMessage({ type: 'proto:toast', text }, location.origin); return; }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  document.getElementById('toastHost').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Navigation ---------- */
function hashFor(id, state, extra = {}) {
  const q = new URLSearchParams(extra);
  if (state) q.set('state', state);
  if (route.journey !== null) q.set('journey', route.journey);
  return `#/${id}${q.toString() ? `?${q}` : ''}`;
}
function go(id, state = null, extra = {}) { location.hash = hashFor(id, state, extra); }
function tellShell() {
  if (window.parent !== window) window.parent.postMessage({ type: 'proto:route', id: route.id, state: route.state }, location.origin);
}
// A click inside a screen changed its state: keep the URL and the toolbar in step.
function setState(state, { rerender = false } = {}) {
  if (route.state === state) { if (rerender) render(); return; }
  route.state = state;
  const extra = Object.fromEntries([...route.params].filter(([k]) => k !== 'state' && k !== 'journey'));
  history.replaceState(null, '', hashFor(route.id, state, extra));
  tellShell();
  if (rerender) render();
}
Object.assign(rt, { toast, go, setState, rerender: () => render({ keepScroll: true }) });

/* ---------- Notes ---------- */
let openPop = null;
function drawNotes(notes = []) {
  app.querySelectorAll('.pin, .pin-pop').forEach((el) => el.remove());
  openPop = null;
  notes.forEach((n, i) => {
    const target = app.querySelector(n.target);
    if (!target) return;
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'pin';
    pin.textContent = i + 1;
    pin.setAttribute('aria-label', `Note ${i + 1}: ${n.text}`);
    if (n.pos) pin.style.cssText = n.pos;
    pin.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const same = openPop && openPop.dataset.for === String(i);
      if (openPop) { openPop.remove(); openPop = null; }
      if (same) return;
      const pop = document.createElement('div');
      pop.className = 'pin-pop';
      pop.dataset.for = String(i);
      pop.innerHTML = `<b>${i + 1}</b>${n.text}`;
      target.appendChild(pop);
      openPop = pop;
    });
    target.appendChild(pin);
  });
}

/* ---------- Delegated events ---------- */
document.addEventListener('click', (e) => {
  if (openPop && !e.target.closest('.pin-pop, .pin')) { openPop.remove(); openPop = null; }
  const todo = e.target.closest('[data-todo], a[href="#"]');
  if (todo) { e.preventDefault(); toast(todo.dataset.todo || 'Not in prototype yet'); return; }
  const el = e.target.closest('[data-action]');
  if (el && rt.actions[el.dataset.action]) rt.actions[el.dataset.action](el, e);
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-input]');
  if (el && rt.actions[el.dataset.input]) rt.actions[el.dataset.input](el, e);
});
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-submit]');
  if (!form) return;
  e.preventDefault();
  if (rt.actions[form.dataset.submit]) rt.actions[form.dataset.submit](form, e);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (ui.sheet || ui.drawer || ui.menu || ui.search) { ui.sheet = null; ui.drawer = false; ui.menu = false; ui.search = false; render({ keepScroll: true }); }
});

/* ---------- Render ---------- */
let renderId = 0;
async function render({ keepScroll = false } = {}) {
  const id = ++renderId;
  const def = byId(route.id);
  let mod;
  if (def && def.step <= BUILT_STEP && modules[`./screens/${def.id}.js`]) mod = await modules[`./screens/${def.id}.js`]();
  else mod = await modules['./screens/_stub.js']();
  if (id !== renderId) return;
  const states = def ? def.states : [];
  const state = route.state && states.some((s) => s.id === route.state) ? route.state : (states[0] && states[0].id) || 'default';
  document.title = def ? def.title : 'Not found';
  const y = window.scrollY;
  const out = (await mod.render({ root: app, def, state, stateGiven: !!route.state, params: route.params, go, setState, toast, fresh: !keepScroll })) || {};
  if (out.html !== undefined) app.innerHTML = out.html;
  document.body.classList.toggle('has-sticky', !!app.querySelector('.sticky'));
  document.body.style.overflow = ui.drawer || ui.sheet || ui.menu || ui.search ? 'hidden' : '';
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, out.scrollTo || 0);
  drawNotes(out.notes);
  if (out.after) out.after();
}

window.addEventListener('hashchange', () => {
  route = parse();
  resetOverlays();
  rt.scope = null; rt.onCartChange = null; rt.onSheet = null; rt.pdpSize = null;
  tellShell();
  render();
});
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data || e.data.type !== 'proto:set') return;
  root.dataset.mode = e.data.mode;
  if (e.data.notes) root.dataset.notes = 'on'; else delete root.dataset.notes;
  if (e.data.state && e.data.state !== route.state) { route.state = e.data.state; render({ forcedState: true }); }
});
render();

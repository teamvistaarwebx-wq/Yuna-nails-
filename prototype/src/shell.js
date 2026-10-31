// Prototype shell: screen map at "/", screens at "/#/<screen>?state=<state>".
// Screens render inside a same-origin iframe (screen.html) so a 375 px phone frame gets a true phone viewport.
import { screens, PRIORITY_LABELS, JOURNEY, BUILT_STEP, byId } from './screens/registry.js';

const root = document.documentElement;
const toolbar = document.getElementById('toolbar');
const shell = document.getElementById('shell');

/* ---------- Preferences (per viewer) ---------- */
const PREF_KEY = 'yuna-proto-prefs';
const prefs = { device: 'phone', mode: 'styled', notes: false, collapsed: false };
try { Object.assign(prefs, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (_) { /* storage blocked */ }
const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (_) { /* ignore */ } };

/* ---------- Route ---------- */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  if (!h) return null;
  const [path, query = ''] = h.split('?');
  const q = new URLSearchParams(query);
  return { id: path, state: q.get('state') || null, journey: q.has('journey') ? Number(q.get('journey')) : null };
}
function hashFor({ id, state, journey }) {
  const q = new URLSearchParams();
  if (state) q.set('state', state);
  if (journey !== null && journey !== undefined) q.set('journey', journey);
  const qs = q.toString();
  return `#/${id}${qs ? `?${qs}` : ''}`;
}
let route = parseHash();

/* ---------- Toast ---------- */
export function toast(text) {
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  host.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Toolbar ---------- */
function renderToolbar() {
  const def = route && byId(route.id);
  const states = def ? def.states : [];
  const current = route && (route.state || (states[0] && states[0].id));
  const j = route && route.journey !== null ? route.journey : null;
  toolbar.classList.toggle('is-collapsed', prefs.collapsed);
  toolbar.innerHTML = `
    <button class="tb__btn" data-act="map" title="Screen map">☰ Screen map</button>
    ${def ? `<span class="tb__title" title="${def.title}">${def.title}<small>Brief ${def.brief}</small></span>` : ''}
    <span class="tb__sep" aria-hidden="true"></span>
    <span class="tb__group" role="group" aria-label="Device">
      <button data-device="phone" aria-pressed="${prefs.device === 'phone'}">Phone 375</button>
      <button data-device="desktop" aria-pressed="${prefs.device === 'desktop'}">Desktop 1440</button>
    </span>
    <span class="tb__group" role="group" aria-label="Mode">
      <button data-mode="wireframe" aria-pressed="${prefs.mode === 'wireframe'}">Wireframe</button>
      <button data-mode="styled" aria-pressed="${prefs.mode === 'styled'}">Styled</button>
    </span>
    <button class="tb__btn" data-act="notes" aria-pressed="${prefs.notes}" title="Show the reasons behind design decisions">Notes ${prefs.notes ? 'on' : 'off'}</button>
    ${states.length > 1 ? `<label class="visually-hidden" for="stateSel">State</label>
      <select id="stateSel" aria-label="Screen state">${states.map((s) => `<option value="${s.id}"${s.id === current ? ' selected' : ''}>State: ${s.label}</option>`).join('')}</select>` : ''}
    ${j !== null ? `<span class="tb__sep" aria-hidden="true"></span><span class="tb__journey">Journey <b>${j + 1}/${JOURNEY.length}</b>
      <button class="tb__btn" data-act="prev" ${j === 0 ? 'disabled' : ''} aria-label="Previous journey step">←</button>
      <button class="tb__btn" data-act="next" ${j === JOURNEY.length - 1 ? 'disabled' : ''} aria-label="Next journey step">Next →</button></span>` : ''}
    <button class="tb__btn tb__toggle" data-act="collapse" aria-label="${prefs.collapsed ? 'Show' : 'Hide'} toolbar" title="${prefs.collapsed ? 'Show' : 'Hide'} toolbar">${prefs.collapsed ? '⌄' : '⌃'}</button>
  `;
}
toolbar.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.device) { prefs.device = b.dataset.device; savePrefs(); render(); return; }
  if (b.dataset.mode) { prefs.mode = b.dataset.mode; savePrefs(); applyMode(); renderToolbar(); pushToFrame(); return; }
  switch (b.dataset.act) {
    case 'map': location.hash = ''; break;
    case 'notes': prefs.notes = !prefs.notes; savePrefs(); renderToolbar(); pushToFrame(); break;
    case 'collapse': prefs.collapsed = !prefs.collapsed; savePrefs(); renderToolbar(); break;
    case 'prev': goJourney(route.journey - 1); break;
    case 'next': goJourney(route.journey + 1); break;
    default: break;
  }
});
toolbar.addEventListener('change', (e) => {
  if (e.target.id === 'stateSel') { route.state = e.target.value; history.replaceState(null, '', hashFor(route)); pushToFrame(); }
});

function goJourney(i) {
  const step = JOURNEY[i];
  if (!step) return;
  location.hash = hashFor({ id: step.id, state: step.state || null, journey: i });
}
function applyMode() { root.dataset.mode = prefs.mode; }

/* ---------- Screen map ---------- */
function renderMap() {
  document.title = 'Yuna prototype · screen map';
  const groups = [...new Set(screens.map((s) => s.priority))].sort((a, b) => a - b);
  shell.innerHTML = `
    <div class="map">
      <section class="map__hero">
        <p class="map__eyebrow">Vistaar WebX · yunanails.in redesign · prototype v1</p>
        <h1>Yuna, <em>screen map</em></h1>
        <p class="map__lead">A clickable first draft of the new store. Every screen opens in a phone or desktop frame. Use the toolbar to switch between wireframe and styled, show the notes behind each decision, and step through each screen's states.</p>
      </section>
      <section class="journey" aria-labelledby="jTitle">
        <p class="map__eyebrow" id="jTitle">The main flow</p>
        <ol class="journey__steps">${JOURNEY.map((s) => `<li>${s.label}</li>`).join('')}</ol>
        <button class="start" data-start>Start the journey <span aria-hidden="true">→</span></button>
      </section>
      ${groups.map((g) => `
        <section class="group" aria-labelledby="g${g}">
          <h2 id="g${g}">${PRIORITY_LABELS[g]}</h2>
          <div class="cards">
            ${screens.filter((s) => s.priority === g).map((s) => `
              <a class="card" href="${hashFor({ id: s.id })}">
                <span class="card__top"><span class="card__title">${s.title}</span><span class="card__brief">Brief ${s.brief}</span></span>
                <p class="card__summary">${s.summary}</p>
                <span class="card__foot">
                  <span>${s.states.length} state${s.states.length === 1 ? '' : 's'}</span>
                  <span class="status${s.step <= BUILT_STEP ? ' status--built' : ''}">${s.step <= BUILT_STEP ? 'Built' : `Step ${s.step}`}</span>
                </span>
              </a>`).join('')}
          </div>
        </section>`).join('')}
      <footer class="map__foot">
        <span>Business facts: <code>data/facts.js</code> · Offers: <code>data/offers.js</code> · Kit switch: <code>data/settings.js</code> · Products: <code>data/products.js</code></span>
        <span>Yellow <b>TO CONFIRM</b> tags mark open items from brief section 15. Photos are placeholders.</span>
      </footer>
    </div>`;
  shell.querySelector('[data-start]').addEventListener('click', () => goJourney(0));
}

/* ---------- Screen stage ---------- */
let frame = null;
function renderStage() {
  const def = byId(route.id);
  document.title = `${def ? def.title : 'Not found'} · Yuna prototype`;
  const phone = prefs.device === 'phone';
  shell.innerHTML = `
    <div class="stage stage--${prefs.device}">
      <div class="device-wrap"><div class="device"><iframe id="frame" title="${def ? def.title : 'Screen'}" src="/screen.html${hashFor(route)}"></iframe></div></div>
      ${phone ? `<p class="stage__caption">${def ? `${def.title} · ${def.summary}` : ''}</p>` : ''}
    </div>`;
  frame = document.getElementById('frame');
  frame.addEventListener('load', pushToFrame);
  fitPhone();
}
function fitPhone() {
  const wrap = shell.querySelector('.stage--phone .device-wrap');
  if (!wrap) return;
  const availH = window.innerHeight - toolbar.offsetHeight - 80;
  const availW = window.innerWidth - 32;
  const scale = Math.min(1, availW / 375, Math.max(0.55, availH / 812));
  wrap.style.setProperty('--scale', scale.toFixed(3));
}
window.addEventListener('resize', fitPhone);

// Shell → screen: mode, notes and state.
function pushToFrame() {
  if (!frame || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ type: 'proto:set', mode: prefs.mode, notes: prefs.notes, state: route.state }, location.origin);
}
// Screen → shell: the screen or state changed from inside (a click), or asks for a toast.
window.addEventListener('message', (e) => {
  if (e.origin !== location.origin || !e.data) return;
  if (e.data.type === 'proto:route') {
    const next = { id: e.data.id, state: e.data.state || null, journey: route ? route.journey : null };
    if (next.journey !== null) {
      // Advance the journey counter when the screen matches a later step.
      let idx = -1;
      JOURNEY.forEach((s, i) => { if (i >= next.journey && s.id === next.id && (!s.state || s.state === next.state)) idx = i; });
      if (idx >= 0) next.journey = idx;
    }
    route = next;
    history.replaceState(null, '', hashFor(route));
    renderToolbar();
    const def = byId(route.id);
    const cap = shell.querySelector('.stage__caption');
    if (cap && def) cap.textContent = `${def.title} · ${def.summary}`;
    if (def) document.title = `${def.title} · Yuna prototype`;
  }
  if (e.data.type === 'proto:toast') toast(e.data.text);
});

/* ---------- Render ---------- */
function render() {
  route = parseHash();
  applyMode();
  renderToolbar();
  if (!route) renderMap();
  else renderStage();
}
window.addEventListener('hashchange', render);
render();

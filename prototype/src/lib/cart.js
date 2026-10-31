// The bag. Offer values come only from data/offers.js; the kit from data/settings.js.
import { offers } from '../../data/offers.js';
import { settings } from '../../data/settings.js';
import { productByHandle } from '../../data/products.js';
import { ui } from './runtime.js';

let lines = [];   // { id, handle, size, later, qty }  (handle 'kit' = nail care kit)
let nextId = 1;

export const cartLines = () => lines;

export function addToCart(handle, { size = null, later = false, qty = 1 } = {}) {
  const same = lines.find((l) => l.handle === handle && l.size === size && l.later === later);
  if (same) same.qty += qty;
  else lines.push({ id: nextId++, handle, size, later, qty });
}
export function changeQty(id, delta) {
  const l = lines.find((x) => x.id === id);
  if (!l) return;
  l.qty = Math.max(0, l.qty + delta);
  lines = lines.filter((x) => x.qty > 0);
}
export function removeLine(id) { lines = lines.filter((x) => x.id !== id); }
export const clearCart = () => { lines = []; };

const tier = (qty) => offers.tiers.find((t) => t.qty === qty);

export function priceOf(handle) {
  if (handle === 'kit') return settings.kit.samplePrice;
  const p = productByHandle(handle);
  return p ? p.price : 0;
}

// Totals, savings, the free remover, the gift bar and the nudge, all from offers.js.
export function summary() {
  const setLines = lines.filter((l) => l.handle !== 'kit');
  const sets = setLines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + priceOf(l.handle) * l.qty, 0);
  const t3 = tier(3);
  const saving = sets >= 3 && t3 && t3.savingRupees ? t3.savingRupees : 0;
  const freeRemover = sets >= 2;
  const total = subtotal - saving;
  const steps = offers.gifts.steps;
  const max = steps[steps.length - 1].threshold;
  const next = steps.find((s) => total < s.threshold) || null;
  const unlocked = steps.filter((s) => total >= s.threshold);
  let nudge = null;
  if (sets === 1) nudge = { text: offers.nudges.oneSet, confirm: tier(2).toConfirm };
  if (sets === 2 && t3) nudge = { text: offers.nudges.twoSets.replace('{saving}', t3.savingRupees.toLocaleString('en-IN')), confirm: t3.toConfirm };
  return {
    lines, sets, subtotal, saving, total, freeRemover, nudge,
    gift: { pct: Math.min(100, Math.round((total / max) * 100)), next, unlocked, steps, max },
    count: lines.reduce((s, l) => s + l.qty, 0),
    hasKit: lines.some((l) => l.handle === 'kit'),
  };
}

// Presets for the cart drawer's states (toolbar).
export function presetCart(state) {
  lines = []; nextId = 1;
  const add = (h, o) => addToCart(h, o);
  switch (state) {
    case 'one': add('rouge-noir', { size: 'M' }); break;
    case 'two': add('peach-whisper', { size: 'S', qty: 2 }); break;
    case 'three': add('rouge-noir', { size: 'M' }); add('peach-whisper', { size: 'M' }); add('celestial-muse', { size: 'M' }); break;
    case 'gift': add('rouge-noir', { size: 'S', qty: 2 }); break;
    case 'kit-soon': add('celestial-muse', { size: 'S' }); ui.kitComingSoon = true; break;
    case 'kit-live': add('celestial-muse', { size: 'S' }); ui.kitComingSoon = false; break;
    case 'size-later': add('rouge-noir', { later: true }); add('peach-whisper', { size: 'XS' }); break;
    default: break;
  }
}

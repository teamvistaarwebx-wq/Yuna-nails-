// Cart drawer (brief 9.5), shown over the collection page. States are presets; quantities and add-ons stay live.
import { layout } from '../components/layout.js';
import { productCard } from '../components/productCard.js';
import { rt, ui } from '../lib/runtime.js';
import { presetCart } from '../lib/cart.js';
import { products } from '../../data/products.js';

function stateFor(s) {
  if (s.count === 0) return 'empty';
  if (s.lines.some((l) => l.later)) return 'size-later';
  if (s.sets >= 3) return 'three';
  if (s.gift.unlocked.length) return 'gift';
  if (s.sets === 2) return 'two';
  return 'one';
}

export function render({ state, fresh }) {
  if (fresh) { presetCart(state); ui.drawer = true; ui.drawerAnimate = true; }
  rt.onCartChange = (s) => rt.setState(stateFor(s));
  const out = {
    html: layout(`<div class="page"><div class="page-head"><h1 class="h1">All <em>sets</em></h1></div>
      <div class="grid">${products.map((p) => productCard(p)).join('')}</div><div style="height:48px"></div></div>`),
    notes: ui.drawer ? [
      { target: '#gift-bar', text: 'Gift progress bar on top; thresholds and gifts from data/offers.js (open item 5).' },
      { target: '#nudge', text: 'Nudge copy changes with the number of sets: 1 set → free remover with 2; 2 sets → save on the 3rd.' },
      { target: '#line-later', text: '"Size me later" lines show "Size to confirm on WhatsApp" (brief 10).' },
      { target: '#addon-kit', text: 'Add-on slot: nail care kit (coming soon until launch) and the glue remover once it exists.' },
      { target: '#drawer-foot', text: 'One checkout button that opens GoKwik. Nothing overlaps it: no save-for-later popup, no chat bubble (audit).' },
      { target: '#cart-empty', text: 'Empty bag still leads somewhere: bestsellers and the kit teaser.' },
    ] : [],
    after: () => { ui.drawerAnimate = false; },
  };
  return out;
}

// Collection with quick add (brief 9.4). States: grid / quick-add sheet open / item added.
import { layout } from '../components/layout.js';
import { productCard, placeholderCard } from '../components/productCard.js';
import { confirmTag } from '../components/annotate.js';
import { rt, ui } from '../lib/runtime.js';
import { products, moreProductsConfirm } from '../../data/products.js';

export function render({ state, fresh }) {
  if (fresh) {
    if (state === 'sheet') ui.sheet = { handle: 'peach-whisper', size: null, later: false, error: false, added: false };
    if (state === 'added') ui.sheet = { handle: 'peach-whisper', size: 'S', later: false, error: false, added: true };
    if (state === 'grid') ui.sheet = null;
  }
  rt.onSheet = (s) => rt.setState(s === 'added' ? 'added' : s === 'sheet' ? 'sheet' : 'grid');
  return {
    html: layout(`<div class="page">
      <div class="page-head"><p class="eyebrow">Hand-painted, made to order</p><h1 class="h1">All <em>sets</em></h1></div>
      <div class="row" id="filters" style="margin-bottom:24px">
        <button type="button" class="chip" data-todo="Colour filter (keep if light)">Colour</button>
        <button type="button" class="chip" data-todo="Shape filter">Shape</button>
        <button type="button" class="chip" data-todo="Sort">Sort: Featured</button>
      </div>
      <div class="grid" id="grid">${products.map((p) => productCard(p)).join('')}${placeholderCard(moreProductsConfirm)}</div>
      <div style="height:48px"></div></div>`),
    notes: [
      { target: '#grid .card', text: 'Hand photo first, name, shape and length, price; at most one quiet offer line. No stacked badges (audit).' },
      { target: '#grid .card__quick', text: 'Quick add on every card opens the size sheet, so she never leaves the grid. No "Choose options" (audit).' },
      { target: '#filters', text: 'Colour filter kept only if light; flag otherwise (brief 9.4).' },
      ...(ui.sheet ? [{ target: '#sheet', text: 'Size sheet: XS–L, Size me later, Add to bag. A short "Added" confirmation, then the bag opens.' }] : []),
    ],
  };
}

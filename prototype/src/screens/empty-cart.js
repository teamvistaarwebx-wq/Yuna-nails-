// Empty cart page (brief 9.9): bestsellers and the kit teaser.
import { layout } from '../components/layout.js';
import { productCard } from '../components/productCard.js';
import { kitTeaser } from '../components/kit.js';
import { clearCart } from '../lib/cart.js';
import { products } from '../../data/products.js';

export function render({ fresh }) {
  if (fresh) clearCart();
  return {
    html: layout(`<div class="page">
      <div class="page-head" style="text-align:center" id="empty"><h1 class="h1">Your bag is <em>empty</em></h1><p class="lead muted">Start with our most-loved sets.</p></div>
      <div class="grid">${products.map((p) => productCard(p)).join('')}</div>
    </div>
    <section class="sec sec--surface" style="margin-top:48px"><div class="page">${kitTeaser()}</div></section>`),
    notes: [{ target: '#empty', text: 'An empty bag still leads somewhere: bestsellers and the kit teaser (brief 9.9).' }],
  };
}

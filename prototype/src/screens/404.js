// 404 (brief 9.9).
import { layout } from '../components/layout.js';
import { productCard } from '../components/productCard.js';
import { products } from '../../data/products.js';

export function render() {
  return {
    html: layout(`<div class="page">
      <div class="page-head" style="text-align:center;padding-block:64px 32px" id="nf"><h1 class="h1">This page has <em>moved</em></h1>
        <p class="lead muted">The link may have changed. These sets are a good place to start.</p></div>
      <div class="grid">${products.map((p) => productCard(p)).join('')}</div>
      <p style="text-align:center;margin:40px 0 64px"><a class="btn" href="#/home">Back to the store</a></p>
    </div>`),
    notes: [{ target: '#nf', text: 'A calm note and a way back to bestsellers, never a dead end.' }],
  };
}

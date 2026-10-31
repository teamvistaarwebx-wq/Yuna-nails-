// Checkout placeholder: where GoKwik takes over (brief 11). Outside our scope.
import { summary } from '../lib/cart.js';
import { rupees } from '../components/facts.js';
import { icon } from '../components/icons.js';
import { confirmTag } from '../components/annotate.js';

export function render() {
  const s = summary();
  return {
    html: `<div class="checkout">
      <a class="link small" href="#/collection" style="justify-self:center">${icon('back')} Back to the store</a>
      <div class="checkout__box" id="gokwik">
        <p class="eyebrow">Checkout</p>
        <h1 class="h2">GoKwik checkout opens here</h1>
        <p class="muted">Outside our scope. A single set from Buy now comes straight here; bundles and add-ons come through the bag.</p>
        <p class="small">${confirmTag('GoKwik go-live date; Size me later flag reaches the order')}</p>
        ${s.count ? `<p class="small">In the bag: ${s.count} item${s.count === 1 ? '' : 's'} · ${rupees(s.total)}</p>` : ''}
      </div>
      <p class="tiny muted">If GoKwik is not live during the build, the native Shopify checkout keeps working (brief 11).</p>
    </div>`,
    notes: [{ target: '#gokwik', text: 'GoKwik onboarding is in progress; confirm the "Size me later" flag reaches the order (open item 16).' }],
  };
}

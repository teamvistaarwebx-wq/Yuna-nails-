// Nail care kit page (brief 9.3). One switch for coming soon / launched; it also changes the homepage slot and the bag add-on.
import { layout } from '../components/layout.js';
import { media } from '../components/media.js';
import { confirmTag } from '../components/annotate.js';
import { rupees } from '../components/facts.js';
import { notifyForm } from '../components/kit.js';
import { productCard } from '../components/productCard.js';
import { rt, ui, action } from '../lib/runtime.js';
import { addToCart } from '../lib/cart.js';
import { openDrawer } from '../lib/actions.js';
import { settings } from '../../data/settings.js';
import { products } from '../../data/products.js';
import { safetyNotes } from '../../data/facts.js';

action('kit-add', () => { addToCart('kit'); openDrawer(); });

export function render({ state, stateGiven }) {
  if (stateGiven) ui.kitComingSoon = state !== 'launched';
  else rt.setState(ui.kitComingSoon ? 'coming-soon' : 'launched');
  const k = settings.kit;
  const info = ui.kitComingSoon
    ? `<p class="kit__status">Coming soon</p>
      <h1 class="h2">${k.name}</h1>
      <p class="lead">${k.promise}</p>
      <p class="small">Price: ${confirmTag(k.priceHint.confirm)}</p>
      <div id="notify">${notifyForm('kit-notify')}</div>`
    : `<h1 class="h2">${k.name}</h1>
      <p><span class="price">${rupees(k.samplePrice)}</span> ${confirmTag('kit price')}</p>
      <p class="lead">${k.promise}</p>
      <div class="buy" id="kit-buy"><button type="button" class="btn btn--full" data-action="kit-add">Add to bag</button></div>
      <div class="tier tier--static" id="kit-bundle"><span class="tier__text"><span class="tier__name">Kit + a press-on set</span><span class="tier__benefit">${confirmTag('set + kit bundle price')}</span></span></div>`;
  return {
    html: layout(`
      <div class="page"><div class="pdp">
        <div class="gallery" id="kit-gallery"><div class="gallery__track">
          ${media({ label: 'Kit hero', ratio: '4:5', tone: '#E7D6C9' })}${media({ label: 'Kit contents', ratio: '1:1', tone: '#EBDDD2' })}</div></div>
        <div class="pdp__info" id="kit-info">${info}
          <div><p class="eyebrow">What's inside</p><p class="small">${confirmTag(k.contents.confirm)}</p></div>
          <details class="acc"><summary>Safety notes</summary><div class="acc__body"><ul class="note list">${safetyNotes.map((n) => `<li>${n}</li>`).join('')}</ul></div></details>
        </div>
      </div></div>
      <section class="sec sec--surface"><div class="page"><div class="sec__head"><h2 class="h2">Pairs with any <em>set</em></h2></div>
        <div class="rail">${products.map((p) => productCard(p)).join('')}</div></div></section>`),
    notes: [
      { target: '#kit-info', text: `One switch (data/settings.js: kitComingSoon) changes this page, the homepage slot and the bag add-on together. Now: ${ui.kitComingSoon ? 'coming soon' : 'launched'}.` },
      ui.kitComingSoon
        ? { target: '#notify', text: 'Inline notify-me form, never a popup (brief 2, 9.3).' }
        : { target: '#kit-bundle', text: 'Set + kit bundle, one of the client\'s value-based offers (brief 5).' },
    ],
  };
}

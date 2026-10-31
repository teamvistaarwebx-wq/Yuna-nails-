// Product page (brief 9.2). States: no size, error, size chosen, Size me later, 2 sets, 3 sets, glue remover add-on.
import { layout } from '../components/layout.js';
import { media } from '../components/media.js';
import { confirmTag } from '../components/annotate.js';
import { fact, rupees, sizes } from '../components/facts.js';
import { sizeChips, sizeChart } from '../components/sizes.js';
import { bundleSelector } from '../components/bundle.js';
import { productCard } from '../components/productCard.js';
import { icon } from '../components/icons.js';
import { rt, ui, action } from '../lib/runtime.js';
import { addToCart } from '../lib/cart.js';
import { openDrawer } from '../lib/actions.js';
import { products, productByHandle, productMetaConfirm } from '../../data/products.js';
import { facts, safetyNotes, trustLine } from '../../data/facts.js';
import { settings } from '../../data/settings.js';

const PRESETS = {
  'no-size': {},
  error: { error: true },
  size: { size: 'M' },
  'size-later': { later: true },
  'two-sets': { size: 'M', qty: 2 },
  'three-sets': { size: 'M', qty: 3 },
  addon: { size: 'M', addon: true },
};
let m = null; // { handle, size, later, error, qty, addon }

const derive = () => (m.error ? 'error' : m.addon ? 'addon' : m.qty === 3 ? 'three-sets' : m.qty === 2 ? 'two-sets' : m.later ? 'size-later' : m.size ? 'size' : 'no-size');
const ready = () => !!(m.size || m.later);
const sync = () => { rt.setState(derive()); rt.rerender(); };

function scrollToSize() {
  const el = document.getElementById('size-group');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function add(buyNow = false) {
  if (!ready()) { m.error = true; sync(); setTimeout(scrollToSize, 50); return; }
  if (buyNow && m.qty === 1) { rt.go('checkout'); return; }
  addToCart(m.handle, { size: m.size, later: m.later, qty: m.qty });
  if (m.addon) rt.toast('Glue remover added once it is a product (open item 7)');
  openDrawer();
}

action('pdp-add', () => add(false));
action('pdp-buy', () => add(true));
action('set-qty', (el) => { m.qty = Number(el.dataset.qty); sync(); });
action('toggle-addon', () => { m.addon = !m.addon; sync(); });

export function render({ state, params }) {
  const handle = params.get('handle') || (m && m.handle) || 'rouge-noir';
  const p = productByHandle(handle) || products[0];
  if (!m || m.handle !== p.handle || state !== derive()) {
    m = { handle: p.handle, size: null, later: false, error: false, qty: 1, addon: false, ...(PRESETS[state] || {}) };
  }
  rt.scope = {
    pickSize: (s) => { Object.assign(m, { size: s, later: false, error: false }); sync(); },
    pickLater: () => { Object.assign(m, { size: null, later: true, error: false }); sync(); },
  };
  rt.pdpSize = () => m.size;
  // Choosing a size in the size sheet (opened from "Size chart") also sets the page.
  if (ui.sheet && ui.sheet.chart && ui.sheet.handle === p.handle && ui.sheet.size && ui.sheet.size !== m.size) { m.size = ui.sheet.size; m.later = false; }

  const others = products.filter((x) => x.handle !== p.handle);
  const showBuyNow = m.qty === 1;
  const label = m.later ? ': to confirm on WhatsApp' : m.size ? `: ${m.size}` : '';

  const html = layout(`
    <div class="page">
      <div class="pdp">
        <div class="gallery" id="gallery" aria-label="Photos and videos">
          <div class="gallery__track">
            ${media({ label: 'Hand video', ratio: '4:5', tone: p.tone, video: true })}
            ${media({ label: 'Hand photo', ratio: '4:5', tone: p.tone })}
            ${media({ label: 'One set on three skin tones', ratio: '1:1', tone: p.tone })}
            ${media({ label: 'Plate shot', ratio: '4:5' })}
            ${media({ label: 'Unboxing', ratio: '4:5' })}
          </div>
          <p class="gallery__count" aria-hidden="true">1 / 5 · swipe</p>
        </div>

        <div class="pdp__info">
          <div class="pdp__title">
            <h1 class="h2">${p.name}</h1>
            <p><span class="price">${rupees(p.price)}</span> <span class="small muted">· ${fact('nailsPerSet')} hand-painted nails</span></p>
            <p class="tiny">${confirmTag(productMetaConfirm)} <a href="#reviews" class="muted">Reviews</a></p>
          </div>

          <fieldset class="option-group${m.error ? ' has-error' : ''}" id="size-group">
            <legend class="option-group__legend"><span>Size${label}</span>
              <button type="button" class="link small" data-action="open-size-chart" data-handle="${p.handle}">Size chart</button></legend>
            ${sizeChips({ size: m.size, later: m.later, error: m.error, scope: 'pdp' })}
          </fieldset>

          ${bundleSelector({ unit: p.price, qty: m.qty })}

          <div class="addon-toggle" id="addon">
            ${media({ label: 'Remover', ratio: '1:1', tag: false })}
            <div><p class="small"><b>Add nail glue remover</b></p><p class="tiny muted">${m.qty >= 2 ? 'Free with 2 sets' : 'Gentle removal, kinder to nails'} ${confirmTag(settings.remover.confirm)}</p>
              <p class="tiny muted">Hidden on the live site until the product exists.</p></div>
            <button type="button" class="switch" role="switch" aria-checked="${m.addon}" aria-label="Add nail glue remover" data-action="toggle-addon"></button>
          </div>

          <div class="buy" id="buy">
            <button type="button" class="btn btn--full" data-action="pdp-add" aria-disabled="${!ready()}">Add to bag</button>
            ${showBuyNow ? `<button type="button" class="btn btn--secondary btn--full" data-action="pdp-buy" aria-disabled="${!ready()}">Buy now</button>` : `<p class="tiny muted">${m.qty} sets go through the bag, so the offer applies.</p>`}
            <ul class="trust">${trustLine.map((t) => `<li>${t}</li>`).join('')}</ul>
          </div>

          <div class="tryon" id="tryon"><span>${icon('sparkle')} Virtual try-on (the current AR app stays here) ${confirmTag('AR try-on placement')}</span>
            <button type="button" class="btn btn--secondary btn--small" data-todo="Opens the existing AR try-on app (not in prototype)">Try on</button></div>

          <div>
            <details class="acc" id="acc-box" open><summary>What's in the box</summary><div class="acc__body">
              <ul class="list"><li>${fact('nailsPerSet')} hand-painted nails</li><li>Nail glue</li><li>Adhesive tabs: ${fact('adhesiveTabs')}</li></ul>
              ${media({ label: 'Unboxing', ratio: '4:5' })}</div></details>
            <details class="acc" id="acc-apply"><summary>How to apply</summary><div class="acc__body">
              <div class="video-box">${media({ label: 'How to apply', ratio: '9:16', video: true })}</div>
              <ol class="list"><li>Clean and dry your nails. Push back cuticles and buff lightly.</li><li>Match a press-on to each nail.</li><li>A thin layer of glue on your nail and the press-on.</li><li>Press on from the cuticle and hold firmly.</li></ol>
              <p class="small">Takes about ${fact('applyTime')}.</p></div></details>
            <details class="acc" id="acc-remove"><summary>Removal</summary><div class="acc__body">
              <div class="video-box">${media({ label: 'How to remove', ratio: '9:16', video: true })}</div>
              <ol class="list"><li>Soak your nails in warm soapy water.</li><li>Gently lift each press-on from the side. Never pull.</li><li>Clean off the glue and keep the set to wear again.</li></ol></div></details>
            <details class="acc" id="acc-safety"><summary>Safety notes</summary><div class="acc__body"><ul class="note list">${safetyNotes.map((n) => `<li>${n}</li>`).join('')}</ul></div></details>
            <details class="acc"><summary>Size and fit</summary><div class="acc__body">${sizeChart()}<p class="small">Wrong size? Exchange it free within ${fact('exchange')}.</p></div></details>
            <details class="acc"><summary>How long do they last?</summary><div class="acc__body"><p class="small">Reusable for ${fact('wearCount')}. Cost per wear: ${fact('costPerWear')}.</p></div></details>
            <details class="acc"><summary>When will it ship?</summary><div class="acc__body"><p class="small">Hand-painted to order and dispatched in ${fact('dispatch')}. ${facts.payment.value}; COD fee ${fact('codFee')}.</p></div></details>
          </div>
        </div>
      </div>
    </div>

    <section class="sec sec--surface" id="reviews"><div class="page">
      <div class="sec__head"><h2 class="h2">Reviews</h2><p class="muted small">From Judge.me, the current reviews app.</p></div>
      <div class="review"><blockquote class="review__quote">The Judge.me reviews widget sits here.</blockquote><p class="review__name">${confirmTag('real reviews load from Judge.me on the store')}</p></div>
    </div></section>

    <section class="sec"><div class="page">
      <div class="sec__head"><h2 class="h2">Pair it with a <em>second set</em></h2><p class="muted small">Two sets come with a free nail glue remover.</p></div>
      <div class="rail">${others.map((x) => productCard(x)).join('')}</div>
    </div></section>`,
  {
    sticky: `<div class="sticky" id="sticky"><div class="sticky__info"><b>${p.name}</b><span class="price">${rupees(p.price * m.qty)}</span></div>
      <button type="button" class="btn" data-action="${ready() ? 'pdp-add' : 'sticky-size'}">${ready() ? 'Add to bag' : 'Choose your size'}</button></div>`,
  });

  return {
    html,
    notes: [
      { target: '#gallery', text: 'Opens on a hand video, then hand photos. Plate shots come later (audit: the page opened on a plate).' },
      { target: '#size-group', text: 'No size pre-selected: avoids wrong-size orders (audit 30 Oct: XS was pre-selected).' },
      { target: '#size-group .chip--wide', text: '"Size me later" lets her order now; Yuna confirms the size on WhatsApp within 24 h (client answers, 31 Oct).' },
      { target: '#bundle', pos: 'top:-4px;right:-4px', text: 'Bundle choice sits above Add to bag, not below it (audit). Offer values come from data/offers.js.' },
      { target: '#addon', text: 'Glue remover is an add-on, hidden until the product exists (client answers; open item 7).' },
      { target: '#buy', text: 'Buy now is for one set only and goes straight to GoKwik; bundles go through the bag so the offer applies (brief 11).' },
      { target: '#tryon', text: 'AR try-on stays in its current spot until Gaurav and Vishal decide placement (open item 13). The beta camera size finder is removed.' },
      { target: '#sticky', text: 'Sticky bar on phones. The WhatsApp button never covers it (brief 9.2).' },
    ],
  };
}

action('sticky-size', () => { if (m) { m.error = true; sync(); setTimeout(scrollToSize, 50); } });

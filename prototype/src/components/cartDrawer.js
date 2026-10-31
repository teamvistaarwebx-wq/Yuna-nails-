// Cart drawer (brief 9.5): gift bar, lines, nudge, add-ons, savings, delivery and COD, one checkout button.
import { summary, priceOf } from '../lib/cart.js';
import { ui } from '../lib/runtime.js';
import { offers } from '../../data/offers.js';
import { settings } from '../../data/settings.js';
import { productByHandle } from '../../data/products.js';
import { media } from './media.js';
import { confirmTag } from './annotate.js';
import { rupees, fact } from './facts.js';
import { icon } from './icons.js';

function giftBar(s) {
  const g = s.gift;
  const cap = (t) => t.replace(/^./, (c) => c.toUpperCase());
  let text;
  if (!g.next) text = 'All gifts unlocked';
  else if (g.unlocked.length) text = `Gift unlocked. ${rupees(g.next.threshold - s.total)} away from ${g.next.gift}`;
  else text = `${rupees(g.next.threshold - s.total)} away from ${g.next.gift}`;
  return `<div class="gift" id="gift-bar">
    <p class="gift__text">${icon('gift')}<span>${cap(text)}</span></p>
    <div class="gift__bar" role="progressbar" aria-valuemin="0" aria-valuemax="${g.max}" aria-valuenow="${s.total}" aria-label="Progress to free gifts">
      <span class="gift__fill" style="width:${g.pct}%"></span>
      ${g.steps.map((st) => `<span class="gift__step${s.total >= st.threshold ? ' is-done' : ''}" style="left:${(st.threshold / g.max) * 100}%"></span>`).join('')}
    </div>
    <p class="gift__confirm">${confirmTag(offers.gifts.toConfirm)}</p>
  </div>`;
}

function line(l) {
  if (l.handle === 'kit') {
    return `<li class="line"><div class="line__media">${media({ label: 'Kit', ratio: '4:5', tag: false })}</div>
      <div class="line__info"><p class="line__title">${settings.kit.name}</p><p class="line__meta">${confirmTag('kit price')}</p>${qty(l)}</div>
      <div class="line__end"><span class="price">${rupees(priceOf('kit') * l.qty)}</span><button type="button" class="link line__remove" data-action="remove-line" data-id="${l.id}">Remove</button></div></li>`;
  }
  const p = productByHandle(l.handle);
  return `<li class="line" ${l.later ? 'id="line-later"' : ''}>
    <div class="line__media">${media({ label: 'Hand', ratio: '4:5', tone: p.tone, tag: false })}</div>
    <div class="line__info">
      <p class="line__title">${p.name}</p>
      ${l.later ? '<p class="line__flag">Size to confirm on WhatsApp</p>' : `<p class="line__meta">Size: ${l.size}</p>`}
      ${qty(l)}
    </div>
    <div class="line__end"><span class="price">${rupees(p.price * l.qty)}</span><button type="button" class="link line__remove" data-action="remove-line" data-id="${l.id}">Remove<span class="visually-hidden"> ${p.name}</span></button></div>
  </li>`;
}
const qty = (l) => `<div class="qty" role="group" aria-label="Quantity">
  <button type="button" data-action="qty" data-id="${l.id}" data-delta="-1" aria-label="One less">${icon('minus')}</button>
  <span aria-live="polite">${l.qty}</span>
  <button type="button" data-action="qty" data-id="${l.id}" data-delta="1" aria-label="One more">${icon('plus')}</button></div>`;

function addons(s) {
  const kitCard = ui.kitComingSoon
    ? `<div class="addon" id="addon-kit"><div class="addon__media">${media({ label: 'Kit', ratio: '1:1', tag: false })}</div>
        <div><p class="addon__title">${settings.kit.name}</p><p class="addon__meta">Coming soon</p></div>
        <a class="btn btn--secondary btn--small" href="#/kit?state=coming-soon" data-action="close-drawer-go" data-to="kit">Notify me</a></div>`
    : `<div class="addon" id="addon-kit"><div class="addon__media">${media({ label: 'Kit', ratio: '1:1', tag: false })}</div>
        <div><p class="addon__title">${settings.kit.name}</p><p class="addon__meta">${rupees(settings.kit.samplePrice)} ${confirmTag('kit price')}</p></div>
        ${s.hasKit ? '<span class="addon__added">Added</span>' : '<button type="button" class="btn btn--secondary btn--small" data-action="add-kit">Add</button>'}</div>`;
  const remover = ui.removerVisible
    ? `<div class="addon"><div class="addon__media">${media({ label: 'Remover', ratio: '1:1', tag: false })}</div>
        <div><p class="addon__title">${settings.remover.name}</p><p class="addon__meta">${confirmTag(settings.remover.confirm)}</p></div>
        <button type="button" class="btn btn--secondary btn--small" data-todo="Glue remover is not a product yet (open item 7)">Add</button></div>`
    : '';
  return `<div class="addons"><p class="addons__title">Add to your order</p>${remover}${kitCard}</div>`;
}

export function cartDrawer() {
  if (!ui.drawer) return '';
  const s = summary();
  const body = s.count === 0
    ? `<div class="cart-empty" id="cart-empty"><p class="h3">Your bag is empty</p><p class="muted">Start with our most-loved sets.</p>
        <a class="btn" href="#/collection" data-action="close-drawer-go" data-to="collection">Shop bestsellers</a></div>${addons(s)}`
    : `${giftBar(s)}
      <ul class="lines">${s.lines.map(line).join('')}
        ${s.freeRemover ? `<li class="line line--free" id="free-remover"><div class="line__info"><p class="line__title">${settings.remover.name}</p><p class="line__meta">Free with 2 sets ${confirmTag(offers.tiers[1].toConfirm)}</p></div><div class="line__end"><span class="price">Free</span></div></li>` : ''}
      </ul>
      ${s.nudge ? `<p class="nudge" id="nudge">${s.nudge.text} ${confirmTag(s.nudge.confirm)}</p>` : ''}
      ${addons(s)}`;
  return `<div class="overlay" data-overlay="drawer">
    <div class="scrim" data-action="close-drawer"></div>
    <aside class="drawer${ui.drawerAnimate ? ' is-entering' : ''}" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" id="drawer">
      <header class="overlay__head"><h2 class="overlay__title" id="drawerTitle">Your bag${s.count ? ` (${s.count})` : ''}</h2>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Close bag">${icon('close')}</button></header>
      <div class="overlay__body">${body}</div>
      ${s.count ? `<footer class="overlay__foot" id="drawer-foot">
        <dl class="sum">
          ${s.saving ? `<div class="sum__row sum__save"><dt>You save</dt><dd>${rupees(s.saving)}</dd></div>` : ''}
          <div class="sum__row"><dt>Delivery</dt><dd>${fact('freeShipping')}</dd></div>
          <div class="sum__row muted"><dt>Cash on delivery</dt><dd>${fact('codFee')} fee</dd></div>
        </dl>
        <button type="button" class="btn btn--full" id="checkout-btn" data-action="checkout">Checkout · ${rupees(s.total)}</button>
      </footer>` : ''}
    </aside>
  </div>`;
}

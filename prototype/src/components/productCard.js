// Product card: hand photo first, name, shape and length, price, one quiet offer line, Quick add (brief 9.4).
import { media } from './media.js';
import { confirmTag } from './annotate.js';
import { rupees } from './facts.js';
import { productMetaConfirm } from '../../data/products.js';

export function productCard(p, { offerLine = null } = {}) {
  return `<article class="card" data-card="${p.handle}">
    <a class="card__link" href="#/product?handle=${p.handle}" aria-label="${p.name}">${media({ label: 'Hand photo', ratio: '4:5', tone: p.tone })}</a>
    <div class="card__body">
      <h3 class="card__title"><a href="#/product?handle=${p.handle}">${p.name}</a></h3>
      <p class="card__meta">${confirmTag(productMetaConfirm)}</p>
      <p class="card__price price">${rupees(p.price)}</p>
      ${offerLine ? `<p class="card__offer">${offerLine}</p>` : ''}
    </div>
    <button type="button" class="btn btn--secondary btn--small btn--full card__quick" data-action="quick-add" data-handle="${p.handle}" aria-haspopup="dialog">Quick add<span class="visually-hidden"> ${p.name}</span></button>
  </article>`;
}

// A card standing in for the rest of the catalogue, which needs store access.
export function placeholderCard(confirmText) {
  return `<article class="card card--placeholder">
    ${media({ label: 'Hand photo', ratio: '4:5' })}
    <div class="card__body">
      <h3 class="card__title">More designs</h3>
      <p class="card__meta">${confirmTag(confirmText)}</p>
    </div>
  </article>`;
}

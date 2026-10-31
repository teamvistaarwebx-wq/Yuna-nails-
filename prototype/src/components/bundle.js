// Bundle selector: 1, 2 or 3 sets, above Add to bag (brief 9.2). Values from data/offers.js.
import { offers } from '../../data/offers.js';
import { confirmTag } from './annotate.js';
import { rupees } from './facts.js';

export function bundleSelector({ unit, qty, name = 'sets' }) {
  return `<fieldset class="option-group" id="bundle">
    <legend class="option-group__legend">How many sets</legend>
    <div class="tiers" role="radiogroup" aria-label="How many sets">
      ${offers.tiers.map((t) => {
        const total = unit * t.qty;
        const save = t.savingRupees || 0;
        const selected = qty === t.qty;
        return `<button type="button" class="tier${selected ? ' is-selected' : ''}" role="radio" aria-checked="${selected}" data-action="set-qty" data-qty="${t.qty}" name="${name}">
          <span class="tier__dot" aria-hidden="true"></span>
          <span class="tier__text"><span class="tier__name">${t.label}</span>
            ${t.benefit ? `<span class="tier__benefit">${t.benefit}</span>` : ''}
            ${save ? `<span class="tier__benefit">Save ${rupees(save)}</span>` : ''}
            ${t.toConfirm ? `<span class="tier__confirm">${confirmTag(t.toConfirm)}</span>` : ''}
          </span>
          <span class="tier__price">${rupees(total - save)}${save ? `<s>${rupees(total)}</s>` : ''}</span>
        </button>`;
      }).join('')}
    </div>
    <p class="tiny muted">Savings shown in ${offers.savingsDisplay.value} ${confirmTag(offers.savingsDisplay.toConfirm)}</p>
  </fieldset>`;
}

// The same offers as quiet cards, for the homepage and landing page.
export function offerCards() {
  return `<div class="tiers">${offers.tiers.map((t) => `
    <div class="tier tier--static">
      <span class="tier__text"><span class="tier__name">${t.label}</span>
        <span class="tier__benefit">${t.benefit || (t.savingRupees ? `Save ${rupees(t.savingRupees)}` : 'Hand-painted, made to order')}</span>
        ${t.toConfirm ? `<span class="tier__confirm">${confirmTag(t.toConfirm)}</span>` : ''}
      </span>
    </div>`).join('')}</div>`;
}

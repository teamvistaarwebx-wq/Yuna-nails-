// Size chips with no size pre-selected, plus "Size me later" (brief 9.2, 10). Used on the product page and in the size sheet.
import { sizes, fact } from './facts.js';
import { icon } from './icons.js';

export function sizeChips({ size, later, error, scope }) {
  return `<div class="chips" role="radiogroup" aria-label="Size">
      ${sizes().map((s) => `<button type="button" class="chip${size === s && !later ? ' is-selected' : ''}" role="radio" aria-checked="${size === s && !later}" data-action="pick-size" data-scope="${scope}" data-size="${s}">${s}</button>`).join('')}
      <button type="button" class="chip chip--wide${later ? ' is-selected' : ''}" role="radio" aria-checked="${!!later}" data-action="pick-later" data-scope="${scope}">Not sure? Size me later</button>
    </div>
    ${later ? `<p class="size-later-note">After your order, we'll message you on WhatsApp. Send a photo of your hand next to a coin or card, and we'll confirm your size within ${fact('sizeConfirmHours')} hours. Your order waits until then.</p>` : ''}
    ${error ? `<p class="field-error" role="alert">${icon('info')}<span>Please choose your size, or pick Size me later.</span></p>` : ''}`;
}

export function sizeChart() {
  return `<div class="size-chart-box">
    <p class="small">${fact('nailsPerSet')} nails per set, sizes ${sizes().join(', ')}. Widths in mm across the widest part of each nail.</p>
    <table class="size-chart"><caption class="visually-hidden">Nail widths in millimetres</caption>
      <thead><tr><th scope="col">Size</th><th scope="col">Thumb</th><th scope="col">Index</th><th scope="col">Middle</th><th scope="col">Ring</th><th scope="col">Little</th></tr></thead>
      <tbody>${sizes().map((s) => `<tr><th scope="row">${s}</th>${'<td>–</td>'.repeat(5)}</tr>`).join('')}</tbody>
    </table>
    <p class="small"><mark class="confirm">TO CONFIRM: mm values from current chart</mark></p>
    <p class="small"><strong>Between two sizes?</strong> ${fact('betweenSizes')}</p>
  </div>`;
}

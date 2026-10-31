// Size sheet (brief 9.6): bottom sheet on phones, centred on desktop. Quick add and every "Size chart" link open it.
import { ui } from '../lib/runtime.js';
import { productByHandle } from '../../data/products.js';
import { sizeChips, sizeChart } from './sizes.js';
import { rupees } from './facts.js';
import { icon } from './icons.js';

export function sizeSheet() {
  const s = ui.sheet;
  if (!s) return '';
  const p = s.handle ? productByHandle(s.handle) : null;
  return `<div class="overlay" data-overlay="sheet">
    <div class="scrim" data-action="close-sheet"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" id="sheet">
      <span class="sheet__grip" aria-hidden="true"></span>
      <header class="overlay__head"><h2 class="overlay__title" id="sheetTitle">${p ? p.name : 'Find your size'}</h2>
        <button type="button" class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('close')}</button></header>
      <div class="overlay__body">
        ${s.added ? `<p class="added" role="status" id="sheet-added">${icon('check')} Added to your bag</p>` : ''}
        ${p ? `<div class="option-group" id="sheet-sizes"><p class="option-group__legend">Size${s.later ? ': to confirm on WhatsApp' : s.size ? `: ${s.size}` : ''} <span class="muted">${rupees(p.price)}</span></p>
          ${sizeChips({ size: s.size, later: s.later, error: s.error, scope: 'sheet' })}</div>` : ''}
        <details class="acc" id="sheet-chart"${s.chart || !p ? ' open' : ''}><summary>Size chart (mm)</summary><div class="acc__body">${sizeChart()}
          <p class="small"><a href="#/size-guide" data-action="close-sheet-go" data-to="size-guide">How to measure</a></p></div></details>
      </div>
      ${p ? `<footer class="overlay__foot"><button type="button" class="btn btn--full" data-action="sheet-add" aria-disabled="${!(s.size || s.later)}">Add to bag</button></footer>` : ''}
    </div>
  </div>`;
}

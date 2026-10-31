// Size sheet (brief 9.6) over the product page: chart in mm, between-sizes line, Size me later.
import { ui } from '../lib/runtime.js';
import * as product from './product.js';

export function render(ctx) {
  if (ctx.fresh) ui.sheet = { handle: 'rouge-noir', size: null, later: false, error: false, added: false, chart: true };
  const out = product.render({ ...ctx, state: 'no-size', params: new URLSearchParams('handle=rouge-noir') });
  return {
    html: out.html,
    notes: [
      { target: '#sheet-sizes', text: 'Same sizes as the product page, none pre-selected, plus Size me later.' },
      { target: '#sheet-chart', text: 'Chart in mm (values to copy from the current site) and one line on what to do between sizes (open item 1).' },
    ],
  };
}

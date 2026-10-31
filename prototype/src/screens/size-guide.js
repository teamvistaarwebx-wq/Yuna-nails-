// Size guide page (brief 9.6): how to measure, the chart, WhatsApp custom sizing, the free exchange.
import { layout } from '../components/layout.js';
import { media } from '../components/media.js';
import { sizeChart } from '../components/sizes.js';
import { fact } from '../components/facts.js';
import { icon } from '../components/icons.js';

export function render() {
  return {
    html: layout(`<div class="page narrow">
      <div class="page-head"><p class="eyebrow">Fit</p><h1 class="h1">Size <em>guide</em></h1><p class="lead muted">Four sizes, ${fact('sizes')}. Here's how to find yours.</p></div>
      <section class="stack" id="measure"><h2 class="h3">How to measure</h2>
        <ol class="steps">
          <li class="step"><div><p class="step__title">Measure each nail</p><p class="step__text">Lay a soft tape or a strip of paper across the widest part of each nail, side to side.</p></div></li>
          <li class="step"><div><p class="step__title">Note it in mm</p><p class="step__text">Write down all five widths, thumb to little finger.</p></div></li>
          <li class="step"><div><p class="step__title">Match the chart</p><p class="step__text">Pick the size whose widths are closest to yours.</p></div></li>
        </ol></section>
      <section class="stack section" id="chart"><h2 class="h3">Size chart</h2>${sizeChart()}</section>
      <section class="note stack" id="custom"><h2 class="h3">Not sure? We'll size you</h2>
        <ol class="list"><li>Pick "Size me later" when you order.</li><li>We message you on WhatsApp after the order.</li><li>Send a photo of your hand next to a coin or card.</li><li>We confirm your size within ${fact('sizeConfirmHours')} hours. Your order waits until then.</li></ol>
        <div style="max-width:220px">${media({ label: 'Hand next to a coin', ratio: '4:5' })}</div>
        <button type="button" class="btn" data-todo="Opens WhatsApp (number to confirm)">${icon('whatsapp')} Send a photo on WhatsApp</button></section>
      <section class="stack section" id="exchange"><h2 class="h3">Free size exchange</h2><p>If a size doesn't fit, tell us within ${fact('exchange')} and we'll exchange it free.</p></section>
    </div>`),
    notes: [
      { target: '#chart', text: 'One chart for the whole site. Today the size chart says larger and the fit guide says smaller (audit); one answer to confirm (open item 1).' },
      { target: '#custom', text: 'Custom sizing on WhatsApp: hand photo with a coin or card, confirmed within 24 h, order on hold (client answers, 31 Oct).' },
    ],
  };
}

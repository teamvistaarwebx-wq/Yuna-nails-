// About (brief 9.9): Sanprita's founder story, hand-painted by Yuna's nail artists, made to order.
import { layout } from '../components/layout.js';
import { media } from '../components/media.js';
import { confirmTag } from '../components/annotate.js';
import { fact } from '../components/facts.js';

export function render() {
  return {
    html: layout(`
      <section class="sec"><div class="page two" id="founder">
        ${media({ label: 'Founder portrait', ratio: '4:5', tone: '#E8D3C8' })}
        <div class="stack"><p class="eyebrow">Our story</p><h1 class="h1">A note from <em>Sanprita</em></h1>
          <p>${confirmTag("Sanprita's founder note")}</p><p class="h3">Sanprita</p></div>
      </div></section>
      <section class="sec sec--surface" id="artists"><div class="page narrow" style="text-align:center">
        <p class="eyebrow">Hand-painted</p><h2 class="h2">Painted by <em>our</em> nail artists</h2>
        <p class="lead muted" style="margin-top:16px">Every set is painted by hand by Yuna's nail artists, one nail at a time. Customisable, never machine-made.</p>
      </div></section>
      <section class="sec"><div class="page two" id="made">
        <div class="stack"><p class="eyebrow">Made to order</p><h2 class="h2">Made for <em>you</em></h2>
          <p>We paint your set after you order, in your size, and dispatch it in ${fact('dispatch')}.</p>
          <a class="btn btn--secondary" href="#/collection" style="justify-self:start">Shop the sets</a></div>
        ${media({ label: 'Studio photo', ratio: '4:5', tone: '#EBDDD2' })}
      </div></section>`),
    notes: [{ target: '#artists .page', text: 'Our edge: genuinely customisable and 100% hand-painted, versus pre-made or machine-made sets (MOM 30 Oct).' }],
  };
}

// Ad landing page (brief 9.1): hook, choose and proof in one scroll. States: video poster / video playing.
import { layout } from '../components/layout.js';
import { hero, moods } from '../components/sections.js';
import { offerCards } from '../components/bundle.js';
import { reelTile, reviewTile } from '../components/tiles.js';
import { media } from '../components/media.js';
import { confirmTag } from '../components/annotate.js';
import { rt, ui } from '../lib/runtime.js';
import { settings } from '../../data/settings.js';

let playing = false;

export function render({ state }) {
  playing = state === 'playing';
  rt.videoToggle = () => { playing = !playing; rt.setState(playing ? 'playing' : 'poster'); rt.rerender(); };
  const kit = `<div class="addon" id="landing-kit">${media({ label: 'Kit', ratio: '1:1', tag: false })}
    <div><p class="addon__title">${settings.kit.name}</p><p class="addon__meta">${ui.kitComingSoon ? 'Coming soon' : 'Now available'}</p></div>
    <a class="btn btn--secondary btn--small" href="#/kit">${ui.kitComingSoon ? 'Notify me' : 'Shop'}</a></div>`;
  return {
    html: layout(`
      ${hero({ id: 'hook', title: 'Salon nails in <em>minutes</em>', playing, cta: 'Shop the sets', href: '#/product?handle=rouge-noir' })}
      ${moods({ count: 2, id: 'choose', title: 'Find your <em>mood</em>' })}
      <section class="sec" style="padding-top:0"><div class="page stack" id="choose-offers">
        <p class="eyebrow">More sets, more value</p>${offerCards()}${kit}
      </div></section>
      <section class="sec sec--surface" id="proof"><div class="page stack-lg">
        <h2 class="h2">Real hands, <em>real</em> reviews</h2>
        <div class="rail">${reelTile()}${reelTile()}${reelTile()}</div>
        <div class="two">
          <div class="stack"><p class="eyebrow">How to apply</p>
            <ol class="steps"><li class="step"><div><p class="step__title">Prep</p><p class="step__text">Clean, dry, buff lightly.</p></div></li>
            <li class="step"><div><p class="step__title">Glue</p><p class="step__text">A thin layer on nail and press-on.</p></div></li>
            <li class="step"><div><p class="step__title">Press</p><p class="step__text">Press from the cuticle and hold.</p></div></li></ol>
            <a class="small" href="#/faq">Safety notes</a></div>
          <div class="stack">${reviewTile()}<a class="btn btn--full" href="#/product?handle=rouge-noir">Shop the sets</a></div>
        </div>
      </div></section>`, { logoTag: false }),
    notes: [
      { target: '#hook-media', text: 'Poster image loads first and is the LCP; the muted video starts only after it (brief 9.1, 12). Tap to play.' },
      { target: '#hook-price', text: '"From" price is read from the cheapest product, never typed (data/products.js).' },
      { target: '#hook-trust', text: 'Short trust line: hand-painted, made to order, dispatch 24–48 h, COD (brief 5).' },
      { target: '#choose-offers', text: 'Offers come from data/offers.js. Fewer % discounts, more value-based offers (client, 31 Oct).' },
      { target: '#proof h2', text: 'Proof: customer reels, 3 steps, one real Judge.me review, one button. No popup anywhere.' },
    ],
  };
}

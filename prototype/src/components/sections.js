// Page sections shared by the homepage and the ad landing page. Each maps to a Shopify section later.
import { media } from './media.js';
import { confirmTag } from './annotate.js';
import { fact, rupees } from './facts.js';
import { offerCards } from './bundle.js';
import { productCard, placeholderCard } from './productCard.js';
import { reelTile, reviewTile } from './tiles.js';
import { icon } from './icons.js';
import { products, cheapestPrice, moodsConfirm, moreProductsConfirm } from '../../data/products.js';
import { trustLine, safetyNotes } from '../../data/facts.js';

export function hero({ title = 'Salon nails, <em>at home</em>', text = 'Hand-painted press-ons, made to order for your size.', playing = false, cta = 'Shop the sets', href = '#/collection', id = 'hero' } = {}) {
  return `<section class="hero" id="${id}">
    <div class="hero__media" id="${id}-media" style="position:relative">
      ${media({ label: playing ? 'Hand video (playing, muted)' : 'Hand video poster', ratio: '4:5', tone: '#D9B8AE', video: true, className: playing ? 'is-playing' : '' })}
      ${playing ? '<div class="video-state" aria-hidden="true"><span>Muted</span><span class="video-state__bar"><i></i></span></div>' : ''}
      <button type="button" class="play-btn" data-action="toggle-video" aria-label="${playing ? 'Pause video' : 'Play video'}"></button>
    </div>
    <div class="hero__content">
      <h1 class="h1">${title}</h1>
      <p class="lead">${text}</p>
      <p class="price" id="${id}-price">From ${rupees(cheapestPrice())}</p>
      <a class="btn" href="${href}">${cta}</a>
      <ul class="trust" id="${id}-trust">${trustLine.map((t) => `<li>${t}</li>`).join('')}</ul>
    </div>
  </section>`;
}

export function bestsellers({ title = 'Bestsellers', id = 'bestsellers' } = {}) {
  return `<section class="sec" id="${id}"><div class="page">
    <div class="sec__head"><p class="eyebrow">Most loved</p><h2 class="h2">${title}</h2>
      <p class="small muted">Top-reviewed sets for now ${confirmTag('bestseller list')}</p></div>
    <div class="grid">${products.map((p) => productCard(p)).join('')}${placeholderCard(moreProductsConfirm)}</div>
    <div class="sec__foot"><a class="btn btn--secondary" href="#/collection">Shop all sets</a></div>
  </div></section>`;
}

export function moods({ count = 4, id = 'moods', title = 'Shop by <em>mood</em>' } = {}) {
  const tones = ['#E8C9BE', '#5A1A22', '#C9C3D9', '#F0C7B4'];
  return `<section class="sec" id="${id}"><div class="page">
    <div class="sec__head"><h2 class="h2">${title}</h2><p class="small">${confirmTag(moodsConfirm)}</p></div>
    <div class="grid">${Array.from({ length: count }, (_, i) => `<a class="mood" href="#/collection">${media({ label: 'Mood photo', ratio: '4:5', tone: tones[i % 4] })}<span class="mood__title">Mood ${i + 1}${icon('arrow')}</span></a>`).join('')}</div>
  </div></section>`;
}

export function buildYourSet({ id = 'build' } = {}) {
  return `<section class="sec" id="${id}"><div class="page two">
    <div class="sec__head"><h2 class="h2">Build your <em>set</em></h2><p class="muted">Mix any designs. Offers apply in the bag.</p></div>
    <div class="stack">${offerCards()}<a class="btn btn--full" href="#/collection">Choose your sets</a></div>
  </div></section>`;
}

export function howToApply({ id = 'how' } = {}) {
  return `<section class="sec sec--surface" id="${id}"><div class="page two">
    <div class="stack">
      <h2 class="h2">How to <em>apply</em></h2>
      <p class="muted">About ${fact('applyTime')}, no salon needed.</p>
      <div class="video-box">${media({ label: 'How to apply', ratio: '9:16', video: true })}</div>
    </div>
    <div class="stack">
      <ol class="steps">
        <li class="step"><div><p class="step__title">Prep</p><p class="step__text">Clean and dry your nails. Push back cuticles and buff lightly.</p></div></li>
        <li class="step"><div><p class="step__title">Glue</p><p class="step__text">A thin layer of nail glue on your nail and on the press-on.</p></div></li>
        <li class="step"><div><p class="step__title">Press</p><p class="step__text">Press on from the cuticle and hold firmly. Done.</p></div></li>
      </ol>
      <details class="acc" id="${id}-safety"><summary>Safety notes</summary><div class="acc__body"><ul class="note list">${safetyNotes.map((n) => `<li>${n}</li>`).join('')}</ul></div></details>
    </div>
  </div></section>`;
}

export function realHands({ id = 'real-hands' } = {}) {
  return `<section class="sec" id="${id}"><div class="page">
    <div class="sec__head"><h2 class="h2">Real <em>hands</em></h2><p class="muted">Worn and filmed by our customers. Reviews alongside (MOM 30 Oct).</p></div>
    <div class="two">
      <div class="rail">${reelTile('Customer reel')}${reelTile('Customer reel')}${reelTile('Customer reel')}</div>
      <div class="stack">${reviewTile()}</div>
    </div>
  </div></section>`;
}

export function instagram() {
  return `<section class="sec" id="instagram"><div class="page">
    <div class="sec__head" style="text-align:center"><h2 class="h2">On <em>Instagram</em></h2><a href="#" data-todo="Opens Instagram">@yunanails ${confirmTag('Instagram handle')}</a></div>
    <div class="insta">${Array.from({ length: 6 }, (_, i) => media({ label: 'Post', ratio: '1:1', tone: ['#E8C9BE', '#5A1A22', '#C9C3D9', '#F0C7B4', '#D9B8AE', '#EBD7CC'][i] })).join('')}</div>
  </div></section>`;
}

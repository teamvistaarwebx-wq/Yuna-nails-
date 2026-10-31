// A fictional, generic reel-style ad card: where the journey starts. Not a copy of any app's interface.
import { media } from '../components/media.js';
import { rt, action } from '../lib/runtime.js';

action('ad-shop', () => rt.go('landing'));

export function render() {
  return {
    html: `<div class="ad">
      <div>
        <article class="ad__card" id="ad-card">
          <header class="ad__top"><span class="ad__avatar">YN</span><span><b>Yuna Nails</b><span class="ad__sponsored">Sponsored</span></span></header>
          ${media({ label: 'Reel: hands, 9:16', ratio: '9:16', tone: '#C9A79C', video: true })}
          <div class="ad__cta"><p>Hand-painted press-ons, made to order.</p><button type="button" class="ad__btn" data-action="ad-shop">Shop now</button></div>
        </article>
        <p class="ad__note">Fictional ad card for the prototype journey. In real life she taps an Instagram ad and the store opens in the in-app browser.</p>
      </div>
    </div>`,
    notes: [{ target: '#ad-card', text: 'Traffic comes from Meta reels opening in the Instagram in-app browser, mostly on phones (brief 4).' }],
  };
}

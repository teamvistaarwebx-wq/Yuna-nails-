// Homepage (brief 9.7): eight sections, in order, and much shorter than today's ~18 phone screens.
import { layout } from '../components/layout.js';
import { hero, bestsellers, moods, buildYourSet, howToApply, realHands, instagram } from '../components/sections.js';
import { kitTeaser } from '../components/kit.js';
import { rt } from '../lib/runtime.js';

let playing = false;

export function render() {
  rt.videoToggle = () => { playing = !playing; rt.rerender(); };
  return {
    html: layout(`
      ${hero({ playing })}
      ${bestsellers()}
      <section class="sec sec--surface" id="home-kit"><div class="page">${kitTeaser()}</div></section>
      ${moods()}
      ${buildYourSet()}
      ${howToApply()}
      ${realHands()}
      ${instagram()}`),
    notes: [
      { target: '#hero-media', text: '1 · Hero: real hands, poster first, video after; light (brief 12: poster ≤ 200 KB, video ≤ 3 MB).' },
      { target: '#bestsellers .sec__head', text: '2 · Bestsellers: top-reviewed sets from a curated collection until the client\'s list arrives.' },
      { target: '#kit-slot', text: '3 · Nail care kit slot follows the one coming-soon switch.' },
      { target: '#moods .sec__head', text: '4 · Shop by mood: categories to confirm (open item 14).' },
      { target: '#build .sec__head', text: '5 · Build your set: 2 and 3 set offers, from data/offers.js. The 5-set offer is gone.' },
      { target: '#how .stack', text: '6 · How to apply, with the safety notes (brief 5, 9.7).' },
      { target: '#real-hands .sec__head', text: '7 · Real hands (UGC) next to reviews, as Vedant asked (MOM 30 Oct).' },
      { target: '#instagram .sec__head', text: '8 · Instagram. The 10% welcome offer lives inline in the footer, never as a popup.' },
    ],
  };
}

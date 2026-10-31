// Design tokens screen: brand colours, type, spacing, buttons, annotation tags and media slots.
// Flip Wireframe / Styled in the toolbar to see the same components in both modes.
import { confirmTag } from '../components/annotate.js';
import { media } from '../components/media.js';
import { fact } from '../components/facts.js';

const COLOURS = [
  ['--color-burgundy', 'Burgundy', 'Text, primary buttons, logo'],
  ['--color-cream', 'Cream', 'Page background'],
  ['--color-olive-gold', 'Olive gold', 'Prices, small accents, links'],
  ['--color-soft-blue', 'Soft blue', 'Info surfaces. Never text'],
];

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function toRgb(css) {
  const probe = document.createElement('span');
  probe.style.color = css;
  document.body.appendChild(probe);
  const out = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  probe.remove();
  return out;
}
const ratio = (a, b) => { const x = luminance(toRgb(a)); const y = luminance(toRgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

export function render({ root }) {
  const cs = getComputedStyle(document.documentElement);
  const v = (name) => cs.getPropertyValue(name).trim();
  const pairs = [
    ['Burgundy on cream', v('--color-burgundy'), v('--color-cream')],
    ['Olive gold on cream', v('--color-olive-gold'), v('--color-cream')],
    ['Burgundy on soft blue', v('--color-burgundy'), v('--color-soft-blue')],
    ['Cream on burgundy', v('--color-cream'), v('--color-burgundy')],
  ];
  root.innerHTML = `
    <div class="page section stack-lg tokens">
      <header class="stack" id="tk-head">
        <p class="eyebrow">System · brief 3 and 12</p>
        <h1 class="h1">Design <em>tokens</em></h1>
        <p class="muted">Every screen reads these values from <code>src/tokens.css</code>. Wireframe mode swaps the same tokens for greys.</p>
      </header>

      <section class="stack" id="tk-colour">
        <h2 class="h3">Colour</h2>
        <div class="tk-swatches">
          ${COLOURS.map(([t, name, use]) => `<div class="tk-swatch"><span class="tk-chip" style="background:var(${t})"></span><b>${name}</b><span class="tiny muted">${v(t).toUpperCase()}</span><span class="tiny muted">${use}</span></div>`).join('')}
        </div>
        <table class="tk-table"><caption class="visually-hidden">Contrast</caption>
          <thead><tr><th scope="col">Pair</th><th scope="col">Contrast</th><th scope="col">WCAG</th></tr></thead>
          <tbody>${pairs.map(([label, fg, bg]) => { const r = ratio(fg, bg); return `<tr><td><span class="tk-pair" style="color:${fg};background:${bg}">Aa</span> ${label}</td><td>${r.toFixed(2)} : 1</td><td>${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'Fails'}</td></tr>`; }).join('')}</tbody>
        </table>
      </section>

      <section class="stack" id="tk-type">
        <h2 class="h3">Type</h2>
        <p class="h1">Salon nails, <em>at home</em></p>
        <p class="h2">Build your set</p>
        <p class="h3">What's in the box</p>
        <p class="eyebrow">Most loved</p>
        <p class="lead">Hand-painted press-ons, made to order for your size.</p>
        <p>Body text in Urbanist. Calm, warm, specific. <span class="price">Rs 1,499</span></p>
        <p class="tiny muted">Headings: Darel Rolando when the font files arrive ${confirmTag('Darel Rolando font files')}. Until then, a fallback serif.</p>
      </section>

      <section class="stack" id="tk-space">
        <h2 class="h3">Spacing and shape</h2>
        <div class="tk-space">${[1, 2, 3, 4, 6, 8].map((n) => `<span><i style="width:var(--space-${n})"></i>${n * 8}</span>`).join('')}</div>
        <p class="small muted">8 px scale · 8 px radius · 1 px lines · no shadows · tap targets at least 44 px</p>
      </section>

      <section class="stack" id="tk-buttons">
        <h2 class="h3">Buttons</h2>
        <div class="row">
          <a class="btn" href="#">Add to bag</a>
          <a class="btn btn--secondary" href="#">Buy now</a>
          <a class="btn btn--small btn--secondary" href="#">Quick add</a>
          <button type="button" class="btn" aria-disabled="true" data-todo="Inactive until a size is picked">Add to bag</button>
          <button type="button" class="btn is-loading" data-todo="Loading state">Add to bag</button>
        </div>
      </section>

      <section class="stack" id="tk-annot">
        <h2 class="h3">Annotations</h2>
        <p>Open items look like this: apply time is ${fact('applyTime')}.</p>
        <p class="note">Info notes use the soft blue surface, for example the WhatsApp sizing note.</p>
        <div class="tk-media">
          ${media({ label: 'Hand photo', ratio: '4:5', tone: '#E8C9BE' })}
          ${media({ label: 'Three skin tones', ratio: '1:1', tone: '#EBD7CC' })}
          ${media({ label: 'How to apply', ratio: '9:16', video: true, tone: '#D9C3BA' })}
        </div>
      </section>
    </div>
    <style>
      .tokens code { font-size: 13px; background: var(--color-info); padding: 1px 6px; border-radius: 4px; }
      .tk-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-2); }
      .tk-swatch { display: grid; gap: 2px; }
      .tk-chip { height: 72px; border-radius: var(--radius); border: var(--line) solid var(--color-line); margin-bottom: 6px; }
      .tk-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
      .tk-table th, .tk-table td { text-align: left; padding: 8px 4px; border-bottom: var(--line) solid var(--color-line); }
      .tk-table th { font-weight: 500; color: var(--color-muted); font-size: var(--text-xs); }
      .tk-pair { display: inline-flex; width: 32px; height: 24px; align-items: center; justify-content: center; border-radius: 4px; margin-right: 6px; font-weight: 600; }
      .tk-space { display: grid; gap: 6px; }
      .tk-space span { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--color-muted); }
      .tk-space i { display: block; height: 12px; background: var(--color-text); border-radius: 2px; }
      .tk-media { display: grid; grid-template-columns: 1fr 1fr 0.7fr; gap: var(--space-2); align-items: start; }
    </style>`;
  return {
    notes: [
      { target: '#tk-colour', text: 'Four final brand colours from the client (31 Oct). Every other tone is mixed from them, so a brand change is one edit.' },
      { target: '#tk-type', text: 'Darel Rolando for headings once the files and web licence arrive; a calm fallback serif until then.' },
      { target: '#tk-buttons', text: 'Inactive buttons stay tappable, so a shopper who skips the size step gets a polite note instead of nothing.' },
      { target: '#tk-annot', text: 'Yellow TO CONFIRM tags mark open items from brief 15. Nothing is guessed.' },
    ],
  };
}

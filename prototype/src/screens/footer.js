// Footer (brief 9.8) with the inline 10% sign-up (brief 9.7).
import { layout } from '../components/layout.js';

export function render() {
  return {
    html: layout(`<div class="page section"><p class="eyebrow">Footer</p><p class="muted small">The footer below appears on every page.</p></div>`),
    scrollTo: 0,
    after: () => { const f = document.getElementById('site-footer'); if (f) f.scrollIntoView(); },
    notes: [
      { target: '#signup', text: 'The 10% welcome offer is an inline sign-up here, never a popup on load (audit: a popup covered the page).' },
      { target: '#site-footer nav', text: 'Shop, help and policies. Instagram, YouTube and WhatsApp links. Payment icons (brief 9.8).' },
    ],
  };
}

// Header and menu (brief 9.8). States: default / menu open / search open with predictive results.
import { layout } from '../components/layout.js';
import { hero } from '../components/sections.js';
import { rt, ui } from '../lib/runtime.js';

export function render({ state, fresh }) {
  if (fresh) {
    ui.menu = state === 'menu';
    ui.search = state === 'search';
    ui.query = state === 'search' ? 'Rou' : '';
  }
  return {
    html: layout(hero(), { logoTag: true }),
    notes: [
      { target: '#announce', text: 'One quiet announcement line, from settings. No stacked sale banners (brief 3, 9.8).' },
      { target: '.logo', text: 'YN monogram, logo variant 1 or 3 only (open item 9: which files).' },
      { target: '#bag-btn', text: 'Bag opens the drawer; the count updates as she adds sets.' },
      ...(ui.menu ? [{ target: '#menu', text: 'Menu: shop all, collections, nail care kit, custom orders, size guide, our story, help (brief 9.8).' }] : []),
      ...(ui.search ? [{ target: '#search', text: 'Predictive search, product-first, with hand thumbnails (brief 9.8). Try typing a name.' }] : []),
    ],
  };
}

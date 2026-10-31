// Page layout shared by every store screen: announcement, header (menu + predictive search), footer and overlays.
// Each part is a function so it maps one-to-one to a Shopify section later.
import { ui, esc } from '../lib/runtime.js';
import { summary } from '../lib/cart.js';
import { settings } from '../../data/settings.js';
import { offers } from '../../data/offers.js';
import { products } from '../../data/products.js';
import { media } from './media.js';
import { confirmTag } from './annotate.js';
import { rupees } from './facts.js';
import { icon } from './icons.js';
import { cartDrawer } from './cartDrawer.js';
import { sizeSheet } from './sizeSheet.js';

export const MENU = [
  ['Shop all', '#/collection'],
  ['Collections', '#/collection'],
  ['Nail care kit', '#/kit'],
  ['Custom orders', '#/contact'],
  ['Size guide', '#/size-guide'],
  ['Our story', '#/about'],
  ['Help', '#/faq'],
];

export function announcement() {
  return `<div class="announce" id="announce">${esc(settings.announcement)}</div>`;
}

export function header({ logoTag = false } = {}) {
  const count = summary().count;
  return `<header class="header" id="site-header">
    <div class="page header__inner">
      <div class="header__left">
        <button type="button" class="icon-btn header__menu" data-action="open-menu" aria-label="Menu" aria-haspopup="dialog">${icon('menu')}</button>
        <a class="logo" href="#/home" aria-label="Yuna Nails home"><span class="logo__mark">YN</span><span class="logo__word">Yuna</span></a>
        ${logoTag ? confirmTag('logo variant 1 or 3') : ''}
      </div>
      <nav class="header__nav" aria-label="Main"><ul>${MENU.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav>
      <div class="header__right">
        <button type="button" class="icon-btn" data-action="open-search" aria-label="Search" aria-haspopup="dialog">${icon('search')}</button>
        <button type="button" class="icon-btn" data-action="open-drawer" aria-label="Bag, ${count} items" id="bag-btn">${icon('bag')}${count ? `<span class="count">${count}</span>` : ''}</button>
      </div>
    </div>
  </header>`;
}

function menuDrawer() {
  if (!ui.menu) return '';
  return `<div class="overlay" data-overlay="menu">
    <div class="scrim" data-action="close-menu"></div>
    <nav class="drawer drawer--left" role="dialog" aria-modal="true" aria-label="Menu" id="menu">
      <header class="overlay__head"><span class="overlay__title">Menu</span><button type="button" class="icon-btn" data-action="close-menu" aria-label="Close menu">${icon('close')}</button></header>
      <div class="overlay__body">
        <ul class="menu-list">${MENU.map(([t, h]) => `<li><a href="${h}" data-action="close-menu-go">${t}<span aria-hidden="true">${icon('arrow')}</span></a></li>`).join('')}</ul>
        <div class="menu-foot">
          <button type="button" class="btn btn--secondary btn--full" data-todo="Opens WhatsApp (number to confirm)">${icon('whatsapp')} Help on WhatsApp</button>
          <a href="#/track" data-action="close-menu-go">Track order</a>
        </div>
      </div>
    </nav>
  </div>`;
}

export function searchResults(q) {
  const found = q ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : [];
  if (!q) return `<p class="muted small">Popular: ${products.map((p) => `<button type="button" class="link" data-action="search-fill" data-q="${p.name}">${p.name}</button>`).join(' · ')}</p>`;
  if (!found.length) return `<p class="muted">No designs found for “${esc(q)}”. Try a colour or a name.</p>`;
  return `<ul class="results" id="search-results">${found.map((p) => `<li><a href="#/product?handle=${p.handle}" data-action="close-search-go">
      <span class="results__media">${media({ label: 'Hand', ratio: '4:5', tone: p.tone, tag: false })}</span>
      <span>${p.name}</span><span class="price">${rupees(p.price)}</span></a></li>`).join('')}</ul>`;
}

function searchPanel() {
  if (!ui.search) return '';
  return `<div class="overlay" data-overlay="search">
    <div class="scrim" data-action="close-search"></div>
    <div class="search" role="dialog" aria-modal="true" aria-label="Search" id="search">
      <div class="search__bar page">
        ${icon('search')}
        <label class="visually-hidden" for="q">Search designs</label>
        <input class="search__input" id="q" type="search" placeholder="Search designs" value="${esc(ui.query)}" data-input="search" autocomplete="off">
        <button type="button" class="icon-btn" data-action="close-search" aria-label="Close search">${icon('close')}</button>
      </div>
      <div class="page search__body" id="search-body">${searchResults(ui.query)}</div>
    </div>
  </div>`;
}

export function footer() {
  return `<footer class="footer" id="site-footer">
    <div class="page footer__grid">
      <div class="footer__signup" id="signup">
        <p class="footer__title">Join the Yuna list</p>
        <p class="small">New designs first, and ${offers.welcomeOffer.value}.</p>
        <form class="inline-form" data-submit="signup" novalidate>
          <label class="visually-hidden" for="footer-email">Email address</label>
          <input class="input" id="footer-email" type="email" placeholder="Email address" autocomplete="email" required>
          <button class="btn btn--light" type="submit">Sign up</button>
        </form>
        <div class="footer__social">
          <a class="icon-btn" href="#" data-todo="Opens Instagram" aria-label="Instagram">${icon('instagram')}</a>
          <a class="icon-btn" href="#" data-todo="Opens YouTube" aria-label="YouTube">${icon('youtube')}</a>
          <a class="icon-btn" href="#" data-todo="Opens WhatsApp (number to confirm)" aria-label="WhatsApp">${icon('whatsapp')}</a>
        </div>
      </div>
      <nav aria-label="Shop"><p class="footer__title">Shop</p><ul>
        <li><a href="#/collection">Shop all</a></li><li><a href="#/collection">Bestsellers</a></li><li><a href="#/kit">Nail care kit</a></li><li><a href="#/contact">Custom orders</a></li></ul></nav>
      <nav aria-label="Help"><p class="footer__title">Help</p><ul>
        <li><a href="#/size-guide">Size guide</a></li><li><a href="#/faq">FAQ</a></li><li><a href="#/track">Track order</a></li><li><a href="#/contact">Contact</a></li></ul></nav>
      <nav aria-label="Policies"><p class="footer__title">Policies</p><ul>
        <li><a href="#" data-todo="Shipping policy page (Shopify policy)">Shipping</a></li><li><a href="#" data-todo="Refund and exchange policy (Shopify policy)">Exchanges</a></li><li><a href="#" data-todo="Privacy policy (Shopify policy)">Privacy</a></li><li><a href="#" data-todo="Terms (Shopify policy)">Terms</a></li></ul></nav>
    </div>
    <div class="page footer__bottom">
      <p>© 2026 Yuna Nails. Hand-painted in India.</p>
      <ul class="pay" aria-label="Payment methods"><li>UPI</li><li>COD</li><li>${confirmTag('other payment icons')}</li></ul>
    </div>
  </footer>`;
}

// Optional floating WhatsApp button: sits above the sticky bar, never over it (brief 9.2).
const waFloat = (show) => (show ? `<button type="button" class="wa-float" data-todo="Opens WhatsApp (number to confirm)" aria-label="Chat on WhatsApp">${icon('whatsapp')}</button>` : '');

export function layout(content, { sticky = '', wa = false, logoTag = false, bare = false } = {}) {
  return `${bare ? '' : announcement() + header({ logoTag })}
    <main id="main">${content}</main>
    ${bare ? '' : footer()}
    ${sticky}${waFloat(wa)}
    ${menuDrawer()}${searchPanel()}${sizeSheet()}${cartDrawer()}`;
}

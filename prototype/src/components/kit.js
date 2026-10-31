// Nail care kit teaser: coming soon (inline notify form, no popup) or launched. One switch: ui.kitComingSoon,
// which starts from data/settings.js and changes the kit page, the homepage slot and the cart add-on together.
import { ui } from '../lib/runtime.js';
import { settings } from '../../data/settings.js';
import { media } from './media.js';
import { confirmTag } from './annotate.js';
import { rupees } from './facts.js';

export function notifyForm(id) {
  return `<form class="notify" data-submit="notify" id="${id}" novalidate>
    <label class="visually-hidden" for="${id}-email">Email address</label>
    <div class="inline-form"><input class="input" id="${id}-email" type="email" placeholder="Email address" autocomplete="email" required><button class="btn" type="submit">Notify me</button></div>
    <p class="tiny muted">One email when it launches. Nothing else unless you ask.</p>
  </form>`;
}

export function kitTeaser() {
  const soon = ui.kitComingSoon;
  return `<div class="kit" id="kit-slot">
    <a href="#/kit" class="kit__media">${media({ label: 'Nail care kit', ratio: '4:5', tone: '#E7D6C9' })}</a>
    <div class="stack">
      ${soon ? '<p class="kit__status">Coming soon</p>' : ''}
      <h2 class="h2">${settings.kit.name}</h2>
      <p class="lead">${settings.kit.promise}</p>
      ${soon ? `<p class="small">${confirmTag(settings.kit.priceHint.confirm)}</p>${notifyForm('kit-notify-home')}`
        : `<p class="price">${rupees(settings.kit.samplePrice)} ${confirmTag('kit price')}</p><a class="btn" href="#/kit?state=launched">Shop the kit</a>`}
    </div>
  </div>`;
}

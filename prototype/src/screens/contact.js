// Contact (brief 9.9): WhatsApp first, then email.
import { layout } from '../components/layout.js';
import { confirmTag } from '../components/annotate.js';
import { icon } from '../components/icons.js';
import { settings } from '../../data/settings.js';

export function render() {
  return {
    html: layout(`<div class="page narrow" style="padding-bottom:64px">
      <div class="page-head"><h1 class="h1">We're here to <em>help</em></h1><p class="lead muted">WhatsApp is the quickest way to reach us. Custom orders too.</p></div>
      <div class="stack" id="contact-ways">
        <button type="button" class="btn btn--full" data-todo="Opens WhatsApp (number to confirm)">${icon('whatsapp')} Chat on WhatsApp</button>
        <p class="tiny">${confirmTag(settings.whatsapp.confirm)}</p>
        <button type="button" class="btn btn--secondary btn--full" data-todo="Opens email (address to confirm)">${icon('mail')} Email us</button>
        <p class="tiny">${confirmTag('support email address')}</p>
      </div>
      <h2 class="h3" style="margin:40px 0 16px">Or write to us</h2>
      <form class="stack" data-submit="contact" novalidate>
        <div class="field"><label for="c-name">Name</label><input class="input" id="c-name" autocomplete="name"></div>
        <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" type="email" autocomplete="email"></div>
        <div class="field"><label for="c-msg">Message</label><textarea class="input" id="c-msg"></textarea></div>
        <button class="btn" type="submit" style="justify-self:start">Send</button>
      </form>
    </div>`),
    notes: [{ target: '#contact-ways', text: 'WhatsApp first: it is the only support channel today (MOM 30 Oct).' }],
  };
}

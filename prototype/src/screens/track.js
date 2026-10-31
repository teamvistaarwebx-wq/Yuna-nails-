// Track order (brief 9.9).
import { layout } from '../components/layout.js';
import { fact } from '../components/facts.js';

export function render() {
  return {
    html: layout(`<div class="page narrow" style="padding-bottom:64px">
      <div class="page-head"><h1 class="h1">Track your <em>order</em></h1><p class="lead muted">Each set is made to order and dispatched in ${fact('dispatch')}. You'll get tracking details by SMS and email.</p></div>
      <form class="stack" data-submit="track" id="track-form" novalidate>
        <div class="field"><label for="t-order">Order number</label><input class="input" id="t-order" placeholder="#1001"></div>
        <div class="field"><label for="t-phone">Phone or email</label><input class="input" id="t-phone" autocomplete="email"></div>
        <button class="btn btn--full" type="submit">Track my order</button>
      </form>
      <p class="section small">A question about your order? <button type="button" class="link" data-todo="Opens WhatsApp (number to confirm)">Ask us on WhatsApp</button></p>
    </div>`),
    notes: [{ target: '#track-form', text: 'Hands off to the existing tracking app; we keep the app (brief 2).' }],
  };
}

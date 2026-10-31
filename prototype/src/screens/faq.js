// FAQ (brief 9.9): the single source for business facts. Every answer reads data/facts.js.
import { layout } from '../components/layout.js';
import { fact, sizes } from '../components/facts.js';
import { safetyNotes, facts } from '../../data/facts.js';

const Q = (q, a) => `<details class="acc"><summary>${q}</summary><div class="acc__body"><p>${a}</p></div></details>`;

export function render() {
  return {
    html: layout(`<div class="page narrow" style="padding-bottom:64px">
      <div class="page-head"><h1 class="h1">Questions</h1></div>
      <section id="faq-orders"><h2 class="h3" style="margin:24px 0 8px">Orders and delivery</h2>
        ${Q('When will my order ship?', `Every set is hand-painted to order and dispatched in ${fact('dispatch')}.`)}
        ${Q('Do you offer cash on delivery?', `Yes. We take ${facts.payment.value}. COD has a fee of ${fact('codFee')}.`)}
        ${Q('Is delivery free?', fact('freeShipping'))}</section>
      <section><h2 class="h3" style="margin:24px 0 8px">Size and fit</h2>
        ${Q('Which sizes do you make?', `${sizes().join(', ')}. Every size is always available.`)}
        ${Q('I\'m between two sizes. Which should I pick?', fact('betweenSizes'))}
        ${Q('What does Size me later mean?', `After your order, we message you on WhatsApp. Send a photo of your hand next to a coin or card, and we confirm your size within ${fact('sizeConfirmHours')} hours. Your order waits until then.`)}
        ${Q('What if a size doesn\'t fit?', `Exchange it free within ${fact('exchange')}.`)}</section>
      <section><h2 class="h3" style="margin:24px 0 8px">Wearing them</h2>
        ${Q('How long does it take to apply?', `About ${fact('applyTime')}.`)}
        ${Q('Can I reuse them?', `Yes, for ${fact('wearCount')}. Cost per wear: ${fact('costPerWear')}.`)}
        ${Q('What\'s in the box?', `${fact('nailsPerSet')} hand-painted nails and nail glue. Adhesive tabs: ${fact('adhesiveTabs')}.`)}
        ${Q('Is it safe?', safetyNotes.join(' '))}</section>
      <p class="section">Still have a question? <a href="#/contact">Ask us on WhatsApp</a>.</p>
    </div>`),
    notes: [{ target: '#faq-orders', text: 'Every number here comes from data/facts.js, so the FAQ can never disagree with the product page (audit: apply time and cost per wear conflicted).' }],
  };
}

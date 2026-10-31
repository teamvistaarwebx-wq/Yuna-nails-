// Offer values: the single source for the bundle selector, cart nudges, savings and the gift bar.
// The final setup is due before Day 3 (brief 5, open item 5). Every value marked toConfirm is a WORKING
// SAMPLE so the prototype can calculate; it shows a yellow TO CONFIRM tag wherever it appears.

export const offers = {
  savingsDisplay: { value: 'rupees', toConfirm: 'rupees or percent (open item 4)' }, // 'rupees' | 'percent' | 'both'

  tiers: [
    { qty: 1, label: '1 set' },
    { qty: 2, label: '2 sets', benefit: 'Free nail glue remover', toConfirm: 'final 2-set offer (open item 5)' },
    { qty: 3, label: '3 sets', savingRupees: 300, toConfirm: '3-set rupee saving, sample Rs 300 (open item 5)' },
  ],

  nudges: {
    oneSet: 'Add one more set, get a free nail glue remover.',
    twoSets: 'Add a 3rd set and save Rs {saving}.',
  },

  gifts: {
    toConfirm: 'gift thresholds and gifts, samples shown (open item 5)',
    steps: [
      { threshold: 2500, gift: 'a free gift' },
      { threshold: 3500, gift: 'a second free gift' },
    ],
  },

  welcomeOffer: { value: '10% off your first order', source: 'Brief 9.7: inline in the footer, never a popup' },
  removed: ['5 sets, 25% off (removed by client, 31 Oct)'],
};

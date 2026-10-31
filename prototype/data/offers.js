// Offer values: the single source for the bundle selector, cart nudges, savings and the gift bar.
// The final setup is due before Day 3 (brief 5, open item 5). Every value marked toConfirm is a WORKING
// SAMPLE so the prototype can calculate; it shows a yellow TO CONFIRM tag wherever it appears.

export const offers = {
  savingsDisplay: { value: 'rupees', toConfirm: 'rupees or percent' }, // 'rupees' | 'percent' | 'both'

  tiers: [
    { qty: 1, label: '1 set' },
    { qty: 2, label: '2 sets', benefit: 'Free nail glue remover', toConfirm: '2-set offer' },
    { qty: 3, label: '3 sets', savingRupees: 300, toConfirm: '3-set saving (sample)' },
  ],

  nudges: {
    oneSet: 'Add one more set, get a free nail glue remover.',
    twoSets: 'Add a 3rd set and save Rs {saving}.',
  },

  gifts: {
    toConfirm: 'gift thresholds (samples)',
    steps: [
      { threshold: 2500, gift: 'a free gift' },
      { threshold: 3500, gift: 'a second free gift' },
    ],
  },

  welcomeOffer: { value: '10% off your first order', source: 'Brief 9.7: inline in the footer, never a popup' },
  removed: ['5 sets, 25% off (removed by client, 31 Oct)'],
};

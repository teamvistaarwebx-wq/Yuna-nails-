// Business facts: the single source. Every screen reads from here.
// A fact with `confirm` and no `value` is an open item (brief section 15) and renders as a yellow TO CONFIRM tag.
// `source` says where a confirmed value comes from.

export const facts = {
  nailsPerSet: { value: '10', source: 'Brief 5: 10 nails per set' },
  sizes: { value: ['XS', 'S', 'M', 'L'], source: 'Brief 5: XS–L, always available' },
  dispatch: { value: '24–48 hours', source: 'Brief 5' },
  codFee: { value: 99, source: 'Brief 5: COD fee Rs 99' },
  payment: { value: 'COD and UPI', source: 'Brief 5' },
  exchange: { value: '48 hours', source: 'Brief 6: free size exchange within 48 hours' },
  sizeConfirmHours: { value: '24', source: 'Brief 10: sizes confirmed within 24 h' },
  priceRange: { value: [999, 2499], source: 'Brief 5: Rs 999 to Rs 2,499 a set' },
  glueIncluded: { value: true, source: 'Brief 5: nail glue in every set' },

  applyTime: { confirm: 'apply time: 5 minutes or about 2?', item: 2 },
  costPerWear: { confirm: 'cost per wear', item: 3 },
  wearCount: { confirm: 'number of wears', item: 3 },
  betweenSizes: { confirm: 'between two sizes: larger or smaller?', item: 1 },
  adhesiveTabs: { confirm: 'adhesive tabs in the box?', item: 6 },
  freeShipping: { confirm: 'free shipping above Rs 999, or free on prepaid?', item: 11 },
};

export const safetyNotes = [
  "Don't apply on broken or infected nails.",
  'Keep nail glue away from eyes and skin.',
  'Remove by soaking in warm soapy water. Never pull them off.',
];

// Size chart in mm. The current site has one; the values have not been copied yet.
export const sizeChart = { confirm: 'size chart mm values (copy from current site)', item: 'size chart' };

export const trustLine = ['Hand-painted', 'Made to order', 'Dispatch in 24–48 hours', 'COD available'];

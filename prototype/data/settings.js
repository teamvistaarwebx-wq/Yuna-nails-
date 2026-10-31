// Prototype switches. One value each, read everywhere.

export const settings = {
  // Nail care kit: true = "coming soon" everywhere (kit page, homepage slot, cart add-on). false = launched.
  kitComingSoon: true,
  kit: {
    name: 'Nail care kit',
    promise: 'Everything for salon-neat nails at home.',
    price: null, // expected around Rs 3,299; shown only if approved
    samplePrice: 3299, // used only to let the launched state add to the bag; tagged TO CONFIRM wherever shown
    priceHint: { confirm: 'show "around Rs 3,299"?' },
    contents: { confirm: 'kit contents' },
  },

  // Nail glue remover: hidden until the product exists (open item 7). The prototype shows it so the flow can be reviewed.
  remover: { exists: false, name: 'Nail glue remover', price: null, confirm: 'remover SKU and price' },

  whatsapp: { number: null, confirm: 'WhatsApp number' },
  announcement: 'Hand-painted and made to order. Dispatch in 24–48 hours.',
};

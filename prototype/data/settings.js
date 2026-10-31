// Prototype switches. One value each, read everywhere.

export const settings = {
  // Nail care kit: true = "coming soon" everywhere (kit page, homepage slot, cart add-on). false = launched.
  kitComingSoon: true,
  kit: {
    name: 'Nail care kit',
    promise: 'Everything for salon-neat nails at home.',
    price: null, // expected around Rs 3,299; shown only if approved
    priceHint: { confirm: 'show "around Rs 3,299"? (open item 8)' },
    contents: { confirm: 'kit contents (open item 8)' },
  },

  // Nail glue remover: hidden until the product exists (open item 7). The prototype shows it so the flow can be reviewed.
  remover: { exists: false, name: 'Nail glue remover', price: null, confirm: 'remover SKU, price and launch (open item 7)' },

  whatsapp: { number: null, confirm: 'WhatsApp number (copy from current site)' },
  announcement: 'Hand-painted and made to order. Dispatch in 24–48 hours.',
};

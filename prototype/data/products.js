// Products. Names and prices are from yunanails.in as given in the brief notes (31 Oct).
// Photos could not be pulled (the store is not reachable from this workspace), so every image is a
// labelled placeholder until the current photos, then the new shoot, arrive.

export const products = [
  { handle: 'rouge-noir', name: 'Rouge Noir', price: 1499, tone: '#5A1A22' },
  { handle: 'peach-whisper', name: 'Peach Whisper', price: 999, tone: '#F0C7B4' },
  { handle: 'celestial-muse', name: 'Celestial Muse', price: 2499, tone: '#C9C3D9' },
];

// Shape and length per design are not known yet.
export const productMetaConfirm = 'shape · length';
// More designs: the full list needs the store export or network access.
export const moreProductsConfirm = 'rest of the catalogue';

// Moods for "Shop by mood" are not decided (open item 14).
export const moodsConfirm = 'mood categories';
export const productByHandle = (h) => products.find((p) => p.handle === h);
export const cheapestPrice = () => Math.min(...products.map((p) => p.price));

# Open items in the prototype

Every yellow **TO CONFIRM** tag, what it's waiting on, and where it appears. Item numbers refer to section 15 of the brief. When an answer arrives, change the one data file listed and every screen follows.

## Business decisions

| Tag text | Brief 15 item | Set in | Appears on |
| --- | --- | --- | --- |
| larger or smaller? | 1. Between two sizes | `data/facts.js` → `betweenSizes` | Size sheet, size chart on product page, size guide, FAQ |
| apply time, 5 or 2 min | 2. Application time | `data/facts.js` → `applyTime` | Product page (How to apply), homepage (How to apply), FAQ, design tokens |
| cost per wear | 3. Cost per wear | `data/facts.js` → `costPerWear` | Product page (How long do they last?), FAQ |
| number of wears | 3. Wear count | `data/facts.js` → `wearCount` | Product page, FAQ |
| rupees or percent | 4. Savings display | `data/offers.js` → `savingsDisplay` | Product page bundle selector |
| 2-set offer | 5. Final bundle setup | `data/offers.js` → `tiers[1]` | Product page bundle selector, homepage and landing offer cards, bag (free remover line, 1-set nudge) |
| 3-set saving (sample) | 5. Final bundle setup | `data/offers.js` → `tiers[2]` (sample Rs 300) | Product page bundle selector, offer cards, bag (2-set nudge, "You save") |
| gift thresholds (samples) | 5. Gift thresholds and gifts | `data/offers.js` → `gifts` (samples Rs 2,500 and Rs 3,500) | Bag gift progress bar |
| set + kit bundle price | 5. Set + kit bundle | `src/screens/kit.js` | Kit page, launched state |
| tabs in the box? | 6. Adhesive tabs | `data/facts.js` → `adhesiveTabs` | Product page (What's in the box), FAQ |
| remover SKU and price | 7. Nail glue remover | `data/settings.js` → `remover` | Product page add-on, bag add-on (when shown) |
| kit price | 8. Kit price (expected ~Rs 3,299; sample used to let the launched state add to bag) | `data/settings.js` → `kit.samplePrice` | Kit page launched, homepage kit slot launched, bag kit line and add-on |
| show "around Rs 3,299"? | 8. Kit price hint while coming soon | `data/settings.js` → `kit.priceHint` | Kit page and homepage kit slot, coming soon |
| kit contents | 8. Kit contents | `data/settings.js` → `kit.contents` | Kit page |
| logo variant 1 or 3 | 9. Logo files | `src/components/layout.js` | Header screen (the header shows a "YN · YUNA" stand-in everywhere) |
| Darel Rolando font files | 10. Heading font and licence | `src/tokens.css` | Design tokens screen. Headings use a fallback serif everywhere until then |
| free-shipping rule | 11. Free-shipping rule | `data/facts.js` → `freeShipping` | Bag (Delivery line), FAQ |
| bestseller list | 12. Bestsellers | `src/components/sections.js` | Homepage bestsellers |
| AR try-on placement | 13. Try-on placement | `src/screens/product.js` | Product page (try-on stays in its current spot) |
| mood categories | 14. Shop-by-mood | `data/products.js` → `moodsConfirm` | Homepage and landing page moods (shown as "Mood 1…4") |
| GoKwik go-live date; Size me later flag reaches the order | 16. GoKwik | `src/screens/checkout.js` | Checkout placeholder |
| Placeholder photo / Placeholder video tags | 17. Shoot dates and who shoots | `src/components/media.js` | Every photo and video slot |

## Content to copy from the current site

These need the store (yunanails.in is not reachable from the Vistaar workspace) or a product export.

| Tag text | Set in | Appears on |
| --- | --- | --- |
| mm values from current chart | `src/components/sizes.js` | Size chart: size sheet, product page, size guide |
| shape · length | `data/products.js` → `productMetaConfirm` | Every product card, product page |
| rest of the catalogue | `data/products.js` → `moreProductsConfirm` | Homepage bestsellers, collection (only Rouge Noir, Peach Whisper and Celestial Muse are in so far) |
| WhatsApp number | `data/settings.js` → `whatsapp` | Contact. Every WhatsApp button shows a toast until the number is set |
| support email address | `src/screens/contact.js` | Contact |
| Sanprita's founder note | `src/screens/about.js` | About |
| Instagram handle | `src/components/sections.js` | Homepage Instagram section |
| other payment icons | `src/components/layout.js` | Footer (UPI and COD are confirmed) |
| paste one real Judge.me review | `src/components/tiles.js` | Homepage real hands, landing proof |
| real reviews load from Judge.me on the store | `src/screens/product.js` | Product page reviews |

## Sample values in use

So the bag can calculate, the prototype uses these sample values. Each one is tagged wherever it shows; none is a client decision.

- **3-set saving:** Rs 300 (`data/offers.js`).
- **Gift thresholds:** Rs 2,500 for "a free gift" and Rs 3,500 for "a second free gift" (`data/offers.js`).
- **Kit price:** Rs 3,299, from the brief's "expected around Rs 3,299" (`data/settings.js`).

## Removed, per the client

- 5 sets, 25% off (client answers, 31 Oct). Not shown anywhere.

# Screen list

Every screen and state in the prototype, with its brief section. Open any of them directly with `/#/<screen>?state=<state>`.

| # | Screen | URL | Brief | States |
| --- | --- | --- | --- | --- |
| 0 | Instagram ad (fictional) | `#/ad` | 4 | Ad |
| 1 | Ad landing page | `#/landing` | 9.1 | `poster` video poster · `playing` video playing |
| 2 | Product page | `#/product` | 9.2 | `no-size` no size chosen (buttons inactive) · `error` tapped add without a size · `size` size chosen · `size-later` Size me later (WhatsApp note) · `two-sets` 2 sets (Buy now hidden) · `three-sets` 3 sets · `addon` glue remover add-on on |
| 3 | Nail care kit page | `#/kit` | 9.3 | `coming-soon` inline notify-me form · `launched` |
| 4 | Collection with quick add | `#/collection` | 9.4 | `grid` · `sheet` quick-add size sheet open · `added` item added (confirmation, then the bag opens) |
| 5 | Cart drawer | `#/cart` | 9.5 | `empty` · `one` 1 set (nudge: free remover with 2) · `two` 2 sets (nudge: save on 3rd) · `three` 3 sets · `gift` gift threshold reached · `kit-soon` kit add-on coming soon · `kit-live` kit add-on available · `size-later` a line with "Size to confirm on WhatsApp" |
| 6 | Checkout placeholder | `#/checkout` | 11 | "GoKwik checkout opens here (outside our scope)" |
| 7 | Homepage | `#/home` | 9.7 | Eight sections: hero, bestsellers, kit coming soon, shop by mood, build your set, how to apply, real hands (UGC) next to reviews, Instagram |
| 8 | Header and menu | `#/header` | 9.8 | `default` · `menu` menu open · `search` search open with predictive results |
| 9 | Footer | `#/footer` | 9.8, 9.7 | With the inline 10% sign-up |
| 10 | Size sheet | `#/size-sheet` | 9.6 | Bottom sheet over the product page: sizes, Size me later, chart, between sizes |
| 11 | Size guide | `#/size-guide` | 9.6 | How to measure, chart, WhatsApp custom sizing steps, free exchange |
| 12 | About | `#/about` | 9.9 | Founder note, hand-painted, made to order |
| 13 | FAQ | `#/faq` | 9.9 | Every answer reads `data/facts.js` |
| 14 | Contact | `#/contact` | 9.9 | WhatsApp first, then email, then a form |
| 15 | Track order | `#/track` | 9.9 | Order number and phone or email |
| 16 | 404 | `#/404` | 9.9 | A way back to the bestsellers |
| 17 | Empty cart page | `#/empty-cart` | 9.9 | Bestsellers and the kit teaser |
| — | Design tokens | `#/tokens` | 3, 12 | Colours with live contrast, type, spacing, buttons, annotations |

## Interactions that work

- **Product page:**
  - Size chips, Size me later and the polite error.
  - The 1/2/3 set selector: Buy now hides for 2 or 3 sets.
  - The glue remover toggle and the "Size chart" sheet.
  - Add to bag opens the bag; Buy now goes to the checkout placeholder.
  - The sticky bar on phones reads "Choose your size" until a size is picked.
- **Collection:** Quick add opens the size sheet. Pick a size or Size me later, then Add to bag: an "Added" confirmation shows, then the bag slides in.
- **Bag:**
  - Quantity changes and remove update the totals.
  - The gift bar, "You save" line and the free remover line update with the number of sets.
  - The nudge copy changes with the number of sets.
  - The kit add-on follows the kit switch.
  - The checkout button opens the GoKwik placeholder.
- **Header:** the menu drawer, and predictive search with hand thumbnails (try "Rou").
- **Forms:** the kit notify-me, footer sign-up and contact forms confirm inline. Nothing is sent.
- **Video:** the landing and home heroes switch between poster and playing.

## Main journey

Start from "Start the journey" on the screen map:

1. Instagram ad: tap **Shop now**.
2. Landing page: tap **Shop the sets**.
3. Product page: pick a size.
4. Tap **Add to bag**.
5. The cart drawer opens: tap **Checkout**.
6. The GoKwik placeholder opens.

`scripts/journey-test.mjs` clicks through this, plus quick add and the kit switch: 24 checks, all passing on 31 Oct 2026.

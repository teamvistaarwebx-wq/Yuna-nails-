# Build report: phases 1–4

Date: 31 Oct 2026. The client asked us to go ahead without stopping at the gates. Store access is still blocked (see `phase0-audit.md`), so this is built and checked locally, not on the store yet.

## What was built

A new, lean Online Store 2.0 theme in `theme/`, made only of editable sections and blocks.

The current live theme was not pulled (no access). It is not modified, and nothing has been published or pushed. When access arrives, the live theme is pulled into `live-theme/` for the audit and for moving app settings across.

**Why a new theme rather than patching the old one:** the brief's budget (LCP ≤ 2.5 s in the Instagram in-app browser) and the old site's ~297 requests make a clean base the faster route. The theme's own code is 6.3 KB CSS + 5.6 KB JS (gzipped) + 36 KB fonts. There's no framework, and no app code is loaded by the theme itself.

| Priority | Page | Template | Status |
| --- | --- | --- | --- |
| 1 | Ad landing (hook, choose, proof) | `page.landing.json` | Built |
| 1 | Product page | `product.json` | Built |
| 1 | Nail care kit (coming soon / launched) | `product.kit.json` | Built, one switch |
| 1 | Collection with quick add | `collection.json` | Built |
| 1 | Cart drawer | `sections/cart-drawer.liquid` | Built |
| 2 | Homepage, 8 sections | `index.json` | Built |
| 2 | Header, menu, search, footer | header and footer groups, `predictive-search` | Built |
| 2 | Size sheet, size guide | `size-sheet` snippet, `page.size-guide.json` | Built |
| 3 | About, FAQ, Contact, Track order, 404, empty cart | `page.about/faq/contact/track-order.json`, `404.json`, cart | Built |
| — | Component preview (Phase 2) | `page.components.json` | Built |
| — | Search, collections list, blog, article, password, gift card, customer accounts | standard templates | Built (simple) |

## How the brief's rules are met

- **No size pre-selected.** XS–L start empty, with "Not sure? Size me later" beside them. Add to bag and Buy now look inactive until a choice is made; tapping anyway shows "Please choose your size, or pick Size me later." at the size step.
- **Size me later.**
  - The cart line gets the property `Size: To confirm on WhatsApp` (wording set in Theme settings > Sizing). The bag shows "Size to confirm on WhatsApp".
  - If a product has a "Size me later" variant, that variant is used; otherwise the first size is added with the property.
  - Buy now for one set passes the same flag as a checkout attribute.
- **Bundle selector above Add to bag.** It offers 1, 2 and 3 sets; labels, benefits and savings all come from settings. There is no 5-set offer anywhere.
- **Buy now.** One set goes straight to checkout with only that set (cart link), or, by setting, add-then-checkout. With 2 or 3 sets, Buy now is hidden, or by setting routed through the bag.
- **Cart drawer.**
  - Gift progress bar, then lines, then the bundle nudge ("Add one more set, get a free nail glue remover." / "Add a 3rd set and save [saving].").
  - Add-ons: kit (coming soon) and glue remover (once set).
  - "You save" line from the real discounts, delivery and COD lines from settings, and one checkout button with nothing over it.
- **Kit.** One switch (Theme settings > Products) changes the kit page, the homepage kit slot and the bag add-on together. While it's coming soon: hero, promise and an inline notify form (customers tagged `kit-notify`). The price stays hidden unless a price hint is set.
- **Facts in one place.** See `phase2-components.md`. Every open item shows as a visible `[[TO CONFIRM]]` mark until filled.
- **No popups.** The 10% welcome offer is an inline footer sign-up. There's no beta camera size finder, no stickers or stacked badges, and at most one offer line per card (empty by default).
- **Video.**
  - The poster image loads first and is the LCP element.
  - Videos start only after the page has loaded, only when on screen, never with Save-Data or reduced-motion, and always muted with a poster.
- **Floating WhatsApp.** The theme's own button is off by default. When on, it moves above the sticky add-to-bag bar, so it never covers it.
- **Accessibility.**
  - Tap targets are 44 px or more, with visible focus rings.
  - Inputs are labelled, and images and videos have alt text.
  - Dialogs use native `<dialog>` (focus trap, Escape), and reduced motion is respected.
  - Colour contrast passes AAA (see `phase2-components.md`).

## Local check

- **Linting:** `shopify theme check` reports 97 files, no offences.
- **Preview:** `npm run preview` renders the real theme Liquid with sample data and a working in-memory cart (`scripts/preview/`).
- **Screenshots:** `preview/screens/`, at 375 px (`-m`) and 1440 px (`-d`), for every page and these flows:
  - `flow-1-no-size`: Add to bag tapped without a size shows the polite note.
  - `flow-2-size-later-2-sets`: Size me later picked, with the WhatsApp note and 2 sets.
  - `flow-3-drawer`: bag with the gift bar, flagged line, 3rd-set nudge and kit add-on.
  - `flow-4-quick-add`, `flow-5-drawer-3-sets`: quick add from the grid with the size sheet.
  - `flow-6-sticky-bar`: phone sticky bar, which never sits under a floating button.
- **Console:** no JavaScript errors in either viewport. The only error logged is the intended 404 test.

### Speed (local, indicative only)

Lighthouse 13.6 mobile profile (simulated slow 4G, 4× CPU), 1 run each, on the local preview with sample images. There's no Shopify CDN and no apps, so this measures the theme's own cost, not the live store.

| Page | Score | LCP | TBT | CLS | Requests |
| --- | --- | --- | --- | --- | --- |
| Home | 100 | 1.20 s | 0 ms | 0 | 11 |
| Collection | 100 | 1.57 s | 0 ms | 0 | 14 |
| Product | 100 | 1.20 s | 25 ms | 0 | 12 |
| Cart | 100 | 1.50 s | 0 ms | 0 | 10 |
| Landing | 100 | 1.27 s | 21 ms | 0 | 5 |

The homepage is about 8 phone screens at 375 px (the old one is about 18). The real before/after comparison, including the Instagram in-app browser, needs store access: the Phase 0 baseline first, then the same scripts against the unpublished theme's preview link.

## Not done yet (needs store access or client input)

1. Pull the live theme and run the Phase 0 audit (blocked: network policy, Theme Access password).
2. Push this theme as an **unpublished** theme and share the preview link.
3. Move app embeds and blocks across (reviews, WhatsApp, tracking, try-on, GoKwik). See `handoff.md`.
4. Fill the open items (`open-items.md`). They show as `[[TO CONFIRM]]` until then.
5. Real speed numbers on the store, in Chrome, Safari and the Instagram in-app browser on Android and iPhone.
6. Copy check: how-to-apply and removal steps are written generically, with no numbers. Check them against the current site's wording.

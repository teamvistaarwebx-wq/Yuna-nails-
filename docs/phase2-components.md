# Phase 2: tokens and components

## Tokens

- **Where:** `theme/config/settings_schema.json` (Theme settings > Brand) → output once as CSS custom properties by `theme/snippets/design-tokens.liquid`. Every component reads only these.
- **Colours:** `--color-burgundy` #3D0B0E, `--color-cream` #F4EAE0, `--color-olive-gold` #52451B, `--color-soft-blue` #B8D4E3. Lines, surfaces, info notes and the scrim are mixed from these four at render time, so changing a brand colour changes them too.
- **Type:** headings use the heading token: Darel Rolando once its woff2 URL is set (open item 10), otherwise a system serif stack. Body is Urbanist, self-hosted as woff2 (400, 500, 600; SIL Open Font Licence), 36 KB in total, regular weight preloaded.
- **Shape and space:** radius 8 px, 8 px spacing scale (`--space-1` … `--space-10`), 1 px lines, no shadows, one thin line-icon style.

### Contrast (WCAG)

| Pair | Ratio | Result |
| --- | --- | --- |
| Burgundy on cream | 14.1 : 1 | AAA |
| Olive gold on cream | 7.95 : 1 | AAA, safe for prices and links |
| Burgundy on soft-blue note | 10.8 : 1 | AAA |
| Cream on burgundy (buttons, footer) | 14.1 : 1 | AAA |

Soft blue is used only as a surface, never as text.

## Components and their states

Preview page: `templates/page.components.json`. In admin, create a hidden page, give it the "components" template, and pick a product in the section settings. Locally: `npm run preview`, then open `/pages/components`. Screenshots: `preview/screens/components-m.jpg` and `components-d.jpg`.

| Component | Snippet or section | States shown |
| --- | --- | --- |
| Buttons | `base.css` | Primary, secondary, small, inactive (no size yet), loading, text link |
| Size selector | `snippets/size-selector.liquid` | Nothing selected, size picked, Size me later picked (with WhatsApp note), error after tapping Add to bag |
| Bundle selector | `snippets/bundle-selector.liquid` | 1, 2 and 3 sets; benefit or saving lines; `[[TO CONFIRM]]` when the 3-set saving is empty |
| Product card with quick add | `snippets/product-card.liquid` | Hand photo first, second image on hover (desktop), shape and length, price, rating (when reviews exist), one quiet offer line |
| Size sheet | `snippets/size-sheet.liquid` | Quick-add mode (sizes and add), chart-only mode |
| Cart line | `snippets/cart-line.liquid` | Sized; "Size to confirm on WhatsApp"; free gift line |
| Gift progress bar | `snippets/gift-progress.liquid` | Start, halfway, unlocked; hidden when no thresholds are set |
| Add-on card | `snippets/addon-card.liquid` | Kit coming soon (Notify me), kit launched (Add), glue remover (hidden until the product is set) |
| Kit block | `snippets/kit-block.liquid` | Coming soon with inline notify form; launched |
| Announcement bar | `sections/announcement-bar.liquid` | One quiet line, fact tokens filled in |
| Review and UGC tiles | `snippets/review-tile.liquid`, `snippets/ugc-tile.liquid` | Real review quote (hidden when empty); 9:16 reel with poster |

## Business facts: one source

Theme settings > Facts holds every fact. Copy anywhere in the theme (FAQ answers, product details, announcement, how-to) uses tokens like `[dispatch_time]`; `snippets/fact.liquid` fills them in.

When a fact is empty, the token becomes a visible `[[TO CONFIRM: …]]` mark, so nothing is guessed and nothing is missed before launch. The tokens are:

- `[apply_minutes]`, `[dispatch_time]`, `[cod_fee]`, `[cost_per_wear]`, `[wear_count]`
- `[exchange_window]`, `[nails_per_set]`, `[size_confirm_hours]`
- `[between_sizes]`, `[delivery]`

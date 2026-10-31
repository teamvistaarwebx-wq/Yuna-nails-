# Open items

Do not guess these. Until each is answered, use a marked placeholder (`[[TO CONFIRM: …]]` in copy, or a theme setting with an empty default) and list it in the phase report.

Last updated: 31 Oct 2026 (Phase 0).

## Business decisions (client)

| # | Item | Owner | Needed by | How the theme handles it until then |
| --- | --- | --- | --- | --- |
| 1 | Between two sizes: choose larger or smaller? The live size chart and fit guide disagree. | Vedant | Phase 2 (size sheet) | One setting `size_between_advice`, empty. Size sheet shows `[[TO CONFIRM: between sizes]]` in preview only |
| 2 | Application time: 5 minutes or about 2? | Vedant | Phase 3 | Setting `fact_apply_minutes`, empty |
| 3 | Cost per wear, and number of wears | Vedant | Phase 3 | Settings `fact_cost_per_wear`, `fact_wear_count`, empty; lines hidden when empty |
| 4 | Savings display: rupees, percent or both | Vedant | Phase 2 | Setting `savings_display`, default rupees |
| 5 | Final bundle setup: 2 sets → free glue remover; 3 sets → rupee saving; set + kit bundle price; gift thresholds and gifts | Vedant | Before Day 3 | All offer values are settings with empty defaults; offer lines hide when empty |
| 6 | Are adhesive tabs still in the box? | Vedant | Phase 3 | "What's in the box" lists 10 nails + glue; tabs line is `[[TO CONFIRM]]` |
| 7 | Nail glue remover: SKU, price, launch timing | Vedant | Phase 3 | Add-on block hidden until a product is picked in its setting |
| 8 | Nail care kit: contents, price (~Rs 3,299), launch date, images. May the price show as "around Rs 3,299"? | Vedant, Sanprita | Phase 3 | "Coming soon" switch on; price hidden; contents and images are marked placeholders |
| 9 | Logo files: which are variants 1 and 3? | Vedant | Phase 2 | Current logo stays until the files arrive |
| 10 | Darel Rolando web font files (woff2) and web licence | Vedant | Phase 2 | Heading token falls back to a system serif |
| 11 | Free-shipping rule: "above Rs 999" (MOM) or "free on prepaid orders" (current site)? | Vedant | Phase 3 | Delivery line is a setting, empty |
| 12 | Bestseller list | Vedant | Phase 4 | Manually curated collection of top-reviewed sets |
| 13 | AR try-on placement: homepage, own page, or product page only | Gaurav, Vishal | Phase 4 | Stays where it is on the product page |
| 14 | Shop-by-mood categories | Vedant | Phase 3 | Section with editable blocks; placeholder labels marked `[[TO CONFIRM]]` |
| 15 | Keep or drop strike-through compare-at prices ("Rs 500 off") on cards? | Vedant | Phase 2 | Setting `show_compare_at`, off by default (fits "one quiet offer line"), easy to switch on |
| 16 | GoKwik go-live date; confirm the "Size me later" line property reaches the order | Vedant, GoKwik | Phase 3 | Native Shopify checkout path kept working; flagged |
| 17 | Shoot dates, and who shoots (agency or in-house photographer) | Vedant | Phase 3 | Current store photos as placeholders. No AI images |

## Access (Vistaar, needed to start Phase 0)

| # | Item | Owner | Status |
| --- | --- | --- | --- |
| A1 | Network access for the cloud workspace: yunanails.in, the store's `*.myshopify.com` domain, `cdn.shopify.com`, and the app domains (reviews, WhatsApp, GoKwik, try-on, tracking) | Vistaar | Blocked (403) |
| A2 | Theme Access password for the store, saved as environment variables `SHOPIFY_CLI_THEME_TOKEN` and `SHOPIFY_FLAG_STORE` (the `…myshopify.com` domain) | Vedant (installs Theme Access app), Vistaar (stores it) | Not set |
| A3 | Shopify connector signed in again (read-only look at products and the bundle discount setup) | Vistaar | Needs re-auth |
| A4 | One representative product handle for speed tests | Vedant or Vistaar | Not set |
| A5 | Someone with an Android phone and an iPhone with Instagram, for the in-app browser baseline | Vishal or Prachi | Not booked |

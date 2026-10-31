# Handoff

What's needed to take the new theme from this repo to a preview link, and then to launch. The client publishes; Vistaar never does.

## 1. Put the theme on the store (unpublished)

Run these with the Theme Access password set (see `phase0-audit.md`).

```bash
npm install
```

```bash
npm run theme:pull
```

```bash
npx shopify theme push --path theme --unpublished
```

- `theme:pull` saves the live theme to `live-theme/`, for reference.
- The push creates a new unpublished theme. Note its id; every later push uses `--theme <id>`. Never `--live`, never `publish`.

## 2. Theme settings to fill (Customize > Theme settings)

| Group | Setting | Value | Open item |
| --- | --- | --- | --- |
| Brand: type | Heading font file URLs | Darel Rolando woff2 (regular, italic) uploaded to Content > Files | 10 |
| Brand: logo | Logo | Variant 1 or 3 (never 2) | 9 |
| Offers: bundles | Show savings as | Rupees (default) or percent | 4 |
| Offers: bundles | 2 sets benefit, 3 sets saving | Final setup | 5 |
| Offers: bundles | Buy now mode | Confirm with GoKwik | 16 |
| Offers: bundles | Show compare-at price | Keep or drop "Rs 500 off" | 15 |
| Offers: gifts | Thresholds and gifts | Final setup | 5 |
| Products | Bestsellers collection | Curated top-reviewed sets | 12 |
| Products | Kit product, kit image, price hint, bundle line | When ready | 8 |
| Products | Glue remover product | When the SKU exists | 7 |
| Sizing | Size chart (mm) | Copy from the current chart | — |
| Sizing | Between two sizes | Larger or smaller | 1 |
| Facts | Application time, cost per wear, wear count | Final figures | 2, 3 |
| Facts | Delivery line | Free-shipping rule | 11 |
| Facts | What's in the box | Confirm adhesive tabs | 6 |
| Contact | WhatsApp number, email, Instagram, YouTube | From the current site | — |

Already filled from confirmed facts: dispatch 24–48 hours, COD fee Rs 99, free size exchange within 48 hours, 10 nails per set, sizes XS–L, safety notes, size confirmation within 24 hours.

Search the preview for `[[TO CONFIRM` before launch: every remaining one is an unfilled item.

## 3. Admin changes needed (Vistaar lists, the client makes them)

Nothing below has been changed. Each needs the client's go-ahead.

1. **Pages.** Create Landing, Size guide, FAQ, Our story (about), Contact, Track order and a hidden Components page. Give each its matching template (`page.landing`, `page.size-guide`, …).
2. **Kit product.** Give the nail care kit product the `product.kit` template.
3. **Menus.**
   - `main-menu`: Shop all, Collections, Nail care kit, Custom orders, Size guide, Our story, Help.
   - Footer menus: `footer-shop`, `footer-help` and `footer-policies`.
4. **Bestsellers collection.** A manual collection of the top-reviewed sets.
5. **Product media order.** Move a hand photo or video to first place on every product; plate shots after.
6. **Shape and length (optional).** Product metafields `custom.shape` and `custom.length` (single-line text) show "Almond · Medium" on cards.
7. **Discounts** (after the final offer setup):
   - Remove the 5-set / 25% tier.
   - 2 sets → free glue remover: an automatic "Buy X get Y" once the remover exists.
   - 3 sets → rupee saving: an automatic amount-off discount with a minimum quantity of 3.
   - If "Yuna Quantity Breaks" stays, keep its discount but hide its own product-page widget; the theme's bundle selector replaces it.
8. **Size me later (optional, cleaner for ops).** Add a variant with the size value "Size me later" to each product. Without it, the line property alone carries the flag. Either way, confirm that GoKwik passes line properties and checkout attributes into the order.

## 4. Apps on the new theme

App embeds and blocks don't carry over to a new theme automatically. After pulling `live-theme/`, check `config/settings_data.json` there for each embed.

| App | Where it goes | Note |
| --- | --- | --- |
| Judge.me | Product page "Reviews" section (anchor `reviews`), landing "proof", home "Real hands" | Star ratings on cards read the standard reviews metafields Judge.me already fills. |
| GoKwik | App embed, checkout button | Ask GoKwik to hook the bag's checkout button (`button[name="checkout"]` in `#CartDrawer`) and Buy now. Until it's live, Shopify checkout keeps working. |
| AR try-on | App block in the product section, same spot as today | Don't add it elsewhere until open item 13 is decided. |
| WhatsApp | Theme links work without the app | If the app's floating button stays, set its bottom offset so it never covers the sticky add-to-bag bar. Or switch it off and use the theme's own button (Theme settings > Contact). |
| Tracking | Track order page: app block or tracking page link | |
| Newsletter popup | **Turn off** | No popups on load. The footer sign-up replaces it. |
| "Save it for later?" cart popup | **Turn off** | It covered the checkout button. |
| Beta camera size finder | **Keep off** | Brief rule. |

## 5. QA checklist (brief section 16)

✅ checked locally; ⏳ needs the store or the client.

- ✅ Every Priority 1–3 page built from editable sections, at 375 px and 1440 px.
- ✅ No size pre-selected. Size me later works from the product page and quick add, and the flag shows in the bag. ⏳ Flag in the order via GoKwik.
- ✅ Bundle selector above Add to bag. No 5-set offer. Offer values from settings.
- ✅ Buy now: one set to checkout; bundles through the bag. ⏳ GoKwik hook.
- ✅ Bag: gift bar, nudge, add-on slot, savings line, one uncovered checkout button.
- ✅ Kit page, homepage slot and bag add-on switch with one setting.
- ✅ No popups from the theme. No beta size finder. No stickers or stacked badges. No slang. ⏳ Turn off the popup apps on the new theme.
- ✅ Each business fact in one place. ⏳ Open items filled.
- ✅ Brand only through tokens. ⏳ Darel Rolando files.
- ✅ Safety notes on the product page and in How to apply.
- ⏳ Speed budget on the store, with before/after for mobile Chrome, Safari and the Instagram in-app browser.
- ⏳ Device tests: Android Chrome, iPhone Safari, Instagram in-app (both), bag → GoKwik.
- ✅ Accessibility: contrast, tap targets, focus, labels, alt text. ⏳ Screen-reader pass on a real phone.
- ✅ Live theme untouched.

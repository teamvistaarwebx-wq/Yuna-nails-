# Phase 0: read and audit

**Status, 31 Oct 2026: blocked on access. Nothing has been measured yet.** The tooling is built and tested; each step below is one command once access is granted. No theme has been touched.

## What is blocking

| Need | Why | Fix |
| --- | --- | --- |
| Network access to yunanails.in and its app domains | The cloud workspace's network policy refuses yunanails.in (403). Speed tests also need every app domain reachable, or app weights read low. | In the cloud environment settings, choose a broader network access level for this work. Allowing only yunanails.in is not enough: app scripts load from domains we don't know yet. |
| Theme Access password | `shopify theme pull` needs a login. A cloud session can't do the interactive login. | Vedant installs Shopify's free **Theme Access** app and sends a password to Vistaar's email. Vistaar saves it in the environment settings as `SHOPIFY_CLI_THEME_TOKEN`, with `SHOPIFY_FLAG_STORE` set to the store's `…myshopify.com` domain. A new session picks them up. Never paste it in chat. |
| Shopify connector | Read-only look at products, collections and the "Yuna Quantity Breaks" discount setup | Sign the Shopify connector in again in claude.ai connector settings. |
| A product handle | The product-page speed test needs one real product | Pick a typical set (Rs 1,299–1,499). |
| Real phones | The Instagram in-app browser can't be measured from a server | Book 20 minutes with Vishal or Prachi (Android + iPhone). |

A Theme Access password can push themes, so the standing rule applies: pull from live; push only to an unpublished copy with `--theme <id>`; never `--live`, never `publish`.

## Plan once access is granted

### 1. Pull the theme

```bash
npm install
```

```bash
npm run theme:list
```

```bash
npm run theme:pull
```

`theme:pull` reads the live theme into `theme/` and changes nothing on the store. It gets committed as the untouched baseline. The unpublished duplicate is created in Phase 3, not now.

### 2. Templates, sections, snippets, apps (with weights)

```bash
npm run audit:inventory
```

Writes `reports/theme-inventory.md`:

- every template and the sections it uses
- unused sections and snippets
- app embeds and app blocks, and whether each is on
- external scripts that block rendering
- the largest assets

App **weights** come from step 3 (bytes and main-thread time per app, per page), because many apps inject code through `content_for_header`, which isn't in the theme files.

### 3. Baseline speed

```bash
npm run audit:speed -- --product <handle>
```

```bash
npm run audit:speed -- --product <handle> --ua instagram-android --label baseline-ig-ua
```

What it measures:

- Pages: home, collection, product and cart.
- Profile: Lighthouse mobile (emulated mid-range phone, simulated slow 4G, 4× CPU).
- Runs: 3 per page; the median LCP run is kept.
- Recorded per page: LCP, FCP, TBT, CLS, request count, transfer size, the LCP element, the video bytes downloaded during load (this settles the 13 MB vs ~30 MB hero video question), and a per-app weight table.

The second command only swaps the user agent. It shows whether apps serve Instagram different code, but it is **not** an in-app measurement.

**Instagram in-app browser, real phones (no theme edits):**

1. Send the page links in an Instagram DM, then open each one from inside Instagram on a mid-range Android phone and on an iPhone, using 4G with Wi-Fi off.
2. Screen-record each open, 3 times per page, after closing and reopening Instagram each time.
3. From the recordings, note the time to first content, the time until the hero image is visible, the time until the page can be scrolled, and whether any popup appears.
4. Repeat in Chrome on Android and in Safari on iPhone, for comparison.

Optional, needs approval: on an unpublished copy of the live theme, add a small on-screen readout (shown only with `?perf=1`) that displays LCP and CLS inside the in-app browser. This gives exact numbers but is a theme edit, so it waits for your go-ahead.

### 4. Business facts and conflicts

```bash
npm run audit:facts -- --urls reports/fact-urls.txt
```

This scans:

- theme files, including settings and translations
- the rendered text of every page listed in `reports/fact-urls.txt`, including hidden accordions and tabs, because product descriptions and pages live in Shopify admin, not the theme

It covers apply time, cost per wear, wear count, between-sizes advice, offers (including the 5-set offer to remove), shipping rule, dispatch time, COD, exchange window and box contents. It flags any fact with more than one value. Output: `reports/fact-scan.md`.

### 5. How the bundle discount and the try-on are wired

- The inventory's feature trace shows where "Yuna Quantity Breaks" and the try-on appear in the theme: app block, app embed or hard-coded script.
- With the Shopify connector, a read-only query shows how the discount itself is set up: automatic or code, the function app, and the tiers.
- Nothing in admin gets changed.

## Already known (reported in the brief, 30 Oct). Each will be checked against live

| Area | Finding | Phase 0 check |
| --- | --- | --- |
| Home | A 10% newsletter popup covers the page within seconds | Inventory (popups trace) and phone recordings |
| Home | Hero video 13 MB measured; MOM says ~30 MB | Video bytes in the speed report |
| Home | About 18 phone screens long, about 297 requests | Request count in the speed report; page height at 375 px |
| Product | Opens on a plate photo; XS pre-selected; bundle choice below Add to cart; beta size finder and beta try-on shown | Inventory and template review |
| Collection | "Choose options" on every card; stacked offer badges | Template review |
| Cart drawer | No second-set nudge; "Save it for later?" popup over the checkout button | Inventory (save-for-later trace) |
| Facts | Size chart says larger, fit guide says smaller; apply time 5 min vs ~2 min; cost per wear ~Rs 180 vs Rs 300 | Fact scan |
| Layout | WhatsApp and chat buttons cover product cards and sticky buttons | Phone recordings |

## Done in this phase so far

- `CLAUDE.md`: standing rules, sources order, brand tokens, phase gates.
- `docs/open-items.md`: the 17 open items with owner, deadline and the placeholder used until answered; plus the access items above.
- `docs/asset-list.md`: every media slot with ratio, minimum size, length and where it appears (MOM action, can go to the agency now).
- `scripts/`: speed baseline, theme inventory and fact scan. All three were tested on a local test page and a small test theme with deliberate conflicts. All conflicts were caught.

## Next

Once access items A1–A4 are in place, I run steps 1–5, fill this report with real numbers, and stop for review. No wireframes start before that.

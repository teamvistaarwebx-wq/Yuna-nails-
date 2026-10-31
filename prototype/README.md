# Yuna prototype

A clickable first draft of the redesigned yunanails.in store, for the team to click through on phone and desktop sizes and plan the website from. Static front end only: plain HTML, CSS and vanilla JavaScript, served by Vite. No Shopify, no backend, no real checkout.

## Run it

You need Node.js 18 or newer.

```bash
cd prototype
```

```bash
npm install
```

```bash
npm run dev
```

It opens on http://localhost:5173 (Vite prints another port if 5173 is busy). From the repository root, `npm run prototype:install` and then `npm run dev` do the same.

## Use it

- **Screen map** (`/`): every screen as a card, grouped by priority. **Start the journey** walks the main flow: Instagram ad → landing page → product page → add to bag → cart drawer → GoKwik placeholder. The toolbar shows the step and Next / Back.
- **Toolbar**, on every screen:
  - **Phone 375 / Desktop 1440**: phone shows the screen in a phone frame at a true 375 px viewport.
  - **Wireframe / Styled**: wireframe is greyscale with grey boxes for photos (the agreed "grey first" step); styled is the full Soft Glam look.
  - **Notes**: numbered pins; each opens a one-line reason for a design decision.
  - **State**: a switcher for the screen's states (for example "Size me later" or "3 sets" on the product page).
  - **Screen map**: back to the index. The ⌃ button hides the toolbar.
- Everything is clickable. Dead ends show a toast: "Not in prototype yet".
- The URL keeps the screen and state, so a link like `/#/product?state=size-later` opens that exact view.

## Where things live

| What | File |
| --- | --- |
| Brand tokens (colours, fonts, spacing); wireframe mode | `src/tokens.css` |
| Business facts: sizes, dispatch, COD fee, apply time, cost per wear… | `data/facts.js` |
| Offers: bundle tiers, nudges, gift thresholds | `data/offers.js` |
| Kit "coming soon / launched" switch, remover, WhatsApp | `data/settings.js` |
| Products (names and prices) | `data/products.js` |
| Screens and their states | `src/screens/registry.js` |
| Reusable components (header, footer, product card, size sheet, cart drawer, bundle selector, kit block) | `src/components/` |
| Store styles | `src/site.css`, `src/ui.css` |
| Toolbar, phone frame, screen map | `src/shell.js`, `src/shell.css` |

Change a value in one data file and every screen follows. Set `kitComingSoon: false` in `data/settings.js` to see the kit launched on the kit page, the homepage slot and the cart add-on at once.

## Rules it follows

The standing rules and design direction of the brief (sections 2, 3 and 7):

- No popups on load. The 10% offer sits inline in the footer.
- No stickers, stacked badges or slang.
- No beta measurement tool. Hand photos come first.
- Brand only through tokens. No AI-generated images.
- Anything still open (brief section 15) shows as a yellow **TO CONFIRM** tag. Every photo slot carries a "Placeholder photo" tag.

## Checks

With the dev server running:

```bash
npm run shoot -- http://127.0.0.1:5173 screens all
```

```bash
node scripts/journey-test.mjs http://127.0.0.1:5173 screens/journey
```

The first takes screenshots of every screen and state at 375 and 1440 px in both modes, and reports any horizontal overflow or page error. The second clicks through the journey, quick add and the kit switch, and reports pass or fail for each step. It needs Playwright, which is preinstalled in the Vistaar workspace; elsewhere, run `npm i -D playwright` first.

## Porting to Shopify later

Each component in `src/components/` is a function that returns HTML, the same shape as a Shopify section or snippet. The data files map to theme settings (`facts`, `offers`, `settings`) and to products and metafields. The `theme/` folder in this repository holds a Liquid version of the same design.

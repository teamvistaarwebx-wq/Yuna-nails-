# Yuna Nails theme redesign (Vistaar WebX)

Redesign of the yunanails.in Shopify store (Online Store 2.0, Liquid).
Goal: turn ad clicks into orders, sell more 2 and 3 set orders, raise order value, and load fast in the Instagram in-app browser on phones.

## Standing rules

- Never publish a theme, run `shopify theme push --live` or `shopify theme publish`, or edit the live theme. Work only on an unpublished duplicate. Always pass `--theme <unpublished id>` to `shopify theme push` and `shopify theme dev`.
- Never change products, prices, discounts, apps, shipping or checkout settings in Shopify admin. List the change needed and ask.
- No hard-coded brand values. Colours, fonts, radius and spacing come from tokens (`config/settings_schema.json` → `snippets/design-tokens.liquid`).
- No hard-coded business facts: offers, prices, thresholds, sizes, apply time, cost per wear, wear count, dispatch time. Each lives in one place (theme settings, metafields or metaobjects) and is read everywhere.
- Do not guess open items (`docs/open-items.md`). Use a marked placeholder (`[[TO CONFIRM: …]]` in copy, or a setting with an empty default) and list it in the phase report.
- Do not show the beta on-site measurement tool (camera size finder).
- No popups or splash screens on load.
- No stickers, rotated badges, wavy text bands, handwritten fonts, thick outlines, offset shadows or stacked sale banners.
- No slang ("slay", "bestie", "main character"). Copy is minimal, elegant and caring. Sentence case for headings and buttons.
- No AI-generated images, and no AI-generated copy presented as real customers.
- Mobile first at 375 px, then desktop at 1440 px.
- Keep the current apps (reviews, WhatsApp, tracking, try-on, GoKwik) unless a change clearly improves conversion. Flag it; do not remove it.
- After every phase, write a short report in `docs/` and stop for approval.

## Sources (newer wins)

1. Client answers, 31 Oct 2026 (Vedant)
2. Minutes of meeting, 30 Oct 2026
3. Kickoff deck, 30 Oct 2026. Its colours (cream #FBF6F2, berry #A93A5E, Instrument Sans) are for the deck only. Never use them on the site.
4. Live site audit, 30 Oct 2026

## Brand tokens (final values, used only through tokens)

| Token | Hex | Use |
| --- | --- | --- |
| `--color-burgundy` | #3D0B0E | Primary text, primary buttons, logo |
| `--color-cream` | #F4EAE0 | Page background, soft surfaces |
| `--color-olive-gold` | #52451B | Small accents, prices, links (check contrast) |
| `--color-soft-blue` | #B8D4E3 | Secondary surfaces, info notes. Never as text |

Headings: Darel Rolando (self-hosted woff2 once licensed; fallback serif until then). Body: Urbanist (self-hosted woff2). 8 px radius, 8 px spacing scale, thin lines, no shadows.

## Phases and gates

0. Read and audit, no theme edits → `docs/phase0-audit.md` → STOP
1. Grey wireframes at 375 px in `/wireframes` → `docs/phase1-wireframes.md` → STOP
2. Tokens and components → component preview page → STOP
3. Build Priority 1 on the unpublished theme → preview link + speed comparison → STOP
4. Priority 2 and 3, desktop, kit states → preview link → STOP for client review
5. Feedback and QA → `docs/handoff.md`. The client publishes.

## Layout

- `theme/`: the new theme (built fresh, lean OS 2.0). Push only to an unpublished theme.
- `live-theme/`: the current live theme, pulled read-only for the audit and for moving app settings (not in git until pulled)
- `docs/`: phase reports, open items, asset list, handoff
- `scripts/`: audit and measurement tooling (`npm run …`, see `package.json`)
- `scripts/preview/`: local preview of `theme/` with sample data and a working cart (`npm run preview`, `npm run preview:shoot`)
- `preview/screens/`: screenshots at 375 px (`-m`) and 1440 px (`-d`)
- `wireframes/`: Phase 1 greyscale HTML

Before committing theme changes: `npm run theme:check` must report no offences.

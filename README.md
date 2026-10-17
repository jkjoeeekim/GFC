# God’s Family Church

A modular React + TypeScript + Vite redesign of [gfchouse.com](https://www.gfchouse.com/), built with the installed scroll-craft skill. The primary visitor action is finding a house church.

## Run

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
npm run lint
npm run check:content
python3 research/check_migration.py
```

The production output is `dist/`. This is a client-routed app: configure the host to serve `index.html` for page routes. `public/_redirects` provides that rule for compatible static hosts. No production deployment or admin backend is configured.

## Component and content structure

- `src/components/layout/`: header, footer, original brand mark, and about navigation.
- `src/components/ui/`: buttons, page introductions, service details, media dialogs, sermon posters, event listings, and connection invitations.
- `src/components/gallery/`, `house-church/`, `sermons/`: reusable collection components.
- `src/sections/home/`: seven independent homepage sections.
- `src/pages/`: route-level page compositions.
- `src/content/`: typed content provider, default site settings, and the editable-field contract.
- `src/data/`: original church copy, house churches, doctrines, gallery albums, and sermon records.
- `src/styles/`: shared design tokens and styles grouped by responsibility; mobile and reduced-motion rules are in `responsive.css`.

See [the admin integration guide](docs/ADMIN_INTEGRATION.md) for the portal connection boundary and permitted site fields.

## Content preservation

The source audit covers 10 house church entries, 13 doctrines with 63 statements, 251 gallery photographs, 173 unique video recordings, and 40 audio recordings. Original giving, social, congregation, and media destinations are retained. Original internal URL paths and legacy aliases resolve in the new application.

Original pages and a structured inventory are in `research/`. Their scripts can regenerate data:

```sh
python3 research/build_content.py
node scripts/cache-media.mjs
python3 research/check_migration.py
```

The cache step needs network access only for new media. It uses stable URL hashes and keeps originals' URLs alongside local optimized files. Do not replace the church’s text or media with generated content.

## Verification

`npm run build` type-checks and builds. `npm run lint` checks application source. `npm run check:content` verifies field boundaries, URL/email checks, and immutable content updates.

Browser verification uses the installed Google Chrome and disables native pointer lock/capture. With the production preview on port 4173:

```sh
node scripts/verify-ui.mjs
```

With the development server on port 5173, the isolated fixture verifies future admin data propagation:

```sh
node scripts/verify-content-ui.mjs
```

The fixture is outside the production source entry. It contains example verification values only; it is not an admin portal.

Scroll-craft planning and findings live in `scrollcraft/builds/gfc/`. Browser screenshots and reports are generated under `output/playwright/`. A real iPhone/Android touch-device check remains separate from headless viewport checks.

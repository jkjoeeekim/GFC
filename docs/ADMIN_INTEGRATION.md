# Connecting the future admin portal

The UI is separated from content storage. The integration boundary is the optional `content` prop on `App`, which passes typed, published values to `ContentProvider`. Components do not fetch from or depend on an admin service.

## Limited site editing

Default site settings live in `src/content/site.json`. `editableFields` in `src/content/editableFields.ts` defines the initial editable fields, labels, input types, and maximum lengths:

- Service day, time, room, and address.
- Church contact email.
- Existing giving and Korean-congregation destinations.
- Homepage hero text, two photo paths, and meaningful photo descriptions.
- Community heading, introduction, and meeting days.
- Closing heading and invitation.

Navigation structure, styling, animation, component markup, and the primary visitor journey are outside this field list. The list is explicit so the portal can expose a small form instead of a general page builder.

```tsx
import App from './App'
import { defaultSite } from './content/useContent'
import { applySiteContentPatch } from './content/editableFields'

// Fetch this published field patch from your own authorized content service.
const publishedPatch = {
  'service.time': '11 AM',
  'contactEmail': 'gfchousechurches@gmail.com',
}
const site = applySiteContentPatch(defaultSite, publishedPatch)

root.render(<App content={{ site }} />)
```

`applySiteContentPatch` rejects unknown fields, empty/oversized values, invalid emails, and non-HTTP(S) remote addresses. It returns a new object. Local image paths are allowed. React renders text as text, never as HTML.

These client checks are a formatting contract. The admin server must authenticate editors, authorize allowed fields, validate updates, and return only published content. There are no credentials, storage calls, or editing endpoints in the public UI.

## Collection and page data

`ContentOverrides` in `src/content/useContent.ts` exposes optional, typed data collections when the portal is ready to manage them:

| Key | Data | Consumers |
|---|---|---|
| `site` | `SiteContent` | Hero, invitation, service details, metadata, footer, email links |
| `church` | `ChurchContent` | Mission, biography, beliefs, house churches, social links, giving copy |
| `gallery` | `GalleryContent` | Album filters, photo grid, lightbox |
| `sermons` | `SermonContent` | Latest message, archive categories, search, players |
| `events` | `ChurchEvent[]` | Events page and reusable event listings |

Omitted collections use their source-preserving local defaults. Events default to an empty list because the original site listed none. `ChurchEvent` has `id`, `title`, `startsAt` (ISO timestamp), `description`, and optional `timeZone`, `location`, and `href`. Event dates display in the supplied IANA timezone, defaulting to America/Los_Angeles.

Before enabling collection editing, define server-side field/role rules for that collection. In particular, doctrinal text and payment destinations should not become editable merely because other church copy is editable. Validate array shapes, unique identifiers, dates, URLs, and asset descriptions on the service that publishes them. Archive UI and player components remain unchanged when the data source changes.

## Modular component conventions

Route components compose reusable parts. Homepage sections own their local interaction state; `useScrollProgress` updates CSS variables without rerendering the page on scroll. Shared layout, media, and collection components receive explicit data or read from the content context. Styles are grouped under `src/styles/`, and the common tokens are in `src/index.css`.

Keep new admin fields in the content contract. Avoid scattering settings through JSX, importing backend SDKs inside visual components, accepting raw HTML, or exposing CSS/layout editors.

The isolated `research/fixtures/admin-preview` fixture and `scripts/verify-content-ui.mjs` prove that changed headline, time, city, street, email, metadata, and inner-page service details propagate through the provider. These example values are excluded from the production build.

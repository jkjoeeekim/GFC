# GFC redesign delivery

The React project now contains the full redesigned site, including the original URL paths, about pages, staff biography, doctrines, house churches, events, gallery, giving information, and sermon series. The brief uses the user's words and explicitly delegated creative judgment.

Local development preview: http://127.0.0.1:5173/
Production-build verification preview: http://127.0.0.1:4173/

## Design and journey

Grammar: **Community album**. A persistent directory and normal page flow support newcomers and returning members. Independent photographic prints establish depth in the opening. The signature **A place at the table** draws a house/table connection while three real gathering photos converge, then carries a life-stage choice into the house church finder.

The eight predefined grammars were considered: one-shot and continuous-world formats obscure navigation; chaptered editorial excludes the requested photographic opening; live surface treats the church as a product demo; typographic poster discards its real people; gallery/catalog alone cannot carry the mission; split stage invents a two-sided comparison; rhythmic cutlist rushes the visitor. The complete constraints and score are in `BRIEF.md`.

The feeling curve is welcome → understanding → belonging → trust → warmth → readiness. The quiet mission precedes the community peak, which has the largest authored section span. The ending holds the house church invitation beside real service details.

| Beat | Main treatment |
|---|---|
| Welcome | Independently moving congregation and meal photographs |
| Mission | Quiet text and flow entrances |
| Belonging, peak | Bespoke line trace, photographic convergence, life-stage choice |
| Teaching | Original click-to-play message and archive |
| Memories | Original retreat photos, reveal and restrained image parallax |
| Next step | Stable invitation, email, address, and service time |

Fingerprint gate: no previous registry rows. GFC's row is now appended. No generated assets, paid image/video calls, or invented testimonials or statistics were used.

## Preservation and modularity

Source audit: **10 house church entries, 13 doctrines with all 63 statements, 251 gallery photos, 173 unique videos, and 40 audio recordings**. Original media endpoints, social destinations, Tithe.ly destination, and congregation link are retained. Giving instructions embedded in the original image are also included, with a text equivalent and the original Zelle QR graphic.

The two source pages labeled “’22 series” were separated using their own URLs and media IDs: Galatians has 9 recordings and 1 Corinthians has 10. The old sermon-topics index was inaccessible, so its existing path now presents the preserved series index.

Components are separated into layout, UI, collection components, independent homepage sections, and page compositions. A typed provider accepts published site, church, gallery, sermon, and event data. An explicit site-field allowlist supports limited portal editing; layout and styles stay in code. No admin backend, credentials, or publishing service is connected. See `docs/ADMIN_INTEGRATION.md`.

## Verification and changes

- TypeScript production build, source lint, content-field contract checks, and source migration audit pass.
- 36 production URL paths were walked to check content, image loading, and horizontal overflow. No broken images or overflow were found.
- Nine desktop accessibility audits and four phone audits reported no automated WCAG A/AA violations. These supplement the visual and keyboard checks; they are not an accessibility certification.
- Original sermon search, native audio metadata and muted playback, original YouTube iframe loading, album changes, progressive photo loading, keyboard arrows, Escape, and dialog focus return were exercised.
- House church life-stage, name, and area filters, reset behavior, selected-group email destinations, and homepage-to-directory selection persistence pass.
- The original giving destination was checked without submitting a payment. No email was sent.
- A provider fixture confirms that changed headline, service time, city, street, email, metadata, footer, and inner-page service details propagate through the modular components.
- Final scroll runs sampled 132 frames: 32 desktop, 34 phone, 34 compact phone, and 32 reduced-motion. No dead scroll was reported. Contact sheets and representative full-size frames were visually inspected.

The initial visual read was welcome → purpose → belonging → reflection → warmth → invitation. This is close to the intended curve, with teaching quieter than its intended trust beat. The original player, exact message context, and archive link make that section substantive rather than adding stronger marketing claims. The community section remains the peak.

Visual/functional fixes made during verification: compact phone headline wrapping; a missing space where a desktop line break was hidden on phones; explicit focus restoration after media/photo dialogs; and a mobile-menu event being misclassified as an outside click after its SVG icon changed. The menu now checks the event's composed path. Later targeted interaction checks supersede the earlier failures. Final interaction checks report no browser page errors.

Evidence lives under `output/playwright/`: `final-desktop`, `final-phone`, `final-compact`, `final-reduced`, the functional reports/screenshots, admin-content report, and audio-playback report. The earlier source-reading/route audit is retained separately from the final targeted interaction run.

Not verified: a physical iPhone/Android device, every remote video’s complete playback, the church’s ownership of external account integrations, or a production deployment. The existing remote media remains subject to its provider. Local optimized imagery and local fonts load from the reviewed build.

The final gallery refinement leads with a deterministic cross-section of each album, while the archived data keeps the source ordering. A dedicated follow-up walked all three albums on desktop and phone and confirmed all 251 photos remain present exactly once, with working navigation and focus return and no automated accessibility violations. Its screenshots and report are `final-gallery-1440.png`, `final-gallery-390.png`, and `gallery-final-report.json`.

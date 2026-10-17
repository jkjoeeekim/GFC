# GFC redesign brief

Self-authored under explicit creative delegation. Existing content is evidence;
the design and journey below are authored decisions, not user quotations.

## User direction and scope

- Feeling, verbatim: "warm, inviting, clear, intuitive, inspiring".
- Scope, verbatim: "All pages, including the sermon archive and gallery (Recommended)".
- Primary action, verbatim: "Connect with a house church".
- Creative authority, verbatim: "Yes, use your judgment (Recommended)".
- Use the media, information, and hyperlink destinations from https://www.gfchouse.com/.

## Eight decisions

1. Vibe: the user's five words above. Authored visual reference: a community
   photo album, with generous white space and a grounded forest-green identity.
2. Journey: welcome; understand the mission; see everyday community; choose a
   house church; hear the teaching; see shared memories; take a next step.
3. Energy: a welcoming opening, a quiet mission statement, a generous communal
   peak, then easy, practical discovery and a confident ending.
4. Emotional memory: everyday people become a family in Christ. The peak brings
   separate photographs together around a shared table-shaped composition.
5. Signature: "A place at the table". A scroll-drawn house/table connection
   brings three real community photographs together. Choosing a life stage
   carries the visitor to the corresponding real house church directory filter.
6. Aesthetic: warm community editorial. Forest green, near-white, pale sage,
   restrained citron; Manrope display and DM Sans text. No luxury styling.
7. Distinct scenes in natural document flow. No continuous world, scroll lock,
   cinematic waiting, or hidden navigation.
8. Only original church photographs, logo, sermon artwork, videos, and audio.
   No generated people, invented testimonials, statistics, or event dates.

## Audience, belief, action

Audience (authored from source): people exploring the English-Speaking
Congregation in Buena Park and surrounding communities, plus existing members.
Belief: GFC is a real, Christ-centered community where faith is lived together.
Primary label: "Find a house church". Secondary actions retain their purposes.

## Feeling curve, written before the score

1. Welcome: the real congregation and a readable invitation share the opening.
2. Understanding: the original mission sits quietly in generous space.
3. Belonging (peak): separate meals and gatherings converge around a shared
   table outline, followed by a choice of community for the visitor's life stage.
4. Trust: real Sunday teaching is playable, with the full archive available.
5. Warmth: actual retreat memories, with the complete gallery one click away.
6. Readiness: the house church invitation resolves beside practical Sunday details.

Peak sentence: "The photos came together like people gathering at a table, and
I could find a house church for my season of life."
Tell-someone sentence: "It's the site where a real church family makes room
at the table and helps you find your people."
Authored silence: the quiet mission section. No blank viewport or dead scroll.

## Grammar and constraints

Authored grammar: **Community album**. Navigation is a clear, persistent site
directory with a house church action. Sections alternate an invitation, a
mission spread, a shared-table composition, a teaching feature, and a memory
strip. The ending is a practical invitation with address and time.
Bans: full-screen video ground, pinned reading, disappearing essential text,
decorative counters, generic feature-card grids, and forced lateral scrolling.
The full information architecture remains available through ordinary links.

Why the eight predefined grammars lost: filmic one-shot removes navigation;
chaptered editorial forbids the photographic opening; live surface misstates a
church as software; continuous world adds travel unrelated to the offer;
typographic poster removes the requested photography; gallery/catalog cannot
carry the full mission and newcomer path; split stage creates a false two-sided
argument; rhythmic cutlist is too hurried for an inviting community.

Fingerprint gate: the local registry is empty. No prior rows to compare.

## Score

| Beat | Device | Purpose |
|---|---|---|
| Welcome | Layered parallax | Real photographic prints overlap and move independently; text stays still |
| Mission | Flow + in | Quiet, readable original mission |
| Belonging | Bespoke SVG trace + photographic reveal | The house/table gathers people, then provides a useful life-stage choice |
| Teaching | Flow | Practical, click-to-play sermon without autoplay |
| Memories | In-frame image parallax | Photographs provide warmth without trapping the scroll |
| Commitment | Static resolution | One complete final invitation, no fade-out |

Four device families: parallax, flow/in, reveal, custom trace. No scrub video.
Peak has the largest section span on desktop; phone is recomposed in natural flow.

## Hero layer contract

| Plane | Asset | Motion / overlap |
|---|---|---|
| Far | Pale sage ground and architectural house outline | Static, supplies visual breathing room |
| Mid | Source congregation photograph | Small scroll displacement, bounded by its photographic frame |
| Near | Source house church meal photograph | Moves in the opposite direction and overlaps the congregation frame |
| Type / controls | Real HTML | Stable and unobscured; primary action always legible |

The photos are separate prints, not fake parts of one scene. No alpha extraction,
duplicate people, or generated background is needed. Opening: independent framed
prints; midpoint: near meal print passes in front; exit: prints resolve into the
quiet mission. Phone: readable title above a separately composed compact album.
Reduced motion: complete static prints, trace and full information remain visible.

## Source and operational findings

- Original Events page has a heading but no published event listings.
- The source has some legacy aliases and HTTP/absolute internal links. Their
  href values are retained while same-site links resolve to redesigned routes.
- Local source archive records the original text, photos, embeds, and links.
- Some requests to individual sermon pages returned HTTP 429. Their series
  content is also on the already-archived main Listen page; retry missing pages
  after independent implementation rather than hammering the source.
- Preflight: Node and installed Chrome available. Playwright installed for QA.
  Full ffmpeg is initially unavailable; no new videos are generated or encoded.
  Original YouTube embeds and audio URLs remain the playback sources.

## Resolved preflight and archive findings

- A temporary full ffmpeg binary (441 filters) completed preflight and generated
  the screenshot contact sheets. No new video or imagery was generated.
- All individual sermon series were archived after the initial rate limit cleared.
  The old `/listen/sermon-topics` index remained inaccessible; its URL now serves
  an index of the fully preserved series. All linked media and the individual
  series' records were audited against their source pages.
- The main Listen page’s generic “’22 series” is Galatians, verified by matching
  its media IDs to `/listen/galatians`. `/listen/1-corinthians` has a separate set.
  The migration keeps their memberships distinct (9 and 10 recordings).

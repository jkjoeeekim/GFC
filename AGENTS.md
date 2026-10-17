# Project instructions

This project uses React, TypeScript, and Vite.

For landing-page design, scroll-driven experiences, and visual implementation, read and follow `.agents/skills/scroll-craft/SKILL.md` and the references it requires. Use the installed scroll-craft skill as the project's design workflow. Establish the user's brief before generating assets or designing a brand experience.

## Commands

- `npm run dev`: start the development server.
- `npm run build`: type-check and create the production build.
- `npm run lint`: check source code with Oxlint.

## Modular components and admin content

- Keep layout, UI primitives, collection components, page compositions, and homepage sections modular.
- Keep editable information in the typed content layer (`src/content/`), supplied through `App` / `ContentProvider`.
- Add limited site fields to the explicit `editableFields` contract rather than exposing arbitrary markup or styling.
- Keep backend SDKs and admin-service calls out of visual components. A future portal supplies validated, published content through the provider.
- Preserve original church facts, media, and destination URLs when changing presentation. Use the source migration audit for data changes.

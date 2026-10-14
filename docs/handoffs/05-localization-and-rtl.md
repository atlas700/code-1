# Task 05 handoff — localization and RTL plumbing

## Completed

- Added General Translation's `gt-next` provider and configuration.
- Configured `en-US` as the default locale and `ps-AF` (Pashto) as the initial
  supported locale.
- Added a Next.js 16 `proxy.ts` that stores the selected locale without changing
  application URLs.
- Set document `lang` and `dir` values from the active locale; `ps-AF` renders with
  `dir="rtl"`.
- Added a labeled locale selector to the landing page and put its representative
  user-facing copy behind GT translation components.
- Recorded the founder's localization decision in
  [ADR 0001](../adr/0001-launch-localization.md).

## Translation resources and environment impact

- `gt.config.json` declares the future generated-resource path
  `public/_gt/[locale].json` for Pashto.
- GT runtime translation and remote cache access are disabled. Therefore no
  `GT_API_KEY`, `GT_PROJECT_ID`, or unvalidated machine-translated business terms
  are required or present.
- Pashto intentionally falls back to English until terminology is validated and
  reviewed translation resources are generated.

## Acceptance checks

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed (1 test).
- `npm run build` passed and recognized the Next.js Proxy entry.
- Production smoke checks returned HTTP 200 for both English and Pashto-preferred
  requests. The rendered document attributes were `lang="en-US" dir="ltr"` and
  `lang="ps-AF" dir="rtl"`, respectively.

## Limitations and next task

- The Pashto selector and RTL document support are ready, but there are no approved
  Pashto translations yet. Do not enable remote translation until terminology and
  GT credentials are supplied.
- The exact next task is **06 — Decide and integrate authentication only**, which
  remains blocked until G4 approves an authentication provider.

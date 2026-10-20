# Task 05 CI follow-up — restore merged localization layout

## Completed

- Restored the `Viewport` type import and locale/direction lookups lost while
  merging `main` into `feat/localization-rtl`.
- Kept the merge's `ReactNode` layout-prop type and all existing localization
  behavior unchanged.

## Acceptance checks

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed (1 test).
- `npm run build` compiled and completed type checking and page-data collection.

## Changed files

- `src/app/layout.tsx`
- `docs/handoffs/05-localization-and-rtl-ci-fix.md`

## Limitation and next task

The repair is covered by the existing CI typecheck rather than a new unit test.
The exact next task remains **06 — Decide and integrate authentication only**,
which is blocked until G4 approves an authentication provider.

**Update (20 October 2026):** [ADR 0002](../adr/0002-clerk-authentication.md)
approved Clerk. The provider-approval blocker above no longer applies; see the
[Task 06 handoff](06-authentication.md).

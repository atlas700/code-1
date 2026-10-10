# Task 03 handoff — runtime environment validation

## Completed

- Added the server-only `src/env.ts` module, loaded by the root layout at startup.
- It validates `NODE_ENV` as `development`, `production`, or `test` and gives an
  actionable error for any other value.
- Added a redacted `.env.example` with no application-specific variables because
  this baseline has no external services or credentials yet.
- Documented local, staging, and production environment-value handling in
  [Deployment](../deployment.md).

## Environment impact

- No new secrets or required application-specific variables.
- Local private values belong in the ignored root `.env.local`; staging and
  production values remain pending the G4 deployment decision.

## Verification and next task

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed, including a focused invalid-`NODE_ENV` assertion.
- `npm run build` passed.
- The exact next task is **04 — Build the application shell and accessible
  navigation**.

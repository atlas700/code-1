# Task 06 handoff — Clerk authentication

Date: 20 October 2026.

## Status

**Task 06 is complete.** Automated checks and development authentication,
protected-page access, sign-out, keyboard access, and mobile/RTL checks passed.
The user created the development account and completed authentication; no account
identifier or credential value was recorded or committed. Production deployment
and production-cookie inspection remain part of the staging rehearsal. CI
placeholders are not working credentials.

## Implemented

- Installed `@clerk/nextjs` 7.9.17 and kept provider-specific code in `src/auth`.
- Added the provider inside the document body, preserving GT and document locale/
  direction handling.
- Replaced the sign-in placeholder with `/sign-in/[[...sign-in]]`. Signed-in users
  are directed to `/dashboard`; signed-out users see Clerk's sign-in component.
  No local sign-up, invitation, organization, or role workflow was added.
- Added an accessible sign-out button in both desktop and mobile navigation.
- Added server-only `getSession()` and `requireSession()` functions. Their only
  returned identity field is the external Clerk `userId`. They do not establish
  organization membership or business permissions.
- Each of the six application pages invokes `requireSession()` before returning
  its content. Clerk 7 guidance requires resource-level checks; protection does
  not depend on a layout or a deprecated `createRouteMatcher`.
- Composed Clerk's proxy with the existing GT locale middleware. Clerk's request
  matching also covers API routes for future handlers, which must add their own
  session checks.
- Added required-key validation, matching test/live key modes, and an exact
  `APP_ORIGIN` allowlist for Clerk's `authorizedParties`. Live origins require
  HTTPS. Invalid configuration errors do not echo credentials.
- Tracked the redacted `.env.example`, documented setup, and annotated Task 05's
  superseded provider-approval blocker.

## Acceptance and verification evidence

- Baseline before edits: lint, typecheck, the existing 1 test, and build passed.
- `npm run lint`: passed after implementation.
- `npm run typecheck`: passed after implementation. Next route types were
  regenerated for the new optional catch-all sign-in route.
- `npm run test`: passed, **30 tests across 4 files**. Coverage includes signed-out/
  pending session lookup, sanitized identity, guard denial/acceptance on all six
  pages, sign-in availability/redirect decisions, missing/malformed keys, mixed
  key modes, origin validation, and live-instance HTTPS requirements.
- `npm run build`: passed both with nonfunctional CI placeholders and with the
  configured development keys. Compilation does not establish live authentication.
- Before key setup, `/sign-in` returned 500 from the configuration guard. After
  setup, `/` and `/sign-in` return 200 and the real Clerk form renders in Chrome.
- Anonymous requests to all six app URLs returned 307 to the local `/sign-in`,
  preserving each original URL in `redirect_url`. A malformed session cookie is
  also denied. Browser-like requests may first follow Clerk's development-browser
  handshake; Chrome reaches the local sign-in page with the return URL preserved.
- English/Pashto HTTP checks passed for `/`, `/sign-in`, and the catch-all
  `/sign-in/factor-one`: 200 responses with `lang="en-US" dir="ltr"` and
  `lang="ps-AF" dir="rtl"`, respectively.
- Earlier browser connection failures were resolved on retry. Chrome rendered the
  real sign-in form and the authenticated workspace without a framework overlay.
- The user reported successful email account sign-up. The browser returned to the
  original `/purchases` destination with an authenticated session; all six app pages
  then rendered. Visiting `/sign-in` while authenticated redirected to `/dashboard`.
- Keyboard activation of the mobile **Sign out** button returned to `/`. Fresh
  browser navigation to each of the six protected URLs then returned to sign-in,
  confirming that the signed-out session could no longer enter the workspace.
- Desktop keyboard focus reached the skip link. At a 390×844 mobile viewport, the
  workspace and the fully loaded sign-in form had no document horizontal overflow;
  the email field's Tab key moved focus to **Continue**. Selecting Pashto through
  the locale control persisted `lang="ps-AF" dir="rtl"` through workspace access,
  sign-out, and sign-in. English and the normal viewport were restored afterward.
- Browser diagnostics reported no local application console errors. Clerk's
  development-key warning was expected. Browser-extension errors and a hosted
  Clerk Account Portal CSS warning were outside the local application.
- A separate read-only implementation review found no actionable auth bypass or
  SDK misuse. Mocked tests do not establish actual Clerk credential delivery or
  session revocation.

## Completed acceptance checks

- [x] Configure valid Clerk development keys and render the real sign-in form.
- [x] Verify anonymous access to all six protected URLs redirects to `/sign-in`.
- [x] Complete sign-in with a test account using the configured development method.
- [x] Sign in, visit the protected pages, and confirm sign-out removes access.
- [x] Verify direct-route return destinations and the sign-in catch-all steps.
- [x] Verify GT locale selection, English LTR/Pashto RTL, and keyboard/mobile
  usability through the real sign-in flow.

Clerk manages credential validation, session issuance/refresh/revocation, and
cookies. No custom cookie flags or token storage were introduced. Production
guidance was reviewed: configure a production instance and domain, HTTPS, matching
live keys, and the explicit allowed origin. Actual production-cookie inspection
still belongs in the staging rehearsal; development cookies are not evidence of
production behavior. See [setup and smoke checks](../deployment.md#authentication-setup-and-smoke-check),
[Clerk's production guidance](https://clerk.com/docs/guides/development/deployment/production),
and [Clerk's cookie guidance](https://clerk.com/docs/guides/how-clerk-works/cookies).

## Changed files

- Dependency/configuration: `package.json`, `package-lock.json`, `.gitignore`,
  `.env.example`, `.github/workflows/ci.yml`, `vitest.config.mts`.
- Authentication: `src/auth/server.ts`, `src/auth/components.tsx`,
  `src/auth/middleware.ts`, `src/proxy.ts`.
- Environment validation: `src/env.ts`, `src/env.test.ts`.
- Tests: `src/auth/server.test.ts`, `src/auth/protected-pages.test.ts`,
  `src/auth/sign-in.test.ts`.
- UI: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/(app)/layout.tsx`,
  all six existing `(app)` page files; moved `src/app/sign-in/page.tsx` to
  `src/app/sign-in/[[...sign-in]]/page.tsx`.
- Documentation: architecture, deployment, security, testing, both Task 05 handoffs,
  and this handoff.

## Environment and migration impact

- Required: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public), `CLERK_SECRET_KEY`
  (server-only), from the same Clerk instance.
- `APP_ORIGIN`: exact allowed application origin; defaults to
  `http://localhost:3000`. Set explicitly for other ports/environments.
- Sign-in path `/sign-in`, fallback destination `/dashboard`, and sign-out
  destination `/` are configured in code.
- No database, schema, migrations, authentication-user import, or persistent local
  business data was introduced. Rollback is a code/dependency revert; it does not
  remove any external Clerk account or user.

## Limitations and next task

- The pilot sign-in method remains a product decision. Phone OTP is unapproved
  until Pilot A–C validation is recorded and reviewed under ADR 0002. Development
  testing does not approve a pilot method. No provider setting was changed.
- Pashto remains English fallback; Clerk UI has no approved Pashto localization.
- Organizations, authorization roles, and protected business data are absent.
- `npm audit --omit=dev` reports existing production advisories for Next 16.3.5
  (including a critical `next/og` ImageResponse advisory), sharp, and source-map-js.
  None concerns the added Clerk packages. Dependency patching was kept outside
  this authentication task; review before any deployment.
- The exact next task is **07 — Introduce PostgreSQL, Drizzle, and migration
  workflow**, subject to the
  required database/infrastructure decisions. G1 discovery remains outstanding
  before dependent business-domain implementation.

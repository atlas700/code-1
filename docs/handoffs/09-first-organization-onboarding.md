# Task 09 handoff — first-organization onboarding

Date: 26 October 2026.

## Status and acceptance

**Task 09 is complete and ready for review.** It implements authenticated
first-business setup under ADRs 0014/0015. Acceptance checks and the final quality
pass are complete. No Task 10 roles or permissions are added.

- [x] Authenticate inside both the onboarding page and directly callable Server
  Action. Validate explicitly selected fields with direct production Zod 4.6.7;
  ignore client actor, organization, role, retry references, and previous state as
  authority. Business type/timezone are explicit; currency is AFN and languages
  remain the two approved locales.
- [x] Use Clerk organization creation and its creator membership. Verify remote
  creator, private request marker, and exact current organization/user membership
  before pinning the remote ID or provisioning local business data.
- [x] Reserve one durable request per authenticated creator. Reuse its UUID-derived
  unique Clerk slug for concurrent/ambiguous creation; pin verified remote success
  before local writes. Reject replacement IDs and conflicting saved details.
- [x] Commit the local mapping and settings atomically. Concurrent/repeated
  completion creates one mapping/settings pair; a constraint failure rolls back
  the mapping and retains the remote reference for retry. Do not overwrite settings.
- [x] Show safe inline validation, pending feedback, a focusable linked error
  summary, conflict/denial guidance, and correlated unexpected errors. Keep inputs,
  SQL, raw errors, credentials, and provider payloads out of diagnostics.
- [x] Offer activation only after confirmed local success. Clerk `setActive`
  precedes a full dashboard navigation; retrying activation does not create again.
  Missing active local tenancy routes the app layout to onboarding, with resource
  guards retained. No switcher, invitations, billing, or membership mirror.
- [x] Verify real development sign-in, invalid timezone and retained values,
  first creation, no active organization before activation, dashboard access,
  saved-detail reload, repeated completion, 390px RTL layout without horizontal
  overflow, labelled 44px controls, real membership-removal denial, and sign-out.
  The temporary marked user, remote organization, and local rows were removed.

## Files and interfaces

- `src/app/onboarding/page.tsx`, `error.tsx`, `_components/onboarding-form.tsx`,
  `actions.ts`, and `_lib/{state,failure}.ts`: page, minimal controlled form,
  creator-only mutation, result union, and safe diagnostics.
- `src/auth/onboarding.ts`, `organization-activation.tsx`: Clerk creation/recovery,
  current creator-membership verification, and activation control.
- `src/db/onboarding.ts`, `schema/index.ts`: durable reservation, conditional
  remote-ID pin, atomic local completion, settings/request schema.
- Tests: auth provisioning, action failures/validation, protected routing and page
  failures, rendered form feedback, and opt-in real PostgreSQL integration tests.
- `drizzle/0002_organization_onboarding.sql` and generated metadata: additive
  settings/request tables; existing organizations and prior history unchanged.
- `package.json`/lockfile: promote the already installed Zod version to an exact
  production dependency. No form/action/UI library is introduced.
- Build plan, API conventions, architecture, database, deployment, security,
  testing, and documentation index describe the implementation and open gates.
  `AGENTS.md` contains only Next.js's generated heading-level adjustment.

The exact action input/result and each partial-failure path are recorded in
[API conventions](../api-conventions.md#implemented-onboarding-contract).

## Pre-validation review

Used `ponytail:ponytail-review` on the complete task diff, connected page/layout,
session and tenant callers, auth adapters, persistence, generated migration,
tests, and operational documentation. Assumed the small invited pilot, including
multiple tabs and concurrent server processes. Traced authentication, creator
authority, revocation, tenant isolation, input validation, parameter binding,
remote/local partial success, non-overwrite behavior, safe errors, and accessibility.

Resolved findings before the final quality pass:

1. A saved-setup read could expose a database failure to Next.js error logging.
   Added a safe correlated page failure without the raw error; regression tested.
2. A failed creation followed by an absent recovery lookup could hide the original
   provider failure. Preserve the original error for the server boundary while
   keeping client errors/diagnostics sanitized; regression tested.
3. Validation needed an explicit keyboard destination. Added focus to a linked
   error summary and verified its field/message relationships in rendered markup.
4. Live provisioning exposed disabled organization slugs. Enabled only development
   `slug_disabled: false` through the documented Backend API and independently
   verified readback; membership optional, automatic creation off, and cap five
   remained unchanged. Retry and idempotent resume then passed.

No unresolved must-fix findings. The reserved-slug operational constraint below is
documented in code and deployment guidance; no slug-editing UI is in scope.

## Verification and operational impact

- Final `npm run lint` and `npm run typecheck`: pass.
- Final `npm run test`: **126 pass**, with eight opt-in database tests explicitly
  skipped when no verification URL is supplied.
- The eight isolated PostgreSQL tests were separately run against
  `afcs_task07_verify`: **8 pass**, including six-way concurrent reservations and
  completions, rollback, non-overwrite, creator scoping, and unique remote ownership.
- `npm audit --omit=dev --audit-level=high`: **zero vulnerabilities**.
- Schema regeneration: no changes. Applied the reviewed migration twice on the
  verification database; exactly three migration rows, preserved prior hashes,
  and the new hash matched the reviewed SQL. Applied it to `afcs_dev` afterward.
  Both databases retain all migrations and have zero setup/settings/organization
  fixture rows after cleanup.
- Final `npm run build`: pass with CI's nonfunctional Clerk keys and an unreachable
  database URL. `/onboarding` is a dynamic route; compilation needs no live services.
- `git diff --check` and all **209 local links/anchors across 50 documents**: pass.

No runtime environment variable or CI change. The optional
`AFCS_TEST_DATABASE_URL` is test-only. Other environments must explicitly apply
the migration and enable Clerk organization slugs before using onboarding; builds
and startup do neither. The development provider setting change is independently
described in [deployment](../deployment.md#onboarding-recovery-slugs).

## Limitations, recovery, and next task

Keep the reserved slug and its private marker unchanged until the remote ID is
pinned. An external dashboard/API rename during that gap requires reconciliation
before retrying. Pinned IDs tolerate later slug changes. Removed membership and a
deleted pinned organization deny recovery; local history stays intact. Do not drop
tables or delete real organizations to roll back code. Use reviewed forward fixes.

Pashto retains approved English fallback copy until terminology is validated.
Production cookies, pilot phone-OTP delivery, staging, backup restoration, and
deployment were not validated. No permanent browser E2E framework or CI database
service was added; these retain their planned scope.

Next: **10 — Define roles, permissions, and the authorization guard**, blocked
until the G4 permission matrix is approved. G1 research still blocks Tasks 13–35;
decimal policy, pilot sign-in validation, and deployment gates remain open.

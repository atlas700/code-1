# Task 10 handoff — local business authorization

Date: 27 October 2026.

## Status and acceptance

**Task 10 is complete and ready for review.** Acceptance checks, pre-validation
review, and the final quality pass are complete.
The founder explicitly approved [ADR 0016](../adr/0016-local-business-authorization.md)
before feature code. Its full permission matrix is the policy reference, including
viewer financial reads and warehouse purchase-price reads. G1 remains open.

- [x] Define seven fixed role defaults and twenty action permissions without a
  dependency, custom roles, role editor, or editable mapping tables. Unknown
  roles/permissions and Clerk Admin/Member labels grant nothing.
- [x] Store a local role against the exact organization/membership/user identity.
  Check current Clerk membership on every authorization call; removed/rejoined
  memberships do not revive old grants. Reads never provision or grant access.
- [x] Authenticate and check the appropriate permission in all six existing
  application pages. Keep the layout's initial-setup routing and the narrow
  onboarding exception. Future data operations/actions must check independently.
- [x] Bootstrap the verified creator's initial owner role and persistent membership
  marker atomically with local provisioning. Serialize concurrent attempts by
  locking the saved request. Stale retries cannot restore demoted/deleted grants;
  another membership is denied. Failed writes roll back together.
- [x] Preserve redirects/framework control flow and safe action diagnostics.
  Authenticated permission denials use `notFound()` without business data;
  service failures throw a sanitized error without the original cause.
- [x] Provide unit and real PostgreSQL evidence for representative permitted and
  forbidden actions, identity/tenant isolation, concurrency, and rollback.

## Files and interfaces

- `src/auth/permissions.ts`: fixed role defaults, `Permission` type, and pure
  `hasPermission()` lookup. This contains no secrets or grant state; enforcement
  belongs in the server-only guard.
- `src/db/authorization.ts`: `requirePermission(permission): Promise<TenantContext>`.
  It calls `requireSession()` and `getTenantContext()` itself, then performs one
  parameterized role query scoped by local organization, membership, and user.
  It accepts no caller identity/role arguments and caches nothing.
- `src/db/schema/index.ts`, `drizzle/0003_business_roles.sql`, generated snapshot
  and journal: one assignment table and nullable onboarding bootstrap marker.
- `src/auth/onboarding.ts`, `src/db/onboarding.ts`, and onboarding `actions.ts`:
  return verified membership identity internally, preserve the pinned remote ID,
  and perform one-time local owner bootstrap. `completeOnboarding()` now also
  receives verified membership and returns a success/denial boolean.
- All six `(app)` pages use resource permission checks. Dashboard, deferred sales,
  and basic settings placeholders use `organization.read`; inventory, purchases,
  and payments use their own read permissions. No business workflows are added.
- Permission/guard unit tests, connected provider/action/page tests, and the
  extended isolated PostgreSQL suite cover the changed interfaces and fixtures.
- ADR index, build plan, architecture, API conventions, security, database,
  deployment, testing, and documentation index describe the policy and rollout.

## Guard usage

Use a server-owned permission literal inside each protected data operation:

```ts
import { requirePermission } from "@/db/authorization";

const tenant = await requirePermission("purchases.read");
// Scope the purchase query to tenant.organizationId, including validated resource IDs.
```

The same guard belongs inside a future mutation's server operation with its write
permission. It already authenticates and verifies tenancy; schema validation and
resource ownership checks remain required. `staff.manage` does not authorize owner
changes: Task 11 must additionally require `ownership.manage` and preserve the last
active owner. Layout guards and UI visibility cannot replace these checks.

## Pre-validation review

Used `ponytail:ponytail-review` on the complete task diff, connected session and
membership adapters, tenant resolution, all page/action callers, schema/SQL,
fixtures, tests, and operating documentation. Assumed the invited pilot with
multiple tabs and concurrent server processes. Traced input validation,
authentication, exact tenant/membership/user authority, fixed permissions,
revocation, parameter binding, transactional bootstrap, safe errors, and preserved
accessibility/server-client boundaries.

One coverage finding was resolved: the legacy Task 09 upgrade path needed direct
evidence. Added an isolated regression proving a pre-existing mapping/settings pair
stays denied on reads until explicit verified setup resume creates the first grant.
Rechecked that path and the guard return contract. No unresolved must-fix findings.

## Verification and migration impact

- Final `npm run lint`, `npm run typecheck`, and `npm run build`: pass. The build
  uses CI's nonfunctional Clerk keys and an unreachable database URL, proving
  compilation does not require live services. All application pages remain dynamic.
- Final `npm run test`: **167 pass**, with the **15** opt-in database tests
  explicitly skipped without `AFCS_TEST_DATABASE_URL`.
- The complete isolated PostgreSQL suite separately passes **15 tests** on
  `afcs_task07_verify`, including six-way concurrent completion, competing
  membership claims, legacy upgrade, role non-restoration, rollback, and real guard
  scoping. Synthetic fixture rows were removed afterward.
- Reviewed generated SQL is additive. Applied it twice on the isolated database
  and once on `afcs_dev`; both have exactly four migrations, unchanged prior
  hashes, and a new hash matching the reviewed SQL. All four application tables
  are empty in both databases after verification.
- Schema regeneration reports no changes. `git diff --check`, the 140-cell
  ADR-to-code matrix comparison, and local documentation link/anchor checks pass.

No dependency, environment-variable, or CI changes. Other environments must
explicitly apply the migration; application startup and builds do not apply it.

## Limitations and next task

Other environments must apply the additive migration before deploying this guard.
Existing Task 09 creators must explicitly resume their saved setup once for the
first owner grant; there is no read-time or bulk role upgrade. A business without
a verifiable saved request needs separately reviewed recovery. Never reset the
bootstrap marker to repair a permission denial. Retain local history and grants
after remote membership removal; the exact current membership remains mandatory.

No new browser/E2E or live-provider mutation smoke was run for Task 10. Provider
membership behavior is covered by the connected adapter tests; real PostgreSQL
checks use synthetic identities. Production sign-in/cookies, deployment, backups,
and G1 research remain open. All pages still contain their intentional placeholders.

Next: **11 — Add staff invitation and membership management**, under ADRs 0014/0016.
It owns non-owner staff management, ownership changes, and the last-active-owner
invariant. Task 12 still needs decimal-policy approval; G1 blocks Tasks 13–35.

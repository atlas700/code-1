# Task 11 handoff — staff invitation and membership management

Date: 28 October 2026.

## Status and acceptance

**Task 11 is complete and ready for review.** Acceptance checks, pre-validation
review, and final validation pass. Scope follows accepted ADRs 0014–0016; no new role policy,
membership mirror, permission catalogue change, or infrastructure is introduced.

- [x] Owners/admins can list current Clerk staff and pending invitations under
  Settings → Manage staff, invite by email, add an existing Clerk account, assign
  or change its fixed local role, deactivate membership, and revoke invitations.
- [x] Invitations/manual additions create Clerk `org:member` membership only.
  An authorized owner/admin explicitly grants the business role after joining.
  No business role is inferred from Clerk roles, email, invitation, or prior grants.
- [x] `/join` authenticates without requiring a business grant, displays only the
  caller's account ID and memberships, and allows explicit business activation.
  Home, onboarding, and Settings link to it. Activation grants no business access.
- [x] Every command validates untrusted input, derives the current tenant, checks
  `staff.manage`, locks its organization row, then rechecks the actor's current
  membership/local role. Targets must belong to that exact organization.
- [x] Granting/demoting/removing owners also requires `ownership.manage`. Current,
  exact membership/user grants determine active owners. Competing demotions and
  removals preserve one active owner; queued actors cannot use revoked privileges.
- [x] Remote removal denies stale-session access. Rejoining with a new membership
  ID does not revive the old grant. Retain historical grants and bootstrap markers.
- [x] Preserve framework redirects/denials, expose safe correlated mutation errors,
  strip invitation URLs/metadata, refresh on success, and provide pending/error/
  empty states with labelled controls, keyboard focus, and translation boundaries.

## Changed files

- `src/auth/staff.ts` and `staff.test.ts`: small Clerk adapter for membership and
  pending-invitation reads, invite/add/remove/revoke, and personal business choices.
- `src/db/staff.ts`, `staff.test.ts`, and `staff.integration.test.ts`: guarded
  staff workspace, validated commands, serialized role/lifecycle mutations, exact
  owner counting, and unit/isolated PostgreSQL evidence.
- `src/app/(app)/settings/staff/`: Server Component page, loading/error boundaries,
  Server Action and tests, and one small client form with pending/result feedback.
- `src/app/join/`: authenticated staff entry, business selection, loading/error
  boundaries, and page tests. Reuses `src/auth/organization-activation.tsx`, whose
  copy now applies to both first-business setup and joining an existing business.
- Existing Settings, home, and onboarding pages expose the relevant entry links.
- Build plan, architecture, API, database, security, deployment, testing, and
  documentation index record the implemented boundary, recovery, and next task.

No schema, migration, dependency, environment-variable, CI, or provider-setting
changes. Existing reviewed migrations through `0003_business_roles.sql` remain
required. No live accounts, organizations, invitations, email, or SMS were changed
during implementation or verification.

## Expiry and recovery

Email invitations explicitly expire after **30 days**. Clerk sends them only when
its Email/invitation support is configured. The app does not install a mail/SMS
provider or enable sign-up. A disabled/misconfigured provider returns a safe error;
use manual addition of an already provisioned, signed-in account instead.

1. Have staff sign in and open `/join`. Obtain their displayed account ID through
   the business's normal trusted communication. Add that exact account under
   Settings → Manage staff, then explicitly assign its business role. Staff reload
   `/join` and open the business. Joining without a grant stays denied.
2. After invite/add timeout or a refresh error, reload current staff and pending
   invitations before retrying. An existing live pending invite is reused without
   resending; repeat additions recover the exact organization/user membership.
   Revoke an expired or unwanted pending invitation before issuing a replacement.
3. After an ambiguous deactivation/revoke, reload. A remotely removed membership
   remains revoked even if a local transaction/response failed. Retained grants
   cannot authorize absent/rejoined membership. Do not recreate membership or
   restore a role automatically as compensation. Repeat removal of an absent
   target returns a safe conflict.
4. A local role-write failure rolls back; reload its current role and retry the
   explicit change if still authorized. After self-demotion/removal, losing access
   to the staff page is expected. Another active owner/admin continues management.
5. All application staff mutations share a PostgreSQL organization row lock. Clerk
   is outside that transaction. Direct provider edits, account deletion, or
   self-service departures can bypass application owner protection and race its
   remote membership snapshot. Use the app for staff/ownership changes. An
   externally orphaned organization needs separately reviewed operator recovery;
   never reset the bootstrap marker or infer ownership from Clerk Admin.

Reads fail closed when the provider returns an incomplete list (over 100 entries)
or inconsistent identities. This exceeds the approved pilot's included member
cap; add pagination only after a new scale/cost decision. Pending invitations may
also require operator cleanup if that limit is reached.

## Pre-validation review

Used `ponytail:ponytail-review` against the complete task diff, connected session,
tenant/permission guards, onboarding/activation callers, schema constraints,
provider interfaces, tests, and operating documents. Assumed the invited pilot
with multiple tabs and concurrent server processes. Checked trust boundaries,
SQL binding, exact tenant/membership/user identity, owner rules, remote/local
partial outcomes, retries, error/secret exposure, and accessible client boundaries.

Resolved findings before final validation:

- Check current actor membership again on staff reads as well as writes.
- Reject an inconsistent stored membership/user pair and check that the
  conditional role upsert actually saved a row; regression tests cover both.
- Ensure the queued-actor PostgreSQL test reaches the transaction after passing
  initial permission verification, before releasing the competing demotion lock.
- Keep the operation result type in the database service instead of making the
  service depend on an application UI contract file.
- Use a full-page reload for staff access so a newly added membership is fetched
  rather than potentially reusing the client router's existing page.

No unresolved must-fix findings. Out-of-band Clerk changes remain an explicit
distributed-system limitation, not an atomic PostgreSQL guarantee.

## Verification

- Focused provider/action/UI/security tests: pass.
- Full unit suite: **213 pass**, **21 opt-in PostgreSQL tests skipped** without
  `AFCS_TEST_DATABASE_URL`.
- Isolated PostgreSQL acceptance: **21 pass** (15 existing onboarding/authorization
  tests and 6 new staff tests); strengthened queued-actor test also passes.
  Synthetic fixtures are cleaned up and no development database is mutated.
- Final `npm run lint` and `npm run typecheck`: pass. A UI test mock's overly
  broad callable type was corrected and its four focused tests rerun successfully.
- Production `next build` (the `npm run build` script command): pass with CI's
  nonfunctional Clerk keys and unreachable database URL. All routes, including
  `/join` and `/settings/staff`, remain dynamic; compilation needs no live services.
- `git diff --check` and **265** local documentation links/anchors: pass.

## Limitations and next task

No live Clerk mutation, invitation delivery/acceptance, OTP, or browser interaction
smoke was run. Provider behavior is checked through connected adapter tests;
PostgreSQL concurrency uses synthetic provider identities. Static rendering checks
markup and feedback, not browser behavior. Email invitations
require Clerk Email; manual addition requires an already provisioned account.
Runtime translation, pilot sign-in evidence, G1 research, and deployment/backup
verification remain open.

Next: **12 — Add shared domain primitives for money, quantities, and status
transitions**, under accepted ADR 0019. Tasks 13–35 remain blocked by G1 evidence.

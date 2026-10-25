# Task 08 handoff — Clerk organizations and tenant context

Date: 25 October 2026.

## Status and acceptance

Implementation and automated/local database acceptance pass. **Task 08 is not fully
complete:** enabling development Clerk Organizations with membership optional
requires Dashboard access unavailable to this agent. Submit a draft PR for review;
complete the remaining setting check before marking it ready. No business UI or
organization/member creation is included.

- [x] ADR 0014 records the founder-approved use of Clerk organizations/memberships
  with local business roles. ADRs 0002/0013 identify their superseded provisions.
  Build-plan Tasks 08–11 and architecture/security/database docs agree; G1 and the
  remaining G3/G4 gates stay open.
- [x] Add only `organizations`: generated UUID primary key, unique required Clerk
  organization ID, required UTC creation instant. Generate/review
  `0001_organizations.sql` and metadata; preserve `0000_baseline.sql` unchanged.
  Regeneration reports no schema changes.
- [x] Verify the authenticated active organization/user pair against Clerk's
  Backend API with exact filters; reject absent/deleted/mismatched membership.
  Session role claims never authorize business access. Identity-only session
  helpers and their current page callers are unchanged.
- [x] Resolve only the matching local UUID, without writes, fallback selection,
  client-provided tenant authority, or cross-request membership caching. Missing
  mapping yields no context; unexpected failures have sanitized errors.
- [x] Before migration, `afcs_task07_verify` contained only the baseline ledger.
  Apply migration twice with the application role: exactly two ledger rows, original
  baseline hash preserved, new hash matches reviewed SQL, only the ledger and
  `public.organizations` exist. Synthetic transaction checks prove distinct generated
  UUIDs, timestamp defaults/type, duplicate rejection (`23505`), and null rejection
  (`23502`). Roll back fixtures and verify zero organization rows.
- [x] Apply to `afcs_dev` only after isolated success; verify two ledger rows and
  an empty organization table. No existing records are removed.
- [x] Final `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`
  pass. **75 tests across 8 files**, including 25 new tenancy tests. Build uses CI's
  nonfunctional Clerk keys and unreachable database URL; it needs no live services.
- [x] All 179 local Markdown links/anchors across 47 project documents and
  `git diff --check` pass.
- [ ] Development Clerk Organizations enabled, membership optional, automatic
  organization creation off. See the remaining setup below.

## Pre-validation review

Used `ponytail:ponytail-review` on the full diff, new modules/tests, existing session
helpers and page callers, schema/migration, and affected ADR/gate documentation.
Assumed the small invited pilot, not a high-volume public deployment. Reviewed
authentication, tenant isolation, injection, secret/PII exposure, failure handling,
and schema compatibility; tenant resolution is read-only, so no new business
transaction is involved.

One must-fix finding: catching errors around Clerk `auth()` could also swallow
Next.js request-time/redirect control flow. Added the installed guide's
`unstable_rethrow()` before sanitization and a regression test preserving a real
Next redirect. Rechecked the changed paths before the final checks. No remaining
code findings; live configuration remains an acceptance limitation.

## Interfaces and changed files

- `src/auth/organizations.ts` exports the server-only
  `getActiveOrganizationMembership()` adapter and its identity-only result type.
- `src/db/tenant.ts` exports server-only
  `getTenantContext(): Promise<{ userId: string; organizationId: string;
  membershipId: string } | null>`. `organizationId` is the local UUID;
  `membershipId` is the current Clerk membership identity for later local grants.
- Tests: `src/auth/organizations.test.ts`, `src/db/tenant.test.ts` (real Drizzle
  query generation with mocked transport, no live credentials/services).
- Schema/history: `src/db/schema/index.ts`, `drizzle/0001_organizations.sql`,
  `drizzle/meta/0001_snapshot.json`, `drizzle/meta/_journal.json`.
- Documentation: ADR 0014 and ADR/index cross-references, build plan, architecture,
  database, deployment, security, testing, documentation index, and this handoff.

## Remaining live setup

Inspected the configured **development** instance through Clerk's Backend API and
public environment configuration. Initially Organizations were disabled, membership
optional, automatic creation off, and the membership cap five. The Backend API's
enable operation also set membership required. Restored Organizations to disabled
and verified optional membership and automatic creation off again, preserving the
original sign-in behavior. No organization, user, invitation, or membership was
created, and credentials were never printed or committed.

The installed SDK cannot set membership optional. Browser control exposed no
authenticated browser and native control was unavailable. The user has been asked
to enable Organizations with **Membership optional** in the development Dashboard
and leave **Create first organization automatically** off. Verify all three values
afterward using the procedure in [deployment](../deployment.md#development-organization-settings).
Do not repeat the Backend API enable call: it reinstates required membership.

## Migration, limitations, and next task

No new dependency, environment variable, CI job, role, membership mirror, webhook,
or UI is added. Production audit was not repeated because dependencies/CI are
unchanged. Browser sign-in, real membership-removal smoke tests, production cookies,
backup restoration, and deployment are not revalidated. Mocked revocation tests do
not establish live-provider revocation behavior.

Apply history explicitly with `npm run db:migrate`; startup/build/quality CI never
migrate. Keep applied history and local business data if a remote organization is
deleted. Revert code if necessary and use reviewed forward fixes; do not drop the
mapping table as a rollback. Tenant lookup depends on Clerk latency/availability
and API limits; no local authority fallback exists. Local mappings remain empty
until Task 09 provisioning.

Finish the Clerk setting check above, then proceed to **09 — Implement
first-organization onboarding**, only after G4 mutation-boundary approval. Task 10
still needs the permission matrix; G1 continues to block Tasks 13–35.

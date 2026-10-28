# Task 13 — Units and product categories

Date: 28 October 2026.

## Authorization and scope

After being told Task 13 was blocked by incomplete G1 evidence, the founder
instructed “implement it”. ADR 0003 and the build plan record the Task 13-only
exception. G1 remains open for Tasks 14–35 and pilot release. Interview counts,
payment policy, phone sign-in, and deployment readiness are unchanged.

The product-unit policy is kg stock with gram precision under ADR 0019. Fixed
weights include the approved kg/maan/khorwar definitions from ADR 0017; bags require
the actual weight per line. Custom measures are business-owned fixed weights.
Categories start empty because no category defaults have been validated.

## Delivered acceptance checks

- Tenant-owned units and product categories with generated UUIDs, organization
  foreign keys, bounded names, case-insensitive per-tenant name uniqueness,
  deactivation, and exact weight constraints.
- `/settings/catalog`, linked from Settings: lists, creates, edits, deactivates,
  and an explicit idempotent action to add approved pilot units. Read-only staff
  see the lists; owner/admin/manager controls follow `catalog.manage`.
- Every mutation authenticates, validates Zod input, derives tenant authority,
  serializes against staff changes, and rechecks membership and role after waiting.
  Cross-tenant/unavailable/inactive targets return conflict; grants are not inferred
  from Clerk role or prior membership. No row is deleted or automatically revived.
- Fixed weights use Task 12's exact string/bigint helpers. Bag lines require their
  own weight. Snapshot reads preserve the entered measure and quantity, reject
  sub-gram converted stock, and return copied scalar weights for future posting.
  Tests include fractional/custom weights, 10/11-maan bags, 100 maan = 440 kg,
  tenant isolation, and preservation of earlier snapshots after edits/deactivation.
- Forms retain input through validation/errors, label controls, support pending
  state and keyboard focus, announce safe feedback, and follow existing translated
  `T`/RTL-friendly patterns. Loading and recoverable error states are included.

## Changed files and migration impact

- `src/db/schema/index.ts`; generated `drizzle/0004_catalog_units_categories.sql`,
  `drizzle/meta/0004_snapshot.json`, and migration journal: additive tables only.
  The unscaled numeric column plus CHECK constraints rejects excess precision
  rather than silently rounding it as `numeric(p, 3)` would.
- `src/db/catalog.ts`, `catalog.test.ts`, and `catalog.integration.test.ts`:
  tenant-scoped queries/commands, unit snapshots, service and PostgreSQL tests.
- `src/app/(app)/settings/catalog/`: page, Server Action, client form, loading/error
  boundaries, action/static-render tests; Settings adds the entry link.
- `.github/workflows/ci.yml`: include catalogue tests in the existing disposable
  PostgreSQL job. No dependencies or environment variables added.
- ADRs 0003/0013/0019, build plan, documentation index, API/database/testing docs,
  and the research record: limited authorization exception and current contracts.

## Pre-validation review

Used `ponytail:ponytail-review` on the full task diff, connected Settings page,
authorization/membership adapters, staff locking, exact helpers, generated SQL,
Server Actions/forms, service/action/UI/integration tests, and CI/docs. Assumed
the invited pilot with concurrent requests across processes. Checked trust-boundary
validation, identity/tenant scoping, query parameters, stale queued actors,
constraint errors, precision/range, deactivation, snapshots, retained form values,
and accessible/read-only controls.

Resolved a concurrency finding during development: reusing `requirePermission`
inside the locked transaction could request a second pool connection while all
ten connections were occupied by queued mutations. The recheck now uses the
transaction's connection for database reads and verifies the provider membership
directly. Twelve concurrent seed requests pass without duplicate units; a revoked
queued actor is denied. Added changed organization/membership/user/null-membership
regressions and rechecked those paths.

No unresolved must-fix findings. Last-successful-write semantics for concurrent
edits and absence of purchase/receipt snapshot persistence are explicit task limits.

## Verification

- Final `npm run lint`, `npm run typecheck`, and `npm run build`: pass. The
  production build includes the dynamic `/settings/catalog` route and uses the
  existing local environment; no authenticated browser flow was exercised.
- Final `npm run test`: **408 tests pass**; the **35 opt-in PostgreSQL tests**
  skip without `AFCS_TEST_DATABASE_URL` in this normal database-free run.
- Isolated PostgreSQL acceptance: **35 tests pass** across onboarding/authorization,
  staff, and catalogue, including **14 catalogue integration tests**. Synthetic
  fixtures are removed afterward. Clerk membership is mocked in these tests.
- Focused catalogue service/action/static-render acceptance: **36 tests pass**.
- The reviewed fifth migration applied/reapplied on `afcs_task07_verify` and
  `afcs_dev`. Both have five ledger hashes; all prior hashes were preserved.
  The new development unit/category tables remain empty until explicitly populated.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**. This is
  required because CI now runs the new integration suite; no dependency changed.
- `git diff --check` and **289** local documentation links/anchors across **62**
  Markdown files: pass.

## Limitations and next task

No product, supplier, purchase, receipt, financial posting, or inventory workflow
is added. Snapshots are returned values; future posting services must persist them
atomically with the transaction, enforce positive quantities, and apply their
workflow's permissions/concurrency policy. Snapshot calculation accepts zero like
Task 12. Edits use last successful write; there is no optimistic-conflict editor.
Inactive entries remain in history and cannot be edited/reselected/reactivated
through this task. Lists are intentionally small pilot catalogues, without search
or pagination.

Live browser interaction, translated-label usability, and real Clerk membership
changes were not tested; static rendering and mocked-provider integration tests
are separate evidence. Remote PR checks must be distinguished from local checks.

Next: **14 — products**, still blocked by G1. The Task 13 exception does not close
research or authorize later tasks. Pilot phone sign-in and deployment/restore
readiness remain open independently.

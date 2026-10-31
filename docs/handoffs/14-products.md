# Task 14 — Products

Date: 31 October 2026.

## Authorization and acceptance

After being informed that G1 still blocked Task 14, the founder instructed
“implement it”. ADR 0003 and the build plan record a Task 14-only exception.
G1 remains open; Task 15 and later and pilot release still need its evidence.

- Products have tenant-owned UUIDs, validated names, optional codes and categories,
  required weight units, and an active flag. Names and non-null codes are unique
  per business ignoring case and outer spaces, including inactive records.
- `/products`, linked from Settings, provides creation and lists with detail
  links. `/products/[id]` provides detail/edit/deactivation. Read-only roles see
  records without mutation controls; inactive products retain readable history.
- The existing catalogue service/transaction enforces `catalog.read` and
  `catalog.manage`, derives authority server-side, shares staff's organization
  lock, and rechecks fresh provider membership and the local grant after waiting.
  SQL is parameterized. Spoofed authority is ignored; foreign targets are denied.
- Composite database foreign keys prevent cross-business unit/category links.
  Creates/edits require active references. Inactive references stay readable but
  must be replaced or an optional category cleared when editing. Deactivation
  remains possible with inactive references. No rows are deleted or revived.
- Forms retain values through errors, label controls, disable pending controls,
  announce safe feedback, and follow the existing translated/RTL-friendly style.
  Loading, recoverable errors, missing details, and setup/empty states are included.
- Unit/category mutations refresh product pages, and each Server Action accepts
  only its own operation names. Ambiguous outcomes instruct users to reload
  before retrying. Default prices and stock computation remain deferred.

## Changed files and migration impact

- `src/db/schema/index.ts`, `src/db/catalog.ts`: additive product schema,
  same-tenant reference constraints, shared commands, list/detail reads.
- Generated `drizzle/0005_products.sql`, `drizzle/meta/0005_snapshot.json`, and
  migration journal. No prior migration is changed; new referenced unique
  constraints precede foreign keys in reviewed SQL.
- `src/app/(app)/products/`: pages, action, form, loading/error/not-found states,
  action and static-render tests. Settings adds the entry link; the existing
  catalogue action/test includes product refresh and operation scoping.
- `src/db/products.test.ts`, `products.integration.test.ts`; CI includes the new
  integration suite in its existing disposable database job.
- ADRs 0003/0013/0019, build plan, documentation index, database/API/testing docs,
  and G1 register reflect the exception, contracts, and remaining evidence.
- No dependency, environment-variable, provider, or deployed-resource changes.
  Unrelated local skill-installation changes are excluded.

## Pre-validation review

Used `ponytail:ponytail-review` on the complete task diff and connected catalogue
forms/actions, authorization/membership adapters, staff locking, schema/migration,
service/action/UI/database tests, CI, and docs. Assumed the invited pilot with
concurrent requests across processes. Traced input validation, tenant/identity
boundaries, SQL parameters, stale queued actors, constraint failures/rollback,
deactivation, cache refresh, retained values, and accessible/read-only controls.

Resolved three findings and rechecked their connected tests:

1. Drizzle generated foreign keys before their newly added referenced unique
   constraints. Reordered only the new migration before applying it; isolated
   migration/reapplication and direct constraint tests pass.
2. Unit/category changes also affect product labels/options. The existing action
   now refreshes product list/detail paths. Its allowlist prevents product
   operations being dispatched through the unit/category action; a regression
   test covers this boundary.
3. Dynamic product labels and error references inside translated text must use
   GT's `Var` placeholders. Updated the new markup to the current documented
   syntax; rendering tests and the production build cover the corrected paths.

No unresolved must-fix findings. Edits retain existing last-successful-write
semantics. Products are listed in full for this pilot; pagination is deferred.

## Verification

- Final `npm run lint`, `npm run typecheck`, and `npm run build`: pass. The
  production build includes dynamic `/products` and `/products/[id]` routes.
- Final `npm run test`: **448 tests pass**. The **49 opt-in database tests**
  are explicitly skipped in this database-free run.
- Isolated PostgreSQL acceptance: **49 tests pass** across all four suites,
  including **14 product tests**. Clerk membership is mocked. Product fixtures
  are removed after execution; the retained `task14_org_` count is zero.
- Product service/action/static-render coverage: **39 tests pass**, included
  in the full run. The connected catalogue action has an additional regression
  for operation scoping and assertions for product cache refresh.
- Migration 0005 applied/reapplied successfully on `afcs_task07_verify` and
  `afcs_dev`; both retain six ledger entries and unchanged prior hashes/timestamps.
  Reviewed the generated SQL before application and exercised direct constraints.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**, required
  because CI now includes the product database suite. No dependencies changed.
- **357** local Markdown links/anchors across **67** files and
  `git diff --cached --check`: pass.

Remote CI/review results are checked at delivery and reported separately; no
remote result is inferred from these local checks.

## Limitations and next task

Real browser/Clerk interaction and translated-label usability are unverified.
Static rendering and mocked-provider PostgreSQL tests are separate evidence.
Remote PR CI/reviews must be reported independently of local checks.

Product-level default prices, grade/origin/lot attributes, inventory, purchasing,
and durable transaction snapshots are deferred. Future posting must validate
active product/unit state and persist scalar snapshots in its own transaction.
Reverting application code does not undo a database migration; retain additive
tables and use reviewed forward migrations for corrections.

Next: **15 — suppliers**, still blocked by G1. The Task 14 exception does not
authorize later tasks or establish pilot sign-in/deployment/restore readiness.

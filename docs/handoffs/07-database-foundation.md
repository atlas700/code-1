# Task 07 handoff — PostgreSQL and Drizzle foundation

Date: 25 October 2026.

## Status and scope

**Task 07 acceptance checks are complete.** Submit this branch for GitHub review
before merging. The previous agent stopped after drafting the database ADR,
environment validation, client, and unit tests. Review found missing dependencies,
migration history, reproducible setup instructions, and handoff; these are now
completed. The cross-folder environment import now follows the source-alias rule.

ADR 0013 approves local PostgreSQL and structural ownership only. No organization,
membership, business table, application screen, or later-task feature is added.
G1 research and the other open policy/deployment gates remain open.

## Completed acceptance checks and evidence

- [x] Install Drizzle ORM 0.45.4 and `pg` 8.23.1, with Drizzle Kit 0.31.11,
  `@types/pg` 8.23.1, and explicit `@next/env` 16.4.2 tooling dependency.
- [x] Keep the client server-only and lazy. Unit tests confirm import performs no
  query/connection, development reloads reuse the pool without duplicate error
  handlers, production does not cache a development global, and background errors
  do not log credentials.
- [x] Validate `DATABASE_URL` at application startup and in Drizzle Kit. Unit tests
  cover missing/malformed URLs and preserve valid URLs/driver options. Direct CLI
  checks reject empty/malformed values with nonzero exit and sanitized messages.
- [x] Generate and review `drizzle/0000_baseline.sql` and metadata: only `SELECT 1;`,
  empty schema snapshot, one journal entry. A subsequent schema generation reports
  no changes and creates no additional migration.
- [x] Inspect the pre-provisioned `afcs_task07_verify` database: initially no user
  tables. Apply the baseline twice using the application role. Both succeed and
  leave exactly one migration row, proving repeat application is harmless.
- [x] Apply the reviewed baseline to `afcs_dev` only after fresh-database success.
  Both databases contain only `drizzle.__drizzle_migrations`, with the recorded
  hash matching the reviewed SQL. No domain data is created or removed.
- [x] Confirm the configured role is `afcs_dev`, owns development, and has no
  superuser, create-database, or create-role privileges. Existing local credentials
  were reused without printing or committing them.
- [x] `npm run lint`, `npm run typecheck`, and `npm run test` pass; **50 tests across
  6 files** on Vitest 4.1.12. Unit tests never contact PostgreSQL or Clerk.
- [x] `npm run build` passes on Next.js 16.4.2 with the same nonfunctional Clerk
  keys and unreachable database URL used by CI. Build requires no live database.
  All 17 generated browser JS/map assets were checked for the placeholder URL,
  database pool marker, and Drizzle/`pg` driver markers; none were present.
- [x] `npm audit --omit=dev --audit-level=high` passes with zero vulnerabilities.
  Updated the existing tooling-only Zod from 4.6.5 to 4.6.7; the full audit has no
  high/critical entries. Remaining moderate tooling exposure is in
  [security](../security.md#development-tooling-audit-update--25-october-2026).
- [x] Final standards and specification reviews found no remaining actionable
  issues. Local Markdown file links in all 41 documents and `git diff --check`
  pass.

## Changed files

- Runtime/configuration: `src/env.ts`, `src/env.test.ts`, `.env.example`,
  `.github/workflows/ci.yml`, `package.json`, `package-lock.json`,
  `drizzle.config.ts`.
- Database: `src/db/environment.ts`, `src/db/environment.test.ts`,
  `src/db/index.ts`, `src/db/index.test.ts`, `src/db/schema/index.ts`.
- Migration: `drizzle/0000_baseline.sql`, `drizzle/meta/_journal.json`,
  `drizzle/meta/0000_snapshot.json`.
- Documentation: ADR 0013 and its index, build plan, architecture, database,
  deployment, PostgreSQL/Drizzle rules, security, testing, documentation index,
  and this handoff.

## Migration, environment, and recovery

Set the required server-only `DATABASE_URL` in ignored `.env.local`; use the
dedicated local role, not `postgres`. The database and role already existed in
this workspace; provisioning commands for a new checkout are documented in
[database setup](../database.md#local-setup).

Use `npm run db:migrate` to apply reviewed history explicitly. Generate future
schema changes with `npm.cmd run db:generate -- --name=describe_the_change` in
PowerShell (`npm` in other shells). The `npm.ps1` wrapper consumed forwarded flags
in this environment, so the custom baseline was generated with `npm.cmd`.
Startup, builds, and quality CI do not apply migrations.

The baseline adds only Drizzle's ledger. Reverting code does not undo it; keep
applied history intact. Use reviewed forward fixes. Destructive changes require
an explicit plan, backup, and restore procedure. See the documented
[recovery workflow](../database.md#recovery).

## Limitations and exact next task

- Four moderate full-audit entries remain in Drizzle Kit's development-only
  esbuild dependency chain. No dependency-audit exception was added.
- No UI behavior changed. Real Clerk sign-in, browser E2E, backup restoration,
  staging/production access, and production backup policy were not revalidated.
- The verification database is retained with its single baseline ledger; the
  fresh-before-migration assertion cannot be repeated there without a newly
  provisioned empty database. No automatic reset/drop command was added.
- The exact next task is **08 — Model organization membership and tenant
  context**, permitted by ADR 0013. G1 still blocks Tasks 13–35; mutation boundary,
  permissions, decimal policy, and deployment gates still need their approvals.

# Database

## Confirmed baseline

- PostgreSQL 16 and Drizzle with the `pg` driver provide the Task 07 foundation.
- `src/db/index.ts` exports a server-only, lazy pooled client. Development reloads
  reuse the pool; importing it does not connect, query, or apply migrations.
- `src/db/schema/index.ts` defines `organizations` (generated local UUID, unique
  Clerk organization ID, UTC creation timestamp), `organization_settings` (one
  business-settings row per local organization), and `organization_onboarding`
  (one durable request per creator, including the stable UUID and pinned remote ID).
  Task 10 adds the one-time `owner_membership_id` bootstrap marker and
  `organization_role_assignments` (local organization, verified membership/user,
  one fixed role, UTC creation timestamp). Its composite primary key, role/identity
  checks, and organization foreign key enforce grant invariants. Clerk owns
  membership; setup/grant records are not a membership mirror. See
  [ADR 0014](adr/0014-clerk-organizations-local-business-roles.md).
- `0000_baseline.sql` runs only `SELECT 1`; `0001_organizations.sql` adds the local
  mapping. `0002_organization_onboarding.sql` adds Task 09 settings and durable
  requests without modifying existing mapping rows or migration history.
  `0003_business_roles.sql` adds the grant table and nullable bootstrap marker;
  it does not backfill or infer business roles.
- `DATABASE_URL` is required by application startup and migration tooling. It is
  server-only and must never use a `NEXT_PUBLIC_` prefix.
- SQL and metadata live in `drizzle/`. Migrations are explicit operations, separate
  from application startup, builds, and quality CI.

## Local setup

Use Node.js 24 and a running PostgreSQL 16 server. On Windows, add
`C:\Program Files\PostgreSQL\16\bin` to your terminal's `PATH` if needed.
Install locked dependencies with `npm ci`.

Provision once with a PostgreSQL administrator, outside the application. Connect
with `psql -h 127.0.0.1 -U postgres -d postgres -W`, then run the following for
roles/databases that do not already exist:

```sql
CREATE ROLE afcs_dev LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
\password afcs_dev
CREATE DATABASE afcs_dev OWNER afcs_dev;
CREATE DATABASE afcs_task07_verify OWNER afcs_dev;
```

`\password` prompts without placing the password in SQL history. The application
role owns these local databases but cannot create databases, manage roles, or act
as superuser. Use administrative credentials only for provisioning. See
[PostgreSQL role options](https://www.postgresql.org/docs/16/sql-createrole.html).

Copy [`.env.example`](../.env.example) to the ignored root `.env.local` without
overwriting existing Clerk settings. Set `DATABASE_URL` to
`postgresql://afcs_dev:YOUR_ENCODED_PASSWORD@127.0.0.1:5432/afcs_dev`.
Percent-encode reserved password characters. Keep real credentials out of source
control and terminal output. Drizzle Kit uses `@next/env` to load the same root
environment files as Next.js; an existing process variable takes precedence.

## Generate, review, and apply migrations

For later approved schema changes:

```powershell
npm.cmd run db:generate -- --name=describe_the_change
git status --short drizzle
git diff -- drizzle
```

Read new SQL files as well as the tracked diff, review constraints and data-loss
risks, and commit SQL with its generated metadata. The initial empty-schema
baseline was generated once with
`npm.cmd run db:generate -- --custom --name=baseline` and filled with `SELECT 1;`.
Do not regenerate or edit it after application. Do not use `drizzle-kit push`.
Use `npm.cmd` when forwarding flags in Windows PowerShell; in other shells use
`npm`. This avoids the PowerShell `npm.ps1` wrapper consuming migration flags.

Verify reviewed migrations on a separate database before development. The retained
`afcs_task07_verify` receives the fourth migration for Task 10. A fresh checkout may
instead use a newly provisioned empty database. In a
dedicated PowerShell terminal, set a process-only override without recording the
connection string in shell history:

```powershell
$env:DATABASE_URL = Read-Host 'Full PostgreSQL URL for afcs_task07_verify' -MaskInput
npm run db:migrate
npm run db:migrate
Remove-Item Env:DATABASE_URL
```

Both runs must succeed, with exactly four migration rows in
`drizzle.__drizzle_migrations` and the four public tables above plus the ledger.
Verify prior migration hashes remain unchanged. Run the isolated onboarding tests
below for uniqueness, concurrency, settings constraints, and rollback. Stop on any
failure. Removing
the override restores `.env.local` loading for the development command:

```powershell
npm run db:migrate
```

Use `psql -h 127.0.0.1 -U afcs_dev -d afcs_task07_verify -W` (or `-d afcs_dev`)
to inspect the target explicitly:

```sql
SELECT current_database(), current_user;
SELECT count(*) FROM drizzle.__drizzle_migrations;
SELECT schemaname, tablename FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

Task 08 left the mapping table empty; Task 09 writes it only through authenticated
onboarding. Reads never provision it. Later migrations increase the ledger count.
Commit generated history unchanged;
never rewrite an applied migration. See [Drizzle migration guidance](https://orm.drizzle.team/docs/migrations).

## Recovery

The baseline changes only the migration ledger. Reverting application code does
not undo database changes; leave the applied baseline intact. Correct later schema
mistakes with reviewed forward migrations. Destructive work needs an explicit
migration plan, a backup, and a restore procedure before application.

For local recovery planning, `pg_dump -Fc -h 127.0.0.1 -U afcs_dev -d afcs_dev -W -f <private-backup-path>`
creates a custom-format backup. Have an administrator provision a separate empty
recovery database owned by the application role, then use
`pg_restore --exit-on-error --no-owner -h 127.0.0.1 -U afcs_dev -d <recovery-database> -W <private-backup-path>`
and verify its data before considering a switch. Keep backups outside the repo.
See [PostgreSQL backup guidance](https://www.postgresql.org/docs/16/app-pgdump.html).
Production backup ownership, retention, and restore rehearsal remain G4 deployment
decisions; Task 07 does not establish production readiness.

## Tenant-context contract

`getTenantContext()` from `src/db/tenant.ts` is server-only, takes no client input,
and returns `Promise<{ userId: string; organizationId: string; membershipId: string }
| null>`. It first verifies the active Clerk membership through the auth adapter,
then selects only the matching local UUID using a parameterized query. Missing
membership or mapping returns `null`; database failures throw a sanitized error.
No writes, alternate-organization selection, or persistent membership cache occur.
Task 09 must provision local mappings idempotently after Clerk creation; remote
Clerk operations cannot participate in a PostgreSQL transaction. Keep local data
and history if the remote organization disappears. Business roles remain local
and require the separate Task 10 permission guard after membership verification.

## Onboarding persistence and verification

`src/db/onboarding.ts` reserves an immutable request with `user_id` as its primary
key. A generated unique UUID is the server-owned retry identity. A unique nullable
Clerk ID records verified remote success before local business writes; a
conditional update prevents replacing that pinned ID. Business details from the
first validated submission remain fixed across retries.

Local mapping/settings/first-owner writes share one transaction. Locking the saved
request serializes concurrent bootstrap attempts, including stale callers. The
first verified membership is recorded only with its grant; subsequent attempts
cannot restore a changed/deleted role or bootstrap a rejoined membership. Unique Clerk IDs and the
settings organization primary key arbitrate concurrent writes. Settings require a
valid organization foreign key, nonempty bounded names/types, `AFN`, and a supported
locale. Retries confirm existing values rather than overwriting them. No remote
call holds a database transaction or connection open. See the full
[recovery contract](api-conventions.md#implemented-onboarding-contract).

Run the opt-in tests only against the isolated verification database:

```powershell
$env:AFCS_TEST_DATABASE_URL = Read-Host 'Full PostgreSQL URL for afcs_task07_verify' -MaskInput
npm.cmd run test -- src/db/onboarding.integration.test.ts
Remove-Item Env:AFCS_TEST_DATABASE_URL
```

The suite checks `current_database()` before writes, uses unique synthetic fixtures,
and deletes only its grants/settings/mappings/requests afterward. Without the variable, its fifteen tests are
explicitly skipped; ordinary unit tests and CI need no running database. After the
26 October local migration, concurrency/rollback tests, and browser smoke checks,
all three public tables are empty in both local databases.

On 27 October, Task 10 applied/reapplied the reviewed fourth migration on the
verification database and applied it to development. Both retained their three
prior migration hashes; the fourth hash matches the reviewed SQL. After the
extended tests, all four application tables are empty in both databases.

The extended suite verifies actual guard queries across organization, membership,
and user boundaries, role/foreign-key constraints, first-owner concurrency,
bootstrap rollback, and retry non-escalation. Existing Task 09 businesses must
explicitly resume their saved setup for the first owner grant after applying the
new migration. Reads never perform that upgrade; there is no bulk grant migration.
Keep bootstrap markers when changing/removing staff roles. Organizations without a
verifiable saved setup require a separately reviewed recovery procedure.

## Principles for future work

- Store money as PostgreSQL `numeric` or a documented integer minor-unit scheme;
  never as JavaScript floating point.
- Treat `inventory_movements` as the stock audit source when inventory is added.
- Scope future business data by organization and derive tenant context on the server.
- Execute receiving, sale fulfilment, and payment allocation atomically.
- Accepted receipt, inbound stock movements, supplier payable, and purchase status
  commit together. Derive supplier balances from receipt payables less supplier
  payment allocations; see [ADR 0012](adr/0012-receipt-supplier-payables.md).

## Decision status

**Decided — G3 units and currency:** retain one stock unit per product while
accepting exact local weight conversions, fractional quantities, and recorded
bag sizes under [ADR 0017](adr/0017-cash-currencies-local-measures.md), which
amends ADR 0004. Preserve original quantity/price meaning through receipts.
Future payables, cash payments, and balances carry AFN or PKR; allocations must
match the payable's currency and balances must never combine currencies.
Monetary purchase-line totals use two decimal places, rounded half-up once per line;
purchase totals sum those rounded lines. Canonical weight unit, quantity/unit-price
scales, partial-receipt reconciliation, and fractional-cash treatment
still block Task 12.

**Decided — G3 product identity:** each product is one stock identity for the
pilot; see [ADR 0005](adr/0005-product-stock-identity.md). Grade, origin,
harvest-date, and quality distinctions remain deferred unless G1 establishes that
an attribute creates operationally distinct stock for purchasing, storage, or
pricing.

**Decided — G3 receiving:** a receipt variance requires wholesaler-owner approval;
see [ADR 0006](adr/0006-receipt-variance-approval.md). The approver remains the
owner unless G1 establishes that the owner is unavailable for routine receipts.

**Decided — G3 stock policy:** no transaction or authorized correction may result
in negative stock; see [ADR 0007](adr/0007-no-negative-stock.md). A would-be
negative quantity must be rejected while its underlying receipt or count discrepancy
is investigated and corrected.

**Decided — G3 sale timing:** reduce stock at dispatch only if G1 establishes that
physical handoff is reliably recorded; see
[ADR 0008](adr/0008-dispatch-stock-timing.md). Otherwise, revisit sale timing before
the stock-decreasing sales workflow is implemented.

**Decided — G3 credit allocation:** a payment is allocated to one selected invoice
or payable. Its unpaid amount is the obligation's outstanding balance, not a
separate debt record; see
[ADR 0009](adr/0009-specific-obligation-payment-allocation.md). Automatic
oldest-debt allocation and payment splitting remain deferred.

**Decided — G3 correction authority:** stock corrections and transaction
cancellations require wholesaler-owner approval; any future return requires the
same approval and a separate scope decision. See
[ADR 0010](adr/0010-owner-approval-for-corrections.md).

**Decided — G4 database foundation (21 October 2026):** the founder approved local
PostgreSQL 16, Drizzle with `pg`, the structural ownership model, and explicitly
reviewed/run migrations with forward-fix and backup/restore recovery. See
[ADR 0013](adr/0013-local-postgresql-foundation.md). Detailed business schema and
screens beginning at Task 13 still require G1 evidence; decimal scale/rounding and
the other G4 decisions remain open. Current eligibility is recorded in the
[build plan's gate status](agent-sized-build-plan.md#current-gate-status).

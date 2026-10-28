# ADR 0013: Use local PostgreSQL and reviewed Drizzle migrations

- **Date:** 2026-10-21
- **Status:** Accepted

The application-owned membership provision below is superseded by
[ADR 0014](0014-clerk-organizations-local-business-roles.md). Local organization
UUIDs still own business data; Clerk owns membership. Other decisions still apply.

## Context

The founder approved Task 07's implementation plan on 21 October 2026. Local
PostgreSQL 16 is already available. The database foundation needs an approved
ownership model and migration/recovery workflow without pre-empting G1 research.

## Decision

- Use the existing local PostgreSQL 16 server, a dedicated `afcs_dev` database,
  and an application role without superuser, role-management, or database-creation
  privileges. Administrative provisioning is separate from application access.
- Use Drizzle ORM with `pg` on the Node.js server. Keep credentials server-only
  and validate `DATABASE_URL` for both application startup and migration tooling.
- Approve the structural model only: application-owned organizations and
  memberships link to Clerk user identities; each organization's products,
  suppliers, warehouse, purchases, receipts, payables, payments, inventory
  movements, and audit history belong to that organization. Authentication does
  not establish membership or permission. Do not duplicate Clerk credentials.
- Accepted receipts create stock movements and supplier payables atomically under
  ADR 0012. Inventory movements remain the stock audit source; corrections and
  audit history preserve the record of prior business events.
- Generate SQL with Drizzle Kit, commit its SQL and metadata, review the changes,
  and explicitly apply migrations. Do not migrate during application startup,
  builds, or the quality CI workflow. Never rewrite an applied migration.
- Use reviewed forward migrations for corrections. Destructive changes require
  an explicit migration plan, a backup, and a restore procedure; reverting code
  alone does not reverse database changes. Deployment backup ownership, retention,
  and restore rehearsal remain G4 deployment decisions.
- Task 07 creates an empty schema and a custom `SELECT 1` baseline migration.
  Only Drizzle's migration ledger is introduced. Verify on a separate fresh local
  database before applying the baseline to development.

## Consequences

- G4 database is approved for Task 07 and the structural tenancy work in Task 08.
  Detailed business tables and screens from Task 13 still require G1 evidence.
- Decimal scale/rounding, mutation-boundary approval, permissions, pilot sign-in
  validation, and deployment gates remain open. This is not research evidence.
- Docker, hosted PostgreSQL, business schema, automatic migration pipelines, and
  general repository abstractions are outside Task 07.

## Amendment — disposable CI verification (28 October 2026)

The founder approved adding the existing PostgreSQL integration tests to CI.
A separate database-verification job may provision a disposable PostgreSQL 16
service with a database named `afcs_task07_verify`, apply committed migrations twice, and run
the isolated tests. Its fixed credentials belong only to that job's service;
it must not use development, staging, production, or repository-secret credentials.
The service is discarded with the job. The application, builds, and existing
`quality` job still never apply migrations. This exception approves test
verification, not an automatic deployment-migration pipeline or new domain schema.

## Links

- [Database setup and workflow](../database.md)
- [Task readiness and order](../agent-sized-build-plan.md)
- [Authentication boundary](0002-clerk-authentication.md)
- [Receipt supplier payables](0012-receipt-supplier-payables.md)

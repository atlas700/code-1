# Database

## Confirmed baseline

- No database client, database schema, migration tooling, or database environment
  variables exist in the repository today.
- Persistence begins in Task 07 of the [build plan](agent-sized-build-plan.md).
- Shared environments will use generated, reviewed SQL migrations; destructive
  schema shortcuts are prohibited.

## Principles for future work

- Store money as PostgreSQL `numeric` or a documented integer minor-unit scheme;
  never as JavaScript floating point.
- Treat `inventory_movements` as the stock audit source when inventory is added.
- Scope future business data by organization and derive tenant context on the server.
- Execute receiving, sale fulfilment, and payment allocation atomically.

## Decision status

**Open — G3 domain policies:** units, product stock identity, receipt variance,
negative-stock policy, sale timing, credit allocation, and correction authority must
be decided before their dependent schemas and services.

**Open — G4 initial data model:** approve the organization, membership, master-data,
transaction, and audit model before database implementation begins.

No schema, database vendor configuration, migration, or ORM choice is made by this
document.

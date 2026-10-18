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

**Decided — G3 units:** each product uses one stock unit for the pilot; see
[ADR 0004](adr/0004-single-stock-unit.md). Conversion support remains deferred
unless G1 establishes routine differing units with stable, trustworthy per-product
conversions.

**Decided — G3 product identity:** each product is one stock identity for the
pilot; see [ADR 0005](adr/0005-product-stock-identity.md). Grade, origin,
harvest-date, and quality distinctions remain deferred unless G1 establishes that
an attribute creates operationally distinct stock for purchasing, storage, or
pricing.

**Decided — G3 receiving:** a receipt variance requires wholesaler-owner approval;
see [ADR 0006](adr/0006-receipt-variance-approval.md). The approver remains the
owner unless G1 establishes that the owner is unavailable for routine receipts.

**Open — G3 domain policies:** negative-stock policy, sale timing, credit
allocation, and correction authority must be decided before their dependent schemas
and services.

**Open — G4 initial data model:** approve the organization, membership, master-data,
transaction, and audit model before database implementation begins.

No schema, database vendor configuration, migration, or ORM choice is made by this
document.

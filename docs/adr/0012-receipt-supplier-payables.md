# ADR 0012: Recognize supplier debt when goods are received and accepted

- **Date:** 2026-10-20
- **Status:** Accepted

## Context

The purchasing pilot must reconcile supplier amounts owed with physical receipts.
The previous plan excluded payable creation from receiving but later required
payables for payments and statements. The founder selected accepted receipt,
rather than a separate supplier-invoice entry, as the recognition event.

## Decision

- Recognize a supplier payable when goods are received and accepted, using accepted
  quantities and the approved purchase-price snapshot for each receipt line.
- A draft or ordered purchase creates no supplier debt. A partial receipt creates
  only the obligation for the accepted portion; owner-approved quantity variances
  use the approved purchase price under ADR 0006.
- Commit the accepted receipt, inbound inventory movements, receipt payable, and
  purchase status together. Retrying the same acceptance creates no additional
  stock or debt; concurrent receipts must respect approved quantity limits.
- Record supplier payments against exactly one payable under ADR 0009. Supplier
  balances derive from receipt payables less their payment allocations.

## Consequences

- Task 20 owns receipt-payable creation and its transaction/idempotency tests.
- Tasks 25–26 provide supplier payments and reconciled statements in the pilot;
  customer payments and sales remain deferred under ADR 0003.
- Separate supplier-invoice entry and recognition at order creation are excluded.
  A later recognition-policy change requires an ADR and a migration plan.
- Decimal scale and rounding still need approval before Task 12. This decision
  does not claim G1 research or the remaining G4 approvals are complete.

## Links

- [Pilot scope](0003-helmand-pilot-workflow.md)
- [Payment allocation](0009-specific-obligation-payment-allocation.md)
- [Database](../database.md)
- [Tasks 20 and 25–26](../agent-sized-build-plan.md)

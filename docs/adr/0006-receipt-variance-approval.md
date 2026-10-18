# ADR 0006: Permit receipt variance with owner approval for the pilot

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

Receipt quantities that differ from purchases are a stated pilot pain. Blocking
those differences would prevent accurate physical stock records, while accepting
them without approval could make supplier balances unreliable. G1 workflow research
is not yet complete.

## Decision

- A receipt quantity may differ from its purchase-order quantity.
- A variance requires explicit approval from the wholesaler owner before the
  receipt can be completed.
- Revisit the approver only if observed workflows show the owner is not available
  for routine receipts.

## Consequences

- Task 20 must record the actual received quantity and enforce owner approval for
  a receipt variance.
- A receipt without a variance follows the ordinary receipt path.
- G1 evidence that the owner cannot approve routine variances requires a deliberate
  replacement decision before another role is authorized.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Task 20 build plan](../agent-sized-build-plan.md)

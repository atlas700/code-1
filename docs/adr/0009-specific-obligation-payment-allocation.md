# ADR 0009: Allocate each pilot payment to one invoice or payable

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot needs an auditable payment policy without adding automatic allocation or
multi-debt splitting. An unpaid balance must remain visible when payment is needed
but has not fully settled the related invoice or payable.

## Decision

- Allocate each payment to exactly one selected invoice or payable.
- Represent debt only as that obligation's outstanding balance; do not create a
  separate debt record.
- A partially paid obligation retains its remaining outstanding balance.
- Do not automatically allocate to the oldest debt or split one payment across
  multiple obligations during the pilot.

## Consequences

- Task 25 must validate that a payment does not exceed its selected obligation's
  outstanding balance.
- Task 26 may derive customer and supplier balances from outstanding invoice and
  payable amounts.
- Supporting unapplied credit or multi-obligation allocation requires a deliberate
  replacement decision.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Tasks 25–26 build plan](../agent-sized-build-plan.md)

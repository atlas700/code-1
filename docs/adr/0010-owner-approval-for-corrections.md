# ADR 0010: Require wholesaler-owner approval for corrections

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

Stock corrections and transaction cancellations can change the pilot's auditable
stock and balance history. Returns remain excluded from the pilot, but their future
authorization needs the same boundary if they are later introduced.

## Decision

- Require explicit wholesaler-owner approval before completing a stock correction.
- Require explicit wholesaler-owner approval before completing a transaction
  cancellation.
- Require explicit wholesaler-owner approval before recording a return if a later
  policy brings returns into scope.
- Do not introduce returns in the current pilot.

## Consequences

- Task 22 must enforce wholesaler-owner approval for inventory adjustments.
- A future cancellation workflow must retain the approval boundary and stock-history
  integrity.
- Any return implementation requires a separate scope decision in addition to this
  authorization rule.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Task 22 build plan](../agent-sized-build-plan.md)
- [Pilot workflow scope](0003-helmand-pilot-workflow.md)

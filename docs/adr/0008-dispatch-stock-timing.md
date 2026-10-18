# ADR 0008: Reduce stock at dispatch when physical handoff is reliably recorded

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

Future sales must reduce stock at one consistent operational event. Dispatch best
aligns recorded inventory with the goods remaining in the warehouse, but G1 has not
yet established whether pilot wholesalers reliably record physical handoff.

## Decision

- Reduce stock when goods dispatch, provided observed workflows reliably record
  physical handoff.
- Do not reduce stock at sale confirmation or customer delivery under that
  condition.
- If G1 does not establish reliable physical-handoff records, revisit sale timing
  before implementing a stock-decreasing sale workflow.

## Consequences

- Task 24 must append outbound inventory movements at dispatch only after the G1
  evidence condition is met.
- A future sale lifecycle must distinguish confirmation from dispatch when both are
  relevant to the observed workflow.
- This decision does not introduce a delivery route, delivery confirmation, or
  reservation workflow.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Task 24 build plan](../agent-sized-build-plan.md)

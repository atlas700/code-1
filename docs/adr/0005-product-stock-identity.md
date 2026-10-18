# ADR 0005: Treat each product as one stock identity for the pilot

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot needs to know whether grade, origin, harvest date, or quality create
separate stock identities before product and inventory schemas are designed. G1
workflow research is not yet complete.

## Decision

- Track each product as one stock identity during the pilot.
- Do not split stock by grade, origin, harvest date, or quality.
- Revisit this decision before implementation only if observed wholesaler workflows
  treat one of those attributes as operationally distinct stock for purchasing,
  storage, or pricing.

## Consequences

- Task 14 may omit grade, origin, harvest-date, and quality fields from products.
- Staff must not create separate pilot product records solely to capture an
  unapproved attribute.
- G1 evidence that establishes an operationally distinct attribute requires a
  deliberate replacement decision and a safe data-model review before that
  attribute creates separate stock.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Task 14 build plan](../agent-sized-build-plan.md)

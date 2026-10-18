# ADR 0007: Do not allow negative stock during the pilot

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot measures whether stock counts can be trusted without reconstructing paper
records. Allowing stock to fall below zero would hide an unrecorded receipt or a
count discrepancy instead of making it visible.

## Decision

- No pilot transaction or authorized correction may result in negative stock.
- When a transaction would reduce stock below zero, reject it and investigate the
  underlying receipt or count discrepancy.
- Correct the discrepancy through an approved correction; never by recording a
  negative stock quantity.

## Consequences

- Future stock-decreasing operations must validate available stock before they
  complete.
- The future controlled-adjustment workflow must preserve this invariant while
  recording the reason for a correction.
- The policy does not choose which role may make corrections; that remains an open
  G3 decision.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Tasks 20–24 build plan](../agent-sized-build-plan.md)

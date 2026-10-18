# Architecture decision records

Use an ADR for a durable product or engineering decision that changes the system's
behavior, data, security posture, or operating model.

## Statuses

- **Proposed:** awaiting the required evidence or approval.
- **Accepted:** approved and safe for implementation.
- **Superseded:** replaced by a newer ADR that links back to it.
- **Rejected:** considered and not adopted; retain the reason.

## Format

Create numbered files as `NNNN-short-title.md` with: title, date, status, context,
decision, consequences, and links to related tasks or ADRs. A proposed ADR must
clearly distinguish evidence from assumptions.

## Current state

[ADR 0001](0001-launch-localization.md) and
[ADR 0002](0002-clerk-authentication.md) record the accepted localization and pilot
authentication decisions. [ADR 0003](0003-helmand-pilot-workflow.md) records the
initial market and pilot workflow. [ADR 0004](0004-single-stock-unit.md) records
the pilot's single-stock-unit policy. [ADR 0005](0005-product-stock-identity.md)
records the pilot's product-identity policy. G1, the remaining G3 decisions, and
the remaining G4 decisions stay open until evidence or founder approval exists.
Record each decision before starting a task that depends on it.

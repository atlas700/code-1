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
pilot workflow and the 28 October amendment selecting Helmand grain and
mixed-goods wholesalers. [ADR 0004](0004-single-stock-unit.md) records
the pilot's single-stock-unit policy. [ADR 0005](0005-product-stock-identity.md)
records the pilot's product-identity policy. [ADR 0006](0006-receipt-variance-approval.md)
records the pilot's receipt-variance approval policy. [ADR 0007](0007-no-negative-stock.md)
records the no-negative-stock policy. [ADR 0008](0008-dispatch-stock-timing.md)
records the conditional dispatch stock-timing policy. [ADR 0009](0009-specific-obligation-payment-allocation.md)
records the payment-allocation policy. [ADR 0010](0010-owner-approval-for-corrections.md)
records the corrections-approval policy. [ADR 0011](0011-validate-purchase-receipt-terminology.md)
records the terminology-validation scope. [ADR 0012](0012-receipt-supplier-payables.md)
records receipt-based supplier debt recognition. [ADR 0013](0013-local-postgresql-foundation.md)
records local PostgreSQL, the structural ownership model, and reviewed migration
and recovery policy. [ADR 0014](0014-clerk-organizations-local-business-roles.md)
replaces local membership ownership with Clerk organizations and memberships,
retaining local business-data ownership and later business roles.
[ADR 0015](0015-server-action-mutation-boundary.md) approves Server Actions for UI
mutations, the required server checks and observability, and Task 09's narrow
first-organization bootstrap exception.
[ADR 0016](0016-local-business-authorization.md) approves Task 10's fixed business
roles, permission matrix, first-owner bootstrap, and authorization guard. It is
accepted on 27 October and closes the G4 permission-policy gate.
[ADR 0017](0017-cash-currencies-local-measures.md) records cash-only payments,
separate AFN/PKR balances, and local weight entry, amending ADR 0004.
[ADR 0018](0018-managed-pilot-hosting.md) selects Vercel/Neon and founder-owned
operations. [ADR 0019](0019-pilot-numeric-settlement-policy.md) completes the
numeric policy, introduces custom weight measures and recorded mixed-currency
settlement, and approves a future owner-only cash rounding reduction permission.
Research evidence, pilot phone sign-in testing, and deployment readiness remain open.
The [build plan's gate status](../agent-sized-build-plan.md#current-gate-status)
is the task-readiness record. G1 and the remaining G4 decisions stay
open until evidence or founder approval exists. Record each decision before starting
a task that depends on it.

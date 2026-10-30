# ADR 0009: Record supplier payments against a running balance

- **Date:** 2026-10-19
- **Status:** Accepted; amended 30 October 2026

[ADR 0019](0019-pilot-numeric-settlement-policy.md) governs recorded mixed-currency
cash and explicit owner-approved residual reductions. The 30 October amendment
replaces manual single-payable selection with automatic oldest-first allocation.

## Context

The original 19 October decision required staff to select one payable per payment.
The founder's reported notebook workflow instead records a supplier payment and
the supplier's remaining balance. On 30 October the founder approved that entry
flow, automatic oldest-first allocation within each currency, and rejection of
overpayments. The [interview record](../handoffs/pilot-readiness-decisions.md)
records the approval and the evidence limits.

## Decision

- Staff select the supplier and debt currency and record cash actually paid;
  they do not select an individual purchase or receipt for payment allocation.
- Automatically allocate the payment to that supplier's oldest unpaid receipt
  payables in that organization and currency. One payment may settle several
  payables and partially settle the next. Use deterministic ordering for ties.
- Keep AFN and PKR debt balances separate. ADR 0019 still permits mixed AFN/PKR
  cash: convert the combined cash once into the chosen debt currency, then
  distribute the rounded amount without another conversion or rounding per row.
- Reject a payment whose converted allocation exceeds the supplier's total
  outstanding balance in that currency. Reject payment against a zero balance;
  supplier advances and unapplied credit remain excluded.
- Keep receipt payables and explicit allocation records as the audit source.
  Derive the supplier's running balance from their outstanding amounts; do not
  overwrite a supplier balance or introduce a separate debt record.
- Preserve ADR 0019's explicit owner-only reductions and lifetime 0.99 cap per
  payable. Supplier-level payment entry never pools or resets those caps.

## Alternatives considered

- Manual single-payable entry preserves a narrow posting path but conflicts with
  the confirmed entry preference; it is replaced by the amendment above.
- Keeping excess cash as supplier credit was considered and rejected for this
  pilot. The app must reject the overpayment rather than silently retain excess.

## Consequences

- Task 25 must serialize balance reads and all affected allocation/reduction
  writes with the payment, enforce per-payable and supplier-total limits, and
  preserve idempotency under retries and concurrent requests.
- For example, oldest-first AFN payables of 60 and 40 receive allocations of 60
  and 15 from a 75 AFN payment, leaving 25 AFN outstanding. A 101 AFN payment
  against the original 100 AFN balance is rejected.
- Task 26 shows one supplier account per currency with links to the payment's
  allocations. It counts each payment once in account totals, even when it has
  several allocation rows.
- Customer payments, advances, and online money transfer remain deferred. This
  records a future posting policy; G1 and the relevant implementation tasks remain
  required.

## Links

- [Product requirements](../product-requirements.md)
- [Database](../database.md)
- [G3 and Tasks 25–26 build plan](../agent-sized-build-plan.md)

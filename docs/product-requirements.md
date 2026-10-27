# Product requirements

## Confirmed baseline

- The first paid product is a multi-tenant operating system for one type of
  agricultural wholesaler or distributor in one Afghan city or province.
- The approved pilot workflow is: purchase, accept receipt, track stock and supplier
  debt, record supplier payment, and reconcile supplier balances. Sales and customer
  payments remain deferred under ADR 0003.
- Features outside that workflow remain deferred unless pilot evidence makes them
  necessary.

## Decision status

**Decided — G0 initial market:** target Helmand fruit-and-nut wholesalers,
launching Pashto-first with English for internal and administrative use. The
expected pilot contacts are recorded only as Pilot A (owner), Pilot B
(warehouse/operations), and Pilot C (sales/accounts). See
[ADR 0003](adr/0003-helmand-pilot-workflow.md).

**Open — G1 workflow research:** record 20 interviews and 5 workflow observations
covering purchase, receiving, stock, sale, debt, payment, correction, and reporting.
The founder reports interviews and approximately 40 findings, including notebook
records for purchases and sales. Counts and observation coverage are not yet
confirmed; see the [clarification record](handoffs/pilot-blocker-clarifications.md).

**Decided — G2 pilot workflow:** validate purchase-to-receipt first to improve stock
accuracy and supplier balance visibility. The pains, four-week success metric, and
explicit exclusions are in [ADR 0003](adr/0003-helmand-pilot-workflow.md). G1
research remains required before treating this founder-approved scope as
pilot-validated.

**Decided — G3 units:** accept bags with actual recorded size, maan, khorwar,
kilograms, and fractional quantities while retaining one stock unit per product.
The founder defines 1 maan as 4.4 kg and 1 khorwar as 100 maan for this pilot;
[ADR 0017](adr/0017-cash-currencies-local-measures.md) amends ADR 0004.

**Decided — G3 cash and currency:** record cash supplier payments; keep AFN and
PKR balances separate and require payment in the payable's currency. Exchange
and online payment integration remain excluded under ADR 0017. These are future
workflow requirements; current onboarding still accepts AFN only.

**Decided — G3 product identity:** each product is one stock identity for the
pilot. Defer grade, origin, harvest-date, and quality distinctions unless G1
observes an attribute as operationally distinct stock for purchasing, storage, or
pricing; see [ADR 0005](adr/0005-product-stock-identity.md).

**Decided — G3 receiving:** permit a receipt quantity that differs from its
purchase-order quantity only with wholesaler-owner approval. Revisit the approver
only if G1 shows the owner is unavailable for routine receipts; see
[ADR 0006](adr/0006-receipt-variance-approval.md).

**Decided — G3 stock policy:** never permit negative stock. Reject a transaction
that would reduce stock below zero, then investigate and correct the underlying
receipt or count discrepancy; see [ADR 0007](adr/0007-no-negative-stock.md).

**Decided — G3 sale timing:** reduce stock at dispatch if G1 establishes that
physical handoff is reliably recorded. Otherwise, revisit the timing before building
a stock-decreasing sale workflow; see [ADR 0008](adr/0008-dispatch-stock-timing.md).

**Decided — G3 credit allocation:** allocate each payment to one selected invoice
or payable. Debt is that obligation's outstanding balance; defer automatic
oldest-debt allocation, payment splitting, and a separate debt record; see
[ADR 0009](adr/0009-specific-obligation-payment-allocation.md).

**Decided — G3 correction authority:** require wholesaler-owner approval for stock
corrections, transaction cancellations, and any future return. Returns remain
excluded from the pilot; see [ADR 0010](adr/0010-owner-approval-for-corrections.md).

**Decided — G3 supplier debt:** accepted receipts create supplier payables from
accepted quantities and approved purchase-price snapshots. Partial receipts create
only partial debt; supplier payments reduce the selected payable's outstanding
balance. See [ADR 0012](adr/0012-receipt-supplier-payables.md).

**Decided — G3 terminology validation:** validate Pashto terms for product, stock
unit, supplier, purchase, receipt, receipt variance, stock balance, supplier payable,
supplier payment, supplier balance, and correction before shipping pilot labels.
Defer sales/customer-payment terms; see
[ADR 0011](adr/0011-validate-purchase-receipt-terminology.md).

**Partially resolved — G3 decimal policy:** monetary purchase-line totals use two
decimal places and round once per line; purchase totals sum the rounded lines.
Quantity/unit-price scales, canonical stock unit, price-entry conventions,
rounding tie-breaks, partial-receipt reconciliation, and fractional-cash treatment
remain open under ADR 0017 before Task 12. Validate chosen terminology as part of G1. The
localization approach remains General Translation with `en-US` and `ps-AF`; see
[ADR 0001](adr/0001-launch-localization.md). Consult the
[build plan's gate status](agent-sized-build-plan.md#current-gate-status) for current
task readiness; founder-approved policies do not constitute completed research.

## Product boundaries

- Tenant data belongs to an organization; a client-provided organization identifier
  is never authority.
- Stock history is based on appended movements rather than overwritten totals.
- Money must use an exact database representation rather than JavaScript floating
  point when persistence is introduced.
- The deferred backlog in the [build plan](agent-sized-build-plan.md) is out of
  scope until pilot evidence changes the priority.

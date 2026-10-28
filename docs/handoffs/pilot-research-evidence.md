# Pilot research evidence — founder interview

Date: 28 October 2026.

## Source and status

The founder confirmed this anonymized summary in a one-question-at-a-time
`interview-me` session and approved saving it. The answers are founder-reported
evidence, not an independently verified study or business-by-business observation
log. No business names, contact details, transcripts, or financial records are
included.

**G1 remains open.** The founder reports approximately **10 people interviewed**
and **four businesses directly observed**. These are approximate counts, below
the current requirement of 20 interviews and five workflow observations. The
previous report of approximately 40 findings is not an interview count.

## Confirmed workflow summary

For an observed fruit-and-nut wholesale business, the founder confirmed:

1. Agree the goods, quantity, and price with the supplier, then record the purchase
   in a notebook.
2. On delivery, weigh the goods and record the actual received quantity.
3. Record supplier debt after weighing and accepting delivery, using the actual
   received weight and agreed price.
4. Calculate available stock from incoming and outgoing notebook quantities.
5. Record supplier cash payments with the amount and date, reducing the supplier's
   running balance. Payments are not assigned to individual purchases in the
   observed notebook process.
6. The owner checks mistakes and records a correction with the revised balance.
7. The owner regularly checks current stock, the remaining balance for each
   supplier, and cash payments made.

Staff's stated day-to-day need is an accurate total balance for each supplier;
tracking which individual purchases are unpaid was not identified as necessary.
These confirmations describe the reported workflow, not completed app behavior.

## Units and terminology

- Bags and maan are written in the notebook; kilograms are used when weighing.
- The founder confirmed that staff use **«مال ترلاسه کول»** for receiving goods.
- The founder confirmed **«پاتې حساب»** for the unpaid supplier balance.

These two labels were proposed during the interview and confirmed by the founder.
They are not a complete terminology study or a pilot screen-usability test.
Exact weights, custom measures, gram precision, and numeric rules remain governed
by [ADR 0019](../adr/0019-pilot-numeric-settlement-policy.md).

## Policy mismatch requiring review

[ADR 0009](../adr/0009-specific-obligation-payment-allocation.md) currently requires
each payment to select exactly one payable. The reported notebook workflow uses
the supplier's overall balance instead. Before Task 25, review whether the app
should preserve its selected-payable policy, automate allocation, or use an
account-level payment model. No replacement has been approved by this interview.

Any accepted change must update ADRs 0009/0019 and the affected Task 25–26 scope
together. It must explicitly resolve overpayment, separate AFN/PKR balances,
mixed-cash conversion, concurrency/idempotency, and ADR 0019's lifetime rounding
reduction cap per payable. A total-balance screen alone does not settle those
posting rules. Current policies remain in force until that decision is recorded.

## Remaining G1 evidence

- [ ] Reach and record 20 interviews and five directly observed workflows;
  confirm exact counts rather than treating approximate reports as totals.
- [ ] Keep dated, anonymized references to the private evidence and summarize
  each observed business's purchase, receiving, stock, sale, debt, payment,
  correction, and reporting flow. This interview's summary does not replace
  coverage records for all observed businesses.
- [ ] Complete the sale-flow evidence and remaining purchase/receipt terminology
  under [ADR 0011](../adr/0011-validate-purchase-receipt-terminology.md). Observing
  sales does not add sales to the approved purchasing pilot.
- [ ] Reconcile material workflow differences with accepted policies before
  declaring the dependent tasks ready.

The confirmed intent is a trustworthy stock and supplier-balance view using the
familiar notebook workflow. Implementing Task 13, changing payment policy, and
adding sales/customer-payment or multiple-warehouse features are outside this
evidence-recording work. Pilot OTP and deployment/restore gates remain separate.

## Review and verification

Reviewed the confirmed answers against the G1 threshold, pilot exclusions,
terminology decision, payment-allocation policy, and numeric/rounding rules.
Preserved approximate/source-qualified counts, incomplete observation coverage,
and the distinction between research findings and an approved policy change.
No unresolved must-fix findings. This record changes no application behavior,
schema, migration, dependency, or documented command.

At this interview's completion, Task 13 remained blocked by G1. Subsequently,
after being informed of that blocker, the founder instructed implementation of
Task 13; [ADR 0003's amendment](../adr/0003-helmand-pilot-workflow.md#amendment--task-13-implementation-before-g1-closure-28-october-2026)
records that limited exception. G1 remains open; Task 14 and later tasks still
require its evidence. See the [Task 13 handoff](13-units-product-categories.md)
and [maintenance handoff](postgresql-ci-verification.md) for implementation/CI evidence.

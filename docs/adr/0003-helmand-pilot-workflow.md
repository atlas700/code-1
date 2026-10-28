# ADR 0003: Start the Helmand pilot with purchasing and receiving

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The first pilot must be narrow enough to validate stock accuracy and supplier
balances before expanding into the full supply-chain workflow. Formal workflow
research remains incomplete, so this decision is a founder-approved pilot scope
that must be reviewed against G1 evidence.

## Decision

- Target Helmand fruit-and-nut wholesalers.
- Launch Pashto-first, retaining English for internal and administrative use.
- Treat Pilot A (wholesaler owner), Pilot B (warehouse/operations lead), and Pilot
  C (sales/accounts lead) as anonymized prospective contacts; do not record their
  personal information in the repository.
- Validate only the purchase-to-receipt workflow first.
- Include receipt-based supplier debt, supplier payments, and supplier statements
  needed to verify amounts owed; [ADR 0012](0012-receipt-supplier-payables.md)
  records the founder-approved recognition policy on 20 October 2026.
- Address inaccurate stock counts, receipt quantities that differ from purchases,
  and unreliable supplier amounts owed.
- Define success as one pilot business recording every purchase and receipt in the
  application for four weeks, with stock count and supplier balance verifiable
  without reconstructing paper records.
- Exclude sales and customer payments, returns, lot/grade tracking, multiple
  warehouses, and offline mode until purchase/receipt accuracy is proven.

## Consequences

- The future full workflow remains purchase, receive, sell, payment, and balances,
  but implementation begins with purchasing and receiving only.
- G1 remains open: record 20 interviews and 5 workflow observations, then review
  this scope if the evidence contradicts it.
- Work that introduces an excluded capability requires a new decision record or an
  explicit amendment to this ADR.

## Amendment — Task 13 implementation before G1 closure (28 October 2026)

After being told that Task 13 was blocked by G1, the founder instructed
“implement it”. This authorizes Task 13's units/categories schema, services,
and management screens before research completion. It is a Task 13 exception,
not evidence that G1 passed. Tasks 14–35 and pilot release still require G1.
Use the already approved weight definitions from ADRs 0017/0019; do not invent
pilot category defaults or change payment policy. Unvalidated labels remain
subject to research. The build plan records the same exception.

## Links

- [Product requirements](../product-requirements.md)
- [Gates and Tasks 13–18 build plan](../agent-sized-build-plan.md)

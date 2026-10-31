# ADR 0003: Start the Helmand pilot with purchasing and receiving

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The first pilot must be narrow enough to validate stock accuracy and supplier
balances before expanding into the full supply-chain workflow. Formal workflow
research remains incomplete, so this decision is a founder-approved pilot scope
that must be reviewed against G1 evidence.

## Decision

- Target Helmand grain and mixed-goods wholesalers, as amended on 28 October
  below. This replaces the initial fruit-and-nut target.
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

## Amendment — Grain and mixed-goods pilot market (28 October 2026)

The founder confirmed that the first pilot should serve grain and mixed-goods
wholesalers, matching the businesses described in the follow-up research
interview. This replaces the initial fruit-and-nut segment; Helmand and the
Pashto-first launch remain the approved location and language.

Keep the purchasing, receiving, supplier-payment, and reconciliation workflow
and its existing exclusions. Authorized users add their own product names in
Task 14; the catalogue does not require a predefined list of goods. The reported
3 AFN bag-carrying charge is research context and adds no labour-payment feature.

This is market approval, not completed user research. At the 28 October amendment
the founder reported ten interviews and an unknown observation count. The latest
30 October report is 50 interviewees and approximately 50 personally observed
businesses, recalled without notes. Dated business-by-business coverage is still
missing. G1, Task 14's evidence prerequisite, and pilot release remain open. See
the [updated research record](../handoffs/pilot-research-evidence.md).

## Amendment — Task 14 implementation before G1 closure (31 October 2026)

After being told that Task 14 was blocked by G1, the founder instructed
“implement it”. This authorizes Task 14's product schema, services, and
create/list/detail/edit/deactivate screens. Reuse the existing catalogue
permissions and units/categories. Products have user-entered names, optional
codes and categories, and a required weight unit. Default prices remain deferred
because product-level defaults have not been validated. ADR 0005's single stock
identity remains binding; no inventory calculation is included.

This is a Task 14 exception only. It does not close G1 or authorize Task 15 and
later, pilot release, or additional workflow policies. The earlier Task 13
exception remains historical authorization for that task.

## Links

- [Product requirements](../product-requirements.md)
- [Gates and Tasks 13–18 build plan](../agent-sized-build-plan.md)

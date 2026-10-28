# Pilot research evidence — founder interview

Date: 28 October 2026.

## Source and status

The founder confirmed this anonymized summary in a one-question-at-a-time
`interview-me` session and approved saving it. The answers are founder-reported
evidence, not an independently verified study or business-by-business observation
log. No business names, contact details, transcripts, or financial records are
included.

In the follow-up, the founder confirmed that these answers mainly come from
memory. No written interview notes were provided. Counts and workflow details
remain founder-reported recollections until linked to dated private evidence.

**G1 remains open.** In this conversation's follow-up, the founder confirmed
**10 people interviewed**, but could not recall the number of businesses directly
observed. The observation count is **unknown**; the earlier estimate of four is
unconfirmed. G1 requires 20 interviews and five documented workflow observations.
The previous report of approximately 40 findings is not an interview count.

## Confirmed workflow summary

The earlier interview recorded the following workflow summary. Its attribution
to a fruit-and-nut wholesaler remains unconfirmed: the follow-up identified grain
and mixed-goods businesses, without establishing fruit-and-nut coverage.

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

## Follow-up evidence — 28 October 2026

The founder chose to complete G1 research before Task 14, rather than authorize
another implementation exception. The following answers add detail to the same
research; they are not additional interview participants or observation counts.

- The interviews covered grain businesses and businesses selling mixed goods.
  The business discussed mainly buys and sells wheat (غنم) and maize/corn
  (جواري). Other goods and the number of interviewees in each segment remain
  unconfirmed. The founder subsequently approved grain and mixed-goods wholesalers
  as the first pilot market, recorded in ADR 0003's market amendment.
- The business operates throughout the year, with busier months for buying and
  selling. The founder did not establish the observation's month or year.
- Workers receive 3 AFN for carrying one bag. Office staff manage payments to
  workers and suppliers. The founder confirmed personally watching these
  processes. The bag-carrying payment is a labour charge, not a goods price;
  this finding does not authorize a payroll or labour-payment feature.
- After paying a supplier, office staff record the amount paid and remaining
  supplier balance in a notebook. The founder confirmed this description.
- Incoming goods are recorded by both bag count and weight. When delivered weight
  differs from the agreed amount, office staff check with the owner before
  accepting the delivery. The founder confirmed these descriptions.
- Outgoing goods are recorded in a notebook. The founder did not confirm the
  fields in those entries or when they are written relative to physical dispatch.
- The founder requested that users add goods themselves. Task 14 must let
  authorized users enter their business's product names as needed, rather than
  select from a fixed list of wheat, maize, fruit, or nuts. This clarifies its
  existing product-creation scope and retains the requirement to complete G1 first.

## Approved market change — 28 October 2026

When asked whether the first pilot should serve grain/mixed-goods wholesalers or
the fruit-and-nut segment in the plan, the founder confirmed grain and mixed-goods
wholesalers. [ADR 0003's market amendment](../adr/0003-helmand-pilot-workflow.md#amendment--grain-and-mixed-goods-pilot-market-28-october-2026)
and the build plan record this approval. The decision changes the segment; it does
not establish observation counts, dates, or complete workflow coverage, or add
sales, customer payments, or worker payments to the purchasing pilot.

These details do not yet provide dated, business-by-business coverage of every
required workflow. Private evidence references and the observation count remain
unconfirmed; the follow-up does not close G1 or amend payment policy.

The founder confirmed being able to revisit one of these businesses and take
notes while watching a purchase or delivery. No date or new visit evidence has
been recorded. Use the [first-revisit checklist](pilot-research-fieldwork.md) to
collect the missing evidence; planned visits do not increase completed totals.

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
- [ ] Keep per-business evidence for the approved grain and mixed-goods pilot.
  Market approval does not establish the required interview and observation
  coverage; identify the businesses and workflows through anonymized references.
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

The initial review checked the confirmed answers against the G1 threshold, pilot
exclusions, terminology decision, payment-allocation policy, and numeric/rounding rules.
Preserved approximate/source-qualified counts, incomplete observation coverage,
and the distinction between research findings and an approved policy change.
No unresolved must-fix findings. This record changes no application behavior,
schema, migration, dependency, or documented command.

Follow-up review checked the answers against this conversation, corrected the
current counts to ten reported interviews and an unknown observation total,
qualified the earlier fruit-and-nut attribution, and kept the product-name
requirement within Task 14. Recorded the approved grain/mixed-goods market in
ADR 0003 and the plan, plus the confirmed incoming quantities, owner approval,
and notebook recording of outgoing goods. Research coverage and dates remain
open; neither the market decision nor the catalogue adds a G1 exception.
The final review also checked the memory-based source qualification, planned
revisit, blank fieldwork template, private-record boundaries, and linked index.
No unresolved must-fix findings. The documentation diff passes `git diff --check`
and 122 local links/anchors across the eight changed Markdown files. Application
checks are not required because no code or documented command changed.

Changed files: `docs/adr/0003-helmand-pilot-workflow.md`, `docs/adr/README.md`,
`docs/agent-sized-build-plan.md`, `docs/product-requirements.md`,
`docs/handoffs/pilot-research-evidence.md`,
`docs/handoffs/pilot-blocker-clarifications.md`, the new
`docs/handoffs/pilot-research-fieldwork.md`, and `docs/README.md`.

At the initial interview's completion, Task 13 remained blocked by G1. Subsequently,
after being informed of that blocker, the founder instructed implementation of
Task 13; [ADR 0003's amendment](../adr/0003-helmand-pilot-workflow.md#amendment--task-13-implementation-before-g1-closure-28-october-2026)
records that limited exception. G1 remains open; Task 14 and later tasks still
require its evidence. See the [Task 13 handoff](13-units-product-categories.md)
and [maintenance handoff](postgresql-ci-verification.md) for implementation/CI evidence.

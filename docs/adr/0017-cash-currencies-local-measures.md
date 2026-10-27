# ADR 0017: Record cash in AFN or PKR and accept local weight measures

- **Date:** 2026-10-27
- **Status:** Accepted requirements; decimal and rounding policy remains open

## Context

During blocker clarification, the founder reported interviewing businesses that
record purchases and sales in notebooks. Purchases can use bags, maan, fractional
measures, or kilograms. The founder approved recording cash payments, separate
AFN/PKR balances, and each bag's actual size. This amends ADR 0004's prohibition
on entering purchases and receipts in different weight units; it does not close G1.

## Decision

- Record physical cash payments; online payment integration remains excluded.
- Support AFN and PKR obligations with separate balances for each currency. Each
  purchase and its receipt payable use one selected currency; each payment must
  use its selected payable's currency. Do not add cross-currency
  settlement, exchange rates, or a combined monetary balance during the pilot.
- Accept purchase and receipt quantities in kilograms, maan, khorwar, and bags,
  including fractional quantities. The founder's pilot definitions are exactly
  1 maan = 4.4 kg and 1 khorwar = 100 maan = 440 kg. These are pilot definitions,
  not a claim that local measures are uniform across Afghanistan.
- Record actual bag size for the affected line. A 10-maan bag weighs 44 kg; an
  11-maan bag weighs 48.4 kg. Retain the entered quantity, measure, bag size when
  applicable, and agreed price basis so later changes cannot reprice past goods.
- Keep one consistent stock unit per product and use exact approved weight
  conversions for comparison and aggregation. Do not equate a bag count with a
  fixed weight or introduce a general conversion-rule editor.
- Preserve exact agreed amounts. The canonical stock unit, allowed decimal
  scales, price-entry conventions, rounding method/stage, and cash treatment of
  fractional totals still require a concrete transaction example and approval
  before Task 12. No decimal policy is implied by these conversions.

## Consequences

Tasks 12–14, 18–21, and 25–28 must preserve quantity and currency meaning through
purchases, receipts, payments, and read models. Cash allocation still follows
ADR 0009 and receipt-based debt follows ADR 0012. Existing onboarding remains
AFN-only; this decision scopes future trade workflows and does not claim PKR or
weight entry is already implemented. G1 and decimal-policy gates remain open.

## Links

- [Previous units policy](0004-single-stock-unit.md)
- [Payment allocation](0009-specific-obligation-payment-allocation.md)
- [Receipt supplier payables](0012-receipt-supplier-payables.md)
- [Build plan](../agent-sized-build-plan.md)
- [Clarification and evidence record](../handoffs/pilot-blocker-clarifications.md)

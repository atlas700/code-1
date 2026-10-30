# ADR 0011: Validate only purchase-and-receipt terminology for pilot launch

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot launches Pashto-first, but business terms must be validated with Helmand
users before Pashto labels ship. The pilot scope is purchasing and receiving,
including supplier debt/payment reconciliation under ADR 0012. Sales and customer
payments remain excluded until purchase/receipt accuracy is proven.

## Decision

- Validate the Pashto terms for product, stock unit, supplier, purchase, receipt,
  receipt variance, stock balance, supplier payable, supplier payment, supplier
  balance, and correction before shipping labels for the pilot workflow. Supplier
  payable/payment terms were added on 20 October 2026 with ADR 0012.
- Defer validation of sales and customer-payment terminology until that workflow
  is in scope.
- Do not publish machine-translated business terms in place of validation.

## Consequences

- The application continues to use English fallback copy until the listed Pashto
  terms are validated.
- New purchase/receipt labels must use the validated terminology when localization
  is enabled.
- Introducing sales or customer-payment labels requires their own terminology
  validation.

## Review readiness — 30 October 2026

The founder confirmed that a Pashto-speaking owner or accounts clerk from an
observed business can review the pilot labels before launch. The remaining labels
are not yet validated; record the actual review and its results before enabling
them. See the [research record](../handoffs/pilot-research-evidence.md#units-and-terminology).

## Links

- [Launch localization](0001-launch-localization.md)
- [Pilot workflow scope](0003-helmand-pilot-workflow.md)
- [Receipt-based supplier debt](0012-receipt-supplier-payables.md)
- [Product requirements](../product-requirements.md)
- [G3 and Task 05 build plan](../agent-sized-build-plan.md)

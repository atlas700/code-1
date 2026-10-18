# ADR 0011: Validate only purchase-and-receipt terminology for pilot launch

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot launches Pashto-first, but business terms must be validated with Helmand
users before Pashto labels ship. The current pilot scope is purchasing and receiving;
sales and payments remain excluded until purchase/receipt accuracy is proven.

## Decision

- Validate the Pashto terms for product, stock unit, supplier, purchase, receipt,
  receipt variance, stock balance, supplier balance, and correction before shipping
  labels for the pilot workflow.
- Defer validation of sales and payment terminology until that workflow is in scope.
- Do not publish machine-translated business terms in place of validation.

## Consequences

- The application continues to use English fallback copy until the listed Pashto
  terms are validated.
- New purchase/receipt labels must use the validated terminology when localization
  is enabled.
- Introducing sales or payment labels requires their own terminology validation.

## Links

- [Launch localization](0001-launch-localization.md)
- [Pilot workflow scope](0003-helmand-pilot-workflow.md)
- [Product requirements](../product-requirements.md)
- [G3 and Task 05 build plan](../agent-sized-build-plan.md)

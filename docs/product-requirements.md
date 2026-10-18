# Product requirements

## Confirmed baseline

- The first paid product is a multi-tenant operating system for one type of
  agricultural wholesaler or distributor in one Afghan city or province.
- The roadmap's candidate first workflow is: buy from supplier, receive stock,
  sell to customer, record payment, and see balances.
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

**Decided — G2 pilot workflow:** validate purchase-to-receipt first to improve stock
accuracy and supplier balance visibility. The pains, four-week success metric, and
explicit exclusions are in [ADR 0003](adr/0003-helmand-pilot-workflow.md). G1
research remains required before treating this founder-approved scope as
pilot-validated.

**Decided — G3 units:** each product uses one stock unit for the pilot. Defer unit
conversions unless G1 observes routine differing purchase and physical-stock units
with stable, trustworthy per-product conversions; see
[ADR 0004](adr/0004-single-stock-unit.md).

**Decided — G3 product identity:** each product is one stock identity for the
pilot. Defer grade, origin, harvest-date, and quality distinctions unless G1
observes an attribute as operationally distinct stock for purchasing, storage, or
pricing; see [ADR 0005](adr/0005-product-stock-identity.md).

**Open — G3 domain policies:** decide receiving variance and approval,
negative-stock policy, sale timing, payment-credit allocation, correction authority,
and validated launch terminology. Record each as a dated ADR before the task that
depends on it. The launch localization approach is General Translation with `en-US`
and `ps-AF`; see [ADR 0001](adr/0001-launch-localization.md).

## Product boundaries

- Tenant data belongs to an organization; a client-provided organization identifier
  is never authority.
- Stock history is based on appended movements rather than overwritten totals.
- Money must use an exact database representation rather than JavaScript floating
  point when persistence is introduced.
- The deferred backlog in the [build plan](agent-sized-build-plan.md) is out of
  scope until pilot evidence changes the priority.

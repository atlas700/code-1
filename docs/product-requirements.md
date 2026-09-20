# Product requirements

## Confirmed baseline

- The first paid product is a multi-tenant operating system for one type of
  agricultural wholesaler or distributor in one Afghan city or province.
- The roadmap's candidate first workflow is: buy from supplier, receive stock,
  sell to customer, record payment, and see balances.
- Features outside that workflow remain deferred unless pilot evidence makes them
  necessary.

## Decision status

**Open — G0 initial market:** choose one city or province, one business type,
selection rationale, expected pilot contacts, and target language or languages.

**Open — G1 workflow research:** record 20 interviews and 5 workflow observations
covering purchase, receiving, stock, sale, debt, payment, correction, and reporting.

**Open — G2 pilot workflow:** identify the top three pains, highest-frequency and
willingness-to-pay workflow, pilot success metric, and explicit MVP exclusions.
The candidate workflow above is not pilot-validated until G2 is complete.

**Open — G3 domain policies:** decide unit conversion, stock identity attributes,
receiving variance and approval, negative-stock policy, sale timing, payment-credit
allocation, correction authority, and validated launch terminology. Record each as a
dated ADR before the task that depends on it.

## Product boundaries

- Tenant data belongs to an organization; a client-provided organization identifier
  is never authority.
- Stock history is based on appended movements rather than overwritten totals.
- Money must use an exact database representation rather than JavaScript floating
  point when persistence is introduced.
- The deferred backlog in the [build plan](agent-sized-build-plan.md) is out of
  scope until pilot evidence changes the priority.

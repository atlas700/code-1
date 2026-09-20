# API conventions

## Confirmed baseline

- The application has no API routes, route handlers, server actions, or external API
  contract yet.
- Future server boundaries must validate untrusted input and enforce organization
  membership and permission checks on the server.
- A client-provided `organizationId` is never an authorization source.

## Conventions for future work

- Introduce the smallest server boundary that serves the required workflow; choose
  the final mutation boundary only after G4 approval.
- Keep client components as interactive leaves and keep authority, validation, and
  business rules on the server.
- Calculate business totals on the server and use transactions for all-or-nothing
  financial and inventory events.
- Define request, error, pagination, and idempotency details only in the task that
  introduces the relevant endpoint or mutation.

## Decision status

**Open — G4 mutation boundary:** decide the approved boundary and its authentication,
authorization, validation, and observability requirements before protected mutations
are implemented.

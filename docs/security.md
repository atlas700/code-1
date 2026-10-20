# Security

## Confirmed requirements

- Tenant isolation is enforced server-side from authenticated organization membership.
- Hiding a UI control is not authorization; protected queries and mutations require
  server-side permission checks.
- Untrusted server input requires validation.
- Secrets must not be exposed through `NEXT_PUBLIC_*` variables or committed to the
  repository.
- User-facing errors must not expose stack traces, SQL, secrets, or personal data.

## Decision status

**Decided — G4 authentication:** Clerk is the approved managed identity and secure
session provider for Task 06; see [ADR 0002](adr/0002-clerk-authentication.md). The
enabled sign-in method remains a pilot-validation decision. Application organization
membership and business permissions remain server-side records, not client-controlled
Clerk organization state.

Task 06 uses Clerk's SDK-managed sessions, per-page server guards, and an explicit
`authorizedParties` origin. Authentication returns an external user identity only;
organization membership and permissions remain unimplemented. The Clerk publishable
key may use `NEXT_PUBLIC_`; its secret key must never do so. Missing or malformed
configuration fails without echoing credential values.

**Open — G4 role matrix:** approve the roles, allowed actions, and authorization
guard behavior before Task 10.

**Open — G4 operational security:** assign a backup owner and approve access,
logging, and incident responsibilities with the deployment plan.

## Deferred controls

Rate limiting, user-facing request identifiers, structured logs, and formal audit
logging are scheduled in later build-plan tasks. Their absence does not authorize
unsafe authentication or mutation handling.

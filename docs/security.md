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

**Open — G4 authentication:** select and approve an authentication provider, secure
session design, and production cookie guidance before Task 06.

**Open — G4 role matrix:** approve the roles, allowed actions, and authorization
guard behavior before Task 10.

**Open — G4 operational security:** assign a backup owner and approve access,
logging, and incident responsibilities with the deployment plan.

## Deferred controls

Rate limiting, user-facing request identifiers, structured logs, and formal audit
logging are scheduled in later build-plan tasks. Their absence does not authorize
unsafe authentication or mutation handling.

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

## Dependency advisories

Production dependencies must pass the high/critical audit gate described in
[Testing](testing.md#dependency-gate) before deployment. There are currently no
approved advisory exceptions. Record any future owner-approved exception here with
its advisory ID, affected path/reachability, mitigation, owner, and expiry/review date.

### Development-tooling advisory tracked on 20 October 2026

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects `braces` through 3.0.3; the advisory lists no patched release. The installed
path is `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch →
braces`. The full audit reports five high entries for this one development-only
dependency chain; `npm ls braces --omit=dev` confirms it is absent from the
production dependency tree.

The failure case is a deeply nested, attacker-controlled brace pattern exhausting
the parser's call stack. The current lint command uses the fixed `src` path;
application requests do not supply patterns to this tooling. Keep lint patterns
repository-controlled and review untrusted lint configuration before execution.
The repository owner must recheck this advisory on the next dependency update or
before accepting externally supplied patterns. Track a compatible upstream fix;
the audit's suggested downgrade to `eslint-config-next` 14 is incompatible with
this project's Next.js 16 lint stack. This is tracked development-tooling exposure,
not an exception to the production audit gate.

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
enabled sign-in method remains a pilot-validation decision. Under
[ADR 0014](adr/0014-clerk-organizations-local-business-roles.md), Clerk owns
membership and the application will own business permissions. Neither a
client-controlled organization ID nor Clerk Admin/Member roles grant business access.

Task 06 uses Clerk's SDK-managed sessions, per-page server guards, and an explicit
`authorizedParties` origin. Authentication returns an external user identity only;
the separate Task 08 adapter verifies current active-organization membership against
Clerk's Backend API before resolving a local organization UUID. Missing/deleted or
mismatched membership and absent local mappings deny tenant access; outages throw
sanitized errors without exposing provider details, SQL, or credentials. Membership
is rechecked on every lookup, not cached across requests or mirrored by webhooks.
Business-role checks remain Task 10; present pages contain no business data.
The Clerk publishable
key may use `NEXT_PUBLIC_`; its secret key must never do so. Missing or malformed
configuration fails without echoing credential values.

**Open — G4 role matrix:** approve the roles, allowed actions, and authorization
guard behavior before Task 10.

**Open — G4 operational security:** assign a backup owner and approve access,
logging, and incident responsibilities with the deployment plan.

## Deferred controls

The first mutation must meet the safe error and correlation requirements in the
[mutation contract](api-conventions.md#mutation-contract), approved by
[ADR 0015](adr/0015-server-action-mutation-boundary.md). General request logging,
rate limiting, and formal audit logging retain their later build-plan scope.

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

### Development-tooling audit update — 25 October 2026

Task 07's production audit reports zero vulnerabilities. The full audit now
reports four moderate entries from
`drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils → esbuild`
([GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)).
The affected esbuild version is 0.18.20; the advisory concerns its development
HTTP server. This project uses Drizzle Kit only for local generation/migration,
not an esbuild HTTP server or exposed Drizzle Studio. It is absent from production
dependencies. Recheck on the next tooling update; the audit's proposed Drizzle Kit
0.18.1 downgrade would replace the current migration tooling and is not applied.

The existing ESLint dependency's Zod was updated from 4.6.5 to 4.6.7 to resolve
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
No high/critical entries remain in the full audit. The older `braces` entry above
is a historical report; the current audit does not report it. The production gate
and its no-exceptions policy are unchanged.

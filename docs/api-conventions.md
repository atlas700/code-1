# API conventions

## Confirmed baseline

- The first application mutation is `createFirstOrganization()` in
  `src/app/onboarding/actions.ts`. There are no API routes or external API contracts.
- The approved boundary for application UI mutations is Next.js Server Actions;
  see [ADR 0015](adr/0015-server-action-mutation-boundary.md), accepted 26 October 2026.

## Mutation contract

- Treat each action as a directly callable server entry point. Call the local
  `requireSession()` guard inside it; a page, layout, proxy, action ID, or hidden
  control does not authorize a mutation.
- Validate all untrusted input with Zod before side effects, including form fields
  and client-supplied resource or retry identifiers. Explicitly select permitted
  fields; schema validation alone does not establish resource ownership.
- For an existing tenant, call `requirePermission(permission)` inside the action's
  server operation. It authenticates and obtains `getTenantContext()` on each
  invocation. Scope resource reads/writes to its returned local organization UUID.
  The permission is a server-owned catalogue literal. Client-provided user, organization, membership,
  or role IDs never grant authority; Clerk Admin/Member roles are not business roles.
- Keep actions small, client components as interactive leaves, Clerk calls in
  `src/auth`, and database operations in `src/db`. Use server-only helpers rather
  than an internal HTTP API or a new action framework. Route Handlers require an
  approved external HTTP use case.
- Preserve Next.js's same-origin Server Action protections. Any deployment that
  needs an `allowedOrigins` override must approve its exact origins first.
- Calculate business totals on the server. Use a local database transaction for
  each all-or-nothing financial or inventory event. Define idempotency and
  concurrency behavior with the task introducing the mutation.
- Return minimal serializable UI results and safe validation/conflict messages.
  Unexpected failures must provide a safe error and a correlation identifier
  linked to a server diagnostic with operation and failure stage. Exclude secrets,
  raw form data, SQL, provider payloads, and personal data from those diagnostics
  and client errors; never return raw records or caught errors.
- Preserve framework control flow: keep `redirect()` outside error-catching
  blocks, or rethrow Next.js control-flow exceptions before sanitizing failures.
  Refresh/revalidate affected data and navigate only after confirmed success.

The first mutation must include the error/correlation behavior above. A general
logging platform, formal business audit trail, and rate limiting retain their
later build-plan scope.

## Task 09 bootstrap

First-organization onboarding cannot require an existing local tenant. Its sole
exception is an authenticated action that creates or resumes the caller's first
organization and its local provisioning:

- Derive the creator from `requireSession()`. Before local provisioning or recovery,
  verify through Clerk's Backend API that the remote organization was created by
  that user and that their creator membership is current. Treat any submitted
  organization/retry reference only as a lookup hint, never as authority.
- Define durable retry and concurrency behavior in Task 09. Duplicate submissions,
  ambiguous remote outcomes, and remote success followed by local failure must
  recover the same organization without duplicating it or adopting another user's
  organization. A pending button alone is insufficient.
- Keep local organization/settings writes atomic where needed. Clerk and PostgreSQL
  do not share a transaction; document the recovery path for each partial outcome.
  Make the organization active only after local provisioning succeeds.
- [ADR 0016](adr/0016-local-business-authorization.md) extends this exception only
  to bootstrap the initial local owner role once in the provisioning transaction.
  General business operations require their own permission check; tenant reads
  still never provision data or roles.

Task 09 must verify unauthenticated and mismatched-creator denial, invalid input,
duplicate/concurrent requests, partial-success recovery, sanitized failures with
correlation, and successful activation after local provisioning. Define its exact
input/result shapes and recovery mechanism during implementation.

### Implemented onboarding contract

`createFirstOrganization(previousState, formData)` ignores client state as
authority and explicitly validates `name` and `businessType` (trimmed, 1–100
characters), `timezone` (accepted by `Intl.DateTimeFormat`, at most 100 characters),
`baseCurrency` (`AFN`), and `locale` (`en-US` or `ps-AF`). Business type and timezone
have no inferred defaults; the language starts at the current approved UI locale.
Client user/organization/role/retry fields are not used.

The result is a discriminated union: `idle`; `invalid` with field names;
`conflict` when saved details differ; `denied` when creator authority fails;
`error` with a correlation UUID; or `success` with only the Clerk organization ID
needed by the activation control. No provider errors or local records are returned.

The server reserves one immutable `organization_onboarding` row per creator before
contacting Clerk. Its database-generated UUID determines the unique Clerk slug
`afcs-<UUID>` and private `afcsOnboardingId` marker. Clerk slug uniqueness and local
unique constraints arbitrate concurrent requests. Every attempt verifies Clerk's
`createdBy`, marker, and exact current membership; neither the marker nor slug is
authority alone. The verified remote ID is pinned before atomic local
organization/settings writes. A pinned ID can never be replaced by onboarding.
The provider adapter now returns only verified `{ userId, clerkOrganizationId,
membershipId }` to the server operation. These IDs are never accepted from the form.

`completeOnboarding(request, membership)` locks the saved request and returns
`true` after local completion or `false` for a missing/mismatched saved request or
membership. The transaction creates settings/mapping and, only when the durable
`owner_membership_id` is absent, the first owner assignment and marker. A retry
with the same membership preserves any later downgrade/deletion; another membership
is denied. Database failures roll everything back. The action exposes no activation
data after a `false` result.

- Before reservation or after a confirmed failed remote creation: retry the same
  details. No local business exists yet, and the reserved slug stays the same.
- An ambiguous remote result or remote success before the pin: look up the same
  slug, reverify creator membership, and pin the existing organization.
- A local write failure: retain the pinned remote ID and retry its local transaction;
  never delete the remote organization as compensation.
- A retry after completion: reverify membership and confirm the existing settings;
  do not overwrite them. Changed details return `conflict` with reload guidance.
- A removed creator membership or deleted pinned organization: deny recovery and
  retain local history. Do not silently create a replacement.
- Activation failure: the business remains saved. Retry **Open workspace** or
  return to onboarding; activation never reruns organization creation itself.

`OrganizationActivation` calls Clerk `setActive` only after `success`, then performs
a full navigation to `/dashboard`. Dynamic tenant reads therefore use fresh
membership and local data. Subsequent page/data access requires the local business
permission separately; activation alone grants none. Reserved
slugs must remain unchanged until their remote IDs are pinned; see the
[operational prerequisite](deployment.md#onboarding-recovery-slugs).

## Decision status

**Accepted — G4 mutation boundary:** [ADR 0015](adr/0015-server-action-mutation-boundary.md).
Task 09 and the approved Task 10 permission boundary follow ADRs 0015/0016. G1 research, decimal policy,
pilot sign-in validation, and deployment gates remain open in the
[build plan](agent-sized-build-plan.md#current-gate-status).

# ADR 0014: Use Clerk organizations with local business roles

- **Date:** 2026-10-25
- **Status:** Accepted

## Context

The founder approved Task 08 using Clerk organizations and memberships, with
business roles kept in the application. Clerk already supplies the required
membership lifecycle and active-organization context. Building a second membership
system would duplicate that authority. This decision supersedes only the local
membership/organization-selection provisions of ADRs 0002 and 0013; their remaining
authentication, database, and recovery decisions still apply.

## Decision

- Clerk owns organizations and membership. Keep Clerk-specific calls in `src/auth`.
  Do not create an application `organization_members` table or webhook membership
  mirror. Clerk's Admin/Member roles do not grant purchasing permissions.
- Keep one local `organizations` row for business-data ownership: a generated UUID,
  unique required Clerk organization ID, and UTC creation timestamp. Later business
  records reference this local UUID; business settings arrive in Task 09.
- Select only the active organization in the authenticated server session. Verify
  the current user/organization pair with Clerk's Backend API on every lookup;
  session claims alone do not establish current membership. Never accept a tenant
  ID from client input, choose another membership automatically, or provision during
  a read. Missing membership or local mapping produces no tenant context.
- Clerk/API and database failures deny access with sanitized errors. Do not cache
  membership across requests. A deleted organization produces no membership;
  retain its local row and business history rather than cascading a remote deletion.
- Enable development Organizations with membership optional and automatic
  creation disabled, preserving sign-in before onboarding exists. Personal mode
  never grants access to business data. Use included features only; the current
  default membership cap is five and the included tier permits up to twenty.
- Task 09 must use recoverable, idempotent Clerk provisioning and local writes:
  a remote Clerk request cannot share a PostgreSQL transaction. Task 10 defines
  local business roles and permissions after G4 approval. Bind grants to verified
  membership identity so removing/rejoining cannot revive old grants. Task 11 uses
  Clerk membership APIs behind local guards and preserves the last-owner invariant.

## Consequences

Tenant lookup depends on Clerk Backend API availability, latency, and rate limits;
failures never fall back to a local membership copy. Production teams above the
included membership limit require another cost/scope decision. Onboarding,
invitations, management UI, and business roles remain outside Task 08. G1 research,
mutation-boundary approval, the role matrix, decimal policy, pilot sign-in
validation, and deployment gates remain open.

## Links

- [Clerk organizations](https://clerk.com/docs/guides/organizations/overview)
- [Membership lookup](https://clerk.com/docs/reference/backend/organization/get-organization-membership-list)
- [Clerk configuration](https://clerk.com/docs/guides/organizations/configure)
- [Pricing](https://clerk.com/pricing)
- [ADR 0002](0002-clerk-authentication.md)
- [ADR 0013](0013-local-postgresql-foundation.md)
- [Task readiness and scope](../agent-sized-build-plan.md)

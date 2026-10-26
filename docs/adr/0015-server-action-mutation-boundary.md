# ADR 0015: Use Server Actions for application mutations

- **Date:** 2026-10-26
- **Status:** Accepted

## Context

The founder requested closure of the G4 mutation-boundary decision before Task 09.
This decision adopts the existing Next.js rule for UI mutations: native Server
Actions fit the App Router without a second API layer or an action framework.
The engineering choice is recorded under that request. No mutation is implemented
by this decision.

## Decision

- Use Next.js Server Actions for mutations initiated by the application UI.
  Keep provider calls behind `src/auth` and persistence behind `src/db`.
  Add Route Handlers only for a separately approved external HTTP integration.
- Apply the [mutation contract](../api-conventions.md#mutation-contract) inside
  every action: authenticate, validate input with Zod, derive current tenant
  authority on the server, enforce local business permissions, and return only
  safe UI data. Page, layout, proxy, and hidden-control checks are insufficient.
- Approve only the narrow [Task 09 bootstrap exception](../api-conventions.md#task-09-bootstrap)
  before a local tenant and Task 10 permissions exist. It permits authenticated
  creation/recovery of the caller's first organization, verified against Clerk;
  it grants no purchasing or other business permission.
- Task 09 must define and test duplicate/concurrent-submission handling and
  recovery across Clerk and PostgreSQL. Local transactions do not make a remote
  Clerk call atomic. Failure observability and safe retry behavior belong to
  the first mutation, not only the later reliability tasks.

## Consequences

G4 mutation-boundary approval is closed. Task 08's development configuration
acceptance is recorded in its [handoff](../handoffs/08-clerk-organizations.md);
Task 09 is the next implementation task using this native framework boundary.
Zod must become a direct dependency in the implementation task that first uses
it; no package or application change is part of this decision.

G1 research, Task 10's permission matrix, decimal scale/rounding, pilot sign-in
validation, and deployment/backup responsibilities remain open. This decision
does not approve later business schemas, a public API, or pilot release.

## Links

- [Next.js mutation rules](../nextjs.md)
- [Next.js Server Actions security](https://nextjs.org/docs/app/guides/server-actions#security)
- [Next.js data security](https://nextjs.org/docs/app/guides/data-security#mutating-data)
- [Clerk membership and local business roles](0014-clerk-organizations-local-business-roles.md)
- [Task readiness and scope](../agent-sized-build-plan.md)

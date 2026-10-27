# ADR 0016: Fixed local business roles and action permissions

- **Date:** 2026-10-27
- **Status:** Accepted; founder approved the complete proposal on 2026-10-27.

**Future extension approved by [ADR 0019](0019-pilot-numeric-settlement-policy.md):**
Task 25 must add `supplier_payments.adjust_rounding` for owner only. The original
matrix below and Task 10's current twenty permissions are unchanged until that
workflow is implemented. Existing catalogue/payment permissions govern custom
weight measures and payment exchange-rate entry; they do not grant reductions.

## Context

Task 09 is merged. The build plan names Task 10 as next and keeps its G4
permission-matrix gate open. ADR 0014 gives Clerk ownership of membership and the
application ownership of business permissions. ADRs 0006 and 0010 already require
owner approval for receipt variances, stock corrections, and cancellations.

Founder approval covers the matrix, first-owner bootstrap, denial behavior, and
Task 10 scope together. This is policy approval, not evidence of G1 research.
G1 and the other open gates stay open.

## Decision

### Roles and permission catalogue

Use seven fixed role defaults: `owner`, `admin`, `manager`, `warehouse`, `sales`,
`accountant`, and `viewer`. A membership has at most one local business role per
organization. Define the catalogue and role mappings in application code; do not
add editable role/permission tables, custom roles, or a permissions dependency.

Each `Yes` is an explicit grant. An absent role, unknown role/permission, or empty
grant denies access. Owner has every listed permission; new permissions require
an explicit mapping change rather than a wildcard.

| Permission | Owner | Admin | Manager | Warehouse | Sales | Accountant | Viewer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `organization.read` | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `organization.manage` | Yes | Yes | No | No | No | No | No |
| `staff.read` | Yes | Yes | No | No | No | No | No |
| `staff.manage` | Yes | Yes | No | No | No | No | No |
| `ownership.manage` | Yes | No | No | No | No | No | No |
| `catalog.read` | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `catalog.manage` | Yes | Yes | Yes | No | No | No | No |
| `suppliers.read` | Yes | Yes | Yes | Yes | No | Yes | Yes |
| `suppliers.manage` | Yes | Yes | Yes | No | No | No | No |
| `purchases.read` | Yes | Yes | Yes | Yes | No | Yes | Yes |
| `purchases.manage` | Yes | Yes | Yes | No | No | No | No |
| `receipts.accept` | Yes | Yes | Yes | Yes | No | No | No |
| `receipts.approve_variance` | Yes | No | No | No | No | No | No |
| `inventory.read` | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `inventory.correct` | Yes | No | No | No | No | No | No |
| `transactions.cancel` | Yes | No | No | No | No | No | No |
| `supplier_balances.read` | Yes | Yes | Yes | No | No | Yes | Yes |
| `supplier_payments.read` | Yes | Yes | Yes | No | No | Yes | Yes |
| `supplier_payments.record` | Yes | Yes | No | No | No | Yes | No |
| `audit.read` | Yes | Yes | No | No | No | Yes | No |

`organization.read` covers basic business identity/settings, not all business data.
Each dataset needs its own listed permission. Purchase reads include purchase
prices; warehouse and viewer access to those prices is an explicit approved
default. Viewer can read supplier balances/payments but cannot change them. The
sales default has catalogue/stock reads only while sales remains deferred.

`staff.manage` excludes granting, demoting, or removing owners; those operations
also require `ownership.manage`. Task 11 must enforce the last-active-owner
invariant and validate every target's current membership in the same organization.
No current role permits bypassing owner approval or recording a deferred return.

Catalogue entries for later tasks specify their authorization boundary; they do
not authorize implementing those workflows early or bypassing their gates.

### Membership-bound grants and first-owner bootstrap

- Store only the local role assignment: local organization UUID, verified Clerk
  membership ID, verified Clerk user ID, role, and UTC creation timestamp. Enforce
  one role per organization/membership and restrict stored roles to the seven
  defaults. Do not mirror membership lifecycle or trust Clerk Admin/Member roles.
- Resolve assignments using all three verified identities. Removing membership
  denies access on the next lookup. Rejoining with a new membership ID does not
  match the old assignment, even if the user and organization IDs are unchanged.
- Grant the first owner only inside the explicit onboarding mutation, after its
  existing creator/request-marker and current membership verification. Commit the
  grant and an immutable bootstrap membership marker with local provisioning in
  one PostgreSQL transaction. Normal reads never grant a role.
- This extends ADR 0015's bootstrap exception solely to issue the first local
  owner grant after verified provisioning. All subsequent business operations
  require the permission guard; onboarding is not a general role-grant endpoint.
- Bootstrap is one-time per saved onboarding request. Retries preserve any later
  role change/removal and cannot create another owner grant. A different membership
  cannot claim the original grant. Do not reset the marker during staff management.
- Existing Task 09 businesses have no business grants yet. Their authenticated
  creator may explicitly resume the saved setup and pass the same verification
  for the first grant; do not bulk-promote users or derive roles in a migration.
  Organizations without a verifiable saved request remain denied pending a
  separately reviewed recovery procedure.

### Authorization guard

Provide one server-only `requirePermission(permission)` boundary. It authenticates
the caller, resolves the current verified tenant context, looks up that exact
membership's local role, and checks the fixed catalogue. It accepts no caller user,
organization, membership, or role as authority and does not cache across requests.
Successful calls return the verified context for tenant-scoped queries/writes.
Resource IDs still need validation and organization scoping at each data boundary.

Anonymous callers retain the existing sign-in redirect. Missing tenancy, missing
or insufficient grants, and unknown permissions deny access without returning
business data. Provider/database failures fail closed with safe errors; preserve
Next.js control-flow exceptions. An authenticated denial must not start onboarding
again or restore a role. Each Server Action and protected data operation checks its
own permission; a layout guard or hidden control is insufficient.

## Task 10 scope

Add the fixed catalogue, one assignment table and reviewed additive migration,
one-time onboarding bootstrap, and the server guard. Connect applicable existing
page boundaries without introducing business workflows. Update direct callers,
fixtures, and tests affected by the bootstrap contract. Keep all database access
under `src/db` and provider-specific membership verification under `src/auth`.

Verify the guard's permitted/forbidden outcomes, anonymous/non-member denial,
cross-tenant and mismatched-user isolation, removal/rejoin, safe outages, and
membership rechecking. Verify bootstrap concurrency, retry non-escalation, and
transaction rollback on the isolated database. Review the complete diff before
the final lint, typecheck, test, and build pass; finish the handoff and review PR.

Staff UI, invitations, arbitrary grants, last-owner mutation implementation,
business CRUD, sales, returns, deployment changes, and new dependencies are outside
Task 10. Task 11 supplies the guarded staff management operations.

## Consequences

Permission changes require a code review and deployment. Stale assignments may
remain as local records but grant no access without their exact current Clerk
membership. Legacy businesses need an explicit verified setup resume before their
first role exists. Founder approval explicitly includes viewer financial reads and
warehouse purchase-price reads. Research can motivate a later policy ADR.

## Links

- [Task 10 and readiness gates](../agent-sized-build-plan.md#current-gate-status)
- [Security](../security.md)
- [Clerk membership and local roles](0014-clerk-organizations-local-business-roles.md)
- [Server Action boundary](0015-server-action-mutation-boundary.md)
- [Receipt variance approval](0006-receipt-variance-approval.md)
- [Correction approval](0010-owner-approval-for-corrections.md)
- [Task 09 handoff](../handoffs/09-first-organization-onboarding.md)

# Task 08 completion and Task 09 readiness

Date: 26 October 2026.

## Scope and acceptance

The user requested completion of Task 08's development organization settings and
resolution of the G4 mutation-boundary decision. Task 09 implementation is separate.

- [x] Verify the configured Clerk instance is development before the update.
- [x] Change only `force_organization_selection` to `false` through
  `PATCH /v1/instance/organization_settings`; HTTP 200 alone is not acceptance.
- [x] Independently read Clerk's public environment afterward: Organizations on,
  membership optional, automatic organization creation off.
- [x] Record accepted ADR 0015: native Next.js Server Actions with per-call
  authentication, Zod validation, current tenant authority, business permissions,
  safe errors/correlation, and Task 09's narrow creator-provisioning exception.
- [x] Update affected task scope and readiness together. Preserve G1 research,
  permission-matrix, decimal-policy, pilot sign-in, and deployment evidence gates.

## Changed files and operational impact

- `docs/adr/0015-server-action-mutation-boundary.md`: accepted boundary decision.
- `docs/api-conventions.md`: mutation and first-organization bootstrap contracts.
- `docs/architecture.md`, `docs/security.md`: approved boundary and minimum failure
  observability, with later operational work still deferred.
- `docs/agent-sized-build-plan.md`: Task 08 complete; G4 mutation decision resolved;
  Task 09 scope and acceptance aligned with ADR 0015.
- `docs/deployment.md`, `docs/handoffs/08-clerk-organizations.md`: setting correction
  and independent live verification evidence; implementation PR #16 is merged.
- `docs/adr/README.md`, `docs/README.md`, and this handoff: navigation and delivery
  evidence.

Only the development membership-selection requirement changed remotely. No user,
organization, invitation, membership record, database row, or credential changed.
No application code, dependency, migration, environment variable, or CI change.
Optional membership permits authenticated onboarding without a tenant; it does not
grant tenant or business access.

## Pre-validation review

Used `ponytail:ponytail-review` on the full documentation diff, current session and
tenant contracts, ADR 0014, and the small invited pilot scope. Checked the policy
against installed Next.js 16.4.2 guidance and current Context7 documentation.
Reviewed direct action invocation, input validation, ownership/permissions, local
transactions versus remote recovery, safe errors, origin protections, and open
evidence gates.

Resolved one connected documentation mismatch: security guidance deferred all
request identifiers/logging, while the first mutation needs safe correlated
failure evidence. It now distinguishes that minimum from later general logging.
No remaining must-fix findings.

## Final verification

- `npm run lint` and `npm run typecheck`: pass.
- `npm run test`: 75 tests across 8 files pass.
- `npm run build`: pass with CI's nonfunctional Clerk keys and unreachable
  database URL; this is compilation evidence, not a deployable authenticated app.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- All 202 local Markdown links/anchors across 48 project documents and
  `git diff --check`: pass.
- A second read-only Clerk check confirms development, Organizations enabled,
  membership optional, automatic creation off, and the existing five-member cap.

The repository changes are documentation only and can be reverted independently.
Reverting them does not revert the live development setting; a later policy change
requires a separate configuration update and verification.

## Limitations and next task

Live browser sign-in, membership-removal behavior, production cookies, migration
execution, backup restoration, and deployment are not revalidated by this change.
The setting readback verifies configuration, not those runtime behaviors.

Next: **09 — Implement first-organization onboarding**, following ADR 0015 and the
[bootstrap contract](../api-conventions.md#task-09-bootstrap). Task 10 still needs
permission approval, Task 12 needs decimal policy, and Tasks 13–35 need G1 evidence.

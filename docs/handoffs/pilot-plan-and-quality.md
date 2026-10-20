# Maintenance handoff — pilot plan and quality safeguards

Date: 20 October 2026.

## Status and scope

Local acceptance checks are complete. This maintenance change addresses the five
review findings; it does not implement the future purchasing/database tasks.
GitHub review is required before merge.

- Aligned the task sequence, dashboard, E2E scenario, and release checklist with
  the purchasing pilot. Customers, sales, customer payments, multiple warehouses,
  and the report/export suite are deferred; existing task IDs remain stable.
- Added one gate-readiness table with evidence, owners, blockers, and the exact
  conditions for foundation work before discovery. G1/G4 approvals remain open.
- Recorded the founder's accepted-receipt supplier-debt decision in ADR 0012.
  Task 20 now owns atomic receipt/movement/payable/status creation; Tasks 25–26
  cover supplier settlement and reconciliation. Updated terminology requirements.
- Added a high/critical production dependency audit to CI and documented the
  owner-approved, advisory-specific exception policy. No exceptions were added.
- Patched Next.js and `eslint-config-next` to 16.4.2; the lockfile resolves
  `sharp` 0.35.5, `source-map-js` 1.2.2, and Vitest 4.1.12.
- Removed the temporary `--passWithNoTests` allowance.

## Acceptance checks and verification

- [x] All 35 existing task IDs are preserved and classified exactly once.
- [x] The pilot sequence and acceptance checks exclude deferred sales/customer work.
- [x] Supplier debt recognition has an accepted ADR and an owning implementation task.
- [x] Gate status distinguishes founder approval from completed research evidence.
- [x] Dependency patch and production audit pass.
- [x] Lint, typecheck, all tests, and production build pass after dependency changes.
- [x] An unmatched test filter fails instead of silently passing.
- [x] Final documentation links and diff checks pass.

Baseline: lint, typecheck, production build, and 30 tests across four files passed.
The initial production dependency audit reported one critical and two high
vulnerabilities. After dependency updates:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 30 tests across four files on Vitest 4.1.12.
- `npm run build`: passed on Next.js 16.4.2, including GT's SWC integration.
- `npm audit --omit=dev --audit-level=high`: passed, zero vulnerabilities.
- `npm run test -- __afcs_no_matching_tests__`: exited 1 as expected; an explicit
  assertion verified the failure code.
- Local Markdown links in 41 documents, all 35 task IDs/classifications, and
  `git diff --check`: passed.

## Changed files

- Rules and vocabulary: `AGENTS.md`, `GLOSSARY.md`.
- Build plan and product/engineering docs: `docs/agent-sized-build-plan.md`,
  `docs/product-requirements.md`, `docs/architecture.md`, `docs/database.md`,
  `docs/security.md`, `docs/testing.md`, and `docs/README.md`.
- Decisions: ADRs 0003 and 0011, new ADR 0012, and `docs/adr/README.md`.
- Dependencies and CI: `package.json`, `package-lock.json`,
  `.github/workflows/ci.yml`.
- This handoff.

## Environment, migration, and limitations

- No environment variables, credentials, database schema, migrations, or business
  records are changed. Rollback is a code/dependency revert.
- G1 research, Pashto terminology/pilot sign-in validation, decimal scale/rounding,
  and the remaining G4 decisions still need their recorded evidence/approval.
- Purchasing services and their future integration/E2E tests remain unimplemented.
  Existing auth tests mock Clerk; real sign-in and production-cookie behavior are
  not revalidated by this maintenance change.
- The full development-inclusive audit still reports five high entries from one
  unpatched ESLint/`braces` advisory. It is absent from production dependencies;
  exposure and follow-up are recorded in `docs/security.md`. The production gate
  remains strict with no exceptions.

## Exact next task

**07 — Introduce PostgreSQL, Drizzle, and migration workflow**, after the G4
database environment, initial model, and migration/recovery approvals are recorded
in the build plan's gate table. G1 remains required before Tasks 13–35.

# Maintenance handoff — PostgreSQL CI and pilot readiness

Date: 28 October 2026.

## Status and acceptance

**Complete and ready for review.** This maintenance change runs the existing
database acceptance tests in CI and records the confirmed research interview
without implementing a numbered feature. G1 itself remains open.

- [x] Add a separate PostgreSQL 16 service job on every push and pull request.
- [x] Apply the committed migrations twice before running both integration suites.
- [x] Use a disposable `afcs_task07_verify` database and fixed job-local credentials;
  no repository secrets or shared application database are used.
- [x] Preserve the existing `quality` job, including its database-free build.
- [x] Record the approved narrow CI exception in ADR 0013 and update current guidance.
- [x] Complete pre-validation review and all required local quality checks.
- [x] Save the founder-confirmed anonymized research summary and preserve G1's
  unmet evidence threshold and the unresolved payment-policy mismatch.

## Changed files

- `.github/workflows/ci.yml`: add the `database` job with readiness checks,
  committed/repeated migration application, and explicit integration-test opt-in.
- `docs/adr/0013-local-postgresql-foundation.md`: record the approved exception
  for migrations against disposable CI data only.
- `docs/agent-sized-build-plan.md`, `docs/testing.md`, `docs/database.md`, and
  `docs/deployment.md`: distinguish the two jobs and preserve the open gates.
- `docs/README.md`: index this handoff.
- `docs/handoffs/pilot-research-evidence.md` and
  `docs/handoffs/pilot-blocker-clarifications.md`: record the confirmed interview,
  approximate counts, terminology, remaining G1 evidence, and payment-policy review.
- This handoff.

No application, schema, migration, dependency, permission, or deployment changes.
`AFCS_TEST_DATABASE_URL` already exists; CI now supplies it for the database tests.

## Pre-validation review

Used `ponytail:ponytail-review` on the workflow diff, both integration suites,
`drizzle.config.ts`, package scripts, migration history, and connected documentation.
Assumed independent GitHub-hosted jobs with one disposable service per database job.
Checked service readiness, runner-to-service addressing, explicit test activation,
the tests' database-name guards, synthetic fixture cleanup, migration reapplication,
failure propagation, and absence of real credentials or deployment mutation.
The existing quality job is unchanged. No unresolved must-fix findings.
Reviewed the subsequent research record against the founder's confirmed answers,
G1's threshold, pilot exclusions, and ADRs 0009/0019. The running-balance mismatch
is flagged for review; no payment policy or permission is silently changed.

## Verification

- `npm run lint`, `npm run typecheck`, and `npm run build`: pass.
- `npm run test`: **372 unit tests pass**; the **21 opt-in PostgreSQL tests**
  skip in this deliberately database-free run.
- Both integration suites against local PostgreSQL 16's isolated
  `afcs_task07_verify`: **21 tests pass**. Both migration applications pass;
  all four existing migration hashes/timestamps remain unchanged, and application
  table counts return to their pre-test values after synthetic fixture cleanup.
- `npm audit --omit=dev --audit-level=high`: pass, zero vulnerabilities.
- Workflow assertions: existing quality-job contents unchanged; explicit isolated
  database/test opt-in; two migration invocations; no repository-secret references
  or ignored failures.
- `git diff --check` and 281 local documentation links/anchors across 61 Markdown
  files: pass.

Local Docker's Linux engine is unavailable, so a fresh service-container run is
not claimed locally. GitHub's [first PR run](https://github.com/atlas700/code-1/actions/runs/40665610063)
passes both `quality` and `database` on commit `0a025ce`; the push run also passes.
This verifies fresh PostgreSQL 16 service provisioning, committed/repeated
migrations, and the 21 integration tests. Subsequent research/documentation edits
do not change that workflow. Neither local nor CI evidence proves live Clerk
behavior, pilot phone delivery, deployment, backups, or restore readiness.

## Recovery and next task

Revert this maintenance commit to remove the CI job; no shared database migration
or data rollback is needed. G1 research, pilot phone sign-in, and deployment/restore
gates remain open. The [confirmed G1 interview](pilot-research-evidence.md) records
approximately 10 interviews and four observed businesses, below the required
counts, and flags the selected-payable policy for review before Task 25.

Next implementation task remains **13 — units and product categories**, blocked
until the required 20 interviews and five workflow observations are documented.

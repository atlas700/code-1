# Testing

## Pre-validation code review

After implementing a feature or code/configuration change, and before the final
quality-command pass:

1. Use `ponytail:ponytail-review` to review the complete task diff and connected
   callers and tests against the task's acceptance criteria and repository rules.
2. Trace affected security boundaries: input validation, authentication,
   authorization and tenant isolation, injection risks, and secret or sensitive
   data exposure. Check transaction safety, error handling, regressions, and
   missing tests where relevant.
3. Fix all must-fix findings and recheck the fixes before running the final
   quality commands. Record the review scope, findings and their disposition, and
   any remaining limitations in the handoff; explicitly state when no findings
   were found.
4. Run the required quality commands below and task-specific acceptance checks.
   If a validation fix changes code, review the changed paths again before
   rerunning the affected checks.

Keep tests and focused checks running during development, including test-first
work. This review complements the dependency audit and GitHub PR review. It is
an agent workflow requirement; CI continues to run the existing automated checks.

## Quality commands

- **Node.js:** 24.x (the current local baseline is 24.20.0).
- Install locked dependencies with `npm ci`.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
- CI runs those same commands on every push and pull request.
- CI also runs `npm audit --omit=dev --audit-level=high` after installation. Run it
  locally for dependency or CI changes and before deployment.

## Strategy

- Vitest is the unit-test runner. `npm run test` uses `vitest run` for a
  non-interactive one-shot run and fails if no test files are discovered.
- Configuration and authentication tests cover missing/malformed keys, origin
  validation, sanitized session lookup, guard denial/acceptance, all six protected
  pages, and the sign-in page. Auth unit tests mock Clerk; they do not establish
  real credential delivery, session revocation, or production-cookie behavior.
- `vitest.config.mts` resolves the same `@/` source alias used by application code.
- Database unit tests cover URL validation, lazy pool creation, development reload
  reuse, and sanitized background errors without connecting to PostgreSQL. Task 07
  separately verifies its baseline migration on a fresh local database and then
  development; CI does not provision or migrate a database.
- Later tasks add focused tests for tenancy, authorization, exact totals, status
  transitions, inventory, and payments as those behaviors are introduced.
- Task 08 tests mock Clerk and the PostgreSQL transport while using Drizzle's real
  query generation. They cover exact organization/user filtering, absent/deleted
  or mismatched membership, stale claims, sanitized failures, the parameterized
  local mapping read, and rechecking after removal or organization change. Local
  acceptance separately applies/reapplies reviewed SQL and checks defaults and
  constraints in a rolled-back transaction on the isolated verification database.
- Browser end-to-end coverage is deferred to Task 33; it must use isolated seeded
  data for purchasing, accepted receipt/payable creation, supplier payment, and
  stock/supplier balance reconciliation rather than a shared development database.

## Dependency gate

- The audit checks production dependencies and fails for high or critical
  advisories. Lower-severity findings remain visible for review.
- Update compatible affected packages and commit the lockfile; keep Next.js and
  `eslint-config-next` on the same version. Run all four quality commands after
  dependency changes.
- There are no advisory exceptions. If a fix is unavailable, obtain owner approval
  and record the advisory ID, affected path/reachability, mitigation, owner, and
  expiry/review date in `docs/security.md` before changing the gate. A failed audit
  remains a release blocker until fixed or an approved, narrowly scoped exception
  is implemented; never bypass it with `continue-on-error` or a broad severity change.

## Scope

- No browser DOM test environment, coverage tooling, integration-test database, or
  end-to-end framework is part of this baseline.
- CI uses explicitly nonfunctional Clerk key placeholders only for compilation.
  They cannot sign in users and must not be reused for an application deployment.
  Unit tests use their own isolated placeholders and never contact Clerk.
- A normal local build requires development keys in `.env.local`. Follow the
  [authentication smoke check](deployment.md#authentication-setup-and-smoke-check)
  to verify real sign-in and sign-out; this remains separate from unit tests.

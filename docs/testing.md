# Testing

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

# Testing

## Quality commands

- **Node.js:** 24.x (the current local baseline is 24.20.0).
- Install locked dependencies with `npm ci`.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
- CI runs those same commands on every push and pull request.

## Strategy

- Vitest is the unit-test runner. `npm run test` uses `vitest run` for a
  non-interactive one-shot run and temporarily permits no matching test files.
- Configuration and authentication tests cover missing/malformed keys, origin
  validation, sanitized session lookup, guard denial/acceptance, all six protected
  pages, and the sign-in page. Auth unit tests mock Clerk; they do not establish
  real credential delivery, session revocation, or production-cookie behavior.
- `vitest.config.mts` resolves the same `@/` source alias used by application code.
- Later tasks add focused tests for tenancy, authorization, exact totals, status
  transitions, inventory, and payments as those behaviors are introduced.
- Browser end-to-end coverage is deferred to Task 33; it must use isolated seeded
  data rather than a shared development database.

## Scope

- No browser DOM test environment, coverage tooling, integration-test database, or
  end-to-end framework is part of this baseline.
- CI uses explicitly nonfunctional Clerk key placeholders only for compilation.
  They cannot sign in users and must not be reused for an application deployment.
  Unit tests use their own isolated placeholders and never contact Clerk.
- A normal local build requires development keys in `.env.local`. Follow the
  [authentication smoke check](deployment.md#authentication-setup-and-smoke-check)
  to verify real sign-in and sign-out; this remains separate from unit tests.

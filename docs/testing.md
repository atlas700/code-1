# Testing

## Quality commands

- **Node.js:** 24.x (the current local baseline is 24.20.0).
- Install locked dependencies with `npm ci`.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
- CI runs those same commands on every push and pull request.

## Strategy

- Vitest is the unit-test runner. `npm run test` uses `vitest run` for a
  non-interactive one-shot run and temporarily permits no matching test files.
- There are intentionally no test suites yet; feature tasks must add focused tests
  with the behavior they introduce.
- Later tasks add focused tests for tenancy, authorization, exact totals, status
  transitions, inventory, and payments as those behaviors are introduced.
- Browser end-to-end coverage is deferred to Task 33; it must use isolated seeded
  data rather than a shared development database.

## Scope

- No browser DOM test environment, coverage tooling, integration-test database, or
  end-to-end framework is part of this baseline.

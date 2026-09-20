# Testing

## Confirmed baseline

- ESLint is installed and available through `npm run lint`.
- The project has a production build command: `npm run build`.
- No unit, integration, or browser end-to-end test framework is installed.

## Strategy

- Task 02 establishes the minimum repeatable local and CI commands for linting, type
  checking, unit tests, and production builds.
- Later tasks add focused tests for tenancy, authorization, exact totals, status
  transitions, inventory, and payments as those behaviors are introduced.
- Browser end-to-end coverage is deferred to Task 33; it must use isolated seeded
  data rather than a shared development database.

## Decision status

**Open — test tooling:** select only the tooling needed to satisfy Task 02 after
checking the then-current project requirements. No test framework is selected here.

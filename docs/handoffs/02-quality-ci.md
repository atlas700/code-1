# Task 02 handoff — quality commands and CI baseline

## Completed

- Added Vitest as the unit-test runner and a one-shot `npm run test` command.
- Added application-scoped linting, TypeScript type checking, and GitHub Actions CI.
- CI uses Node.js 24, npm's lockfile install, npm cache, and the same quality
  commands documented for local development.

## Commands

```text
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run test` currently succeeds with no test files. This is intentional for the
foundation baseline; future feature tasks must add focused tests.

## Verification

All commands above passed locally on Node.js 24.20.0. The workflow requires no
secrets or environment variables.

## Next task

**03 — Add runtime environment validation**.

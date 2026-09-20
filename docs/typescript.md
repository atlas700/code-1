# TypeScript rules

## Compiler and types

- Keep `strict: true`, `noEmit: true`, and Next.js-generated type includes enabled. Do not weaken the compiler to silence an error.
- Prefer inference for obvious local values. Add explicit types at module boundaries, public APIs, complex return values, and when they make an invariant clear.
- Use `unknown` for untrusted values and narrow it before use. Do not introduce `any`, `@ts-ignore`, or unchecked type assertions; use `@ts-expect-error` only for a documented, intentional failing type test.
- Model optional properties accurately. Omitted and `undefined` are different states when the distinction matters; do not use optional fields as a shortcut for unclear data models.
- Prefer discriminated unions for mutually exclusive states. Make impossible states unrepresentable where practical.

## Modules and naming

- Use `import type` for type-only imports.
- Use the `@/` alias for application imports from `src`; use relative imports within a small, cohesive feature folder.
- Export types alongside the feature that owns them. Avoid global declarations except for genuine ambient types.
- Use `type` for object shapes by default; use `interface` only when declaration merging or a public extension contract is intentionally required.

## Sources

- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [`strict` TSConfig option](https://www.typescriptlang.org/tsconfig/strict.html)
- [`exactOptionalPropertyTypes` TSConfig option](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)

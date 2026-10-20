# Architecture

## Confirmed baseline

- The repository is a minimal Next.js `16.3.5` App Router application with React
  `19.2.8`, strict TypeScript, Tailwind CSS 4, and ESLint.
- Routes and layouts live in `src/app`; the Clerk integration lives in `src/auth`.
- Clerk supplies identity and session management. Each application page calls the
  server-only `requireSession()` guard; the sign-in page uses `getSession()`.
- The proxy composes Clerk session handling with General Translation locale
  handling. Route protection stays in each resource, following Clerk 7 guidance.
- Vitest covers configuration validation, the session boundary, and page access.
- PostgreSQL, Drizzle, and a general UI-component library are not installed.
- Localization uses General Translation with English and Pashto; its runtime
  translation service remains disabled until terminology and credentials are ready.
- Future application work follows the App Router and favors Server Components with
  small client-side interactive leaves.

## Decision status

**Partially decided — G4 architecture approval:** Clerk is the approved pilot
authentication provider; see [ADR 0002](adr/0002-clerk-authentication.md). The
initial data model, role matrix, mutation boundary, deployment target, and backup
owner remain open before their dependent infrastructure work. The owning details are
tracked in [database](database.md), [security](security.md),
[API conventions](api-conventions.md), and [deployment](deployment.md).

## Intended boundaries

- Persistence code may be introduced under `src/db` only when persistence is needed.
- Authentication-provider integration must remain behind a small local auth module.
- `getSession()` returns `{ userId }` or `null`; `requireSession()` returns
  `{ userId }` or delegates denial to Clerk. Neither returns tokens, organization
  claims, or business permissions. New pages, actions, and handlers must invoke the
  guard before accessing protected data; a layout or proxy check is insufficient.
- Server code derives organization context from authenticated membership rather than
  request or form input.
- Financial and inventory business events must be atomic when those modules are
  introduced.

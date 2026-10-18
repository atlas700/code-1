# ADR 0002: Use Clerk for pilot authentication

- **Date:** 2026-10-19
- **Status:** Accepted

## Context

The pilot needs secure sign-in before its database and business-domain schema are
introduced. Better Auth is a valid TypeScript option, but it requires application
database tables and a migration workflow. That would combine the build plan's
authentication task with the later database task.

## Decision

- Use Clerk as the managed identity and session provider for the pilot.
- Keep Clerk-specific calls behind a small local `src/auth` module when Task 06 is
  implemented.
- Treat Clerk's user ID as an external identity reference only. The application's
  future `organization_members` records remain the authority for organization
  selection and business permissions.
- Choose the enabled end-user sign-in methods only after pilot contacts validate
  whether email, phone, or owner-created credentials are workable.

## Consequences

- Task 06 may proceed without first introducing the application's PostgreSQL
  schema.
- Clerk account configuration and server-side credentials will be required during
  implementation. Server-side credentials must remain server-only; any publishable
  key follows Clerk's documented client-exposure guidance.
- Replacing Clerk later requires changing the local auth adapter and migrating the
  external user identity references; it must not change tenant or role rules.

## Links

- [Architecture](../architecture.md)
- [Security](../security.md)
- [Task 06 build plan](../agent-sized-build-plan.md)

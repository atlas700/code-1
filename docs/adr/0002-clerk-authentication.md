# ADR 0002: Use Clerk for pilot authentication

- **Date:** 2026-10-19
- **Status:** Accepted

The membership/organization-selection provisions below are superseded by
[ADR 0014](0014-clerk-organizations-local-business-roles.md). Clerk now owns
membership; business roles remain local. Other decisions in this ADR still apply.

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
- Validate Clerk phone OTP with Pilot A (owner), Pilot B (warehouse/operations),
  and Pilot C (sales/accounts) before enabling it as the pilot sign-in method.
  Record only anonymized delivery and completion outcomes; never add phone numbers
  or OTPs to the repository.
- Choose the enabled end-user sign-in method after reviewing those outcomes. Email
  and owner-created credentials remain alternatives, not fallbacks enabled by
  default.

## Consequences

- Task 06 may proceed without first introducing the application's PostgreSQL
  schema.
- Clerk account configuration and server-side credentials will be required during
  implementation. Server-side credentials must remain server-only; any publishable
  key follows Clerk's documented client-exposure guidance.
- Phone OTP is not approved for pilot use until the Pilot A–C validation result is
  recorded and reviewed.
- Replacing Clerk later requires changing the local auth adapter and migrating the
  external user identity references; it must not change tenant or role rules.

## Links

- [Architecture](../architecture.md)
- [Security](../security.md)
- [Task 06 build plan](../agent-sized-build-plan.md)

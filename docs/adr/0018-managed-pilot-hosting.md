# ADR 0018: Select Vercel and Neon with founder-owned operations

- **Date:** 2026-10-27
- **Status:** Accepted target and owner; deployment readiness remains open

## Context

The founder delegated hosting selection between Vercel, Netlify, or another
suitable option within a startup budget, and confirmed personal responsibility
for hosting. The existing application uses Next.js and PostgreSQL. Select managed
services rather than adding server administration to the pilot.

## Decision

- Select Vercel Pro for the commercial application and Neon PostgreSQL for the
  hosted database. Local PostgreSQL development remains under ADR 0013.
- The founder owns hosting/database accounts, billing, operational alerts, and
  backup recovery. Credentials stay outside source control and public records.
- Plan for separate staging and production data, explicit reviewed migrations,
  monitoring, backups, and a verified non-production restore before pilot use.
- Treat USD 40–60/month as an initial hosting/database planning estimate, not an
  approved spending limit or a guaranteed bill. Domain, authentication/SMS,
  taxes, additional seats, and excess usage are not included in that estimate.
- Approve backup retention/location, monitoring, recovery objectives, and an
  enforceable spending policy before configuring pilot infrastructure. No paid
  resource or deployment is created by recording this selection.

## Consequences

Task 34 has a named target and accountable owner. G4 deployment stays open until
the remaining operating policies, configuration, and restore evidence exist.
Existing builds and migration commands remain unchanged.

Official pricing checked during this clarification: [Vercel Pro](https://vercel.com/pricing)
starts at USD 20/month; [Neon](https://neon.com/pricing) is usage-based and lists
USD 15/month for its example intermittent workload. Recheck at provisioning.

## Links

- [Local database foundation](0013-local-postgresql-foundation.md)
- [Deployment](../deployment.md)
- [Build plan](../agent-sized-build-plan.md)

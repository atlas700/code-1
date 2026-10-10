# Deployment

## Confirmed baseline

- No hosting service, deployment pipeline, staging environment, production database,
  backup configuration, or deployment environment variables are configured.
- Staging deployment, migration handling, backup scheduling, restore verification,
  and monitoring are planned for Task 34.

## Environment configuration

- The server validates `NODE_ENV` at startup. It must be `development`,
  `production`, or `test`.
- No application-specific configuration or secrets are required yet; see the
  redacted root [`.env.example`](../.env.example).
- Local-only values belong in the ignored root `.env.local` file.
- Staging and production values will be set in the approved deployment target's
  encrypted environment configuration after G4 selects that target. They must not
  be committed to the repository or exposed with a `NEXT_PUBLIC_` prefix.

## Future deployment requirements

- A deployment target and backup owner require G4 approval before infrastructure is
  configured.
- Production changes must not auto-run destructive migrations.
- Staging must not expose production data and requires a proven non-production
  restore before pilot use.
- Deployment handoffs must name the owner, rollback procedure, backup location and
  retention, and restore evidence date once those choices exist.

## Decision status

**Open — G4 deployment:** select the hosting and database approach, deployment
responsibility, backup owner, retention policy, and monitoring approach.

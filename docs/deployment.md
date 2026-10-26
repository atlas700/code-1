# Deployment

## Confirmed baseline

- No hosting service, deployment pipeline, staging environment, production database,
  backup configuration, or deployment environment variables are configured.
- Staging deployment, migration handling, backup scheduling, restore verification,
  and monitoring are planned for Task 34.

## Environment configuration

- The server validates `NODE_ENV` at startup. It must be `development`,
  `production`, or `test`.
- Clerk requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from
  the same development or production instance; see [`.env.example`](../.env.example).
  Only the publishable key is public. The secret key remains server-only.
- `APP_ORIGIN` is the exact application origin used by Clerk's `authorizedParties`
  check. It defaults to `http://localhost:3000`; set it explicitly when using another
  port or deploying. Do not include a path, credentials, or trailing slash. Live
  Clerk instances require an HTTPS origin.
- Local-only values belong in the ignored root `.env.local` file.
- `DATABASE_URL` is required at startup and by migration tooling. Keep it
  server-only; follow the [database setup](database.md). Apply reviewed migrations
  explicitly, separately from startup and builds. Quality CI uses an unreachable
  placeholder and never connects to or migrates a database.
- Staging and production values will be set in the approved deployment target's
  encrypted environment configuration after G4 selects that target. They must not
  be committed to the repository. Secrets must never use a `NEXT_PUBLIC_` prefix.
- Configure real build-time publishable keys before building a deployable artifact;
  Next.js embeds public environment values in browser bundles.

## Authentication setup and smoke check

1. Create/select a Clerk development application in the
   [Clerk Dashboard](https://dashboard.clerk.com/), then copy its two API keys into
   the ignored root `.env.local`. Copy [`.env.example`](../.env.example) first if
   needed. Do not paste secrets into chat, documentation, or source control.
2. Choose the development sign-in method explicitly. Configure a disposable test
   user in that development instance. This does not approve a pilot method:
   [ADR 0002](adr/0002-clerk-authentication.md) still requires Pilot A–C phone OTP
   validation before pilot use. Disable public registration for the invited pilot;
   staff invitations remain Task 11. The application exposes sign-in only.
3. Run `npm run dev`, visit `/sign-in`, and authenticate using the configured
   development method. The fallback destination is `/dashboard`; direct access to
   another protected page preserves Clerk's return destination.
4. Confirm all six application pages are accessible while signed in. Select
   **Sign out** in desktop or mobile navigation, then revisit a protected URL and
   verify it redirects to `/sign-in`. Try a fresh private window as well.
5. Repeat an anonymous protected request with Pashto selected; verify the sign-in
   flow preserves the locale preference and the document remains RTL.

Clerk owns credential validation, session issuance/refresh/revocation, and session
cookies. The app does not create its own token or override cookie flags. Production
requires a configured Clerk production instance, HTTPS, matching live keys, the
approved domain, and the exact `APP_ORIGIN`. Inspect actual cookie behavior in the
staging rehearsal; local development cookies are not production-cookie evidence.
See Clerk's [Next.js quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
and [production guidance](https://clerk.com/docs/guides/development/deployment/production).

## Future deployment requirements

### Development organization settings

For Task 08, enable Organizations in the **development** Clerk instance with
**Membership optional** and **Create first organization automatically** off.
This preserves sign-in before Task 09 onboarding; personal mode has no business
tenant context. Use the existing default five-member cap; no paid feature is
required. Revisit plan costs before exceeding Clerk's included membership limit.
Do not enable verified-domain enrollment or introduce business-role mappings here.

Inspect the settings after enabling. The Backend API's enable operation can turn
membership required on. The installed SDK does not expose the selection update,
but a targeted `PATCH /v1/instance/organization_settings` with only
`{"force_organization_selection":false}` was verified on the development instance
on 26 October 2026; see the [Task 08 handoff](handoffs/08-clerk-organizations.md#development-configuration-acceptance).
Verify the instance is development before changing it, and do not repeat the
enable toggle to correct membership selection. Treat neither HTTP 200 nor a
successful enable response alone as proof of the required defaults.
Clerk's public environment configuration exposes
`force_organization_selection` and
`organization_creation_defaults.automatic_organization_creation.enabled` for
verification; read both values again and also verify Organizations remain enabled.
The Dashboard's Membership optional setting is an alternative. See
[configuration](https://clerk.com/docs/guides/organizations/configure).

Organization/membership creation and management remain Tasks 09/11. No switcher,
profile-management UI, or webhooks are needed for this foundation. Future
background tenant requests must explicitly bind their intended organization to
the verified session context; Clerk documents a shared-cookie caveat for multiple
tabs in its [organization overview](https://clerk.com/docs/guides/organizations/overview).

### Staging and production

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

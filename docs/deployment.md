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

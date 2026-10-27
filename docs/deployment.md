# Deployment

## Confirmed baseline

- No hosting service, deployment pipeline, staging environment, production database,
  backup configuration, or deployment environment variables are configured.
- [ADR 0018](adr/0018-managed-pilot-hosting.md) selects Vercel Pro and Neon;
  the founder owns hosting, billing, alerts, and backup recovery. Selection does
  not establish deployed resources or an approved spending limit.
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
  encrypted environment configuration after remaining G4 operating policies are
  approved. They must not be committed to the repository. Secrets must never use
  a `NEXT_PUBLIC_` prefix.
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

   On 27 October the founder confirmed Pilot A–C are available for phone OTP
   testing. No delivery or completed sign-in outcomes are recorded yet. Record
   only anonymous delivery/completion results, never numbers or OTPs.
3. Run `npm run dev`, visit `/sign-in`, and authenticate using the configured
   development method. The fallback destination is `/dashboard`; direct access to
   another protected page preserves Clerk's return destination. An authenticated
   account without an active verified local business goes to `/onboarding`.
4. Complete first-business setup, then select **Open workspace**. Confirm the six
   placeholder pages are accessible with that verified active local tenant. Select
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

### Onboarding recovery slugs

Task 09 requires Clerk **Enable organization slugs** for its stable recovery key.
Clerk disables slugs by default for newer applications. Enable them in Organization
settings before using onboarding; this adds no organization-specific routes or
switcher. Keep each reserved `afcs-<onboarding UUID>` slug unchanged until its remote
ID is pinned locally. Renaming an unpinned slug or editing its private recovery
marker outside the app requires operator reconciliation before another retry.
After pinning, retries use the Clerk ID and tolerate slug changes.

On 26 October, the first development smoke submission returned the safe failure
path because Clerk reported `organization_slugs_disabled`. Verified the configured
instance was development, then sent only `{"slug_disabled":false}` to
`PATCH /v1/instance/organization_settings`. The installed SDK omits this update
field; it is documented by Clerk's
[official Backend API specification](https://github.com/clerk/openapi-specs/blob/main/bapi/2021-02-05.yml).
A fresh public environment read confirmed `organization_settings.slug.disabled`
was `false`, Organizations remained enabled, membership remained optional,
automatic creation remained off, and the five-member cap was unchanged.
The retry then created exactly one business. This setting is a prerequisite for
each future environment; the app never changes provider settings at startup.

The development browser smoke used a temporary, explicitly marked test account and
Clerk's reserved test email-code flow. It verified creation, delayed activation,
dashboard access, saved-detail recovery, mobile RTL layout, repeated submission,
membership-removal denial, and sign-out. The synthetic remote account/organization
and their local rows were deleted afterward. This is development evidence; pilot
phone OTP, production cookies, backup restoration, and deployment remain open.

### Business authorization rollout

Apply reviewed `0003_business_roles.sql` before deploying the Task 10 guard. It
adds local assignments and the one-time owner-bootstrap marker without granting
roles to existing users. Existing Task 09 creators must explicitly resume their
saved setup, with the same details, and pass current creator/membership verification
for the initial grant. Active Clerk membership alone no longer opens protected
pages. Do not solve a denial by assigning Clerk Admin or resetting bootstrap
markers. Staff assignment and last-owner management arrive in Task 11.

Keep the migration, assignments, and markers if application code needs a forward
fix. Rolling back to an application that lacks the guard removes permission
enforcement; it is not an authorization recovery procedure. G4 deployment, backups,
and pilot sign-in validation remain separate open gates.

### Staging and production

- ADR 0018 selects Vercel Pro/Neon and names the founder as operations/backup
  owner. Retention/location, monitoring, recovery objectives, and spending policy
  still need approval before infrastructure is configured.
- Production changes must not auto-run destructive migrations.
- Staging must not expose production data and requires a proven non-production
  restore before pilot use.
- Deployment handoffs must name the owner, rollback procedure, backup location and
  retention, and restore evidence date once those choices exist.

## Decision status

**Partially resolved — G4 deployment:** Vercel Pro/Neon and founder-owned
operations are selected under ADR 0018. Remaining operating policies,
configuration, and a proven non-production restore still block pilot readiness.

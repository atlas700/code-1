# Page and route UX audit fixes

Date: 31 October 2026.

## Authorization and scope

The founder asked to fix all 12 findings from the page/route audit. This is a
focused correction of existing screens under ADR 0020. It adds no domain workflow,
schema migration, dependency, provider setting, or deployment change. G1 remains
open; Task 15 and later remain gated. Existing unrelated skill-installation work
is excluded.

## Acceptance and changed areas

| Finding | Implemented correction | Verification |
| --- | --- | --- |
| F01 | Home uses the existing verified session lookup, hides sign-in for an existing session, and makes Open workspace primary. Dashboard/onboarding guards still decide access. | `src/app/page.test.tsx`; existing onboarding routing tests |
| F02 | Shared Select supplies GT's active direction to Radix, including its portal. | `src/components/ui/select.test.tsx`; local keyboard/portal interaction |
| F03 | All five existing route errors and shared feedback use Next.js 16.4's `retry` callback to refetch server content. | `src/app/recovery.test.tsx`; installed Next guide/source |
| F04 | Root error boundary catches shared workspace layout failures and provides retry/business selection. | Recovery rendering and callback tests; production build |
| F05 | Navigation, dashboard, and settings use the existing permission map and the verified local role to omit inaccessible links. Server guards remain authoritative. | Seven-role UI tests; unknown-role denial; existing guard tests |
| F06 | Workspace header shows the selected business name and links to business selection. A server-only metadata query binds organization, membership, and user. | Workspace page tests; real Drizzle query tests; isolated PostgreSQL switching/revocation test |
| F07 | Product, unit/category, and membership deactivation require a native confirmation naming the target and consequence. The original operation and validation behavior reach the existing Server Action. | Confirmation unit tests and native browser cancellation/submitter checks |
| F08 | Mobile navigation retains Soon; Sales says Outside pilot. | Navigation tests and rendered mobile fixtures |
| F09 | Root not-found view is branded, neutral, translated through GT, and links to guarded workspace access. | Recovery tests and rendered unavailable state |
| F10 | Product-opening links and Select options meet the 44px project target. Long product/business names wrap. | Local rendered widths and 44px option measurement |
| F11 | New business setup preselects Asia/Kabul and explains Afghanistan time. Saved setup timezones are preserved. | New/saved timezone test in onboarding pages |
| F12 | Skip link and navigation label use GT; sign-in and staff access expose the existing language selector. | Source review, entry-page composition, and rendered fixtures |

Changed areas: `src/app` entry pages, shared layout/navigation, dashboard/settings,
product link/form, catalogue/staff confirmation controls, and error views;
`src/components/feedback.tsx`, `src/components/ui/{select,confirm-submit}.tsx`;
`src/db/workspace.ts`; connected tests; `.gitignore`; testing/index documentation.
No existing mutation service, action allowlist, identity adapter, role catalogue,
or migration is changed. Generated QA artifacts are ignored rather than shipped.

## Test-first evidence

Journeys came from the audit: return after login, use only permitted navigation,
confirm the selected business, use RTL forms, recover from an unavailable page,
and cancel a deactivation safely.

- RED checkpoint `8c873f7`: the new home tests reproduced the missing session
  check and persistent sign-in link; Select reproduced LTR in an RTL locale;
  navigation reproduced Warehouse/Sales denied links, unknown-role links, and
  missing mobile indicators. Workspace page tests additionally reproduced absent
  business identity and staff links offered to five restricted roles.
- Tests for new metadata, confirmation, and recovery components initially failed
  to import their missing implementations; these are separate from the executed
  behavioral failures above. One workspace-page test setup was corrected to mock
  the existing server guard before recording its actual behavioral failures.
- GREEN checkpoint `4863fcd`: the connected run passed 76 tests across 13 files.
  A metadata test matrix was corrected to pass row arrays as table data, not
  spread arguments. No production exception was added for that test setup issue.
- The subsequent isolated PostgreSQL run passed all 50 integration tests,
  including current business identity/role switching and revocation.

## Pre-validation review

What this change does: it resolves the 12 audit findings in existing screens,
while retaining authoritative server permissions and existing mutation contracts.

Applied `ponytail:ponytail-review` at full intensity to the complete change from
`801762f`, including connected session/membership/permission helpers, metadata
query, form/actions, fallback hierarchy, locale hooks, tests, and documentation.
Assumed the invited pilot with concurrent users and requests across processes.

Checked exact tenant/membership/user binding, absent/revoked grants, SQL parameter
binding, no client role as authority, safe error text/framework rethrows, native
form submitter/validation behavior, disabled fieldsets, keyboard/RTL behavior,
and rollback implications. No schema or mutation policy is changed.

Resolved review concerns:

1. A destructive submit button relying only on a click handler can submit before
   hydration. The visible trigger is now a non-submit button; only confirmation
   requests submission through its hidden named submitter. A JavaScript-disabled
   browser check confirms the trigger performs no navigation/submission.
2. Business identity must not be read from a client ID or a stale/default role.
   The new read first authorizes `organization.read`, then selects metadata using
   all three verified identities and denies missing/unknown grants. PostgreSQL
   verifies switching and revocation; no cross-request authorization cache exists.
3. Generated fixture bundles must not become application sources or accidental
   commits. `/artifacts/` is ignored, including Tailwind's automatic source scan.

No unresolved must-fix source finding remains. Native confirmation requires
JavaScript, and is intentionally inert before hydration. This does not remove
server validation or authorization.

Verdict: Ship.

## Verification

All implementation acceptance checks above are complete within the local scopes
stated below. Live provider/deployment checks remain separate limitations.

- Final `npm run lint`, `npm run typecheck`, and `npm run build`: pass. The
  production build lists all 14 page route definitions and the framework 404 as
  dynamic routes. The new root error/not-found conventions compile successfully.
- Final `npm run test`: **487 passed**, **50 skipped** opt-in database tests;
  36 test files passed and four database files skipped in the default run.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**.
- `git diff --check`: pass.

- Focused connected run: 76 passed across 13 files.
- Isolated `afcs_task07_verify`: 50 integration tests passed; provider membership
  is mocked. The suite's existing dedicated-database guard and fixture cleanup
  remain in effect. A read after execution found zero retained `task09_org_`
  fixture organizations. No shared development database was used.
- Local synthetic browser fixtures: 138 width/direction checks across all 14
  page surfaces plus error/missing/loading and empty/permission/inactive/success/
  invalid/long-name states. Checked 1440x900, 390x844, and 320x844 in LTR and RTL;
  no document overflow. Inspected desktop products, narrow RTL long names, and
  mobile catalogue screenshots.
- Eight native browser checks passed: RTL trigger/portal, a readable and
  replaceable inactive current selection, keyboard selection/focus return,
  44px options, cancellation, confirmed operation/unit submission, reduced-motion
  skeleton, and an inert trigger without JavaScript.
- Local artifacts: `artifacts/qa-fixes-2026-10-31/` contains the fixture sources,
  screenshots, `layout-results.json`, and `interaction-results.json`. These use
  actual components with synthetic provider/service boundaries, not live sessions.
- The local design evidence checker passes its scoped record. It does not certify
  live provider behavior or full accessibility compliance.

## Limitations and next task

Real Clerk sign-in, OTP/invitation delivery, provider-backed mutations, production
cookies, and deployed routes are not verified by synthetic fixtures or mocked
provider tests. The prior local server timed out; no separate test server was
started and no provider data was changed. Translated Pashto terms remain pending
their existing approval process; RTL English fallback is not Pashto usability
sign-off. Coverage instrumentation is not installed or added; no percentage is
claimed. Remote CI/reviews are reported separately from local results.

The audit's optional follow-up cases about staff input retention and edit-form
success messages were not confirmed defects and are not presented as fixed.

Next: complete real authenticated smoke checks and G1 evidence. Task 15 suppliers
remains blocked; this polish task does not authorize its implementation.

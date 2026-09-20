# Agent-Sized Build Plan — Afghanistan Agricultural Supply Chain OS

## Purpose

This turns the product vision into small, resumable work packages. A single coding
agent should complete **one numbered implementation task per chat**, including its
tests and handoff note. Do not combine adjacent tasks merely because they look
related.

The first paid product is a multi-tenant operating system for one type of
agricultural wholesaler/distributor in one city or province. The first useful
workflow is:

```text
buy from supplier → receive stock → sell to customer → record payment → see balances
```

Everything outside that loop is deferred unless pilot evidence makes it necessary.

## Current repository baseline (20 September 2026)

- A minimal Next.js `16.3.5` App Router project in `src/app`.
- React `19.2.8`, TypeScript strict mode, Tailwind CSS 4, and ESLint are present.
- PostgreSQL, Drizzle, authentication, testing libraries, and UI-component
  libraries are not installed yet.
- Preserve the existing dirty worktree. Do not overwrite unrelated changes.

The project rules in `AGENTS.md` and `docs/` are mandatory. In particular:

- use App Router and prefer Server Components;
- keep client components as small interactive leaves;
- validate untrusted input at every server boundary;
- do not weaken TypeScript;
- add database code only under `src/db` once persistence is actually introduced;
- use generated, reviewed SQL migrations; never use destructive schema shortcuts.

## Non-negotiable operating rules

1. **Discovery before feature work.** Do not start database or UI implementation
   until the discovery gate below is passed.
2. **One task, one concern.** A task must not silently add a second module,
   redesign the app, change deployment, or introduce a speculative abstraction.
3. **Inspect first.** Every agent starts by reading the current files, `git diff`,
   relevant local rules, and the prior task's handoff.
4. **Keep money exact.** Store money as PostgreSQL `numeric` (or an explicitly
   documented integer minor-unit scheme); never JavaScript floating point.
5. **Protect tenant data.** The server derives organization context from the
   authenticated membership. A client-provided `organizationId` is never authority.
6. **Record movements, not overwritten totals.** `inventory_movements` is the
   audit source for stock. A balance/read model may be derived from it but does not
   replace it.
7. **Use transactions for business events.** Receiving, fulfilling a sale, and
   allocating a payment must either completely succeed or roll back.
8. **No fake completion.** A task is complete only when its acceptance checks pass
   and the handoff note says exactly what changed and what remains.
9. **Pilot feedback wins.** Local terminology, units, credit customs, and quality
   fields are product hypotheses until real users validate them.

## The reusable prompt for every coding chat

Copy this, then replace the bracketed task reference with exactly one task below.

```text
You are continuing the Afghanistan Agricultural Supply Chain OS repository.

First inspect: AGENTS.md; the relevant docs/*.md rules; git diff; the current
implementation; and the handoff note for the preceding task. Preserve unrelated
changes.

Implement only [TASK ID AND TITLE] from docs/agent-sized-build-plan.md.

Constraints:
- Next.js 16 App Router; keep server/client boundaries small.
- TypeScript strict; no any, ts-ignore, or weakened configuration.
- Validate all server input with Zod.
- Enforce authenticated organization membership and permissions server-side.
- Do not add functionality from later tasks or new dependencies without need.
- Use a DB transaction for an all-or-nothing financial or inventory operation.

Before finishing: run the task's checks plus the relevant existing checks. Summarize
files changed, migration impact, test evidence, known limitations, and the exact
next task. If a product decision is missing, stop and document it rather than
inventing a policy.
```

## Gates — these are decisions, not coding tasks

### G0 — choose the initial market

**Owner:** founder. **Done when:** the team has named one city/province and one
business type, for example “fruit and nut wholesalers in Kandahar.” Record the
decision, why that segment was selected, expected pilot contacts, and the target
language(s). Do not select “all Afghan agricultural businesses.”

### G1 — observe the work before modelling it

**Owner:** founder/researcher. **Done when:** 20 interviews and 5 workflow
observations are recorded. For every observed business, capture the actual purchase,
receiving, stock, sale, debt, payment, correction, and reporting flow. Prefer “show
me the last transaction” to opinion questions.

### G2 — freeze the pilot workflow

**Owner:** founder + product lead. **Done when:** one document names the top three
pains, one highest-frequency/willingness-to-pay workflow, the pilot's success
metric, and explicit MVP exclusions. The recommended first workflow remains
purchase/receive/sell/payment unless evidence disproves it.

### G3 — resolve domain policies that code cannot safely guess

Answer these from interviews before Tasks 13, 18, and 21 respectively:

| Decision | Required answer |
| --- | --- |
| Units | Are conversion rules needed, or is each product sold in one stock unit for the pilot? |
| Product identity | Does grade, origin, harvest date, or quality create distinct stock? |
| Receiving | Can receipt quantity differ from order quantity, and who may approve it? |
| Stock policy | Is negative stock ever allowed? Recommended pilot policy: no. |
| Sale timing | Does stock leave at confirmation, dispatch, or delivery? |
| Credit | Is payment applied to one invoice, oldest debt first, or manually allocated? |
| Corrections | Which users can adjust stock, cancel transactions, or record returns? |
| Languages | Which language launches first; which terms must be validated in Dari/Pashto? |

Capture each answer as a dated decision record. If an answer changes after pilot use,
change policy deliberately and migrate data safely; do not patch around it in UI.

### G4 — architecture approval

**Owner:** technical lead/founder. **Done when:** the initial data model, chosen auth
provider, role matrix, mutation boundary, deployment target, and backup owner are
approved. This gate prevents an agent from making irreversible infrastructure choices
by assumption.

## Build sequence

Tasks are intentionally small. “Verify” means evidence the agent must include in its
handoff, not a promise that it looked correct.

### Foundation

#### 01 — Create the product decision and engineering documentation shell

**Goal:** Establish durable context before code changes.

**Do:** Add concise documents for product requirements, architecture, database,
API conventions, security, testing, deployment, and an ADR directory. Seed them
with confirmed baseline facts and clearly labelled open decisions from G0–G4.

**Do not:** choose an auth vendor, schema policy, or hosting service in this task.

**Verify:** links are valid; no requirement is presented as confirmed when it is an
assumption.

**Handoff:** list every unresolved decision and point to its document.

#### 02 — Establish app quality commands and CI baseline

**Goal:** Make all later changes routinely checkable.

**Do:** Add only the minimum scripts/configuration required to run lint, TypeScript
type checking, unit tests, and a production build locally and in CI. Add a small CI
workflow that uses the lockfile and runs those checks.

**Do not:** add browser E2E infrastructure yet; that is Task 28.

**Verify:** a clean checkout can run every listed command; CI configuration matches
those commands.

**Handoff:** state the exact commands and any required Node version.

#### 03 — Add runtime environment validation

**Goal:** Fail safely and clearly when server configuration is missing or malformed.

**Do:** Define a server-only typed environment module and a complete redacted
`.env.example`. Validate only values that exist at this stage; document where secrets
are set in local, staging, and production environments.

**Do not:** expose secrets through `NEXT_PUBLIC_*`, add real credentials, or connect
to an external service.

**Verify:** invalid required configuration yields an actionable startup error; the
example contains no secret.

**Handoff:** name the variables and their purpose, never their values.

#### 04 — Build the application shell and accessible navigation

**Goal:** Replace the starter page with the authenticated-app layout shape without
pretending feature pages exist.

**Do:** Create the responsive shell, route groups, sidebar/mobile navigation,
empty-state pages, metadata, and an accessible visual token baseline. Include a
temporary unauthenticated landing/sign-in placeholder only if auth is not ready.

**Do not:** build dashboard data, CRUD forms, or hard-code business data.

**Verify:** keyboard navigation, a phone-size layout, and wide layout work; `build`,
lint, and type checks pass.

**Handoff:** document route structure and which pages are intentional placeholders.

#### 05 — Add localization and RTL plumbing

**Goal:** Make translation and right-to-left support a foundation, not a late rewrite.

**Do:** Choose and document one localization approach after G3. Add a minimal
translation provider, locale preference storage plan, direction switching, and
English plus clearly marked placeholder resources for validated launch language(s).

**Do not:** machine-translate business terms, localize every future screen, or make
locale a client-controlled authorization input.

**Verify:** a small representative page renders in LTR and RTL; no new user-facing
strings are hard-coded in that page.

**Handoff:** identify the translation files and unvalidated terminology.

### Identity, tenancy, and database base

#### 06 — Decide and integrate authentication only

**Goal:** Implement the approved authentication provider with a secure session.

**Do:** Follow the selected provider's current documentation, add sign-in/sign-out,
server-side session lookup, and protected-route behavior. Keep provider-specific code
behind a small local auth module.

**Do not:** build organizations, roles, invitation flows, or custom password
cryptography here.

**Verify:** anonymous users cannot reach a protected page; authenticated users can;
session cookies follow the provider's secure production guidance.

**Handoff:** document provider, session boundary, required environment variables, and
test-account setup.

#### 07 — Introduce PostgreSQL, Drizzle, and migration workflow

**Goal:** Add persistent storage with a repeatable local workflow.

**Do:** Install PostgreSQL/Drizzle dependencies, create the server-only DB client,
Drizzle configuration, local database instructions, and one harmless baseline
migration. Document generation, review, and application commands.

**Do not:** use `drizzle-kit push` for shared environments or create domain tables.

**Verify:** a fresh local database can apply the migration; generated SQL is reviewed
and committed; production build has no client DB import.

**Handoff:** record the migration command and rollback/recovery expectation.

#### 08 — Model organization membership and tenant context

**Goal:** Make an organization the ownership boundary for all future business data.

**Do:** Add `organizations` and `organization_members` schema, migration, server-side
current-membership lookup, and the rule for selecting an active organization. Design
the schema to link to the chosen auth user identity without duplicating passwords.

**Do not:** trust organization ID from a form/query string or add roles yet.

**Verify:** a user with no membership has no active organization; membership lookup
cannot return another tenant's organization.

**Handoff:** give the schema summary and tenant-context function contract.

#### 09 — Implement first-organization onboarding

**Goal:** Let an authenticated owner create their business safely.

**Do:** Add a validated server-side onboarding mutation and minimal form. Create the
organization and owner membership atomically. Include name, business type, timezone,
base currency (`AFN` by default), and locale only where G3 has approved defaults.

**Do not:** expose general organization switching, invitations, or billing.

**Verify:** duplicate submission does not create duplicate owner organizations;
invalid input is shown safely; created organization becomes active.

**Handoff:** describe the idempotency/duplicate-submission behavior.

#### 10 — Define roles, permissions, and the authorization guard

**Goal:** Enforce action-based RBAC on the server.

**Do:** Add a documented permission catalogue, roles/mappings (or a deliberately
simple equivalent approved at G4), seed owner/admin/manager/warehouse/sales/accountant
/viewer defaults, and an authorization function used by mutations and protected data
queries.

**Do not:** rely on hiding buttons as authorization or build staff management UI.

**Verify:** unit tests show a non-member is denied and representative permitted and
forbidden actions are enforced server-side.

**Handoff:** include the permission matrix and guard usage example.

#### 11 — Add staff invitation and membership management

**Goal:** Let an owner/admin manage pilot staff without weakening tenant isolation.

**Do:** Build add/invite, role change, deactivate, and list flows using the approved
auth provider's supported approach. Prevent removal/demotion of the last active owner.

**Do not:** create arbitrary custom roles or send real email/SMS if no provider is
configured; show a safe manual-invite workflow if necessary.

**Verify:** an admin cannot alter another organization; the last-owner invariant is
tested.

**Handoff:** specify invitation expiry and recovery procedure.

### Master data

#### 12 — Add shared domain primitives for money, quantities, and status transitions

**Goal:** Give later modules one precise vocabulary without building a giant shared
framework.

**Do:** Define narrowly scoped server-side helpers/types for decimal input/output,
quantity validation, UTC timestamps, IDs, and explicit status-transition checks.
Document rounding and decimal-scale policy from G3.

**Do not:** write a generic ORM repository, a client-side financial calculator, or
convert values to JavaScript floats.

**Verify:** unit tests cover decimal parsing, rejected negative quantities, rounding,
and invalid transitions.

**Handoff:** state where each primitive may be imported from.

#### 13 — Implement units and product categories

**Goal:** Support the small vocabulary required to create products.

**Do:** Add organization-owned units and categories, schema/migration, list/create/
edit/deactivate services, and their minimal management screens. Seed only validated
pilot defaults.

**Do not:** implement cross-unit conversion, global uncontrolled units, or product
pricing.

**Verify:** tenant scoping, uniqueness rule, permissions, validation, and
deactivation behavior have tests.

**Handoff:** record the selected product-unit policy from G3.

#### 14 — Implement products

**Goal:** Create an organization-scoped product catalogue.

**Do:** Add products with validated name, optional SKU/code, category, stock unit,
default purchase/selling price if validated, active state, and product list/detail/
edit screens. Add appropriate per-organization uniqueness constraints.

**Do not:** add batch/lot/grade/origin fields unless G3 says they define stock
identity; do not compute inventory yet.

**Verify:** SKU uniqueness (when supplied), tenant denial, inactive product behavior,
and form validation are tested.

**Handoff:** name any deliberately deferred product attributes.

#### 15 — Implement suppliers

**Goal:** Manage purchase counterparties.

**Do:** Add supplier schema/services/screens with name, phone, location, approved
type, notes, payment terms, and active state. Phone is a contact value, not an
authentication credential.

**Do not:** persist a mutable supplier balance; payments/payables come later.

**Verify:** create/edit/deactivate, tenant isolation, permission denial, and field
validation are covered.

**Handoff:** describe the chosen supplier types and deferred fields.

#### 16 — Implement customers

**Goal:** Manage sales counterparties.

**Do:** Add customer schema/services/screens with name, phone, location, type, notes,
active state, and credit limit only if G3 defines its enforcement policy.

**Do not:** store a mutable customer balance or imply a credit limit is enforced if
its rule is undecided.

**Verify:** equivalent supplier-style checks plus the selected credit-limit behavior.

**Handoff:** note the credit policy used by future sale tasks.

#### 17 — Implement warehouses

**Goal:** Identify stock locations for pilot transactions.

**Do:** Add warehouse schema/services/screens, an active/default warehouse policy,
and authorization for warehouse access if G3 requires staff restrictions.

**Do not:** build bin locations, warehouse transfer, or stock quantities.

**Verify:** an inactive warehouse cannot be chosen for new transactions and tenant
isolation is tested.

**Handoff:** state whether the pilot has one warehouse or multiple.

### Procurement and inventory

#### 18 — Create purchase orders as drafts

**Goal:** Record an intended supplier purchase without changing stock or debt.

**Do:** Add purchase order/item schema and a create/list/detail flow. Validate active
supplier, products, warehouse, positive item quantities, non-negative prices, totals,
and permitted draft status transitions. Calculate totals server-side.

**Do not:** receive stock, create supplier payable, or accept client-calculated totals
as truth.

**Verify:** invalid item data rolls back the whole draft creation; totals and
permissions have unit/integration tests.

**Handoff:** document purchase statuses and their meaning.

#### 19 — Implement purchase order editing, ordering, and cancellation

**Goal:** Complete non-stock-affecting purchase lifecycle states.

**Do:** Permit only approved transitions (`draft → ordered → partially_received /
received` later; cancellation according to policy) and allow edits only in safe
states. Write audit events through the shared audit interface if it exists; otherwise
leave an explicit integration point for Task 27.

**Do not:** allow editing received quantities through the order or delete historical
orders.

**Verify:** transition matrix tests reject invalid edits/cancels and preserve tenant
scope.

**Handoff:** list exact preconditions for Task 20 receipt.

#### 20 — Receive goods and append inventory movements

**Goal:** Turn physical receipt into durable stock history.

**Do:** Add goods receipt and inventory movement schema, then a single transactional
service/UI to receive quantities against an eligible purchase. Validate supplier,
warehouse, active product, remaining ordered quantity (unless G3 allows variance),
and stock unit. Append one inbound movement per received line. Update purchase status
inside the same transaction.

**Do not:** overwrite a `stock_quantity` field as the source of truth, create
payables, or support returns.

**Verify:** transaction tests prove a failed line creates no receipt/movement/status
change; receiving twice cannot exceed approved limits; stock history is tenant scoped.

**Handoff:** record movement fields and receipt-number strategy.

#### 21 — Add inventory balances and stock history read models

**Goal:** Show usable current stock while retaining the ledger as truth.

**Do:** Implement a server-side aggregate/query for current quantity by
organization/product/warehouse and a paginated movement history. Add indexes only for
these demonstrated queries. Define and document available-stock calculation.

**Do not:** cache or denormalize balances before profiling; implement transfers,
adjustments, or valuation.

**Verify:** ledger aggregate equals expected receipts in integration tests; cross-
tenant filters and pagination are tested; inspect non-trivial query plan if data size
warrants it.

**Handoff:** state whether a materialized/derived balance table is still unnecessary.

#### 22 — Implement controlled inventory adjustments

**Goal:** Record loss, spoilage, count corrections, or opening stock transparently.

**Do:** Add an adjustment command that appends a signed movement with reason,
reference, performer, timestamp, and validation against the negative-stock policy.
Restrict it to the G3-approved permission.

**Do not:** permit free-form deletion or editing of ledger rows; build stock transfer
or product returns.

**Verify:** users without permission are denied; adjustment reason is required;
negative stock policy and audit trail are tested.

**Handoff:** list accepted reason codes and deferred correction workflows.

### Sales, credit, and payments

#### 23 — Create sales orders as drafts

**Goal:** Capture a proposed sale without moving stock or changing balances.

**Do:** Add sales order/item schema and draft create/list/detail screens. Validate
active customer/products, quantity, non-negative pricing/discount, server-calculated
totals, and selected warehouse. Include the product price snapshot needed for history.

**Do not:** reserve stock, decrement stock, issue invoices, or record payment yet.

**Verify:** all invalid lines roll back draft creation; totals/discounts and tenant
authorization are covered by tests.

**Handoff:** document sale statuses and chosen sale-timing policy.

#### 24 — Confirm and fulfil a sale

**Goal:** Make the approved physical-sale event reduce stock exactly once.

**Do:** Implement only the G3-approved lifecycle. In one DB transaction validate
available stock, transition state, append outbound inventory movements, and create
the sale's financial obligation/invoice record if that is the approved model.
Prevent duplicate submit/replay from creating a second outbound movement.

**Do not:** allow negative stock, cancellation reversal, returns, delivery routes, or
front-end-only stock checks.

**Verify:** insufficient stock rolls back everything; concurrent/repeated fulfilment
cannot double-decrement stock; a successful sale appears in stock history.

**Handoff:** specify the idempotency strategy and later reversal requirements.

#### 25 — Record and allocate payments

**Goal:** Track customer receipts and supplier payments without corrupting balances.

**Do:** Add payments and payment allocations according to the G3 credit policy.
Support the smallest validated payment path: direction, counterparty, date, amount,
reference/note, and allocation to one or more obligations if policy requires it. Make
the command transactional and server-authorized.

**Do not:** integrate online payment rails, mutate a balance field as sole truth, or
allow allocations exceeding payment or outstanding amount.

**Verify:** partial payment, full payment, overpayment rejection, duplicate request,
and tenant isolation are integration tested.

**Handoff:** document balance derivation and any approved unapplied-credit behavior.

#### 26 — Implement balances and transaction statements

**Goal:** Give staff a trustworthy customer/supplier account view.

**Do:** Build read-only balance calculations and a paginated statement using invoices/
payables and payment allocations. Show outstanding amount, due date where available,
and links to source transactions.

**Do not:** introduce complex accounting journals, interest, installment plans, or
changing historical obligations.

**Verify:** expected balances for no, partial, and full payments are tested; sum of
statement entries reconciles to the displayed balance.

**Handoff:** list reports that can safely reuse these queries.

### Reporting, reliability, and delivery

#### 27 — Add append-only audit logging

**Goal:** Make sensitive operational events traceable.

**Do:** Add `audit_logs` schema and a small server-only audit writer. Record actor,
organization, action, entity/type/id, timestamp, request/correlation ID, and safe
before/after snapshots for the listed sensitive events. Wire it into organization
staff changes, master-data changes, receipts, adjustments, fulfilment, and payments.

**Do not:** log passwords, sessions, secrets, or unlimited sensitive personal data;
do not make audit writes silently optional for critical completed transactions.

**Verify:** an audit event is written in the same transaction as representative
critical operations; unauthorized failure does not create a success event.

**Handoff:** document retention, access permission, and redaction policy.

#### 28 — Build the pilot dashboard

**Goal:** Surface only metrics supported by trusted data.

**Do:** Implement a server-rendered dashboard for today’s sales/purchases, outstanding
customer and supplier balances, stock value only if valuation policy is approved,
low-stock products only if threshold policy is approved, and recent transactions.
Use real empty/error/loading states.

**Do not:** add fabricated forecasts, charts without a decision they answer, or an
N+1 query per card.

**Verify:** numbers match fixture/integration data, tenant filters are enforced, and
small screens remain usable.

**Handoff:** identify each metric's source query and policy assumptions.

#### 29 — Add core reports and CSV exports

**Goal:** Provide the pilot's validated reporting needs.

**Do:** Deliver reports one at a time behind the same shared date/filter validation:
sales, purchases, inventory movement/current stock, customer balances, and supplier
balances. Generate CSV server-side with authorization, stable columns, locale-safe
dates, and spreadsheet-injection-safe text cells.

**Do not:** generate PDF, allow arbitrary expensive date ranges, or start a background
job queue unless report size demonstrably requires it.

**Verify:** report totals reconcile with source transactions; CSV is authorized,
correctly escaped, and tested.

**Handoff:** state report limits and whether async generation is needed later.

#### 30 — Add user-facing errors, request IDs, and structured server logs

**Goal:** Make pilot failures diagnosable without exposing internals.

**Do:** Establish a consistent error shape, route/page error boundaries where useful,
request/correlation IDs, and structured logs for auth/DB/transaction failures.

**Do not:** expose stack traces, SQL, secrets, or personal data to browser users; do
not log every successful request at noisy full-payload detail.

**Verify:** force a representative invalid request and server failure; the user gets a
safe message while logs contain a correlatable internal event.

**Handoff:** specify where logs are viewed and what is redacted.

#### 31 — Add rate limits and mutation abuse controls

**Goal:** Protect authentication and high-value mutations at pilot scale.

**Do:** Choose a deployment-compatible rate-limit mechanism, apply it to auth and
high-risk mutation endpoints/actions, and add duplicate-submission protection to
receipt, fulfilment, and payment flows where not already complete.

**Do not:** build a distributed queue or claim rate limiting works across instances
without a shared store.

**Verify:** configured limits return a consistent safe response; legitimate retry is
handled by the idempotency policy; implementation limits are documented.

**Handoff:** state keys, windows, storage, and operational limitation.

#### 32 — Add focused unit and integration test coverage

**Goal:** Lock down the financial, inventory, tenancy, and permission invariants.

**Do:** Add test helpers/fixtures and tests for only the critical domain services:
tenant access, RBAC, totals, status transitions, receiving, adjustment, fulfilment,
and payment allocation. Use a disposable test database if integration tests require
one.

**Do not:** chase coverage percentages or test framework internals.

**Verify:** tests run independently/repeatedly without leaking database state; each
critical invariant has a named failing-case test.

**Handoff:** list test command, test DB requirements, and important untested risks.

#### 33 — Add one end-to-end pilot workflow

**Goal:** Test the founder's most important real-user path in a browser.

**Do:** Add Playwright (or the approved E2E tool) and exactly one deterministic
scenario: authenticate → organization → product/supplier/customer/warehouse → purchase
→ receive → sale → payment → verify stock and balance. Use seeded isolated data.

**Do not:** add a brittle screenshot suite for every page or depend on a shared dev
database.

**Verify:** the scenario runs headlessly in CI and produces artifacts on failure.

**Handoff:** document local run command, seeding, and known browser coverage gap.

#### 34 — Deploy a staging environment with migrations and backups

**Goal:** Create a safe place for pilot rehearsal.

**Do:** Containerize only if it matches the approved deployment target; configure
staging environment variables, managed/self-hosted PostgreSQL access, migration-on-
deploy process, health check, database backup schedule, restore drill, and uptime/
error monitoring.

**Do not:** expose production data in staging, auto-run destructive migrations, or
launch publicly before access controls are tested.

**Verify:** a fresh staging deploy works; migration history is visible; backup is
created and one restore is proven in a non-production database.

**Handoff:** name deploy owner, rollback procedure, backup location/retention, and
restore evidence date.

#### 35 — Pilot onboarding, support, and measurement

**Goal:** Turn deployed software into a learning experiment.

**Do:** Create an onboarding checklist, initial data-import/manual entry procedure,
support contact/runbook, consent-aware product event plan, and a weekly pilot review
template. Track time-to-first-value, weekly active organizations, completed real
transactions, workflow failures, and requested changes.

**Do not:** build a nationwide self-service acquisition funnel, marketplace, billing
integration, or speculative analytics.

**Verify:** one internal dry run can onboard a test business from blank account to
first completed workflow; metrics can be reviewed weekly without inspecting raw logs.

**Handoff:** list pilot businesses only in private operational records, not repository
fixtures.

## Explicitly deferred backlog

Do not schedule these until the pilot reaches repeated use and paid retention:

- returns/cancellation reversals and stock transfers (bring forward only if pilots
  cannot operate without them);
- batch/lot/quality/origin tracking;
- multi-currency and exchange rates;
- native mobile apps and full offline transaction queues/conflict resolution;
- PDF invoices, attachments, images, SMS/WhatsApp, email campaigns;
- public marketplace, farmer app, logistics/fleet, warehouse bins, public APIs;
- price forecasting/AI, financing, payments infrastructure, export documentation;
- microservices, Redis/BullMQ, and advanced caching.

When a deferred item becomes necessary, create a new decision record and split it
into a schema task, domain-service task, UI task, and test task. Do not bolt it onto
an unrelated milestone.

## Pilot-release checklist

Before allowing a real business to depend on the app, confirm:

- [ ] G0–G4 are documented and approved.
- [ ] Only invited, authenticated members can access one organization’s data.
- [ ] Owner/admin/operational permissions have denial tests.
- [ ] Purchase receipt, stock adjustment, sale fulfilment, and payment allocation are
      transactional and idempotent where retries can occur.
- [ ] Stock and balances reconcile from their source records for representative data.
- [ ] Audit events exist for sensitive completed actions.
- [ ] User-facing errors are safe; logs contain correlation IDs without secrets.
- [ ] The critical E2E workflow passes in staging.
- [ ] A database backup and a non-production restore have been verified.
- [ ] A founder can onboard and support the pilot business manually.

## How to resume after any agent stops

1. Read `git status`, `git diff`, this plan, and the latest relevant docs/ADR.
2. Run the existing quality commands before editing; distinguish pre-existing failures
   from new failures.
3. Read only the current task and its immediate prerequisite—not the whole backlog.
4. Finish or revert only changes belonging to that task; never discard other people’s
   work.
5. Record a handoff note with: completed acceptance checks, changed files, migrations
   and environment variables, test commands/results, known limitation, and next task.

The plan is successful when it produces three paying pilot businesses using real
transactions—not when every future module exists.

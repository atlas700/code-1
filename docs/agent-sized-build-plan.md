# Agent-Sized Build Plan — Afghanistan Agricultural Supply Chain OS

## Purpose

This turns the product vision into small, resumable work packages. A single coding
agent should complete **one numbered implementation task per chat**, including its
tests and handoff note. Do not combine adjacent tasks merely because they look
related.

The approved pilot serves Helmand fruit-and-nut wholesalers, Pashto-first. Its
workflow follows [ADR 0003](adr/0003-helmand-pilot-workflow.md):

```text
purchase → accept receipt → see stock and supplier debt → record supplier payment → reconcile
```

Sales, customer payments, multiple warehouses, returns, lot/grade tracking, and
offline mode are deferred. Accepted ADRs govern product policy; this plan governs
task readiness and order. Update both when an approved decision changes the scope.

## Current repository baseline (20 October 2026)

- The application shell, localization plumbing, Clerk authentication, environment
  validation, Vitest tests, and CI are implemented (Tasks 01–06).
- Exact dependency versions and quality commands live in `package.json` and its
  lockfile. The application uses App Router in `src/app` and strict TypeScript.
- PostgreSQL, Drizzle, business persistence, and a UI-component library are absent.
- Preserve unrelated worktree changes.

The project rules in `AGENTS.md` and `docs/` are mandatory. In particular:

- use App Router and prefer Server Components;
- keep client components as small interactive leaves;
- validate untrusted input at every server boundary;
- do not weaken TypeScript;
- add database code only under `src/db` once persistence is actually introduced;
- use generated, reviewed SQL migrations; never use destructive schema shortcuts.

## Non-negotiable operating rules

1. **Check task readiness first.** Tasks 01–12 may proceed before G1 only when
   their specific G3/G4 prerequisites below are approved. Tasks 13–35 require G1
   evidence as well. Documentation, dependency patches, and CI maintenance may
   proceed independently; deferred features require a new scope decision.
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
implementation; the gate status and pilot delivery order in this plan; and the
latest prerequisite handoff. Preserve unrelated changes.

Implement only [TASK ID AND TITLE] from docs/agent-sized-build-plan.md.

Constraints:
- Next.js 16 App Router; keep server/client boundaries small.
- TypeScript strict; no any, ts-ignore, or weakened configuration.
- Validate all server input with Zod.
- Enforce authenticated organization membership and permissions server-side.
- Do not add functionality from later tasks or new dependencies without need.
- Use a DB transaction for an all-or-nothing financial or inventory operation.

Before the final quality-command pass: complete the pre-validation code review in
docs/testing.md and fix all must-fix findings. Then run the task's checks plus the
relevant existing checks. Summarize files changed, migration impact, review scope
and finding dispositions, test evidence, known limitations, and the exact next
task. If a product decision is missing, stop and document it rather than inventing
a policy.
```

## Gates — these are decisions, not coding tasks

### Current gate status

This table is the task-readiness record. Update it with dated evidence when a
gate changes; an accepted policy does not count as completed user research.
Research records stay private; link a redacted evidence summary rather than names
or interview transcripts.

| Gate | Status and evidence (20 October 2026) | Owner | Blocks |
| --- | --- | --- | --- |
| G0 market | Accepted: [ADR 0003](adr/0003-helmand-pilot-workflow.md), 19 October | Founder | Market choice is resolved |
| G1 research | Open: 20 interviews and 5 workflow observations have no recorded completion evidence | Founder/researcher | Tasks 13–35 and pilot release |
| G2 scope | Founder-approved: [ADR 0003](adr/0003-helmand-pilot-workflow.md); user validation still depends on G1 | Founder/product lead | Features outside the approved pilot |
| G3 domain policies | Partially resolved: [ADRs 0001–0012](adr/README.md); decimal scale/rounding remain open; terminology requires G1 validation | Founder/product lead | Task 12 until decimal policy is approved; dependent domain work and pilot labels until their policies/evidence exist |
| G4 authentication | Accepted: [ADR 0002](adr/0002-clerk-authentication.md); development checks in [Task 06 handoff](handoffs/06-authentication.md); pilot sign-in method still needs validation | Founder | Pilot authentication until sign-in validation is recorded |
| G4 database | Open: approve database environment, migration workflow, and initial data model in [database](database.md) | Technical lead/founder | Task 07 and subsequent persistence |
| G4 mutation boundary | Open: [API conventions](api-conventions.md) | Technical lead/founder | Task 09 and subsequent protected mutations |
| G4 permissions | Open: role matrix in [security](security.md) | Technical lead/founder | Task 10 and subsequent role-dependent work |
| G4 deployment | Open: hosting, backup owner, retention, and monitoring in [deployment](deployment.md) | Technical lead/founder | Task 34 and pilot release |

**Next implementation task:** 07, after its G4 database approval is recorded. G1
does not block the infrastructure-only baseline in Task 07; it does block business
modelling and screens starting at Task 13. Tasks 08–12 also need their listed
architecture/policy approvals before starting.

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
metric, and explicit MVP exclusions. The accepted initial scope is purchasing,
receiving, supplier payments, and stock/supplier balance reconciliation in ADR 0003.

### G3 — resolve domain policies that code cannot safely guess

Record founder-approved policies before their dependent tasks, then validate them
against G1 research before domain implementation:

| Decision | Required answer |
| --- | --- |
| Units | Are conversion rules needed, or is each product sold in one stock unit for the pilot? |
| Product identity | Does grade, origin, harvest date, or quality create distinct stock? |
| Receiving | Can receipt quantity differ from order quantity, and who may approve it? |
| Supplier debt | Accepted receipt creates the supplier payable at the approved purchase price; see [ADR 0012](adr/0012-receipt-supplier-payables.md). |
| Decimal policy | Approve currency/quantity scale and rounding before Task 12; record it in a decision record. |
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

### Pilot delivery order

Task IDs remain stable for existing handoffs. Execute pilot-required tasks in
ascending order, skipping deferred tasks; each task still needs its gate approvals.
The scope column also constrains the detailed task descriptions below.

| Tasks | Classification | Pilot scope |
| --- | --- | --- |
| 01–06 | Complete | Foundation and authentication; see [handoffs](README.md) |
| 07–15 | Pilot required | Persistence, tenancy, permissions, primitives, products, suppliers |
| 16 | Deferred | Customers |
| 17–22 | Pilot required | One warehouse, purchases, accepted receipts/payables, stock, owner-approved corrections |
| 23–24 | Deferred | Sales drafts and fulfilment |
| 25–28 | Pilot required | Supplier payments/statements, audit logging, purchasing dashboard |
| 29 | Deferred | CSV/report suite until pilot evidence requires it |
| 30–35 | Pilot required | Reliability, focused tests, purchase-to-receipt E2E, staging, onboarding |

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

**Do not:** add browser E2E infrastructure yet; that is Task 33.

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

**Do:** Use the approved localization approach and G3 launch-language decision.
Add a minimal translation provider, locale preference storage plan, direction
switching, and English plus clearly marked placeholder resources for validated
launch language(s).

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

**Scope:** Deferred under ADR 0003; a new scope decision is required to start.

**Goal:** Manage sales counterparties.

**Do:** Add customer schema/services/screens with name, phone, location, type, notes,
active state, and credit limit only if G3 defines its enforcement policy.

**Do not:** store a mutable customer balance or imply a credit limit is enforced if
its rule is undecided.

**Verify:** equivalent supplier-style checks plus the selected credit-limit behavior.

**Handoff:** note the credit policy used by future sale tasks.

#### 17 — Implement warehouses

**Goal:** Identify stock locations for pilot transactions.

**Do:** Add one organization-owned warehouse and the minimal setup needed to choose
it for purchases and receipts. Enforce approved staff permissions.

**Do not:** add multiple warehouses, warehouse switching/transfers, bins, or stock
quantities in this task.

**Verify:** an inactive warehouse cannot be chosen for new transactions and tenant
isolation is tested.

**Handoff:** record the single-warehouse constraint from ADR 0003.

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

#### 20 — Accept receipts, append stock movements, and create supplier payables

**Goal:** Turn an accepted physical receipt into stock history and supplier debt.

**Do:** Add goods receipt, inventory movement, and supplier payable schema, then a
single transactional service/UI to accept quantities against an eligible purchase.
Validate supplier, warehouse, active product, remaining ordered quantity, stock unit,
and owner approval for variances. Append inbound movements and create one payable
per accepted receipt using accepted quantities and approved purchase-price snapshots
under [ADR 0012](adr/0012-receipt-supplier-payables.md). Update purchase status in the
same transaction. Enforce receipt-request uniqueness and concurrent quantity limits
in the database so retries cannot duplicate stock or debt.

**Do not:** overwrite a `stock_quantity` field as the source of truth, recognize
debt at draft/order creation, add supplier invoice entry, or support returns.

**Verify:** integration tests cover partial receipts and approved variances at the
approved price; failure at any write leaves no receipt/movement/payable/status
change; concurrent/repeated requests neither duplicate stock/debt nor exceed
approved limits; receipt, stock, and payable references remain tenant scoped.

**Handoff:** record movement/payable fields, receipt-number and idempotency strategy,
and evidence that stock and supplier debt reconcile to accepted receipt lines.

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

**Scope:** Deferred under ADR 0003; a new scope decision is required to start.

**Goal:** Capture a proposed sale without moving stock or changing balances.

**Do:** Add sales order/item schema and draft create/list/detail screens. Validate
active customer/products, quantity, non-negative pricing/discount, server-calculated
totals, and selected warehouse. Include the product price snapshot needed for history.

**Do not:** reserve stock, decrement stock, issue invoices, or record payment yet.

**Verify:** all invalid lines roll back draft creation; totals/discounts and tenant
authorization are covered by tests.

**Handoff:** document sale statuses and chosen sale-timing policy.

#### 24 — Confirm and fulfil a sale

**Scope:** Deferred under ADR 0003; a new scope decision is required to start.

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

#### 25 — Record and allocate supplier payments

**Goal:** Settle receipt-based supplier debt without corrupting balances.

**Do:** Add supplier payments and payment allocations under ADR 0009. Record the
supplier, date, exact positive amount, reference/note, and exactly one selected receipt
payable from Task 20. Make allocation transactional, server-authorized, and protected
against concurrent over-allocation and duplicate requests.

**Do not:** add customer payments, split payments across payables, introduce unapplied
credit, integrate online payment rails, overwrite balances, or allow allocations
exceeding the selected payable's outstanding amount.

**Verify:** partial/full payment, overpayment rejection, concurrent allocation,
duplicate requests, and tenant isolation are integration tested against Task 20
payables. A failed payment leaves both payment and allocation unchanged.

**Handoff:** document balance derivation and payment idempotency; customer receipts
and unapplied credit remain deferred.

#### 26 — Implement balances and transaction statements

**Goal:** Give staff a trustworthy supplier account view.

**Do:** Build read-only supplier balances and paginated statements using Task 20
receipt payables and Task 25 payment allocations. Show outstanding amounts and links
to accepted receipts and supplier payments; show due dates only under approved terms.

**Do not:** add customer statements, complex accounting journals, interest,
installment plans, or changes to historical obligations.

**Verify:** expected balances for no, partial, and full payments are tested; sum of
statement entries reconciles to the displayed balance.

**Handoff:** list reports that can safely reuse these queries.

### Reporting, reliability, and delivery

#### 27 — Add append-only audit logging

**Goal:** Make sensitive operational events traceable.

**Do:** Add `audit_logs` schema and a small server-only audit writer. Record actor,
organization, action, entity/type/id, timestamp, request/correlation ID, and safe
before/after snapshots for the listed sensitive events. Wire it into organization
staff changes, master-data changes, receipts/payables, adjustments, and supplier
payments. Fulfilment/customer-payment events belong to the deferred sales work.

**Do not:** log passwords, sessions, secrets, or unlimited sensitive personal data;
do not make audit writes silently optional for critical completed transactions.

**Verify:** an audit event is written in the same transaction as representative
critical operations; unauthorized failure does not create a success event.

**Handoff:** document retention, access permission, and redaction policy.

#### 28 — Build the pilot dashboard

**Goal:** Surface only metrics supported by trusted data.

**Do:** Implement a server-rendered dashboard for purchases, accepted receipts,
current stock quantities, outstanding supplier balances, and recent pilot
transactions. Use real empty/error/loading states.

**Do not:** add sales/customer metrics, stock valuation, speculative low-stock
thresholds, fabricated forecasts, or an N+1 query per card.

**Verify:** numbers match fixture/integration data, tenant filters are enforced, and
small screens remain usable.

**Handoff:** identify each metric's source query and policy assumptions.

#### 29 — Add core reports and CSV exports

**Scope:** Deferred until pilot evidence requires reports beyond Task 26 statements
and Task 28 dashboard; a scope decision must select each report before starting.

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
high-risk mutation endpoints/actions. Verify the duplicate-submission protections
already required by receipt/payable and supplier-payment tasks; close any gaps.

**Do not:** build a distributed queue or claim rate limiting works across instances
without a shared store.

**Verify:** configured limits return a consistent safe response; legitimate retry is
handled by the idempotency policy; implementation limits are documented.

**Handoff:** state keys, windows, storage, and operational limitation.

#### 32 — Add focused unit and integration test coverage

**Goal:** Lock down the pilot's financial, inventory, tenancy, and permission invariants.

**Do:** Add test helpers/fixtures and tests for only the critical domain services:
tenant access, RBAC, totals, purchase transitions, receiving/payable creation,
adjustments, and supplier-payment allocation. Use a disposable test database for
integration tests. Each implementation task already requires its own behavior tests;
this task closes remaining pilot gaps rather than deferring those tests until here.

**Do not:** chase coverage percentages or test framework internals.

**Verify:** tests run independently/repeatedly without leaking database state; each
critical invariant has a named failing-case test.

**Handoff:** list test command, test DB requirements, and important untested risks.

#### 33 — Add one end-to-end pilot workflow

**Goal:** Test the founder's most important real-user path in a browser.

**Do:** Add Playwright (or the approved E2E tool) and exactly one deterministic
scenario: authenticate → organization → product/supplier/one warehouse → purchase
→ accept partial receipt → verify stock and payable → pay supplier → verify stock
unchanged and outstanding supplier balance reduced. Use seeded isolated data and
include a retry that proves a receipt cannot duplicate stock or debt.

**Do not:** require customers, sales, multiple warehouses, a brittle screenshot
suite for every page, or a shared development database.

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
- [ ] G1 evidence validates the founder-approved purchasing scope and Pashto terms.
- [ ] Only pilot-required tasks are included; deferred features have not become
      release prerequisites.
- [ ] Only invited, authenticated members can access one organization’s data.
- [ ] Owner/admin/operational permissions have denial tests.
- [ ] Accepted receipt, inventory movements, supplier payable, and purchase status
      commit atomically; retries/concurrent receipt requests cannot duplicate stock
      or debt.
- [ ] Owner-approved stock adjustments and supplier-payment allocations are
      transactional and idempotent where retries can occur.
- [ ] Stock and balances reconcile from their source records for representative data.
- [ ] Partial/full supplier payments reconcile to receipt payables without exceeding
      the outstanding amount, including concurrent requests.
- [ ] Audit events exist for sensitive completed actions.
- [ ] User-facing errors are safe; logs contain correlation IDs without secrets.
- [ ] The critical E2E workflow passes in staging.
- [ ] Production dependencies pass `npm audit --omit=dev --audit-level=high`.
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

The first pilot succeeds when one business records every purchase and receipt for
four weeks and can verify stock and supplier balances, as defined in ADR 0003.
Three paying businesses remain a later expansion goal; deferred sales features do
not block this pilot.

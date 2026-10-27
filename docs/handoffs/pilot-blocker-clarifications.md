# Pilot blocker clarification record

Date: 27 October 2026.

## Status and source

Founder clarification, recorded from this conversation. This is a redacted
requirements/evidence summary, not a transcript or independently verified study.
Documentation clarification is complete and ready for review. The clarified
policies and dependent task scopes are recorded; evidence gates remain open and
application behavior is unchanged.

- [x] Record the founder's requirements and reported notebook findings without
  inventing research counts or successful authentication tests.
- [x] Amend the old unit-entry exclusion and update dependent task scopes,
  vocabulary, and product/database guidance together.
- [x] Record hosting selection and founder accountability while keeping unresolved
  operating policies and live verification open.
- [x] Complete pre-validation review, documentation checks, and exact weight checks.

## Confirmed requirements and reported evidence

- The founder reports conducting interviews and approximately 40 findings. The
  reported common finding is that businesses maintain purchase and sale records
  in notebooks. This does not establish 40 interviews or 5 workflow observations;
  counts and coverage of receiving, stock, debt, payments, and corrections remain
  unconfirmed. Sales remain outside the approved purchasing pilot.
- Cash-only payments, separate AFN/PKR balances, same-currency settlement, exact
  agreed amounts, and actual bag sizes were explicitly accepted. Purchases can
  use bags, maan, fractional measures, and kilograms. The pilot definitions are
  1 maan = 4.4 kg and 1 khorwar = 100 maan = 440 kg; 10/11-maan bags are
  44/48.4 kg. ADR 0017 amends the old unit-entry exclusion accordingly.
- Pilot A–C are available to test phone OTP. Availability is not a successful
  delivery or sign-in result. No pilot authentication outcome is claimed.
- Hosting selection was delegated; ADR 0018 selects Vercel Pro/Neon. The founder
  confirmed ownership of hosting, billing, alerts, and backup recovery. Resources
  have not been provisioned and a database restore has not been demonstrated.

## Remaining blockers and next decisions

- G1 stays open until interview totals, five workflow observations, and a redacted
  workflow summary establish the build plan's required coverage. Do not invent
  counts or reinterpret findings as interview participants.
- Task 12 stays blocked on canonical weight unit, allowed money/quantity scales,
  agreed price basis, and rounding/cash-settlement rules. Obtain one concrete
  purchase with quantity, bag weight if applicable, currency, unit price, and
  price measure; support for fractions alone does not select precision.
- Run each pilot contact's real phone sign-in test and record anonymous delivery
  and completion outcomes before approving the pilot sign-in method.
- Agree backup retention/location, monitoring, recovery objectives, and spending
  policy; configure staging and prove a restore under Task 34 before pilot use.

## Scope and review

Changed files: `GLOSSARY.md`; `docs/README.md`; `docs/product-requirements.md`;
`docs/database.md`; `docs/deployment.md`; `docs/agent-sized-build-plan.md`;
`docs/architecture.md`; `docs/security.md`; `docs/adr/README.md`;
ADRs 0004, 0017, and 0018; and this record.

Pre-validation review used `ponytail:ponytail-review` on the complete documentation
diff and connected product, database, deployment, security, and task guidance.
Checked the stated interview evidence, gate preservation, exact unit arithmetic,
AFN-only onboarding versus future trade currency, immutable price/weight meaning,
same-currency allocation, and private research/phone-data boundaries. Found stale
architecture/security text saying target and backup owner were unselected; updated
both. No unresolved must-fix findings.

Verification passes: 139 local links/anchors across 13 changed Markdown files;
four exact-decimal checks for 10/11/100 maan and half a maan; assertions preserving
G1, Task 12's decimal gate, Task 11 as next, and the partially resolved deployment
gate; documentation-only scope assertion; and `git diff --check`.

No application, schema, migration, dependency, command, CI, or test configuration
changes. App lint/typecheck/test/build are not required for this documentation-only
change; no live OTP, hosted service, billing, or restore test was performed.

Next implementation task remains **11 — staff invitation and membership
management**. G1 still blocks Tasks 13–35; this clarification does not authorize
implementing adjacent tasks or declare the pilot ready.

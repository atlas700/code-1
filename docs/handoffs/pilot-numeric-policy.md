# Completed pilot numeric-policy interview

Date: 27 October 2026.

## Status and acceptance

**Policy clarification is complete and ready for review.**

The founder answered the numeric-policy interview and explicitly asked to finish
the questions. ADR 0019 records those decisions and the existing conservative
overpayment/no-unapplied-credit boundary. No further numeric-policy interview is
required before Task 12; Task 11 remains next in delivery order.

- [x] Capture kg/gram stock, custom weight measures, differing quantity/price
  units, two-decimal input prices, and immutable transaction weight snapshots.
- [x] Preserve half-up purchase-line rounding and cumulative receipt debt
  reconciliation, including 33.33/33.34/33.33 for the 100 AFN example.
- [x] Replace the old same-currency-only restriction with whole AFN/PKR cash,
  manually agreed PKR-per-AFN rates of at most six decimals, and one rounded
  combined allocation in the selected payable's currency.
- [x] Record owner-only residual reductions with reason/audit evidence and a
  lifetime cumulative cap of 0.99 debt-currency units per payable. Larger amounts
  stay outstanding; payments/reductions never overwrite original debt or cash.
- [x] Update dependent task scope, terminology, security, and supersession notes
  together; preserve G1, pilot authentication, and deployment readiness gates.

## Scope, review, and verification

Changed files: `GLOSSARY.md`; `docs/README.md`; ADRs 0004, 0009, 0016, 0017, and new 0019;
`docs/adr/README.md`; product requirements, database, architecture, security, build
plan; the earlier clarification record; and this handoff.

Pre-validation review used `ponytail:ponytail-review` on the complete policy diff,
existing permission roles, allocation/correction ADRs, and connected task scopes.
Checked exact arithmetic, immutable snapshots, catalogue/payment authority,
owner-only reductions, lifetime versus per-request limits, concurrent/idempotent
postings, separate adjustment provenance, and preservation of evidence gates.
Resolved stale same-currency/exchange exclusions, deferred-backlog wording, and
the old units ADR's obsolete open-decimal note. Existing overpayment rejection
remains in force; payment authority never implicitly grants debt reductions.
No unresolved must-fix findings. Verification passes: 156 local links/anchors
across 15 changed Markdown files; exact-rational checks for local/custom weights,
gram/price/rate precision, differing price measures, half-up ties, summed lines,
cumulative receipts, both exchange directions, and the lifetime reduction cap;
gate/scope assertions; and `git diff --check`. These verify policy examples, not
an application implementation.
No application, schema, dependency, migration, command, or CI changes. Current
onboarding stays AFN-only and the new reduction permission is not implemented yet.
App quality commands are not required for documentation-only changes.

## Remaining readiness work

- G1: preserve the founder's reported interviews/notebook findings; completion
  counts and the required observations/workflow coverage still need evidence.
- Pilot authentication: contacts are available, but actual phone delivery and
  completed sign-in results must be recorded.
- Deployment: Vercel/Neon and founder ownership are selected; remaining operating
  policies, spending controls, configuration, backups, and restore proof stay open.

These are follow-up evidence/operating tasks; this handoff does not claim pilot
readiness, perform a deployment, or start another numbered implementation task.

# Task 12 handoff — shared domain primitives

Date: 28 October 2026.

## Status and acceptance

**Task 12 is complete and ready for review.** Acceptance checks, pre-validation
review, and final quality verification pass. Scope follows accepted ADR 0019
without changing product or permission policy.

- [x] Server-only decimal parsing/output uses native `bigint` and exact integer
  ratios. No financial or stock values pass through JavaScript floating point.
- [x] Reject malformed input, negative stock, excess precision, sub-gram converted
  stock, invalid/non-positive weights or rates, and bounded-result overflow.
- [x] Preserve separate quantity and price measure weights; round purchase lines
  half-up once, then sum rounded lines.
- [x] Reconcile receipt value from rounded cumulative quantities and the amount
  already recognized; check the previous quantity/value pair for consistency.
- [x] Allocate whole AFN/PKR cash using one recorded PKR-per-AFN rate and final
  half-up rounding; reject missing conversion rates and zero-valued allocations.
- [x] Pure reduction checks enforce positive reductions within the balance and
  the 0.99 lifetime cap; authorization and posting remain Task 25 work.
- [x] Validate local UUIDs, UTC timestamps, and transitions in a caller-owned graph.
- [x] Complete pre-validation review and the final quality-command pass.

## Changed files and imports

All modules below import `server-only`. Use direct imports in server modules;
no barrel, client calculator, persistence layer, or new dependency is introduced.

| Import | Exports and contract |
| --- | --- |
| `@/domain/decimal` | `parseDecimal(unknown, places)` and `parseNonNegativeDecimal(unknown, places)` return scaled `bigint`; `formatDecimal(bigint, places)` returns fixed-scale text; `roundHalfUp(numerator, positiveDenominator)` rounds exact signed ratios to integer units, with ties away from zero. |
| `@/domain/quantity` | `pilotWeightMeasures` has kg, 4.4 kg maan, and 440 kg khorwar weights; `parseWeight(unknown)` returns positive whole grams; `normalizeQuantityKg(unknown)` returns three-decimal kg; `quantityToKg(count, kilogramsPerMeasure)` converts an explicit weight snapshot without rounding stock. Bags/custom measures must supply their actual positive weight. |
| `@/domain/money` | `currencySchema`/`Currency` accept AFN or PKR; `normalizeMoney(unknown)` returns non-negative two-decimal text; `calculateLineTotal`, `sumLineTotals`, `calculateReceiptValue`, `allocateCashPayment`, and `validateRoundingReduction` take the inputs described below and return two-decimal text. |
| `@/domain/validation` | `localIdSchema`/`LocalId` validate branded UUID strings; `utcTimestampSchema`/`UtcTimestamp` validate UTC `Z` timestamps and normalize to millisecond ISO strings; `assertStatusTransition(current, next, transitions)` requires both statuses to be own keys and the edge to be explicitly allowed. Terminal statuses need an empty edge list. |

Each module has a colocated test file. The build plan, architecture, testing guide,
and documentation index record the new boundary and next gate.

### Monetary input shapes

All numeric fields below are decimal **strings**. Helpers validate the complete
input shape with Zod, then validate each numeric field without coercion.

- `calculateLineTotal({ quantity, quantityMeasureKg, unitPrice, priceMeasureKg })`:
  quantity is a measure count; measure fields are immutable kg weights supplied
  by the owning service. For example, two 44 kg bags priced at 100 per 4.4 kg
  produce `2000.00`.
- `sumLineTotals(amounts)`: sums already rounded non-negative amounts. The caller
  must supply amounts in one currency; this helper does not merge AFN/PKR balances.
- `calculateReceiptValue({ previousQuantityKg, cumulativeQuantityKg,
  previouslyRecognized, unitPrice, priceMeasureKg })`: quantities are normalized
  stock kg. Previous recognized money must match the rounded previous cumulative
  value at those same price/weight snapshots. Three 1 kg receipts against 100 per
  3 kg produce `33.33`, `33.34`, and `33.33`. Equal cumulative quantities produce
  zero delta; this is not durable duplicate-submission protection.
- `allocateCashPayment({ debtCurrency, afnCash, pkrCash, pkrPerAfn? })`: cash is
  whole and non-negative, with at least one positive value. A positive rate with
  at most six decimals is mandatory when cash needs conversion. A supplied rate
  is validated even if conversion is unnecessary. Original cash/rates are not
  mutated or returned as replacements; the service must persist their snapshots.
- `validateRoundingReduction({ previousReductions, reduction, outstandingBalance })`:
  all amounts use the same payable currency; previous reductions are the lifetime
  sum. Returns the normalized reduction only when positive, within the balance,
  and cumulative reductions do not exceed `0.99`.

### Technical limits

Plain ASCII decimals accept an optional minus sign at the low-level signed parser,
leading zeros, and at most 18 integer digits. Numeric inputs are strings, without
spaces, exponent notation, separators, or a leading plus. Unsupported extra
fractional digits are rejected even when zero. Stock quantities/measure weights
use at most three decimals, prices/amounts two, rates six; fractional measure counts
allow up to 18 decimals but their exact converted stock must be whole grams.
Zero quantity and price are valid arithmetic inputs; each workflow enforces its
own positive ordered/received quantities.

Low-level precision is bounded to 0–18 digits; parsed input and formatted results
have at most 18 integer digits. Rounded-line summation accepts at most 1,000 lines.
These are implementation safety limits, not a PostgreSQL schema or a new business
entitlement. Later schema tasks must align precision/range and input bounds before
accepting persisted transactions; widening limits needs corresponding tests.
Intermediate integer ratios remain exact and do not have those output bounds.

UTC input accepts seconds and up to three fractional digits; finer timestamps,
timezone offsets, and local times are rejected rather than truncated or inferred.
No workflow status catalogue or cancellation policy is added; owning tasks define
their allowed graphs and preconditions.

## Pre-validation review

Used `ponytail:ponytail-review` on the complete task diff, helper imports, tests,
ADR 0019 examples, existing server-only conventions, and task/gate documentation.
Assumed the invited pilot with concurrent requests/processes; these helpers are
stateless and do not claim to serialize persistence. Checked runtime input shapes,
signed/unsigned arithmetic, gram precision, intermediate ratios, rounding stages,
size bounds, UTC conversion, inherited status keys, and absence of client/data,
provider, authorization, or migration changes. No existing application callers
or fixtures require migration.

Resolved one must-fix finding: cumulative receipt recognition could exceed the
supported 18 integer digits while the individual receipt delta still fit. That
would produce state the next receipt could not parse. Added a regression that
failed before the fix, bounded the cumulative amount before returning its delta,
and rechecked both the fix and the existing reconciliation path.

No unresolved must-fix findings. Transactional authorization, overpayment checks,
and durable snapshots remain explicit later-service responsibilities.

## Verification

- Baseline: lint, typecheck, 213 unit tests, and production build pass;
  21 opt-in PostgreSQL tests are skipped without a test database URL.
- Focused domain acceptance: **159 tests pass**, including the receipt-overflow
  regression proven to fail before the fix.
- Final `npm run lint`, `npm run typecheck`, and `npm run test`: pass;
  **372 unit tests pass**, **21 opt-in PostgreSQL tests skipped** without
  `AFCS_TEST_DATABASE_URL`. No database code or configuration changed.
- Final `npm run build`: pass with CI's nonfunctional Clerk keys and unreachable
  database URL. All 13 application routes remain dynamic; compilation requires
  no live provider or database.
- `git diff --check` and **269** local documentation links/anchors across **59**
  Markdown files: pass. No dependency/CI changes; a new dependency audit is not
  required for this task.

## Limitations and next task

No schema, migration, dependency, environment-variable, CI, UI, provider setting,
or live data changes. No database, browser, live rate, or payment-posting checks
are needed for these pure helpers. The existing application has no purchasing
callers yet; later tasks must call these helpers rather than recompute money.

Owning services must derive current tenant/permissions, read trusted snapshots,
reject overpayment, enforce receipt variances, and serialize cumulative recognition
and owner-only reductions with transactional/idempotent posting. Task 25 must add
the separate owner-only reduction permission and record its reason/audit evidence.
Task 12 does not implement those services or claim their guarantees.

Next: **13 — Implement units and product categories**, blocked by **G1**.
Record evidence for 20 interviews and 5 workflow observations before starting it.
Pilot phone sign-in and deployment/backup readiness remain open separately.

# Workspace design-system redesign

Date: 31 October 2026.

## Authorization and scope

The founder requested a quality-focused visual redesign, asked that it be
informed by Apple's design guidance, and requested shared form components with
Zod validation. They explicitly excluded Task 15. This is a separately
authorized design-system improvement, not a numbered domain task.

- The shared visual language now covers public pages, authenticated workspace
  navigation, dashboard, catalogue, products, staff, onboarding, loading,
  recoverable-error, and unavailable-state views.
- `Button`, `Input`, Radix-based `Select`, `Field`, feedback, panel, badge, and page
  heading components replace repeated raw control styles. The compatible
  shadcn/ui-derived controls retain their MIT attribution in
  `src/components/ui/README.md`.
- Existing native forms, Server Actions, pending states, and authoritative Zod
  server schemas remain intact. Field-specific server feedback is connected to
  its affected control; no duplicate client validation schema or form-state
  library was added.
- The overview links only to delivered capabilities and labels unavailable work
  honestly. It does not present fabricated operational balances or metrics.
- This change adds no schema migration, environment variable, provider setting,
  domain mutation, or deployment change. The existing G1 gate remains open;
  Task 15 and later remain blocked.

## Design decision and changed areas

ADR 0020 records the Apple-inspired, web-appropriate design direction:
hierarchy, aligned grouping, restrained surfaces, system typography, accessible
focus, 44px controls, reduced motion, and logical RTL-friendly layout. It also
records the shadcn/ui provenance and validation boundary.

- `src/app/globals.css`, `src/components/`, `src/lib/`, and `components.json`:
  tokens, shared primitives, feedback, workspace composition, and class helper.
- `src/app/`, `src/auth/`: public, onboarding, locale, and authentication-shell
  visual updates.
- `src/app/(app)/`: responsive navigation and all existing workspace routes.
- `package.json`, `package-lock.json`: explicit UI primitive dependencies.
- `docs/adr/0020-workspace-design-system.md`, build plan, and documentation
  index: decision, scope, and gate-preserving record.

Unrelated local skill-installation files and `skills-lock.json` changes are
deliberately excluded from this delivery.

### Radix Select refinement

The original `NativeSelect` wrapper was replaced with a shared Radix Select
primitive styled with the existing Tailwind token utilities. Product unit and
category selection, catalogue weight basis, staff roles, and onboarding locale
now use the same keyboard-accessible trigger, viewport, option, selected-state,
disabled-state, error, and focus treatment.

Radix supplies the hidden native control for normal form submission. The only
non-native value is the product form's no-category sentinel, which the Product
Server Action converts to `null` before the existing Zod-backed catalogue
boundary validates it. This keeps optional categories working without trusting
the client or changing the domain model.

## Pre-validation review

Applied the full Ponytail review to the complete redesign diff and the connected
form/action, authentication, navigation, test, dependency, and documentation
callers. The review traced form names, operation values, pending/disabled states,
field error references, read-only presentation, route links, provider boundaries,
and RTL/keyboard behavior. It found no unresolved must-fix issue.

One layout issue found during the visual pass was corrected: labels in the
onboarding form are explicit block elements with consistent separation from
their controls. No business, identity, authorization, or mutation logic changed.

The Select refinement review found no unresolved must-fix issue. It confirmed
all four callers retain their `name`, required/disabled state, labels, and
field-error references; the optional product-category sentinel is normalized
before validation and has focused action coverage.

## Verification

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run test`: **451 passed**, **49 skipped** database tests.
- `npm run build`: pass; all 15 application routes compile as dynamic routes.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities**.
- `git diff --check`: pass.
- Local rendered visual inspection: public home at 1440x900, 390x844, and
  320x844; local sign-in shell at 1440x900 and 390x844. All checked public
  home viewports have document width equal to viewport width; no horizontal
  overflow was observed.
- Select refinement: focused product action and all affected static form tests
  pass; the production build compiles the Radix client boundary successfully.

## Limitations and next task

The live Clerk sign-in form, authenticated workspace routes, database mutation
flows, and translated Pashto content were not exercised in a real provider-backed
browser session. Local screenshots are visual evidence only, not provider or
end-to-end evidence. Remote CI and review remain separate evidence.

Next: no new domain task is authorized by this redesign. Task 15 (suppliers)
remains blocked by G1; complete the required evidence gate before selecting it.

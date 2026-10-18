# ADR 0001: Launch localization uses General Translation with Pashto

- **Date:** 2026-10-12
- **Status:** Accepted

## Context

The pilot must support right-to-left content before operational screens are built.
The founder selected General Translation for localization and selected Pashto as the
initial non-English locale. Product terminology has not yet been validated, so the
application must not publish machine-translated business terms.

## Decision

- Use `gt-next` for application localization.
- Support `en-US` as the default locale and `ps-AF` as the initial launch locale.
- Persist the selected locale through GT's cookie-based request handling without
  locale-prefixed routes.
- Set the document `lang` and `dir` attributes from the active GT locale.
- Keep GT runtime translation and remote translation caching disabled until validated
  Pashto terminology from [ADR 0011](0011-validate-purchase-receipt-terminology.md)
  and GT project credentials are available.

## Consequences

- Pashto currently renders English fallback copy; this is an intentional placeholder,
  not a Pashto translation.
- New user-facing copy on localized pages must use GT translation components. Add the
  General Translation CLI only when approved terminology is ready to generate files.
- Adding another locale requires a dated decision record and validated terminology.

## Links

- [Product requirements](../product-requirements.md)
- [Task 05 build plan](../agent-sized-build-plan.md)

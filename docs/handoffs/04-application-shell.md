# Task 04 handoff — application shell and accessible navigation

## Completed

- Replaced the starter page with an intentional unauthenticated landing page and
  sign-in placeholder for the pre-authentication state.
- Added an `(app)` route group with a shared responsive application layout:
  sidebar navigation on wide screens and horizontally scrollable navigation on
  smaller screens.
- Added accessible empty-state placeholders for dashboard, inventory, purchases,
  sales, payments, and settings. They contain no operational data or CRUD UI.
- Established a small visual token baseline and app/page metadata.

## Route structure

```text
/                 unauthenticated landing placeholder
/sign-in          temporary sign-in placeholder
/(app)/dashboard  dashboard placeholder
/(app)/inventory  inventory placeholder
/(app)/purchases  purchases placeholder
/(app)/sales      sales placeholder
/(app)/payments   payments placeholder
/(app)/settings   settings placeholder
```

The `(app)` group does not appear in URLs. Its layout provides the shared
navigation. The navigation uses a single client component only to report the
current route; layouts and pages remain server-rendered.

## Acceptance checks

- Keyboard support: semantic links, a skip link, current-page state, and visible
  focus styles are present in the shared navigation.
- Responsive implementation: the wide-screen sidebar changes to an
  overflow-safe mobile navigation strip below the `lg` breakpoint.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed (1 test).
- `npm run build` passed and generated all eight intended routes.
- A production `next start` smoke check returned HTTP 200 for every intended
  route.

## Limitations

- Authentication, protected-route behavior, organization context, translated
  strings, RTL direction, and all operational data are intentionally deferred.
- The temporary landing and sign-in pages must be replaced or updated when Task
  6 integrates the approved authentication provider.

## Next task

**05 — Add localization and RTL plumbing.** This task must wait until G3 has
approved the launch language and terms.

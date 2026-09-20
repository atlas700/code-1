# Next.js rules

## Scope

- This project uses Next.js 16 with the App Router in `src/app`. Do not add a `pages` router unless an explicit migration decision is made.
- Keep framework entry files in their documented names: `page`, `layout`, `loading`, `error`, `not-found`, and `route`.
- A folder becomes a public route only when it contains `page.tsx` or `route.ts`; colocate route-only helpers in `_components` and `_lib` folders when that improves clarity.
- Use route groups, `(group)`, only to organize routes or apply a shared layout without changing the URL.

## Rendering and data

- Prefer Server Components. Pages and layouts are Server Components by default.
- Add `'use client'` only at the smallest boundary that needs state, event handlers, effects, or browser APIs. Keep database access, secrets, and server-only utilities outside that boundary.
- Fetch data in the Server Component or server-side function that needs it. Do not build an internal HTTP endpoint solely to fetch data for a Server Component.
- Use Route Handlers for HTTP integrations and Server Actions for mutations initiated by the application UI. Validate all untrusted input at the server boundary.
- Use `next/link`, `next/image`, and the Metadata API where applicable instead of recreating their behavior.

## Reliability

- Provide `loading.tsx`, `error.tsx`, and `not-found.tsx` when a route can benefit from a deliberate pending, failure, or missing-resource state.
- Keep `next-env.d.ts` generated and unedited. Do not bypass build type checking with `typescript.ignoreBuildErrors`.
- Read the relevant installed Next.js guide in `node_modules/next/dist/docs/` before changing a Next-specific API; this repository intentionally tracks a version with breaking changes.

## Sources

- [App Router overview](https://nextjs.org/docs/app)
- [Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

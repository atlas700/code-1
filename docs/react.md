# React rules

## Components and state

- Write function components. Use a default export only for a Next.js convention file; use named exports for reusable components and utilities.
- Keep rendering pure: never mutate props, state, context, or module-level values while rendering.
- Keep state minimal and local. Derive values from props and state during render instead of duplicating them in state.
- Update arrays and objects immutably. Give list items stable keys from their data, not their array index when items can be reordered, inserted, or removed.

## Events and effects

- Put user-triggered work in event handlers.
- Use `useEffect` only to synchronize with an external system such as a subscription, timer, browser API, or non-React widget. Include every reactive dependency and return cleanup when setup creates a resource.
- Do not use an Effect to derive state, react to a click, or fetch initial data that a Next.js Server Component can load.
- Extract a custom hook only when shared stateful behavior is used by more than one component; do not create wrapper hooks for one-off logic.

## Client boundaries

- Hooks, browser APIs, and event handlers require a Client Component in this app. Keep the `'use client'` directive as close to the interactive leaf as possible.
- Pass only serializable data from Server Components to Client Components. Keep sensitive values and server capabilities on the server.

## Sources

- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [`useEffect` reference](https://react.dev/reference/react/useEffect)

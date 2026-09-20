# Tailwind CSS rules

## Styling approach

- This project uses Tailwind CSS 4. Keep the CSS-first setup in `src/app/globals.css` with `@import "tailwindcss"`; do not add a JavaScript configuration file for ordinary theme changes.
- Define reusable design tokens with top-level `@theme` variables only when they should generate Tailwind utilities. Use ordinary CSS custom properties for values that are not utility tokens.
- Compose layouts with utility classes close to the markup. Extract a component when markup or behavior is shared; do not create semantic CSS classes just to wrap a small fixed set of utilities.
- Use arbitrary values sparingly and promote a repeated, meaningful value to a theme token.

## Responsive and accessible UI

- Build mobile-first: unprefixed utilities establish the base, then add `sm:`, `md:`, and larger variants for wider viewports.
- Include visible keyboard focus styles, sufficient contrast, semantic HTML, and descriptive labels. Do not rely on color alone to communicate state.
- Use state variants such as `hover:`, `focus-visible:`, `disabled:`, and `aria-*` deliberately; interactive controls must work with keyboard and touch, not only hover.
- Keep class lists readable by grouping layout, spacing, typography, color, and state utilities in a consistent order.

## Sources

- [Tailwind CSS 4 theme variables](https://tailwindcss.com/docs/theme)
- [Utility-class styling](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Responsive design](https://tailwindcss.com/docs/responsive-design)

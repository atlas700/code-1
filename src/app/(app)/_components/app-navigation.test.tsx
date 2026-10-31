import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ pathname: "/products/123" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("gt-next", () => ({ T: ({ children }: { children: ReactNode }) => children }));

import { AppNavigation } from "./app-navigation";

describe("workspace navigation", () => {
  it("keeps the products section current when viewing a product", () => {
    state.pathname = "/products/123";
    const markup = renderToStaticMarkup(<AppNavigation />);
    expect(markup).toMatch(/<a[^>]*aria-current="page"[^>]*href="\/products"/);
    expect(markup.match(/aria-current="page"/g)).toHaveLength(1);
  });

  it("marks nested settings and avoids matching unrelated path prefixes", () => {
    state.pathname = "/settings/catalog";
    expect(renderToStaticMarkup(<AppNavigation compact />)).toMatch(/<a[^>]*aria-current="page"[^>]*href="\/settings"/);
    state.pathname = "/products-other";
    expect(renderToStaticMarkup(<AppNavigation />)).not.toContain('aria-current="page"');
  });
});

import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogState } from "@/db/catalog";

const mocks = vi.hoisted(() => ({ getCatalogWorkspace: vi.fn(), getState: vi.fn<() => CatalogState>(), pending: false }));
vi.mock("@/db/catalog", () => mocks);
vi.mock("./actions", () => ({ updateCatalog: vi.fn() }));
vi.mock("gt-next", () => ({ useLocaleDirection: () => "ltr", useGT: () => (text: string) => text, T: ({ children }: { children: ReactNode }) => children }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(), useActionState: () => [mocks.getState(), () => {}, mocks.pending],
}));

import CatalogPage from "./page";
import { CatalogForm } from "./_components/catalog-form";

beforeEach(() => {
  mocks.getState.mockReturnValue({ status: "idle" });
  mocks.getCatalogWorkspace.mockResolvedValue({ canManage: true, units: [
    { id: "unit_maan", name: "maan", kind: "fixed", kilogramsPerUnit: "4.400", isActive: true },
    { id: "unit_old", name: "Old measure", kind: "fixed", kilogramsPerUnit: "2.000", isActive: false },
  ], categories: [{ id: "cat_fruit", name: "Fruit", isActive: true }] });
});
afterEach(() => { vi.resetAllMocks(); mocks.pending = false; });

describe("catalogue page and forms", () => {
  it("preserves read denial without rendering business data", async () => {
    mocks.getCatalogWorkspace.mockRejectedValue(new Error("denied"));
    await expect(CatalogPage()).rejects.toThrow("denied");
  });
  it("offers management only for active entries with names and exact weights", async () => {
    const markup = renderToStaticMarkup(await CatalogPage());
    expect(markup).toContain("Units and product categories");
    expect(markup).toContain('value="4.400"');
    expect(markup).toContain('value="cat_fruit"');
    expect(markup).toContain("Old measure");
    expect(markup).not.toContain('value="unit_old"');
    expect(markup).toContain('value="seed-units"');
    expect(markup).toContain('formNoValidate=""');
    expect(markup).toContain("48.4 kg");
  });
  it("shows a read-only catalogue without mutation controls", async () => {
    const data = await mocks.getCatalogWorkspace();
    mocks.getCatalogWorkspace.mockResolvedValue({ ...data, canManage: false });
    const markup = renderToStaticMarkup(await CatalogPage());
    expect(markup).toContain("Fruit");
    expect(markup).toContain("Only owners, admins, and managers");
    expect(markup).not.toContain("<form");
  });
  it("shows empty states and labels inputs without exposing a tenant identifier", async () => {
    mocks.getCatalogWorkspace.mockResolvedValue({ units: [], categories: [], canManage: true });
    const markup = renderToStaticMarkup(await CatalogPage());
    expect(markup).toContain("No weight units yet");
    expect(markup).toContain("No product categories yet");
    expect(markup).toContain("Kilograms per unit");
    expect(markup).toContain('inputMode="decimal"');
    expect(markup).not.toContain('name="organizationId"');
    const labelIds = [...markup.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((match) => match[1]);
    expect(labelIds.length).toBeGreaterThan(0);
    for (const id of labelIds) expect(markup).toContain(`id="${id}"`);
  });
  it("keeps bag weight variable and retains entered values on errors", () => {
    mocks.getState.mockReturnValue({ status: "duplicate" });
    const markup = renderToStaticMarkup(<CatalogForm entity="unit" entry={{ id: "bag", name: "Bag", kind: "bag", kilogramsPerUnit: null }} />);
    expect(markup).toContain("actual weight when recording goods");
    expect(markup).not.toContain('name="kilogramsPerUnit"');
    expect(markup).toContain('value="Bag"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("already used");
  });
  it("disables pending controls and announces invalid fields and safe feedback", () => {
    mocks.pending = true;
    let markup = renderToStaticMarkup(<CatalogForm entity="category" />);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('<fieldset disabled=""');
    mocks.pending = false;
    mocks.getState.mockReturnValue({ status: "invalid", fields: ["name", "unit"] });
    markup = renderToStaticMarkup(<CatalogForm entity="unit" />);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain("three decimal places");
    mocks.getState.mockReturnValue({ status: "error", correlationId: "safe-reference" });
    expect(renderToStaticMarkup(<CatalogForm entity="category" />)).toContain("safe-reference");
  });
});

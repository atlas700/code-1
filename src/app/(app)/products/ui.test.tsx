import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogState } from "@/db/catalog";

const mocks = vi.hoisted(() => ({ getCatalogWorkspace: vi.fn(), getProducts: vi.fn(), getProduct: vi.fn(), getState: vi.fn<() => CatalogState>(), pending: false }));
vi.mock("@/db/catalog", () => mocks);
vi.mock("./actions", () => ({ updateProduct: vi.fn() }));
vi.mock("gt-next", () => ({ T: ({ children }: { children: ReactNode }) => children, Var: ({ children }: { children: ReactNode }) => children }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(), useActionState: () => [mocks.getState(), () => {}, mocks.pending],
}));
import ProductsPage from "./page";
import ProductPage from "./[id]/page";
import { ProductForm } from "./_components/product-form";

const product = { id: "product", name: "Wheat", sku: "W-1", categoryId: "grain", unitId: "kg", isActive: true, unitName: "kg", categoryName: "Grain" };
const units = [{ id: "kg", name: "kg", kind: "fixed" as const, kilogramsPerUnit: "1.000", isActive: true },
  { id: "old", name: "Old measure", kind: "fixed" as const, kilogramsPerUnit: "2.000", isActive: false }];
const categories = [{ id: "grain", name: "Grain", isActive: true }, { id: "old-category", name: "Old category", isActive: false }];
beforeEach(() => {
  mocks.getState.mockReturnValue({ status: "idle" });
  mocks.getCatalogWorkspace.mockResolvedValue({ units, categories, canManage: true });
  mocks.getProducts.mockResolvedValue([product]); mocks.getProduct.mockResolvedValue(product);
});
afterEach(() => { vi.resetAllMocks(); mocks.pending = false; });

describe("product pages and form", () => {
  it("shows list links and accessible labelled creation controls", async () => {
    const markup = renderToStaticMarkup(await ProductsPage());
    expect(markup).toContain('href="/products/product"');
    expect(markup).toContain("Wheat"); expect(markup).toContain("W-1");
    expect(markup).toContain('value="create-product"');
    expect(markup).not.toContain('value="old"');
    expect(markup).not.toContain('value="old-category"');
    expect(markup).not.toContain('name="organizationId"');
    const ids = [...markup.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(4);
    for (const id of ids) expect(markup).toContain(`id="${id}"`);
  });
  it("provides empty states and directs setup when no active unit exists", async () => {
    mocks.getProducts.mockResolvedValue([]);
    mocks.getCatalogWorkspace.mockResolvedValue({ units: [], categories: [], canManage: true });
    const markup = renderToStaticMarkup(await ProductsPage());
    expect(markup).toContain("No products yet.");
    expect(markup).toContain("Add an active weight unit");
    expect(markup).toContain('href="/settings/catalog"');
    expect(markup).not.toContain("<form");
  });
  it("hides all write controls from read-only staff on both pages", async () => {
    mocks.getCatalogWorkspace.mockResolvedValue({ units, categories, canManage: false });
    for (const page of [await ProductsPage(), await ProductPage({ params: Promise.resolve({ id: product.id }) })]) {
      const markup = renderToStaticMarkup(page);
      expect(markup).toContain("Wheat"); expect(markup).not.toContain("<form");
    }
  });
  it("shows details/edit for active products and retains inactive products without controls", async () => {
    const active = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ id: product.id }) }));
    expect(mocks.getProduct).toHaveBeenCalledWith(product.id);
    expect(active).toContain("Edit product"); expect(active).toContain('value="update-product"');
    expect(active).toContain('value="deactivate-product"'); expect(active).toContain('formNoValidate=""');
    mocks.getProduct.mockResolvedValue({ ...product, isActive: false });
    const inactive = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ id: product.id }) }));
    expect(inactive).toContain("Inactive"); expect(inactive).toContain("record is retained"); expect(inactive).not.toContain("<form");
  });
  it("retains values and shows inactive current selections so they can be replaced", () => {
    mocks.getState.mockReturnValue({ status: "duplicate" });
    const markup = renderToStaticMarkup(<ProductForm product={{ ...product, unitId: "old", categoryId: "old-category" }} units={units} categories={categories} />);
    expect(markup).toContain('value="Wheat"'); expect(markup).toContain('value="W-1"');
    expect(markup).toContain("Old measure"); expect(markup).toContain("Old category");
    expect(markup).toContain("(inactive)"); expect(markup).toContain('disabled="" selected=""');
    expect(markup).toContain('role="alert"'); expect(markup).toContain("already used");
  });
  it("disables pending fields and announces invalid input and safe errors", () => {
    mocks.pending = true;
    let markup = renderToStaticMarkup(<ProductForm units={units} categories={categories} />);
    expect(markup).toContain('aria-busy="true"'); expect(markup).toContain('<fieldset disabled=""');
    mocks.pending = false; mocks.getState.mockReturnValue({ status: "invalid", fields: ["name", "unitId"] });
    markup = renderToStaticMarkup(<ProductForm units={units} categories={categories} />);
    expect(markup).toContain('aria-invalid="true"'); expect(markup).toContain("active weight unit");
    for (const errorId of [...markup.matchAll(/aria-describedby="([^"]+-(?:name|unit)-error)"/g)].map((match) => match[1])) {
      expect(markup).toContain(`id="${errorId}"`);
    }
    expect(markup).toContain("Enter a product name of 1–80 characters.");
    mocks.getState.mockReturnValue({ status: "error", correlationId: "safe-reference" });
    expect(renderToStaticMarkup(<ProductForm units={units} categories={categories} />)).toContain("safe-reference");
  });
  it("preserves read denial and detail not-found control flow", async () => {
    mocks.getProducts.mockRejectedValue({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(ProductsPage()).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
    mocks.getProduct.mockRejectedValue({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(ProductPage({ params: Promise.resolve({ id: "foreign" }) })).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
  });
});

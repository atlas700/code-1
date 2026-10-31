import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireSession: vi.fn(), manageCatalog: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/auth/server", () => mocks);
vi.mock("@/db/catalog", () => mocks);
vi.mock("next/cache", () => mocks);
import { updateCatalog } from "./actions";

beforeEach(() => { mocks.requireSession.mockResolvedValue({ userId: "user_a" }); mocks.manageCatalog.mockResolvedValue({ status: "success" }); });
afterEach(() => { vi.resetAllMocks(); vi.restoreAllMocks(); });

describe("catalogue Server Action", () => {
  it("authenticates, forwards only input fields, and refreshes after success", async () => {
    const form = new FormData();
    form.set("operation", "create-unit"); form.set("name", "Bag"); form.set("kind", "bag");
    form.set("kilogramsPerUnit", "44"); form.set("organizationId", "attacker");
    expect(await updateCatalog({ status: "success" }, form)).toEqual({ status: "success" });
    expect(mocks.requireSession).toHaveBeenCalledOnce();
    expect(mocks.manageCatalog).toHaveBeenCalledWith({ operation: "create-unit", id: null, name: "Bag", unit: { kind: "bag", kilogramsPerUnit: null } });
    expect(mocks.revalidatePath.mock.calls).toEqual([["/settings/catalog"], ["/products"], ["/products/[id]", "page"]]);
  });
  it("preserves anonymous redirects and permission denials", async () => {
    mocks.requireSession.mockImplementation(() => redirect("/sign-in"));
    await expect(updateCatalog({ status: "idle" }, new FormData())).rejects.toHaveProperty("digest", expect.stringContaining("NEXT_REDIRECT"));
    expect(mocks.manageCatalog).not.toHaveBeenCalled();
    mocks.requireSession.mockResolvedValue({ userId: "user_a" });
    mocks.manageCatalog.mockRejectedValue({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    await expect(updateCatalog({ status: "idle" }, new FormData())).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
  });
  it("returns safe correlated errors without leaking input or SQL details", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.manageCatalog.mockRejectedValue(new Error("secret SQL password"));
    expect(await updateCatalog({ status: "idle" }, new FormData())).toEqual({ status: "error", correlationId: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/secret|password|SQL/);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
  it("does not refresh after invalid input or a conflict", async () => {
    mocks.manageCatalog.mockResolvedValue({ status: "conflict" });
    expect(await updateCatalog({ status: "idle" }, new FormData())).toEqual({ status: "conflict" });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    // @ts-expect-error Exercise the untrusted Server Action transport.
    await updateCatalog({ status: "idle" }, null);
    expect(mocks.manageCatalog).toHaveBeenLastCalledWith(null);
  });
  it("keeps product operations in the product action", async () => {
    mocks.manageCatalog.mockResolvedValue({ status: "invalid", fields: ["operation"] });
    const form = new FormData(); form.set("operation", "deactivate-product");
    await updateCatalog({ status: "idle" }, form);
    expect(mocks.manageCatalog).toHaveBeenCalledWith(null);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

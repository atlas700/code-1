import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requirePermission: vi.fn(), query: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("./authorization", () => mocks);
vi.mock("./index", async () => {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool } = await import("pg");
  const pool = new Pool();
  pool.query = mocks.query;
  return { db: drizzle({ client: pool }) };
});
import { getWorkspaceSummary } from "./workspace";

const tenant = { organizationId: "53409e5c-e4d7-4351-a6b3-46ee18c4f532", membershipId: "member_a", userId: "user_a" };
beforeEach(() => {
  mocks.requirePermission.mockResolvedValue(tenant);
  mocks.query.mockResolvedValue({ rows: [["Helmand business", "warehouse"]] });
});
afterEach(() => vi.resetAllMocks());

describe("workspace identity and role", () => {
  it("reads only the authorized business and exact membership-bound role", async () => {
    expect(await getWorkspaceSummary()).toEqual({ name: "Helmand business", role: "warehouse" });
    expect(mocks.requirePermission).toHaveBeenCalledExactlyOnceWith("organization.read");
    expect(mocks.query).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      text: expect.stringContaining('"organization_role_assignments"."membership_id" = $2'),
    }), [tenant.organizationId, tenant.membershipId, tenant.userId, 1]);
  });
  it("does not query or expose business identity after a denial", async () => {
    const denial = { digest: "NEXT_HTTP_ERROR_FALLBACK;404" };
    mocks.requirePermission.mockRejectedValue(denial);
    await expect(getWorkspaceSummary()).rejects.toBe(denial);
    expect(mocks.query).not.toHaveBeenCalled();
  });
  it.each([{ rows: [] }, { rows: [["Business", "unknown"]] }])("denies a missing or invalid current role: %j", async ({ rows }) => {
    mocks.query.mockResolvedValue({ rows });
    await expect(getWorkspaceSummary()).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
  });
  it("sanitizes database failures", async () => {
    mocks.query.mockRejectedValue(new Error("private SQL and credentials"));
    await expect(getWorkspaceSummary()).rejects.toThrow(/^Workspace unavailable\.$/);
  });
});

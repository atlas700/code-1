import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { requireSession, getTenantContext, query } = vi.hoisted(() => ({
  requireSession: vi.fn(), getTenantContext: vi.fn(), query: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/auth/server", () => ({ requireSession }));
vi.mock("./tenant", () => ({ getTenantContext }));
vi.mock("./index", async () => {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool } = await import("pg");
  const pool = new Pool();
  pool.query = query;
  return { db: drizzle({ client: pool }) };
});

import { requirePermission } from "./authorization";

const tenant = { userId: "user_a", organizationId: "53409e5c-e4d7-4351-a6b3-46ee18c4f532", membershipId: "membership_a" };
const denied = { digest: "NEXT_HTTP_ERROR_FALLBACK;404" };

beforeEach(() => {
  requireSession.mockResolvedValue({ userId: tenant.userId });
  getTenantContext.mockResolvedValue(tenant);
  query.mockResolvedValue({ rows: [["warehouse"]] });
});
afterEach(() => vi.resetAllMocks());

describe("server business authorization", () => {
  it("permits receiving using only the verified organization, membership, and user", async () => {
    expect(await requirePermission("receipts.accept")).toEqual(tenant);
    expect(query).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      text: expect.stringContaining('"organization_role_assignments"."organization_id" = $1'),
    }), [tenant.organizationId, tenant.membershipId, tenant.userId, 1]);
  });

  it("denies warehouse financial writes and owner-only approvals", async () => {
    await expect(requirePermission("supplier_payments.record")).rejects.toMatchObject(denied);
    await expect(requirePermission("receipts.approve_variance")).rejects.toMatchObject(denied);
  });

  it("allows an accountant to record payments but denies managing staff", async () => {
    query.mockResolvedValue({ rows: [["accountant"]] });
    expect(await requirePermission("supplier_payments.record")).toEqual(tenant);
    await expect(requirePermission("staff.manage")).rejects.toMatchObject(denied);
  });

  it("preserves anonymous sign-in redirects without checking grants", async () => {
    requireSession.mockImplementation(() => redirect("/sign-in"));
    await expect(requirePermission("inventory.read")).rejects.toHaveProperty("digest", expect.stringContaining("NEXT_REDIRECT"));
    expect(getTenantContext).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
  });

  it.each([null, { ...tenant, userId: "another_user" }])("denies absent or mismatched membership without a role query", async (context) => {
    getTenantContext.mockResolvedValue(context);
    await expect(requirePermission("inventory.read")).rejects.toMatchObject(denied);
    expect(query).not.toHaveBeenCalled();
  });

  it.each([{ rows: [] }, { rows: [["unknown_role"]] }, { rows: [["toString"]] }])("denies absent or unknown assignments: %j", async ({ rows }) => {
    query.mockResolvedValue({ rows });
    await expect(requirePermission("inventory.read")).rejects.toMatchObject(denied);
  });

  it("rechecks grants and current membership on every invocation", async () => {
    await requirePermission("inventory.read");
    query.mockResolvedValue({ rows: [] });
    getTenantContext.mockResolvedValue({ ...tenant, membershipId: "membership_rejoined" });
    await expect(requirePermission("inventory.read")).rejects.toMatchObject(denied);
    expect(query).toHaveBeenLastCalledWith(expect.anything(), [tenant.organizationId, "membership_rejoined", tenant.userId, 1]);
    getTenantContext.mockResolvedValue(null);
    await expect(requirePermission("inventory.read")).rejects.toMatchObject(denied);
    expect(getTenantContext).toHaveBeenCalledTimes(3);
    expect(query).toHaveBeenCalledTimes(2);
  });

  it.each(["session", "membership", "database"])("fails closed without exposing %s outage details", async (stage) => {
    const error = new Error("Private SQL, credentials, and provider data");
    if (stage === "session") requireSession.mockRejectedValue(error);
    if (stage === "membership") getTenantContext.mockRejectedValue(error);
    if (stage === "database") query.mockRejectedValue(error);
    const result = requirePermission("inventory.read");
    await expect(result).rejects.toThrow(/^Business access unavailable\.$/);
    await expect(result).rejects.not.toHaveProperty("cause");
  });
});

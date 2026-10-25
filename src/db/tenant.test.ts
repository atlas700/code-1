import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getActiveOrganizationMembership, query } = vi.hoisted(() => ({
  getActiveOrganizationMembership: vi.fn(),
  query: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/auth/organizations", () => ({ getActiveOrganizationMembership }));
vi.mock("./index", async () => {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool } = await import("pg");
  const pool = new Pool();
  pool.query = query;
  return { db: drizzle({ client: pool }) };
});

import { getTenantContext } from "./tenant";

const organizationId = "53409e5c-e4d7-4351-a6b3-46ee18c4f532";

beforeEach(() => {
  getActiveOrganizationMembership.mockResolvedValue({
    userId: "user_a",
    clerkOrganizationId: "org_a",
    membershipId: "membership_a",
  });
  query.mockResolvedValue({ rows: [[organizationId]] });
});

afterEach(() => vi.resetAllMocks());

describe("tenant context", () => {
  it("resolves only the verified organization's local UUID using a parameterized read", async () => {
    expect(await getTenantContext()).toEqual({
      userId: "user_a",
      organizationId,
      membershipId: "membership_a",
    });
    expect(query).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        text: 'select "id" from "organizations" where "organizations"."clerk_organization_id" = $1 limit $2',
      }),
      ["org_a", 1],
    );
  });

  it("does not query the database without verified membership", async () => {
    getActiveOrganizationMembership.mockResolvedValue(null);
    expect(await getTenantContext()).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it("does not create a mapping or fall back to another tenant when none exists", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(await getTenantContext()).toBeNull();
    expect(query).toHaveBeenCalledOnce();
  });

  it("preserves sanitized membership failures without querying the database", async () => {
    const denied = new Error("Unable to verify organization membership.");
    getActiveOrganizationMembership.mockRejectedValue(denied);
    await expect(getTenantContext()).rejects.toBe(denied);
    expect(query).not.toHaveBeenCalled();
  });

  it("does not expose SQL, credentials, or the original database error", async () => {
    query.mockRejectedValue(new Error("Private connection string and SQL"));
    const result = getTenantContext();
    await expect(result).rejects.toThrow(/^Unable to resolve organization context\.$/);
    await expect(result).rejects.not.toHaveProperty("cause");
  });

  it("resolves a changed active organization without reusing the previous tenant", async () => {
    await getTenantContext();
    getActiveOrganizationMembership.mockResolvedValue({
      userId: "user_a",
      clerkOrganizationId: "org_b",
      membershipId: "membership_b",
    });
    query.mockResolvedValue({ rows: [] });
    expect(await getTenantContext()).toBeNull();
    expect(query).toHaveBeenLastCalledWith(expect.anything(), ["org_b", 1]);
  });
});

import { ClerkAPIResponseError } from "@clerk/nextjs/errors";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const clerk = vi.hoisted(() => ({
  auth: vi.fn(),
  clerkClient: vi.fn(),
  getOrganizationMembershipList: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => clerk);

import { getActiveOrganizationMembership } from "./organizations";

beforeEach(() => {
  clerk.auth.mockResolvedValue({
    isAuthenticated: true,
    userId: "user_a",
    orgId: "org_a",
    orgRole: "org:admin",
  });
  clerk.clerkClient.mockResolvedValue({
    organizations: { getOrganizationMembershipList: clerk.getOrganizationMembershipList },
  });
  clerk.getOrganizationMembershipList.mockResolvedValue({
    data: [{
      id: "membership_a",
      organization: { id: "org_a" },
      publicUserData: { userId: "user_a", identifier: "private@example.invalid" },
      role: "org:admin",
    }],
  });
});

afterEach(() => vi.resetAllMocks());

describe("active organization membership", () => {
  it("verifies the exact session organization/user pair and returns only identity fields", async () => {
    expect(await getActiveOrganizationMembership()).toEqual({
      userId: "user_a",
      clerkOrganizationId: "org_a",
      membershipId: "membership_a",
    });
    expect(clerk.getOrganizationMembershipList).toHaveBeenCalledExactlyOnceWith({
      organizationId: "org_a",
      userId: ["user_a"],
      limit: 1,
    });
  });

  it.each([
    { isAuthenticated: false, userId: null, orgId: null },
    { isAuthenticated: false, userId: "pending_user", orgId: "org_a" },
    { isAuthenticated: true, userId: "user_a", orgId: null },
  ])("does not query memberships without an authenticated active organization: %j", async (session) => {
    clerk.auth.mockResolvedValue(session);
    expect(await getActiveOrganizationMembership()).toBeNull();
    expect(clerk.clerkClient).not.toHaveBeenCalled();
  });

  it("denies a removed membership even when the session still claims admin access", async () => {
    clerk.getOrganizationMembershipList.mockResolvedValue({ data: [] });
    expect(await getActiveOrganizationMembership()).toBeNull();
  });

  it.each([
    { organization: { id: "org_other" }, publicUserData: { userId: "user_a" } },
    { organization: { id: "org_a" }, publicUserData: { userId: "user_other" } },
    { organization: { id: "org_a" }, publicUserData: null },
    { organization: { id: "org_a" } },
  ])("rejects mismatched or missing membership identity: %j", async (membership) => {
    clerk.getOrganizationMembershipList.mockResolvedValue({
      data: [{ id: "membership_other", ...membership }],
    });
    expect(await getActiveOrganizationMembership()).toBeNull();
  });

  it("returns no context when Clerk reports a deleted organization", async () => {
    clerk.getOrganizationMembershipList.mockRejectedValue(
      new ClerkAPIResponseError("Private provider detail", { status: 404, data: [] }),
    );
    expect(await getActiveOrganizationMembership()).toBeNull();
  });

  it.each([401, 403, 429, 500])("fails closed with a sanitized error for Clerk status %s", async (status) => {
    clerk.getOrganizationMembershipList.mockRejectedValue(
      new ClerkAPIResponseError("Private provider detail", { status, data: [] }),
    );
    await expect(getActiveOrganizationMembership()).rejects.toThrow(
      /^Unable to verify organization membership\.$/,
    );
  });

  it.each(["auth", "clerkClient", "getOrganizationMembershipList"] as const)(
    "sanitizes unexpected failures from %s without exposing their cause",
    async (method) => {
      clerk[method].mockRejectedValue(new Error("Private credential or network failure"));
      const result = getActiveOrganizationMembership();
      await expect(result).rejects.toThrow(/^Unable to verify organization membership\.$/);
      await expect(result).rejects.not.toHaveProperty("cause");
    },
  );

  it("rechecks membership instead of reusing an earlier successful lookup", async () => {
    expect(await getActiveOrganizationMembership()).not.toBeNull();
    clerk.getOrganizationMembershipList.mockResolvedValue({ data: [] });
    expect(await getActiveOrganizationMembership()).toBeNull();
    expect(clerk.getOrganizationMembershipList).toHaveBeenCalledTimes(2);
  });

  it("preserves Next.js control-flow errors instead of sanitizing them as provider failures", async () => {
    clerk.auth.mockImplementation(() => redirect("/sign-in"));
    await expect(getActiveOrganizationMembership()).rejects.toHaveProperty(
      "digest", expect.stringContaining("NEXT_REDIRECT"),
    );
    expect(clerk.clerkClient).not.toHaveBeenCalled();
  });
});

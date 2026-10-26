import { ClerkAPIResponseError } from "@clerk/nextjs/errors";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const clerk = vi.hoisted(() => ({
  clerkClient: vi.fn(), getOrganization: vi.fn(), createOrganization: vi.fn(), getOrganizationMembershipList: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => clerk);

import { getOrCreateCreatorOrganization } from "./onboarding";

const request = { userId: "user_a", id: "21e2c06c-30fa-4a2a-b8da-49e9e4c0e802", name: "Example business", clerkOrganizationId: null, ownerMembershipId: null };
const verifiedMembership = { userId: "user_a", clerkOrganizationId: "org_a", membershipId: "membership_a" };
const organization = { id: "org_a", createdBy: "user_a", privateMetadata: { afcsOnboardingId: request.id } };
const missing = () => new ClerkAPIResponseError("Private provider data", { status: 404, data: [] });

beforeEach(() => {
  clerk.clerkClient.mockResolvedValue({ organizations: clerk });
  clerk.getOrganization.mockResolvedValue(organization);
  clerk.createOrganization.mockResolvedValue(organization);
  clerk.getOrganizationMembershipList.mockResolvedValue({ data: [{
    id: "membership_a", organization: { id: "org_a" }, publicUserData: { userId: "user_a" },
  }] });
});
afterEach(() => vi.resetAllMocks());

describe("first organization provider provisioning", () => {
  it("recovers the reserved slug and verifies exact current creator membership without creating", async () => {
    expect(await getOrCreateCreatorOrganization(request)).toEqual(verifiedMembership);
    expect(clerk.getOrganization).toHaveBeenCalledWith({ slug: `afcs-${request.id}` });
    expect(clerk.createOrganization).not.toHaveBeenCalled();
    expect(clerk.getOrganizationMembershipList).toHaveBeenCalledWith({ organizationId: "org_a", userId: ["user_a"], limit: 1 });
  });

  it("creates through Clerk with server-derived creator and stable unique recovery marker", async () => {
    clerk.getOrganization.mockRejectedValueOnce(missing());
    expect(await getOrCreateCreatorOrganization(request)).toEqual(verifiedMembership);
    expect(clerk.createOrganization).toHaveBeenCalledExactlyOnceWith({
      name: request.name, slug: `afcs-${request.id}`, createdBy: "user_a", privateMetadata: { afcsOnboardingId: request.id },
    });
    expect(clerk.getOrganizationMembershipList).toHaveBeenCalledOnce();
  });

  it.each([new Error("Timeout after remote success"), new ClerkAPIResponseError("Conflict", { status: 422, data: [] })])(
    "recovers ambiguous success or a concurrent slug conflict", async (error) => {
      clerk.getOrganization.mockRejectedValueOnce(missing());
      clerk.createOrganization.mockRejectedValueOnce(error);
      expect(await getOrCreateCreatorOrganization(request)).toEqual(verifiedMembership);
      expect(clerk.getOrganization).toHaveBeenCalledTimes(2);
      expect(clerk.createOrganization).toHaveBeenCalledOnce();
    },
  );

  it("uses the pinned ID after a slug change", async () => {
    expect(await getOrCreateCreatorOrganization({ ...request, clerkOrganizationId: "org_a" })).toEqual(verifiedMembership);
    expect(clerk.getOrganization).toHaveBeenCalledWith({ organizationId: "org_a" });
  });

  it("preserves the original creation failure when recovery finds no organization", async () => {
    const creationError = new ClerkAPIResponseError("Slugs disabled", { status: 403, data: [] });
    clerk.getOrganization.mockRejectedValue(missing());
    clerk.createOrganization.mockRejectedValue(creationError);
    await expect(getOrCreateCreatorOrganization(request)).rejects.toBe(creationError);
    expect(clerk.createOrganization).toHaveBeenCalledOnce();
  });

  it("concurrent requests recover the one organization created with the reserved slug", async () => {
    let created = false;
    let organizationsCreated = 0;
    clerk.getOrganization.mockImplementation(async () => {
      if (!created) throw missing();
      return organization;
    });
    clerk.createOrganization.mockImplementation(async () => {
      if (created) throw new ClerkAPIResponseError("Slug taken", { status: 422, data: [] });
      created = true;
      organizationsCreated++;
      return organization;
    });
    expect(await Promise.all([getOrCreateCreatorOrganization(request), getOrCreateCreatorOrganization(request)]))
      .toEqual([verifiedMembership, verifiedMembership]);
    expect(organizationsCreated).toBe(1);
  });

  it("does not replace a deleted pinned organization", async () => {
    clerk.getOrganization.mockRejectedValueOnce(missing());
    expect(await getOrCreateCreatorOrganization({ ...request, clerkOrganizationId: "org_a" })).toBeNull();
    expect(clerk.createOrganization).not.toHaveBeenCalled();
  });

  it("denies a rejoined creator's new membership after owner bootstrap", async () => {
    expect(await getOrCreateCreatorOrganization({ ...request, ownerMembershipId: "membership_original" })).toBeNull();
    expect(clerk.createOrganization).not.toHaveBeenCalled();
  });

  it.each([
    { ...organization, createdBy: "user_other" },
    { ...organization, createdBy: undefined },
    { ...organization, privateMetadata: {} },
    { ...organization, privateMetadata: { afcsOnboardingId: "another-request" } },
    { ...organization, id: "org_other" },
  ])("denies an unrelated organization or mismatched creator: %j", async (remote) => {
    clerk.getOrganization.mockResolvedValue(remote);
    expect(await getOrCreateCreatorOrganization({ ...request, clerkOrganizationId: "org_a" })).toBeNull();
    expect(clerk.getOrganizationMembershipList).not.toHaveBeenCalled();
    expect(clerk.createOrganization).not.toHaveBeenCalled();
  });

  it.each([
    [],
    [{ organization: { id: "org_other" }, publicUserData: { userId: "user_a" } }],
    [{ organization: { id: "org_a" }, publicUserData: { userId: "user_other" } }],
    [{ organization: { id: "org_a" }, publicUserData: null }],
  ])("denies missing or mismatched current membership: %j", async (...memberships) => {
    clerk.getOrganizationMembershipList.mockResolvedValue({ data: memberships });
    expect(await getOrCreateCreatorOrganization(request)).toBeNull();
  });

  it.each([401, 403, 429, 500])("does not create after a lookup failure with status %s", async (status) => {
    clerk.getOrganization.mockRejectedValue(new ClerkAPIResponseError("Private detail", { status, data: [] }));
    await expect(getOrCreateCreatorOrganization(request)).rejects.toThrow();
    expect(clerk.createOrganization).not.toHaveBeenCalled();
  });

  it("preserves framework control flow instead of creating during a redirect", async () => {
    clerk.getOrganization.mockImplementation(() => redirect("/sign-in"));
    await expect(getOrCreateCreatorOrganization(request)).rejects.toHaveProperty("digest", expect.stringContaining("NEXT_REDIRECT"));
    expect(clerk.createOrganization).not.toHaveBeenCalled();
  });
});

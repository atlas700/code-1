import { randomUUID } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/env", () => ({ env: {
  databaseUrl: process.env.AFCS_TEST_DATABASE_URL ?? "postgresql://unused:unused@127.0.0.1:1/unused",
  nodeEnvironment: "test",
} }));

import { db } from "./index";
import { completeOnboarding, getOnboardingRequest, pinOnboardingOrganization, reserveOnboarding } from "./onboarding";
import { organizationOnboarding, organizations, organizationSettings } from "./schema";

const details = { name: "Task 09 fixture", businessType: "Wholesaler", timezone: "Asia/Kabul", baseCurrency: "AFN", locale: "en-US" };
const userIds: string[] = [];
const remoteIds: string[] = [];
function fixture() {
  const token = randomUUID();
  const userId = `task09_user_${token}`;
  const remoteId = `task09_org_${token}`;
  userIds.push(userId);
  remoteIds.push(remoteId);
  return { userId, remoteId };
}

describe.skipIf(!process.env.AFCS_TEST_DATABASE_URL)("onboarding against isolated PostgreSQL", () => {
  beforeAll(async () => {
    const result = await db.execute<{ database: string }>(sql`select current_database() as database`);
    if (result.rows[0]?.database !== "afcs_task07_verify") throw new Error("Use only the isolated afcs_task07_verify database.");
  });

  afterAll(async () => {
    if (remoteIds.length) {
      const rows = await db.select({ id: organizations.id }).from(organizations).where(inArray(organizations.clerkOrganizationId, remoteIds));
      if (rows.length) await db.delete(organizationSettings).where(inArray(organizationSettings.organizationId, rows.map((row) => row.id)));
      await db.delete(organizations).where(inArray(organizations.clerkOrganizationId, remoteIds));
    }
    if (userIds.length) await db.delete(organizationOnboarding).where(inArray(organizationOnboarding.userId, userIds));
  });

  it("reserves one immutable setup across concurrent submissions", async () => {
    const { userId } = fixture();
    const requests = await Promise.all(Array.from({ length: 6 }, () => reserveOnboarding(userId, details)));
    expect(new Set(requests.map((request) => request.id)).size).toBe(1);
    expect(requests[0].createdAt).toBeInstanceOf(Date);
    expect(await reserveOnboarding(userId, { ...details, name: "Changed details" })).toEqual(requests[0]);
  });

  it("reads only the selected creator and never provisions during a read", async () => {
    const a = fixture();
    const b = fixture();
    const request = await reserveOnboarding(a.userId, details);
    expect(await getOnboardingRequest(a.userId)).toEqual(request);
    expect(await getOnboardingRequest(b.userId)).toBeNull();
  });

  it("pins the remote ID once and rejects attempts to replace it", async () => {
    const { userId, remoteId } = fixture();
    const request = await reserveOnboarding(userId, details);
    const pinned = await pinOnboardingOrganization(request, remoteId);
    expect(await pinOnboardingOrganization(request, remoteId)).toEqual(pinned);
    await expect(pinOnboardingOrganization(request, "task09_org_other")).rejects.toThrow("conflict");
    expect((await getOnboardingRequest(userId))?.clerkOrganizationId).toBe(remoteId);
  });

  it("rejects pinning another creator's request and duplicate remote ownership", async () => {
    const a = fixture();
    const b = fixture();
    const requestA = await reserveOnboarding(a.userId, details);
    const requestB = await reserveOnboarding(b.userId, details);
    await expect(pinOnboardingOrganization({ ...requestA, userId: b.userId }, a.remoteId)).rejects.toThrow("conflict");
    await pinOnboardingOrganization(requestA, a.remoteId);
    await expect(pinOnboardingOrganization(requestB, a.remoteId)).rejects.toThrow();
  });

  it("commits only one mapping and settings row across concurrent/repeated completion", async () => {
    const { userId, remoteId } = fixture();
    const request = await pinOnboardingOrganization(await reserveOnboarding(userId, details), remoteId);
    await Promise.all(Array.from({ length: 6 }, () => completeOnboarding(request)));
    const mappings = await db.select().from(organizations).where(eq(organizations.clerkOrganizationId, remoteId));
    expect(mappings).toHaveLength(1);
    expect(mappings[0].id).toMatch(/^[0-9a-f-]{36}$/);
    expect(await db.select().from(organizationSettings).where(eq(organizationSettings.organizationId, mappings[0].id)))
      .toEqual([{ organizationId: mappings[0].id, ...details }]);
  });

  it("rolls back the new mapping when settings fail and can recover with the pinned ID", async () => {
    const { userId, remoteId } = fixture();
    const request = await pinOnboardingOrganization(await reserveOnboarding(userId, details), remoteId);
    await expect(completeOnboarding({ ...request, baseCurrency: "USD" })).rejects.toThrow();
    expect(await db.select().from(organizations).where(eq(organizations.clerkOrganizationId, remoteId))).toHaveLength(0);
    expect((await getOnboardingRequest(userId))?.clerkOrganizationId).toBe(remoteId);
    await completeOnboarding(request);
    expect(await db.select().from(organizations).where(eq(organizations.clerkOrganizationId, remoteId))).toHaveLength(1);
  });

  it("does not overwrite existing business settings on a retry", async () => {
    const { userId, remoteId } = fixture();
    const request = await pinOnboardingOrganization(await reserveOnboarding(userId, details), remoteId);
    await completeOnboarding(request);
    await expect(completeOnboarding({ ...request, name: "Overwrite attempted" })).rejects.toThrow("conflict");
    const [mapping] = await db.select().from(organizations).where(eq(organizations.clerkOrganizationId, remoteId));
    const [settings] = await db.select().from(organizationSettings).where(eq(organizationSettings.organizationId, mapping.id));
    expect(settings.name).toBe(details.name);
  });

  it("does not create a local business without a pinned remote organization", async () => {
    const { userId } = fixture();
    const request = await reserveOnboarding(userId, details);
    await expect(completeOnboarding(request)).rejects.toThrow("unavailable");
  });
});

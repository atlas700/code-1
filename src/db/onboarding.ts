import "server-only";

import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "./index";
import { organizationOnboarding, organizations, organizationSettings } from "./schema";

export type OrganizationDetails = Omit<typeof organizationSettings.$inferInsert, "organizationId">;
export type OnboardingRequest = typeof organizationOnboarding.$inferSelect;

export async function getOnboardingRequest(userId: string) {
  const [request] = await db.select().from(organizationOnboarding)
    .where(eq(organizationOnboarding.userId, userId)).limit(1);
  return request ?? null;
}

export async function reserveOnboarding(userId: string, details: OrganizationDetails) {
  await db.insert(organizationOnboarding).values({ userId, ...details })
    .onConflictDoNothing({ target: organizationOnboarding.userId });
  const request = await getOnboardingRequest(userId);
  if (!request) throw new Error("Onboarding reservation unavailable.");
  return request;
}

export async function pinOnboardingOrganization(request: OnboardingRequest, clerkOrganizationId: string) {
  const [pinned] = await db.update(organizationOnboarding).set({ clerkOrganizationId })
    .where(and(
      eq(organizationOnboarding.userId, request.userId),
      eq(organizationOnboarding.id, request.id),
      or(isNull(organizationOnboarding.clerkOrganizationId), eq(organizationOnboarding.clerkOrganizationId, clerkOrganizationId)),
    )).returning();
  if (!pinned) throw new Error("Onboarding organization conflict.");
  return pinned;
}

export async function completeOnboarding(request: OnboardingRequest) {
  const { clerkOrganizationId, name, businessType, timezone, baseCurrency, locale } = request;
  if (!clerkOrganizationId) throw new Error("Onboarding organization unavailable.");

  await db.transaction(async (tx) => {
    await tx.insert(organizations).values({ clerkOrganizationId })
      .onConflictDoNothing({ target: organizations.clerkOrganizationId });
    const [organization] = await tx.select({ id: organizations.id }).from(organizations)
      .where(eq(organizations.clerkOrganizationId, clerkOrganizationId)).limit(1);
    if (!organization) throw new Error("Organization mapping unavailable.");

    await tx.insert(organizationSettings)
      .values({ organizationId: organization.id, name, businessType, timezone, baseCurrency, locale })
      .onConflictDoNothing({ target: organizationSettings.organizationId });
    const [settings] = await tx.select().from(organizationSettings)
      .where(eq(organizationSettings.organizationId, organization.id)).limit(1);
    if (!settings || settings.name !== name || settings.businessType !== businessType ||
      settings.timezone !== timezone || settings.baseCurrency !== baseCurrency || settings.locale !== locale) {
      throw new Error("Organization settings conflict.");
    }
  });
}

import "server-only";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { clerkClient } from "@clerk/nextjs/server";
import { unstable_rethrow } from "next/navigation";

type CreatorOrganizationRequest = {
  userId: string;
  id: string;
  name: string;
  clerkOrganizationId: string | null;
};

export async function getOrCreateCreatorOrganization(request: CreatorOrganizationRequest): Promise<string | null> {
  const client = await clerkClient();
  // shortcut: unpinned recovery needs the reserved slug unchanged; reconcile before adding slug edits.
  const slug = `afcs-${request.id}`;
  let organization;

  try {
    organization = await client.organizations.getOrganization(
      request.clerkOrganizationId ? { organizationId: request.clerkOrganizationId } : { slug },
    );
  } catch (error) {
    unstable_rethrow(error);
    if (!isClerkAPIResponseError(error) || error.status !== 404) throw error;
    if (request.clerkOrganizationId) return null;

    try {
      organization = await client.organizations.createOrganization({
        name: request.name,
        slug,
        createdBy: request.userId,
        privateMetadata: { afcsOnboardingId: request.id },
      });
    } catch (createError) {
      unstable_rethrow(createError);
      // A timeout or a concurrent create can still have created this unique slug.
      try {
        organization = await client.organizations.getOrganization({ slug });
      } catch (lookupError) {
        unstable_rethrow(lookupError);
        throw createError;
      }
    }
  }

  if (organization.createdBy !== request.userId ||
    organization.privateMetadata.afcsOnboardingId !== request.id ||
    (request.clerkOrganizationId && organization.id !== request.clerkOrganizationId)) return null;

  const { data } = await client.organizations.getOrganizationMembershipList({
    organizationId: organization.id,
    userId: [request.userId],
    limit: 1,
  });
  const membership = data[0];
  if (membership?.organization.id !== organization.id || membership.publicUserData?.userId !== request.userId) return null;
  return organization.id;
}

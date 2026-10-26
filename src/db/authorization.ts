import "server-only";

import { and, eq } from "drizzle-orm";
import { notFound, unstable_rethrow } from "next/navigation";
import { hasPermission, type Permission } from "@/auth/permissions";
import { requireSession } from "@/auth/server";
import { db } from "./index";
import { organizationRoleAssignments } from "./schema";
import { getTenantContext, type TenantContext } from "./tenant";

export async function requirePermission(permission: Permission): Promise<TenantContext> {
  try {
    const { userId } = await requireSession();
    const tenant = await getTenantContext();
    if (!tenant || tenant.userId !== userId) notFound();

    const [assignment] = await db.select({ role: organizationRoleAssignments.role })
      .from(organizationRoleAssignments).where(and(
        eq(organizationRoleAssignments.organizationId, tenant.organizationId),
        eq(organizationRoleAssignments.membershipId, tenant.membershipId),
        eq(organizationRoleAssignments.userId, tenant.userId),
      )).limit(1);
    if (!assignment || !hasPermission(assignment.role, permission)) notFound();
    return tenant;
  } catch (error) {
    unstable_rethrow(error);
    throw new Error("Business access unavailable.");
  }
}

import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { notFound, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { hasPermission } from "@/auth/permissions";
import { getActiveOrganizationMembership } from "@/auth/organizations";
import { formatDecimal } from "@/domain/decimal";
import { parseWeight, pilotWeightMeasures, quantityToKg } from "@/domain/quantity";
import { localIdSchema } from "@/domain/validation";
import { requirePermission } from "./authorization";
import { db } from "./index";
import { catalogUnits, organizationRoleAssignments, organizations, productCategories } from "./schema";

export type CatalogState =
  | { status: "idle" | "success" | "duplicate" | "conflict" }
  | { status: "invalid"; fields: string[] }
  | { status: "error"; correlationId: string };

const nameSchema = z.string().trim().min(1).max(80);
const weightSchema = z.string().max(22).transform((value, context) => {
  try { return formatDecimal(parseWeight(value), 3); }
  catch { context.addIssue({ code: "custom", message: "Enter a positive gram-precise weight." }); return z.NEVER; }
});
const unitDetails = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("fixed"), kilogramsPerUnit: weightSchema }),
  z.object({ kind: z.literal("bag"), kilogramsPerUnit: z.null() }),
]);
const commandSchema = z.discriminatedUnion("operation", [
  z.object({ operation: z.literal("seed-units") }),
  z.object({ operation: z.literal("create-unit"), name: nameSchema, unit: unitDetails }),
  z.object({ operation: z.literal("update-unit"), id: localIdSchema, name: nameSchema, unit: unitDetails }),
  z.object({ operation: z.literal("deactivate-unit"), id: localIdSchema }),
  z.object({ operation: z.literal("create-category"), name: nameSchema }),
  z.object({ operation: z.literal("update-category"), id: localIdSchema, name: nameSchema }),
  z.object({ operation: z.literal("deactivate-category"), id: localIdSchema }),
]);

export async function getCatalogWorkspace() {
  try {
    const tenant = await requirePermission("catalog.read");
    const [units, categories, [actor]] = await Promise.all([
      db.select({ id: catalogUnits.id, name: catalogUnits.name, kind: catalogUnits.kind,
        kilogramsPerUnit: catalogUnits.kilogramsPerUnit, isActive: catalogUnits.isActive })
        .from(catalogUnits).where(eq(catalogUnits.organizationId, tenant.organizationId)).orderBy(asc(catalogUnits.name)),
      db.select({ id: productCategories.id, name: productCategories.name, isActive: productCategories.isActive })
        .from(productCategories).where(eq(productCategories.organizationId, tenant.organizationId)).orderBy(asc(productCategories.name)),
      db.select({ role: organizationRoleAssignments.role }).from(organizationRoleAssignments).where(and(
        eq(organizationRoleAssignments.organizationId, tenant.organizationId),
        eq(organizationRoleAssignments.membershipId, tenant.membershipId), eq(organizationRoleAssignments.userId, tenant.userId),
      )).limit(1),
    ]);
    if (!actor || !hasPermission(actor.role, "catalog.read")) notFound();
    return { units, categories, canManage: hasPermission(actor.role, "catalog.manage") };
  } catch (error) {
    unstable_rethrow(error);
    throw new Error("Catalogue unavailable.");
  }
}

export async function manageCatalog(input: unknown): Promise<CatalogState> {
  const tenant = await requirePermission("catalog.manage");
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { status: "invalid", fields: [...new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? "operation")))] };
  const command = parsed.data;
  try {
    return await db.transaction(async (tx): Promise<CatalogState> => {
      // Share staff's lock so queued mutations recheck a revoked or changed actor.
      const [organization] = await tx.select({ id: organizations.id, clerkOrganizationId: organizations.clerkOrganizationId })
        .from(organizations).where(eq(organizations.id, tenant.organizationId)).for("update");
      const current = await getActiveOrganizationMembership();
      const [actor] = await tx.select({ role: organizationRoleAssignments.role }).from(organizationRoleAssignments).where(and(
        eq(organizationRoleAssignments.organizationId, tenant.organizationId),
        eq(organizationRoleAssignments.membershipId, tenant.membershipId), eq(organizationRoleAssignments.userId, tenant.userId),
      )).limit(1);
      if (!organization || !current || current.clerkOrganizationId !== organization.clerkOrganizationId ||
        current.membershipId !== tenant.membershipId || current.userId !== tenant.userId ||
        !actor || !hasPermission(actor.role, "catalog.manage")) notFound();
      if (command.operation === "seed-units") {
        await tx.insert(catalogUnits).values([
          ...Object.entries(pilotWeightMeasures).map(([name, kilogramsPerUnit]) => ({ organizationId: tenant.organizationId, name,
            kind: "fixed" as const, kilogramsPerUnit })),
          { organizationId: tenant.organizationId, name: "bag", kind: "bag", kilogramsPerUnit: null },
        ]).onConflictDoNothing();
        return { status: "success" };
      }
      if (command.operation === "create-unit") {
        await tx.insert(catalogUnits).values({ organizationId: tenant.organizationId, name: command.name, ...command.unit });
      } else if (command.operation === "create-category") {
        await tx.insert(productCategories).values({ organizationId: tenant.organizationId, name: command.name });
      } else {
        const table = command.operation === "update-unit" || command.operation === "deactivate-unit" ? catalogUnits : productCategories;
        const changes = command.operation === "update-unit" ? { name: command.name, ...command.unit }
          : command.operation === "update-category" ? { name: command.name } : { isActive: false };
        const saved = await tx.update(table).set(changes).where(and(eq(table.id, command.id),
          eq(table.organizationId, tenant.organizationId), eq(table.isActive, true))).returning({ id: table.id });
        if (saved.length === 0) return { status: "conflict" };
      }
      return { status: "success" };
    });
  } catch (error) {
    unstable_rethrow(error);
    // Drizzle wraps pg errors; only these two named uniqueness constraints are expected conflicts.
    const cause = error instanceof Error ? error.cause : error;
    if (cause && typeof cause === "object" && "code" in cause && cause.code === "23505" && "constraint" in cause &&
      (cause.constraint === "catalog_units_organization_name" || cause.constraint === "product_categories_organization_name")) return { status: "duplicate" };
    throw error;
  }
}

// The posting service must persist these scalar snapshots alongside each transaction line.
export async function getUnitSnapshot(input: unknown) {
  const tenant = await requirePermission("catalog.read");
  const request = z.object({ id: localIdSchema, quantity: z.string().max(38), bagWeightKg: weightSchema.optional() }).parse(input);
  const [unit] = await db.select({ id: catalogUnits.id, name: catalogUnits.name, kind: catalogUnits.kind,
    kilogramsPerUnit: catalogUnits.kilogramsPerUnit }).from(catalogUnits).where(and(
    eq(catalogUnits.id, request.id), eq(catalogUnits.organizationId, tenant.organizationId), eq(catalogUnits.isActive, true),
  )).limit(1);
  if (!unit) notFound();
  const kilogramsPerUnit = unit.kind === "bag" ? request.bagWeightKg : unit.kilogramsPerUnit;
  if (!kilogramsPerUnit || (unit.kind !== "bag" && request.bagWeightKg !== undefined)) throw new Error("A bag needs its actual weight; fixed units use their saved weight.");
  return { unitId: unit.id, name: unit.name, kind: unit.kind, kilogramsPerUnit,
    quantity: request.quantity, quantityKg: quantityToKg(request.quantity, kilogramsPerUnit) };
}

import { sql } from "drizzle-orm";
import { boolean, check, numeric, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { businessRoles } from "@/auth/permissions";

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrganizationId: text("clerk_organization_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const catalogUnits = pgTable("catalog_units", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  kind: text("kind", { enum: ["fixed", "bag"] }).notNull(),
  // Unscaled numeric prevents PostgreSQL from silently rounding sub-gram inputs.
  kilogramsPerUnit: numeric("kilograms_per_unit"),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  uniqueIndex("catalog_units_organization_name").on(table.organizationId, sql`lower(btrim(${table.name}))`),
  check("catalog_units_name", sql`${table.name} = btrim(${table.name}) and length(${table.name}) between 1 and 80`),
  check("catalog_units_weight", sql`(${table.kind} = 'bag' and ${table.kilogramsPerUnit} is null) or
    (${table.kind} = 'fixed' and ${table.kilogramsPerUnit} is not null and ${table.kilogramsPerUnit} > 0
    and ${table.kilogramsPerUnit} < 1000000000000000000 and scale(${table.kilogramsPerUnit}) <= 3)`),
]);

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  uniqueIndex("product_categories_organization_name").on(table.organizationId, sql`lower(btrim(${table.name}))`),
  check("product_categories_name", sql`${table.name} = btrim(${table.name}) and length(${table.name}) between 1 and 80`),
]);

export const organizationRoleAssignments = pgTable("organization_role_assignments", {
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  membershipId: text("membership_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role", { enum: businessRoles }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.organizationId, table.membershipId] }),
  check("organization_role_assignments_role", sql`${table.role} in ('owner', 'admin', 'manager', 'warehouse', 'sales', 'accountant', 'viewer')`),
  check("organization_role_assignments_identity", sql`length(btrim(${table.membershipId})) > 0 and length(btrim(${table.userId})) > 0`),
]);

export const organizationSettings = pgTable("organization_settings", {
  organizationId: uuid("organization_id").primaryKey().references(() => organizations.id),
  name: text("name").notNull(),
  businessType: text("business_type").notNull(),
  timezone: text("timezone").notNull(),
  baseCurrency: text("base_currency").notNull(),
  locale: text("locale").notNull(),
}, (table) => [
  check("organization_settings_name", sql`length(btrim(${table.name})) between 1 and 100`),
  check("organization_settings_business_type", sql`length(btrim(${table.businessType})) between 1 and 100`),
  check("organization_settings_timezone", sql`length(${table.timezone}) between 1 and 100`),
  check("organization_settings_currency", sql`${table.baseCurrency} = 'AFN'`),
  check("organization_settings_locale", sql`${table.locale} in ('en-US', 'ps-AF')`),
]);

// One durable request per creator keeps retries tied to the first business.
export const organizationOnboarding = pgTable("organization_onboarding", {
  userId: text("user_id").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),
  clerkOrganizationId: text("clerk_organization_id").unique(),
  ownerMembershipId: text("owner_membership_id"),
  name: text("name").notNull(),
  businessType: text("business_type").notNull(),
  timezone: text("timezone").notNull(),
  baseCurrency: text("base_currency").notNull(),
  locale: text("locale").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

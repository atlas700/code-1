CREATE TABLE "catalog_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"kilograms_per_unit" numeric,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "catalog_units_name" CHECK ("catalog_units"."name" = btrim("catalog_units"."name") and length("catalog_units"."name") between 1 and 80),
	CONSTRAINT "catalog_units_weight" CHECK (("catalog_units"."kind" = 'bag' and "catalog_units"."kilograms_per_unit" is null) or
    ("catalog_units"."kind" = 'fixed' and "catalog_units"."kilograms_per_unit" is not null and "catalog_units"."kilograms_per_unit" > 0
    and "catalog_units"."kilograms_per_unit" < 1000000000000000000 and scale("catalog_units"."kilograms_per_unit") <= 3))
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "product_categories_name" CHECK ("product_categories"."name" = btrim("product_categories"."name") and length("product_categories"."name") between 1 and 80)
);
--> statement-breakpoint
ALTER TABLE "catalog_units" ADD CONSTRAINT "catalog_units_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_units_organization_name" ON "catalog_units" USING btree ("organization_id",lower(btrim("name")));--> statement-breakpoint
CREATE UNIQUE INDEX "product_categories_organization_name" ON "product_categories" USING btree ("organization_id",lower(btrim("name")));
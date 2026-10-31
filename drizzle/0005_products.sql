CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"category_id" uuid,
	"unit_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "products_name" CHECK ("products"."name" = btrim("products"."name") and length("products"."name") between 1 and 80),
	CONSTRAINT "products_sku" CHECK ("products"."sku" is null or ("products"."sku" = btrim("products"."sku") and length("products"."sku") between 1 and 40))
);
--> statement-breakpoint
ALTER TABLE "catalog_units" ADD CONSTRAINT "catalog_units_organization_id" UNIQUE("organization_id","id");--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_organization_id" UNIQUE("organization_id","id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_unit" FOREIGN KEY ("organization_id","unit_id") REFERENCES "public"."catalog_units"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_category" FOREIGN KEY ("organization_id","category_id") REFERENCES "public"."product_categories"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "products_organization_name" ON "products" USING btree ("organization_id",lower(btrim("name")));--> statement-breakpoint
CREATE UNIQUE INDEX "products_organization_sku" ON "products" USING btree ("organization_id",lower(btrim("sku")));

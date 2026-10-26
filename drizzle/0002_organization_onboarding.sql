CREATE TABLE "organization_onboarding" (
	"user_id" text PRIMARY KEY NOT NULL,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"clerk_organization_id" text,
	"name" text NOT NULL,
	"business_type" text NOT NULL,
	"timezone" text NOT NULL,
	"base_currency" text NOT NULL,
	"locale" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_onboarding_id_unique" UNIQUE("id"),
	CONSTRAINT "organization_onboarding_clerk_organization_id_unique" UNIQUE("clerk_organization_id")
);
--> statement-breakpoint
CREATE TABLE "organization_settings" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"business_type" text NOT NULL,
	"timezone" text NOT NULL,
	"base_currency" text NOT NULL,
	"locale" text NOT NULL,
	CONSTRAINT "organization_settings_name" CHECK (length(btrim("organization_settings"."name")) between 1 and 100),
	CONSTRAINT "organization_settings_business_type" CHECK (length(btrim("organization_settings"."business_type")) between 1 and 100),
	CONSTRAINT "organization_settings_timezone" CHECK (length("organization_settings"."timezone") between 1 and 100),
	CONSTRAINT "organization_settings_currency" CHECK ("organization_settings"."base_currency" = 'AFN'),
	CONSTRAINT "organization_settings_locale" CHECK ("organization_settings"."locale" in ('en-US', 'ps-AF'))
);
--> statement-breakpoint
ALTER TABLE "organization_settings" ADD CONSTRAINT "organization_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
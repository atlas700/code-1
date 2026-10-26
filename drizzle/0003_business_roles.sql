CREATE TABLE "organization_role_assignments" (
	"organization_id" uuid NOT NULL,
	"membership_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_role_assignments_organization_id_membership_id_pk" PRIMARY KEY("organization_id","membership_id"),
	CONSTRAINT "organization_role_assignments_role" CHECK ("organization_role_assignments"."role" in ('owner', 'admin', 'manager', 'warehouse', 'sales', 'accountant', 'viewer')),
	CONSTRAINT "organization_role_assignments_identity" CHECK (length(btrim("organization_role_assignments"."membership_id")) > 0 and length(btrim("organization_role_assignments"."user_id")) > 0)
);
--> statement-breakpoint
ALTER TABLE "organization_onboarding" ADD COLUMN "owner_membership_id" text;--> statement-breakpoint
ALTER TABLE "organization_role_assignments" ADD CONSTRAINT "organization_role_assignments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "tenant_context" (
	"org_id" text PRIMARY KEY NOT NULL,
	"basic_info" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"market" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"goals" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);

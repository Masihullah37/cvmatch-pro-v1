ALTER TYPE "public"."plan" ADD VALUE 'one_time' BEFORE 'monthly';--> statement-breakpoint
CREATE TABLE "cv_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"analysis_id" uuid,
	"template_id" uuid,
	"template_style" varchar,
	"template_data" jsonb,
	"pdf_url" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"active_offer" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cv_templates" DROP CONSTRAINT "cv_templates_analysis_id_cv_analyses_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."subscription_status";--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DATA TYPE "public"."subscription_status" USING "subscription_status"::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "cv_analyses" ALTER COLUMN "guest_session_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "cv_analyses" ADD COLUMN "optimized_data" jsonb;--> statement-breakpoint
ALTER TABLE "cv_analyses" ADD COLUMN "detected_platform" varchar(100);--> statement-breakpoint
ALTER TABLE "cv_templates" ADD COLUMN "guest_session_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ai_rewrites_used" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_blocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_analysis_id_cv_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."cv_analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_template_id_cv_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."cv_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_analyses" ADD CONSTRAINT "cv_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_templates" ADD CONSTRAINT "cv_templates_analysis_id_cv_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."cv_analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
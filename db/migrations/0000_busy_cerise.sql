CREATE TYPE "public"."status" AS ENUM('processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('one_time', 'subscription');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'past_due');--> statement-breakpoint
CREATE TABLE "cv_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_session_id" varchar,
	"original_cv_url" varchar,
	"job_url" varchar,
	"user_name" varchar,
	"job_title" varchar,
	"job_description" text,
	"ats_score" integer,
	"score_breakdown" jsonb,
	"flaws" jsonb,
	"suggestions" jsonb,
	"keywords_missing" jsonb,
	"keywords_found" jsonb,
	"status" "status" DEFAULT 'processing',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cv_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid,
	"template_number" integer,
	"template_style" varchar,
	"template_data" jsonb,
	"pdf_url" varchar,
	"is_paid" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guest_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar,
	"ip_address" varchar,
	"user_agent" text,
	"email" varchar,
	"created_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now(),
	CONSTRAINT "guest_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_email" varchar,
	"guest_session_id" varchar,
	"stripe_payment_intent_id" varchar,
	"stripe_session_id" varchar,
	"amount" integer,
	"currency" varchar DEFAULT 'eur',
	"payment_type" "payment_type",
	"template_id" uuid,
	"status" "payment_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar,
	"email" varchar,
	"name" varchar,
	"plan" "plan" DEFAULT 'free',
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"subscription_status" "subscription_status",
	"subscription_ends_at" timestamp,
	"cv_templates_used_this_month" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cv_templates" ADD CONSTRAINT "cv_templates_analysis_id_cv_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."cv_analyses"("id") ON DELETE no action ON UPDATE no action;
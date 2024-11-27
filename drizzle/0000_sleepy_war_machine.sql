CREATE TYPE "public"."DeliveryStatus" AS ENUM('PENDING', 'DELIVERED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."Plan" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" integer NOT NULL,
	"emoji" text,
	"userId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fields" json NOT NULL,
	"formattedMessage" varchar(255) NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"deliveryStatus" "DeliveryStatus" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"eventCategoryId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quotas_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text,
	"quota_limit" integer NOT NULL,
	"plan" "Plan" DEFAULT 'FREE' NOT NULL,
	"email" varchar(255) NOT NULL,
	"api_key" text DEFAULT 'cm3z9l0au0000cwv2folr7yug' NOT NULL,
	"discord_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "event_categories_name_userId_index" ON "event_categories" USING btree ("name","userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_created_at_index" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_api_key_index" ON "users" USING btree ("api_key");
CREATE TYPE "public"."programming_language" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css', 'json', 'yaml', 'markdown', 'bash', 'other');--> statement-breakpoint
CREATE TYPE "public"."roast_mode" AS ENUM('sarcastic', 'constructive');--> statement-breakpoint
CREATE TABLE "code_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"code" text NOT NULL,
	"language" "programming_language" DEFAULT 'other' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"session_id" text NOT NULL,
	"rank" integer NOT NULL,
	"score" numeric(3, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roast_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" numeric(3, 2) NOT NULL,
	"roast_mode" "roast_mode" DEFAULT 'sarcastic' NOT NULL,
	"feedback" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

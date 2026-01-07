ALTER TABLE "user" ALTER COLUMN "numbers_of_repos" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "numbers_of_tasks" integer DEFAULT -1 NOT NULL;
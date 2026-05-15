-- Rename mission_reflection to mission_motivation
ALTER TABLE "applications" RENAME COLUMN "mission_reflection" TO "mission_motivation";

-- Add mission_accepted column
ALTER TABLE "applications" ADD COLUMN "mission_accepted" BOOLEAN NOT NULL DEFAULT false;

-- Add github_link column (optional)
ALTER TABLE "applications" ADD COLUMN "github_link" TEXT;

-- Make availability optional (allow NULL)
ALTER TABLE "applications" ALTER COLUMN "availability" DROP NOT NULL;

-- Add screening form columns
ALTER TABLE "applications" ADD COLUMN "screening_data" JSONB;
ALTER TABLE "applications" ADD COLUMN "screening_completed_at" TIMESTAMPTZ;

-- Add interview form columns
ALTER TABLE "applications" ADD COLUMN "interview_data" JSONB;
ALTER TABLE "applications" ADD COLUMN "interview_completed_at" TIMESTAMPTZ;

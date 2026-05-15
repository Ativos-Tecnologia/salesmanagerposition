-- Adiciona observação opcional ao rejeitar uma candidatura
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "rejection_observation" TEXT;

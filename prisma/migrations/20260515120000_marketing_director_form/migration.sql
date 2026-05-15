-- Migration: Atualiza schema para vaga de Diretor de Marketing
-- Adiciona mission_accepted e torna availability opcional

-- Adicionar coluna mission_accepted (checkbox Etapa 1 - Missão)
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "mission_accepted" BOOLEAN NOT NULL DEFAULT false;

-- Tornar availability opcional (campo removido do novo formulário)
ALTER TABLE "applications" ALTER COLUMN "availability" DROP NOT NULL;

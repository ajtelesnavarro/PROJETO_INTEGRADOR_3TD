
-- =============================================
-- MIGRATION 0002 - AJUSTES NA ESTRUTURA LUMORA
-- =============================================

-- 1. Remover Diego da equipe de suporte
-- Diego continua cadastrado como usuário.

DELETE FROM equipe_usuario
WHERE id_usuario = 4
  AND id_equipe = 2;


-- 2. Adicionar vínculo de quem abriu a ocorrência

ALTER TABLE ocorrencia
ADD COLUMN id_usuario_abertura INT NULL
AFTER id_dispositivo;


-- 3. Criar chave estrangeira para o usuário que abriu a ocorrência

ALTER TABLE ocorrencia
ADD CONSTRAINT fk_ocorrencia_usuario_abertura
FOREIGN KEY (id_usuario_abertura)
REFERENCES usuario(id_usuario);

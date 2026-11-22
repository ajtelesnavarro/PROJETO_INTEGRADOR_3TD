
-- =============================================
-- MIGRATION 0002 - AJUSTES NA ESTRUTURA LUMORA
-- =============================================

-- 1. Adicionar tipo de empreendimento aos prédios

ALTER TABLE predio
ADD COLUMN tipo_empreendimento ENUM(
    'Comercial',
    'Corporativo',
    'Residencial',
    'Outro'
) NOT NULL DEFAULT 'Outro';


-- 2. Classificar os prédios de exemplo

UPDATE predio
SET tipo_empreendimento = CASE id_predio
    WHEN 1 THEN 'Corporativo'
    WHEN 2 THEN 'Comercial'
    WHEN 3 THEN 'Comercial'
    WHEN 4 THEN 'Corporativo'
    ELSE 'Outro'
END
WHERE id_predio IN (1, 2, 3, 4);


-- 3. Remover o valor padrão do tipo de empreendimento

ALTER TABLE predio
MODIFY COLUMN tipo_empreendimento ENUM(
    'Comercial',
    'Corporativo',
    'Residencial',
    'Outro'
) NOT NULL;


-- 4. Remover Diego da equipe de suporte
-- Diego continua cadastrado como usuário.

DELETE FROM equipe_usuario
WHERE id_usuario = 4
  AND id_equipe = 2;


-- 5. Adicionar vínculo de quem abriu a ocorrência

ALTER TABLE ocorrencia
ADD COLUMN id_usuario_abertura INT NULL
AFTER id_dispositivo;


-- 6. Criar chave estrangeira para o usuário que abriu a ocorrência

ALTER TABLE ocorrencia
ADD CONSTRAINT fk_ocorrencia_usuario_abertura
FOREIGN KEY (id_usuario_abertura)
REFERENCES usuario(id_usuario);

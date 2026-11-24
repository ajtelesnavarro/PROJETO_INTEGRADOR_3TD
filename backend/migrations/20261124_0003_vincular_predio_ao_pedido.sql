-- Garante o tipo de empreendimento em bancos que ainda não aplicaram a migration 0002.
SET @lumora_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'predio'
       AND column_name = 'tipo_empreendimento') = 0,
    'ALTER TABLE predio ADD COLUMN tipo_empreendimento ENUM(''Comercial'', ''Corporativo'', ''Residencial'', ''Outro'') NOT NULL DEFAULT ''Outro''',
    'SELECT 1'
);
PREPARE lumora_stmt FROM @lumora_sql;
EXECUTE lumora_stmt;
DEALLOCATE PREPARE lumora_stmt;

-- Associar o prédio criado após o pagamento ao pedido correspondente.
SET @lumora_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'pedido'
       AND column_name = 'id_predio') = 0,
    'ALTER TABLE pedido ADD COLUMN id_predio INT NULL UNIQUE, ADD CONSTRAINT fk_pedido_predio FOREIGN KEY (id_predio) REFERENCES predio(id_predio)',
    'SELECT 1'
);
PREPARE lumora_stmt FROM @lumora_sql;
EXECUTE lumora_stmt;
DEALLOCATE PREPARE lumora_stmt;

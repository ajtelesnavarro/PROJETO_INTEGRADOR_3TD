-- Remove a classificação de tipo do cadastro de prédios.
SET @lumora_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'predio'
       AND column_name = 'tipo_empreendimento') > 0,
    'ALTER TABLE predio DROP COLUMN tipo_empreendimento',
    'SELECT 1'
);
PREPARE lumora_stmt FROM @lumora_sql;
EXECUTE lumora_stmt;
DEALLOCATE PREPARE lumora_stmt;

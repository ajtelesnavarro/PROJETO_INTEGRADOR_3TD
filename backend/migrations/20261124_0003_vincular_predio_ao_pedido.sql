-- Associa o prédio criado após o pagamento ao pedido correspondente.
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

-- Permite criar um contato de orçamento sem prédio, CPF ou senha.
-- O usuário só poderá autenticar depois que uma senha for definida.
ALTER TABLE usuario
    MODIFY COLUMN id_predio INT NULL,
    MODIFY COLUMN cpf CHAR(11) NULL,
    MODIFY COLUMN senha_hash VARCHAR(255) NULL;

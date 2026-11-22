USE db_lumora;

-- 1. Visitante passa a ser Locador.
UPDATE usuario SET perfil = 'locador' WHERE perfil = 'visitante';

ALTER TABLE usuario
MODIFY COLUMN perfil ENUM(
    'administrador',
    'manutencao',
    'porteiro',
    'locador'
) NOT NULL DEFAULT 'locador';

-- 2. Registro de versão do sistema (RF-017/RF-018).
CREATE TABLE IF NOT EXISTS versao_sistema (
    id_versao INT AUTO_INCREMENT PRIMARY KEY,
    versao VARCHAR(30) NOT NULL,
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notas TEXT NULL
) ENGINE=InnoDB;

INSERT INTO versao_sistema (versao, notas)
SELECT '2.0.0', 'Controle de acesso por perfil: Administrador, Manutenção, Porteiro e Locador; integração com histórico e painel.'
WHERE NOT EXISTS (SELECT 1 FROM versao_sistema WHERE versao = '2.0.0');

-- 3. Impede que o perfil legado volte a ser criado.
-- A aplicação também valida o perfil no JWT e nas rotas.

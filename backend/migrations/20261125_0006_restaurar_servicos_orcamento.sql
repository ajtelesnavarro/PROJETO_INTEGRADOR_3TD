-- Sincroniza o catálogo de serviços do banco existente com
-- database/init/01-schema.sql sem sobrescrever preços já cadastrados.

CREATE TABLE IF NOT EXISTS servico (
    id_servico INT AUTO_INCREMENT PRIMARY KEY,
    nome_servico ENUM(
        'monitoramento_temperatura',
        'controle_iluminacao',
        'monitoramento_energia',
        'controle_acesso',
        'monitoramento_dispositivos'
    ) NOT NULL,
    valor_base DECIMAL(12,2) NOT NULL,
    descricao VARCHAR(255) NULL,
    CONSTRAINT uk_nome_servico UNIQUE (nome_servico),
    CONSTRAINT chk_valor_base_servico CHECK (valor_base >= 0)
) ENGINE=InnoDB;

INSERT IGNORE INTO servico (nome_servico, descricao, valor_base) VALUES
('monitoramento_temperatura', 'Monitoramento da temperatura dos ambientes e identificacao de alteracoes fora dos limites configurados.', 1500.00),
('controle_iluminacao', 'Monitoramento dos niveis de iluminacao dos ambientes conforme os limites definidos.', 2000.00),
('monitoramento_energia', 'Acompanhamento do consumo e da potencia eletrica, com estimativa de custos de energia.', 1800.00),
('controle_acesso', 'Gerenciamento de credenciais, permissoes e registros de entrada e saida dos ambientes.', 2500.00),
('monitoramento_dispositivos', 'Acompanhamento do funcionamento e do status dos dispositivos instalados no predio.', 1200.00);

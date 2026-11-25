-- Restaura o catálogo de serviços e os vínculos dos serviços aos orçamentos.
-- CREATE IF NOT EXISTS permite aplicar a migração em bancos já parcialmente atualizados.

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
('monitoramento_temperatura', 'Monitoramento da temperatura dos ambientes e identificação de alterações fora dos limites configurados.', 1500.00),
('controle_iluminacao', 'Monitoramento dos níveis de iluminação dos ambientes conforme os limites definidos.', 2000.00),
('monitoramento_energia', 'Acompanhamento do consumo e da potência elétrica, com estimativa de custos de energia.', 1800.00),
('controle_acesso', 'Gerenciamento de credenciais, permissões e registros de entrada e saída dos ambientes.', 2500.00),
('monitoramento_dispositivos', 'Acompanhamento do funcionamento e do status dos dispositivos instalados no prédio.', 1200.00);

CREATE TABLE IF NOT EXISTS orcamento_servico (
    id_orcamento INT NOT NULL,
    id_servico INT NOT NULL,
    valor_servico DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id_orcamento, id_servico),
    CONSTRAINT fk_orcamento_servico_orcamento
        FOREIGN KEY (id_orcamento) REFERENCES orcamento(id_orcamento),
    CONSTRAINT fk_orcamento_servico_servico
        FOREIGN KEY (id_servico) REFERENCES servico(id_servico),
    CONSTRAINT chk_valor_servico CHECK (valor_servico >= 0)
) ENGINE=InnoDB;

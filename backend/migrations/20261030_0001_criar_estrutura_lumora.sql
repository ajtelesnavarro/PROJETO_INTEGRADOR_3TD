
CREATE DATABASE IF NOT EXISTS db_lumora
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_lumora;

-- 1. PREDIO

CREATE TABLE predio (
    id_predio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_predio VARCHAR(100) NOT NULL,
    cep CHAR(9) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,

    INDEX idx_cep (cep)
) ENGINE=InnoDB;


-- 2. ANDAR

CREATE TABLE andar (
    id_andar INT AUTO_INCREMENT PRIMARY KEY,
    id_predio INT NOT NULL,
    numero_andar INT NOT NULL,
    descricao VARCHAR(255) NULL,
    data_cadastro DATE NULL,

    CONSTRAINT fk_andar_predio
        FOREIGN KEY (id_predio)
        REFERENCES predio(id_predio),

    CONSTRAINT uk_andar_predio_numero
        UNIQUE (id_predio, numero_andar)
) ENGINE=InnoDB;


-- 3. USUARIO

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_predio INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,

    perfil ENUM(
        'administrador',
        'manutencao',
        'porteiro',
        'visitante'
    ) NOT NULL DEFAULT 'visitante',

    cpf CHAR(11) NOT NULL,
    foto VARCHAR(255) NULL,
    data_nascimento DATE NULL,

    ativo ENUM(
        'ativo',
        'inativo'
    ) NOT NULL DEFAULT 'ativo',

    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT uk_usuario_cpf UNIQUE (cpf),
    CONSTRAINT uk_usuario_predio UNIQUE (id_usuario, id_predio),

    CONSTRAINT fk_usuario_predio
        FOREIGN KEY (id_predio)
        REFERENCES predio(id_predio)
) ENGINE=InnoDB;


-- 4. SETOR

CREATE TABLE setor (
    id_setor INT AUTO_INCREMENT PRIMARY KEY,
    id_andar INT NOT NULL,
    nome_setor VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,
    id_usuario_responsavel INT NULL,

    CONSTRAINT fk_setor_usuario_responsavel
        FOREIGN KEY (id_usuario_responsavel)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_setor_andar
        FOREIGN KEY (id_andar)
        REFERENCES andar(id_andar),

    CONSTRAINT uk_setor_andar
        UNIQUE (id_andar, nome_setor),

    CONSTRAINT uk_setor_id_andar
        UNIQUE (id_setor, id_andar)
) ENGINE=InnoDB;


-- 5. AMBIENTE

CREATE TABLE ambiente (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
    id_andar INT NOT NULL,
    id_setor INT NULL,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    capacidade_maxima INT NULL,
    horario_abertura TIME NOT NULL,
    horario_fechamento TIME NOT NULL,

    CONSTRAINT fk_ambiente_andar
        FOREIGN KEY (id_andar)
        REFERENCES andar(id_andar),

    CONSTRAINT fk_ambiente_setor
        FOREIGN KEY (id_setor, id_andar)
        REFERENCES setor(id_setor, id_andar),

    CONSTRAINT chk_capacidade
        CHECK (
            capacidade_maxima IS NULL
            OR capacidade_maxima > 0
        ),

    CONSTRAINT chk_horario_ambiente
        CHECK (horario_fechamento > horario_abertura)
) ENGINE=InnoDB;


-- 6. EQUIPE

CREATE TABLE equipe (
    id_equipe INT AUTO_INCREMENT PRIMARY KEY,
    id_predio INT NOT NULL,
    nome_equipe VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,

    status ENUM(
        'ativa',
        'inativa'
    ) NOT NULL DEFAULT 'ativa',

    CONSTRAINT fk_equipe_predio
        FOREIGN KEY (id_predio)
        REFERENCES predio(id_predio),

    CONSTRAINT uk_equipe_predio
        UNIQUE (id_equipe, id_predio)
) ENGINE=InnoDB;


-- 7. EQUIPE_USUARIO

CREATE TABLE equipe_usuario (
    id_equipe_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_equipe INT NOT NULL,
    id_usuario INT NOT NULL,
    id_predio INT NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE NULL,

    CONSTRAINT fk_equipe_usuario_equipe
        FOREIGN KEY (id_equipe, id_predio)
        REFERENCES equipe(id_equipe, id_predio),

    CONSTRAINT fk_equipe_usuario_usuario
        FOREIGN KEY (id_usuario, id_predio)
        REFERENCES usuario(id_usuario, id_predio),

    UNIQUE (id_equipe, id_usuario),

    CHECK (
        data_saida IS NULL
        OR data_saida >= data_entrada
    )
) ENGINE=InnoDB;


-- 8. DISPOSITIVO

CREATE TABLE dispositivo (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario INT NULL,
    nome VARCHAR(100) NOT NULL,

    tipo_dispositivo ENUM(
        'energia',
        'iluminacao',
        'temperatura'
    ) NOT NULL,

    fabricante VARCHAR(100) NULL,
    modelo VARCHAR(100) NULL,

    unidade_medida ENUM(
        'kWh',
        'lux',
        '°C'
    ) NULL,

    potencia_nominal_kw DECIMAL(10,4) NULL,
    data_dispositivo DATE NULL,

    status_dispositivo ENUM(
        'ativo',
        'instavel',
        'manutencao',
        'inativo',
        'offline'
    ) NOT NULL DEFAULT 'ativo',

    CONSTRAINT fk_dispositivo_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_dispositivo_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- 9. TEMPERATURA

CREATE TABLE temperatura (
    id_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    temperatura_minima DECIMAL(5,2) NOT NULL,
    temperatura_maxima DECIMAL(5,2) NOT NULL,

    CONSTRAINT uk_temperatura_ambiente
        UNIQUE (id_ambiente),

    CONSTRAINT fk_temperatura_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_temperatura_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_temperatura
        CHECK (temperatura_minima <= temperatura_maxima)
) ENGINE=InnoDB;


-- 10. ILUMINACAO

CREATE TABLE iluminacao (
    id_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    iluminacao_minima DECIMAL(10,2) NOT NULL,
    iluminacao_maxima DECIMAL(10,2) NOT NULL,

    CONSTRAINT uk_iluminacao_ambiente
        UNIQUE (id_ambiente),

    CONSTRAINT fk_iluminacao_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_iluminacao_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_iluminacao
        CHECK (
            iluminacao_minima >= 0
            AND iluminacao_minima <= iluminacao_maxima
        )
) ENGINE=InnoDB;


-- 11. ENERGIA

CREATE TABLE energia (
    id_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    consumo_minimo DECIMAL(12,4) NOT NULL,
    consumo_maximo DECIMAL(12,4) NOT NULL,
    potencia_maxima DECIMAL(10,4) NOT NULL,

    CONSTRAINT uk_energia_ambiente
        UNIQUE (id_ambiente),

    CONSTRAINT fk_energia_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_energia_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_consumo
        CHECK (
            consumo_minimo >= 0
            AND consumo_minimo <= consumo_maximo
        ),

    CONSTRAINT chk_potencia_maxima
        CHECK (potencia_maxima >= 0)
) ENGINE=InnoDB;


-- 12. TARIFA_ENERGIA

CREATE TABLE tarifa_energia (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_alteracao INT NULL,
    id_predio INT NOT NULL,
    valor_kwh DECIMAL(10,4) NOT NULL,
    data_inicio_vigencia DATE NOT NULL,
    data_fim_vigencia DATE NULL,

    CONSTRAINT fk_tarifa_energia_predio
        FOREIGN KEY (id_predio)
        REFERENCES predio(id_predio),

    CONSTRAINT fk_tarifa_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_valor_tarifa
        CHECK (valor_kwh >= 0),

    CONSTRAINT chk_vigencia_tarifa
        CHECK (
            data_fim_vigencia IS NULL
            OR data_fim_vigencia >= data_inicio_vigencia
        )
) ENGINE=InnoDB;


-- 13. HISTORICO_TEMPERATURA

CREATE TABLE historico_temperatura (
    id_historico_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    temperatura_medida DECIMAL(5,2) NOT NULL,
    umidade DECIMAL(5,2) NULL,
    data_temperatura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_temperatura_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_umidade
        CHECK (
            umidade IS NULL
            OR (umidade >= 0 AND umidade <= 100)
        )
) ENGINE=InnoDB;


-- 14. HISTORICO_ILUMINACAO

CREATE TABLE historico_iluminacao (
    id_historico_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    iluminacao_medida DECIMAL(10,2) NOT NULL,
    data_iluminacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_iluminacao_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_iluminacao_medida
        CHECK (iluminacao_medida >= 0)
) ENGINE=InnoDB;


-- 15. HISTORICO_ENERGIA

CREATE TABLE historico_energia (
    id_historico_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_tarifa INT NULL,
    consumo_kwh DECIMAL(12,4) NOT NULL,
    potencia_kw DECIMAL(10,4) NOT NULL,
    custo_estimado DECIMAL(12,2) NULL,

    qualidade_medicao ENUM(
        'boa',
        'regular',
        'ruim'
    ) NULL,

    data_historico_energia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_energia_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_hist_energia_tarifa
        FOREIGN KEY (id_tarifa)
        REFERENCES tarifa_energia(id_tarifa),

    CONSTRAINT chk_consumo_energia
        CHECK (consumo_kwh >= 0),

    CONSTRAINT chk_potencia_energia
        CHECK (potencia_kw >= 0),

    CONSTRAINT chk_custo_energia
        CHECK (
            custo_estimado IS NULL
            OR custo_estimado >= 0
        )
) ENGINE=InnoDB;


-- 16. CREDENCIAIS_ACESSO

CREATE TABLE credenciais_acesso (
    id_credencial INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,

    status ENUM(
        'ativa',
        'bloqueada',
        'expirada'
    ) NOT NULL DEFAULT 'ativa',

    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    token_hash CHAR(64) NOT NULL,

    tipo_credencial ENUM(
        'cartao_rfid',
        'tag_nfc',
        'qr_code'
    ) NOT NULL,

    bloqueado_ate DATETIME NULL,

    CONSTRAINT uk_credencial_token_hash
        UNIQUE (token_hash),

    CONSTRAINT fk_credencial_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;


-- 17. PERMISSAO_ACESSO

CREATE TABLE permissao_acesso (
    id_permissao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_ambiente INT NOT NULL,
    horario_inicio TIME NULL,
    horario_fim TIME NULL,

    status_permissao ENUM(
        'ativa',
        'inativa',
        'suspensa',
        'expirada'
    ) NOT NULL DEFAULT 'ativa',

    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    dias_semana VARCHAR(100) NULL,

    CONSTRAINT fk_permissao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_permissao_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT chk_vigencia_permissao
        CHECK (
            data_fim IS NULL
            OR data_fim >= data_inicio
        ),

    CONSTRAINT chk_horario_permissao
        CHECK (
            horario_inicio IS NULL
            OR horario_fim IS NULL
            OR horario_fim > horario_inicio
        )
) ENGINE=InnoDB;


-- 18. EVENTOS_ACESSOS

CREATE TABLE eventos_acessos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_credencial INT NULL,
    id_ambiente INT NOT NULL,

    tipo_acesso ENUM(
        'entrada',
        'saida'
    ) NOT NULL,

    decisao_acesso ENUM(
        'permitido',
        'negado'
    ) NOT NULL,

    token_tentado CHAR(64) NULL,

    status_evento ENUM(
        'processando',
        'concluido',
        'pendente',
        'falha_comunicacao',
        'bloqueado',
        'falha'
    ) NOT NULL DEFAULT 'pendente',

    data_expiracao DATETIME NULL,
    data_utilizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    motivo ENUM(
        'acesso_autorizado',
        'acesso_de_manutencao',
        'saida_registrada',
        'credencial_bloqueada',
        'credencial_expirada',
        'token_nao_reconhecido',
        'sem_permissao',
        'fora_do_horario_permitido',
        'ambiente_restrito',
        'falha_na_validacao',
        'falha_de_comunicacao'
    ) NULL,

    CONSTRAINT fk_evento_credencial
        FOREIGN KEY (id_credencial)
        REFERENCES credenciais_acesso(id_credencial),

    CONSTRAINT fk_evento_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente)
) ENGINE=InnoDB;


-- 19. RECLAMACOES

CREATE TABLE reclamacoes (
    id_reclamacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_abertura INT NOT NULL,
    id_ambiente INT NULL,
    id_dispositivo INT NULL,
    id_usuario_responsavel INT NULL,

    status_chamado ENUM(
        'aberto',
        'em_andamento',
        'concluido',
        'cancelado'
    ) NOT NULL DEFAULT 'aberto',

    data_hora_recebido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao_usuario TEXT NOT NULL,

    prioridade ENUM(
        'baixa',
        'media',
        'alta'
    ) NOT NULL DEFAULT 'media',

    categoria_problema ENUM(
        'climatizacao',
        'iluminacao',
        'acesso',
        'energia',
        'dispositivo',
        'outro'
    ) NULL,

    CONSTRAINT fk_reclamacao_abertura
        FOREIGN KEY (id_usuario_abertura)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_reclamacao_ambiente
        FOREIGN KEY (id_ambiente)
        REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_reclamacao_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_reclamacao_responsavel
        FOREIGN KEY (id_usuario_responsavel)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_reclamacao_local
        CHECK (
            id_ambiente IS NOT NULL
            OR id_dispositivo IS NOT NULL
        )
) ENGINE=InnoDB;


-- 20. OCORRENCIA

CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_equipe_responsavel INT NULL,
    id_tecnico_responsavel INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,

    status_ocorrencia ENUM(
        'aberta',
        'em_andamento',
        'resolvida',
        'cancelada'
    ) NOT NULL DEFAULT 'aberta',

    prioridade ENUM(
        'baixa',
        'media',
        'alta'
    ) NOT NULL DEFAULT 'media',

    data_ocorrencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolvida_em DATETIME NULL,

    CONSTRAINT fk_ocorrencia_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_ocorrencia_equipe
        FOREIGN KEY (id_equipe_responsavel)
        REFERENCES equipe(id_equipe),

    CONSTRAINT fk_ocorrencia_tecnico
        FOREIGN KEY (id_tecnico_responsavel)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_data_resolucao
        CHECK (
            resolvida_em IS NULL
            OR resolvida_em >= data_ocorrencia
        )
) ENGINE=InnoDB;


-- 21. HISTORICO_OCORRENCIA

CREATE TABLE historico_ocorrencia (
    id_historico_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    id_usuario INT NULL,
    data_historico_ocorrencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT NULL,

    status_anterior ENUM(
        'aberta',
        'em_andamento',
        'resolvida',
        'cancelada'
    ) NULL,

    status_posterior ENUM(
        'aberta',
        'em_andamento',
        'resolvida',
        'cancelada'
    ) NOT NULL,

    CONSTRAINT fk_hist_ocorrencia_ocorrencia
        FOREIGN KEY (id_ocorrencia)
        REFERENCES ocorrencia(id_ocorrencia),

    CONSTRAINT fk_hist_ocorrencia_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;


-- 22. HISTORICO_DISPOSITIVO

CREATE TABLE historico_dispositivo (
    id_historico_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,

    status_dispositivo ENUM(
        'ativo',
        'instavel',
        'manutencao',
        'inativo',
        'offline'
    ) NOT NULL,

    data_historico_dispositivo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_inicio_status DATETIME NOT NULL,
    data_fim_status DATETIME NULL,
    motivo VARCHAR(255) NULL,
    consumo_estimado_kwh DECIMAL(12,4) NULL,
    custo_estimado DECIMAL(12,2) NULL,
    observacao TEXT NULL,

    CONSTRAINT fk_hist_dispositivo_dispositivo
        FOREIGN KEY (id_dispositivo)
        REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_periodo_dispositivo
        CHECK (
            data_fim_status IS NULL
            OR data_fim_status >= data_inicio_status
        ),

    CONSTRAINT chk_consumo_estimado
        CHECK (
            consumo_estimado_kwh IS NULL
            OR consumo_estimado_kwh >= 0
        ),

    CONSTRAINT chk_custo_estimado
        CHECK (
            custo_estimado IS NULL
            OR custo_estimado >= 0
        )
) ENGINE=InnoDB;


-- 23. SERVICO

CREATE TABLE servico (
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

    CONSTRAINT uk_nome_servico
        UNIQUE (nome_servico),

    CONSTRAINT chk_valor_base_servico
        CHECK (valor_base >= 0)
) ENGINE=InnoDB;


-- 24. ORCAMENTO

CREATE TABLE orcamento (
    id_orcamento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    nome_responsavel VARCHAR(150) NOT NULL,
    nome_empresa VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    quantidade_andares INT NOT NULL,
    quantidade_ambientes INT NOT NULL,
    quantidade_dispositivos INT NULL,
    descricao TEXT NULL,
    valor_subtotal DECIMAL(12,2) NULL,
    valor_desconto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(12,2) NULL,
    prazo_estimado_dias INT NULL,
    data_solicitacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_validade DATE NULL,

    status_orcamento ENUM(
        'solicitado',
        'em_analise',
        'enviado',
        'aprovado',
        'recusado',
        'expirado'
    ) NOT NULL DEFAULT 'solicitado',

    CONSTRAINT fk_orcamento_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL,

    CONSTRAINT chk_quantidade_andares
        CHECK (quantidade_andares > 0),

    CONSTRAINT chk_quantidade_ambientes
        CHECK (quantidade_ambientes > 0),

    CONSTRAINT chk_quantidade_dispositivos
        CHECK (
            quantidade_dispositivos IS NULL
            OR quantidade_dispositivos >= 0
        ),

    CONSTRAINT chk_valores_orcamento
        CHECK (
            (valor_subtotal IS NULL OR valor_subtotal >= 0)
            AND valor_desconto >= 0
            AND (valor_total IS NULL OR valor_total >= 0)
            AND (
                valor_subtotal IS NULL
                OR valor_desconto <= valor_subtotal
            )
            AND (
                valor_subtotal IS NULL
                OR valor_total IS NULL
                OR valor_total = valor_subtotal - valor_desconto
            )
        ),

    CONSTRAINT chk_prazo_orcamento
        CHECK (
            prazo_estimado_dias IS NULL
            OR prazo_estimado_dias >= 0
        )
) ENGINE=InnoDB;


-- 25. ORCAMENTO_SERVICO

CREATE TABLE orcamento_servico (
    id_orcamento INT NOT NULL,
    id_servico INT NOT NULL,
    valor_servico DECIMAL(12,2) NOT NULL,

    PRIMARY KEY (id_orcamento, id_servico),

    CONSTRAINT fk_orcamento_servico_orcamento
        FOREIGN KEY (id_orcamento)
        REFERENCES orcamento(id_orcamento),

    CONSTRAINT fk_orcamento_servico_servico
        FOREIGN KEY (id_servico)
        REFERENCES servico(id_servico),

    CONSTRAINT chk_valor_servico
        CHECK (valor_servico >= 0)
) ENGINE=InnoDB;


-- 26. PEDIDO

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_orcamento INT NOT NULL UNIQUE,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_contratado DECIMAL(12,2) NOT NULL,

    status_pedido ENUM(
        'aguardando_pagamento',
        'confirmado',
        'pagamento_recusado',
        'cancelado'
    ) NOT NULL DEFAULT 'aguardando_pagamento',

    observacoes TEXT NULL,

    CONSTRAINT fk_pedido_orcamento
        FOREIGN KEY (id_orcamento)
        REFERENCES orcamento(id_orcamento),

    CONSTRAINT chk_valor_contratado
        CHECK (valor_contratado >= 0)
) ENGINE=InnoDB;


-- 27. PAGAMENTO

CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    valor_pago DECIMAL(12,2) NOT NULL,

    metodo_pagamento ENUM(
        'pix',
        'cartao_credito',
        'cartao_debito',
        'boleto',
        'transferencia'
    ) NOT NULL,

    status_pagamento ENUM(
        'pendente',
        'aprovado',
        'recusado',
        'estornado'
    ) NOT NULL DEFAULT 'pendente',

    codigo_transacao VARCHAR(150) NULL,
    data_pagamento DATETIME NULL,

    CONSTRAINT fk_pagamento_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido),

    CONSTRAINT chk_valor_pago
        CHECK (valor_pago > 0)
) ENGINE=InnoDB;


-- 28. INDICES

CREATE INDEX idx_dispositivo_status
    ON dispositivo(status_dispositivo);

CREATE INDEX idx_hist_temperatura_data
    ON historico_temperatura(data_temperatura);

CREATE INDEX idx_hist_iluminacao_data
    ON historico_iluminacao(data_iluminacao);

CREATE INDEX idx_hist_energia_data
    ON historico_energia(data_historico_energia);

CREATE INDEX idx_eventos_acessos_data
    ON eventos_acessos(data_utilizacao);

CREATE INDEX idx_permissao_usuario_ambiente
    ON permissao_acesso(id_usuario, id_ambiente);

CREATE INDEX idx_ocorrencia_status
    ON ocorrencia(status_ocorrencia);

CREATE INDEX idx_ocorrencia_data
    ON ocorrencia(data_ocorrencia);

CREATE INDEX idx_reclamacao_status
    ON reclamacoes(status_chamado);

CREATE INDEX idx_hist_ocorrencia_data
    ON historico_ocorrencia(data_historico_ocorrencia);


-- REGISTROS


-- PREDIO

INSERT INTO predio
(id_predio, nome_predio, cep, logradouro, numero, complemento, bairro, cidade, estado)
VALUES
(1, 'Edificio Empresarial Central', '09080-500', 'Rua das Acacias', '120', NULL, 'Jardim', 'Santo Andre', 'SP'),
(2, 'Centro Empresarial Horizonte', '09020-110', 'Avenida Portugal', '450', 'Bloco A', 'Centro', 'Santo Andre', 'SP'),
(3, 'Edificio Comercial Nova Era', '09110-300', 'Rua das Figueiras', '780', NULL, 'Campestre', 'Santo Andre', 'SP'),
(4, 'Condominio Empresarial Park', '09210-050', 'Avenida Industrial', '950', 'Torre 2', 'Jardim', 'Santo Andre', 'SP');


-- ANDAR

INSERT INTO andar
(id_andar, id_predio, numero_andar, descricao, data_cadastro)
VALUES
(1, 1, 1, 'Recepcao e salas administrativas', '2024-01-10'),
(2, 1, 2, 'Salas de reuniao', '2024-01-10'),
(3, 1, 3, 'Area de atendimento', '2024-02-15'),
(4, 1, 4, 'Escritorios administrativos', '2024-03-20'),
(5, 1, 5, 'Laboratorio de tecnologia', '2024-04-05');


-- USUARIO

INSERT INTO usuario
(id_usuario, id_predio, nome, email, senha_hash, telefone, perfil, cpf, foto, data_nascimento, ativo)
VALUES
-- Perfil: Administrador | Senha teste: 12345678 | Hash: $2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r
(1, 1, 'Ana Souza', 'ana.souza@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1001', 'administrador', '12345678901', NULL, '1988-04-12', 'ativo'),

-- Perfil: Manutenção | Senha teste: 12345678 | Hash: $2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r
(2, 1, 'Bruno Lima', 'bruno.lima@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1002', 'manutencao', '12345678902', NULL, '1990-08-21', 'ativo'),

-- Perfil: Porteiro | Senha teste: 12345678 | Hash: $2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r
(3, 1, 'Carla Mendes', 'carla.mendes@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1003', 'porteiro', '12345678903', NULL, '1995-02-03', 'ativo'),

-- Perfil: Secretaria | Senha teste: 12345678 | Hash: $2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r
(4, 1, 'Diego Alves', 'diego.alves@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1004', 'secretaria', '12345678904', NULL, '1992-11-17', 'ativo'),

-- Perfil: Visitante | Senha teste: 12345678 | Hash: $2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r
(5, 1, 'Elisa Costa', 'elisa.costa@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', NULL, 'visitante', '12345678905', NULL, '2000-06-25', 'ativo');


-- SETOR

INSERT INTO setor
(id_setor, id_andar, nome_setor, descricao, id_usuario_responsavel)
VALUES
(1, 1, 'Recepcao', 'Setor de atendimento e controle de entrada', 1),
(2, 2, 'Reunioes', 'Setor de salas de reuniao', 1),
(3, 3, 'Atendimento', 'Setor de atendimento ao publico', 3),
(4, 4, 'Administracao', 'Setor administrativo', 1),
(5, 5, 'Tecnologia', 'Setor de laboratorio e tecnologia', 2);


-- AMBIENTE

INSERT INTO ambiente
(id_ambiente, id_andar, id_setor, nome, localizacao, capacidade_maxima, horario_abertura, horario_fechamento)
VALUES
(1, 1, 1, 'Recepcao', 'Proximo a entrada principal', 20, '07:00:00', '19:00:00'),
(2, 2, 2, 'Sala de reunioes A', 'Ala norte', 12, '08:00:00', '20:00:00'),
(3, 3, 3, 'Sala de atendimento', 'Ao lado dos elevadores', 15, '08:00:00', '18:00:00'),
(4, 4, 4, 'Escritorio administrativo', 'Ala leste', 30, '07:00:00', '19:00:00'),
(5, 5, 5, 'Laboratorio de tecnologia', 'Area restrita', 18, '08:00:00', '22:00:00');


-- EQUIPE

INSERT INTO equipe
(id_equipe, id_predio, nome_equipe, descricao, status)
VALUES
(1, 1, 'Manutencao predial', 'Equipe responsavel por manutencao dos ambientes e dispositivos', 'ativa'),
(2, 1, 'Suporte tecnico', 'Equipe responsavel por suporte e verificacao tecnica', 'ativa');


-- EQUIPE_USUARIO

INSERT INTO equipe_usuario
(id_equipe_usuario, id_equipe, id_usuario, id_predio, data_entrada, data_saida)
VALUES
(1, 1, 2, 1, '2024-02-01', NULL),
(2, 2, 2, 1, '2024-02-01', NULL),
(3, 2, 4, 1, '2024-02-10', NULL);


-- DISPOSITIVO

INSERT INTO dispositivo
(id_dispositivo, id_ambiente, id_usuario, nome, tipo_dispositivo, fabricante, modelo, unidade_medida, potencia_nominal_kw, data_dispositivo, status_dispositivo)
VALUES
(1, 1, 2, 'Sensor de temperatura da recepcao', 'temperatura', 'SensTech', 'ST-T100', '°C', 0.0120, '2024-05-10', 'ativo'),
(2, 2, 2, 'Sensor de iluminacao da sala A', 'iluminacao', 'LumenPro', 'LP-200', 'lux', 0.0080, '2024-05-12', 'ativo'),
(3, 3, 2, 'Medidor de energia do atendimento', 'energia', 'EnerMeter', 'EM-300', 'kWh', 0.0150, '2024-06-01', 'instavel'),
(4, 4, 2, 'Sensor de temperatura do escritorio', 'temperatura', 'SensTech', 'ST-T100', '°C', 0.0120, '2024-06-15', 'ativo'),
(5, 5, 2, 'Sensor de iluminacao do laboratorio', 'iluminacao', 'LumenPro', 'LP-250', 'lux', 0.0090, '2024-07-01', 'ativo');


-- TEMPERATURA

INSERT INTO temperatura
(id_temperatura, id_ambiente, id_usuario_alteracao, temperatura_minima, temperatura_maxima)
VALUES
(1, 1, 1, 20.00, 26.00),
(2, 2, 1, 19.00, 25.00),
(3, 3, 1, 20.00, 27.00),
(4, 4, 1, 20.00, 26.00),
(5, 5, 1, 18.00, 24.00);


-- ILUMINACAO

INSERT INTO iluminacao
(id_iluminacao, id_ambiente, id_usuario_alteracao, iluminacao_minima, iluminacao_maxima)
VALUES
(1, 1, 1, 150.00, 500.00),
(2, 2, 1, 300.00, 750.00),
(3, 3, 1, 200.00, 600.00),
(4, 4, 1, 300.00, 700.00),
(5, 5, 1, 500.00, 1000.00);


-- ENERGIA

INSERT INTO energia
(id_energia, id_ambiente, id_usuario_alteracao, consumo_minimo, consumo_maximo, potencia_maxima)
VALUES
(1, 1, 1, 0.1000, 12.0000, 3.5000),
(2, 2, 1, 0.2000, 18.0000, 5.0000),
(3, 3, 1, 0.1500, 15.0000, 4.0000),
(4, 4, 1, 0.3000, 25.0000, 7.5000),
(5, 5, 1, 0.5000, 40.0000, 12.0000);


-- TARIFA_ENERGIA

INSERT INTO tarifa_energia
(id_tarifa, id_usuario_alteracao, id_predio, valor_kwh, data_inicio_vigencia, data_fim_vigencia)
VALUES
(1, 1, 1, 0.7350, '2026-01-01', NULL),
(2, 1, 1, 0.7210, '2025-07-01', '2025-12-31'),
(3, 1, 1, 0.6980, '2025-01-01', '2025-06-30'),
(4, 1, 1, 0.6750, '2024-07-01', '2024-12-31'),
(5, 1, 1, 0.6500, '2024-01-01', '2024-06-30');


-- CREDENCIAIS_ACESSO

INSERT INTO credenciais_acesso
(id_credencial, id_usuario, status, data_cadastro, token_hash, tipo_credencial, bloqueado_ate)
VALUES
(1, 1, 'ativa', '2026-01-10 08:00:00', SHA2('LUM-ANA-001', 256), 'cartao_rfid', NULL),
(2, 2, 'ativa', '2026-01-10 08:05:00', SHA2('LUM-BRUNO-002', 256), 'cartao_rfid', NULL),
(3, 3, 'ativa', '2026-01-11 09:00:00', SHA2('LUM-CARLA-003', 256), 'tag_nfc', NULL),
(4, 4, 'ativa', '2026-01-12 10:00:00', SHA2('LUM-DIEGO-004', 256), 'cartao_rfid', NULL),
(5, 5, 'bloqueada', '2026-02-01 11:00:00', SHA2('LUM-ELISA-005', 256), 'qr_code', '2026-11-05 08:00:00');


-- PERMISSAO_ACESSO

INSERT INTO permissao_acesso
(id_permissao, id_usuario, id_ambiente, horario_inicio, horario_fim, status_permissao, data_inicio, data_fim, dias_semana)
VALUES
(1, 1, 1, '07:00:00', '19:00:00', 'ativa', '2026-01-01', NULL, 'Segunda a sexta'),
(2, 2, 5, '08:00:00', '22:00:00', 'ativa', '2026-01-01', NULL, 'Segunda a sabado'),
(3, 3, 1, '07:00:00', '18:00:00', 'ativa', '2026-01-01', NULL, 'Todos os dias'),
(4, 4, 4, '08:00:00', '19:00:00', 'ativa', '2026-02-01', NULL, 'Segunda a sexta'),
(5, 5, 5, '09:00:00', '17:00:00', 'ativa', '2026-11-01', '2026-12-31', 'Segunda a sexta');


-- EVENTOS_ACESSOS

INSERT INTO eventos_acessos
(id_evento, id_credencial, id_ambiente, tipo_acesso, decisao_acesso, token_tentado, status_evento, data_expiracao, data_utilizacao, motivo)
VALUES
(1, 1, 1, 'entrada', 'permitido', SHA2('LUM-ANA-001', 256), 'concluido', NULL, '2026-11-04 08:00:00', 'acesso_autorizado'),
(2, 2, 5, 'entrada', 'permitido', SHA2('LUM-BRUNO-002', 256), 'concluido', NULL, '2026-11-04 08:15:00', 'acesso_de_manutencao'),
(3, 3, 1, 'saida', 'permitido', SHA2('LUM-CARLA-003', 256), 'concluido', NULL, '2026-11-04 12:00:00', 'saida_registrada'),
(4, 5, 5, 'entrada', 'negado', SHA2('LUM-ELISA-005', 256), 'bloqueado', NULL, '2026-11-04 13:20:00', 'credencial_bloqueada'),
(5, NULL, 4, 'entrada', 'negado', SHA2('TOKEN-INVALIDO-999', 256), 'falha', NULL, '2026-11-04 14:10:00', 'token_nao_reconhecido');


-- RECLAMACOES

INSERT INTO reclamacoes
(id_reclamacao, id_usuario_abertura, id_ambiente, id_dispositivo, id_usuario_responsavel, status_chamado, data_hora_recebido, descricao_usuario, prioridade, categoria_problema)
VALUES
(1, 1, 1, 1, 2, 'em_andamento', '2026-11-01 09:15:00', 'Temperatura da recepcao acima do habitual.', 'alta', 'climatizacao'),
(2, 3, 2, 2, 2, 'em_andamento', '2026-11-01 10:30:00', 'Iluminacao da sala de reunioes esta fraca.', 'media', 'iluminacao'),
(3, 5, 5, NULL, 2, 'aberto', '2026-11-02 14:00:00', 'Acesso ao laboratorio nao foi liberado.', 'alta', 'acesso'),
(4, 2, 3, 3, NULL, 'concluido', '2026-11-02 15:20:00', 'Medidor de energia apresentou leitura inconsistente.', 'media', 'energia'),
(5, 4, 4, 4, 2, 'em_andamento', '2026-11-03 08:45:00', 'Sensor do escritorio esta sem atualizar as leituras.', 'alta', 'dispositivo');


-- HISTORICO_TEMPERATURA

INSERT INTO historico_temperatura
(id_historico_temperatura, id_dispositivo, temperatura_medida, umidade, data_temperatura)
VALUES
(1, 1, 27.50, 58.00, '2026-11-04 08:00:00'),
(2, 1, 26.80, 57.00, '2026-11-04 09:00:00'),
(3, 4, 23.20, 49.00, '2026-11-04 09:15:00'),
(4, 4, 24.10, NULL, '2026-11-04 10:15:00'),
(5, 1, 25.50, 55.00, '2026-11-04 11:00:00');


-- HISTORICO_ILUMINACAO

INSERT INTO historico_iluminacao
(id_historico_iluminacao, id_dispositivo, iluminacao_medida, data_iluminacao)
VALUES
(1, 2, 250.00, '2026-11-04 08:00:00'),
(2, 2, 320.00, '2026-11-04 09:00:00'),
(3, 5, 620.00, '2026-11-04 09:30:00'),
(4, 5, 480.00, '2026-11-04 10:30:00'),
(5, 2, 410.00, '2026-11-04 11:00:00');


-- HISTORICO_ENERGIA

INSERT INTO historico_energia
(id_historico_energia, id_dispositivo, id_tarifa, consumo_kwh, potencia_kw, custo_estimado, qualidade_medicao, data_historico_energia)
VALUES
(1, 3, 1, 2.4500, 1.2000, 1.80, 'boa', '2026-11-04 08:00:00'),
(2, 3, 1, 2.7800, 1.3500, 2.04, 'boa', '2026-11-04 09:00:00'),
(3, 3, 1, 3.1000, 1.5000, 2.28, 'boa', '2026-11-04 10:00:00'),
(4, 3, 1, 2.9000, 1.4000, 2.13, 'regular', '2026-11-04 11:00:00'),
(5, 3, 1, 3.2500, 1.6000, 2.39, 'boa', '2026-11-04 12:00:00');


-- OCORRENCIA

INSERT INTO ocorrencia
(id_ocorrencia, id_dispositivo, id_equipe_responsavel, id_tecnico_responsavel, titulo, descricao, status_ocorrencia, prioridade, data_ocorrencia, resolvida_em)
VALUES
(1, 1, 1, 2, 'Temperatura acima do limite', 'Sensor registrou 27,5 graus, acima do limite configurado para a recepcao.', 'em_andamento', 'alta', '2026-11-04 08:05:00', NULL),
(2, 2, NULL, NULL, 'Iluminacao abaixo do limite', 'Iluminacao da sala de reunioes ficou abaixo do minimo configurado.', 'aberta', 'media', '2026-11-04 08:10:00', NULL),
(3, 3, 1, NULL, 'Consumo elevado de energia', 'Consumo medido se aproximou do limite definido para o ambiente.', 'aberta', 'alta', '2026-11-04 10:05:00', NULL),
(4, 4, 2, 2, 'Leitura irregular do sensor', 'Foram identificadas variacoes incomuns nas leituras de temperatura.', 'resolvida', 'media', '2026-11-03 14:00:00', '2026-11-03 16:30:00'),
(5, 5, NULL, NULL, 'Iluminacao fora do padrao', 'Leitura de iluminacao ficou abaixo do limite minimo do laboratorio.', 'aberta', 'alta', '2026-11-04 10:35:00', NULL);


-- HISTORICO_OCORRENCIA

INSERT INTO historico_ocorrencia
(id_historico_ocorrencia, id_ocorrencia, id_usuario, data_historico_ocorrencia, observacao, status_anterior, status_posterior)
VALUES
(1, 1, 2, '2026-11-04 08:20:00', 'Responsavel iniciou a verificacao do sensor.', 'aberta', 'em_andamento'),
(2, 2, NULL, '2026-11-04 08:10:00', 'Ocorrencia criada automaticamente pelo monitoramento.', NULL, 'aberta'),
(3, 3, NULL, '2026-11-04 10:05:00', 'Alerta gerado automaticamente pelo monitoramento de energia.', NULL, 'aberta'),
(4, 4, 2, '2026-11-03 16:30:00', 'Sensor reiniciado e leituras normalizadas.', 'em_andamento', 'resolvida'),
(5, 5, NULL, '2026-11-04 10:35:00', 'Alerta automatico de iluminacao.', NULL, 'aberta');


-- HISTORICO_DISPOSITIVO

INSERT INTO historico_dispositivo
(id_historico_dispositivo, id_dispositivo, status_dispositivo, data_historico_dispositivo, data_inicio_status, data_fim_status, motivo, consumo_estimado_kwh, custo_estimado, observacao)
VALUES
(1, 1, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:00:00', NULL, 'Operacao normal', 0.0120, 0.01, 'Sensor enviando leituras normalmente'),
(2, 2, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:30:00', NULL, 'Operacao normal', 0.0080, 0.01, 'Sensor de iluminacao em funcionamento'),
(3, 3, 'instavel', '2026-11-04 10:00:00', '2026-11-04 09:45:00', NULL, 'Oscilacao nas medicoes', 0.0150, 0.02, 'Necessaria verificacao tecnica'),
(4, 4, 'instavel', '2026-11-03 14:00:00', '2026-11-03 14:00:00', '2026-11-03 16:30:00', 'Leituras inconsistentes', 0.0120, 0.01, 'Dispositivo apresentou leituras inconsistentes antes da manutencao'),
(5, 5, 'ativo', '2026-11-04 10:30:00', '2026-11-04 08:00:00', NULL, 'Operacao normal', 0.0090, 0.01, 'Sensor ativo no laboratorio'),
(6, 4, 'ativo', '2026-11-03 16:30:00', '2026-11-03 16:30:00', NULL, 'Retorno da manutencao', 0.0120, 0.01, 'Dispositivo voltou ao funcionamento normal');


-- SERVICO

INSERT INTO servico
(nome_servico, descricao, valor_base)
VALUES
('monitoramento_temperatura', 'Monitoramento da temperatura dos ambientes e identificacao de alteracoes fora dos limites configurados.', 1500.00),
('controle_iluminacao', 'Monitoramento dos niveis de iluminacao dos ambientes conforme os limites definidos.', 2000.00),
('monitoramento_energia', 'Acompanhamento do consumo e da potencia eletrica, com estimativa de custos de energia.', 1800.00),
('controle_acesso', 'Gerenciamento de credenciais, permissoes e registros de entrada e saida dos ambientes.', 2500.00),
('monitoramento_dispositivos', 'Acompanhamento do funcionamento e do status dos dispositivos instalados no predio.', 1200.00);


-- ORCAMENTO

INSERT INTO orcamento (
    id_usuario,
    nome_responsavel,
    nome_empresa,
    email,
    telefone,
    quantidade_andares,
    quantidade_ambientes,
    quantidade_dispositivos,
    descricao,
    valor_subtotal,
    valor_desconto,
    valor_total,
    prazo_estimado_dias,
    data_validade,
    status_orcamento
) VALUES
(NULL, 'Carlos Mendes', 'Edificio Central', 'carlos@edificiocentral.com.br', '(11) 98888-1001', 5, 20, 35, 'Instalacao de monitoramento de temperatura e energia.', 3300.00, 0.00, 3300.00, 20, '2026-12-10', 'enviado'),
(NULL, 'Mariana Oliveira', 'Residencial Jardim', 'mariana@residencialjardim.com.br', '(11) 98888-1002', 8, 40, 60, 'Implantacao de controle de iluminacao e acesso.', 4500.00, 300.00, 4200.00, 30, '2026-12-15', 'aprovado'),
(NULL, 'Roberto Almeida', 'Centro Empresarial Alfa', 'roberto@empresarialalfa.com.br', '(11) 98888-1003', 3, 15, 25, 'Monitoramento de temperatura e dispositivos.', 2700.00, 100.00, 2600.00, 15, '2026-12-20', 'em_analise'),
(NULL, 'Fernanda Costa', 'Shopping Nova Era', 'fernanda@shoppingnovaera.com.br', '(11) 98888-1004', 6, 50, 80, 'Monitoramento de energia, controle de acesso e dispositivos.', 5500.00, 500.00, 5000.00, 40, '2026-12-25', 'aprovado'),
(NULL, 'Lucas Ferreira', 'Hotel Bela Vista', 'lucas@hotelbelavista.com.br', '(11) 98888-1005', 4, 30, 45, 'Monitoramento de temperatura, iluminacao e energia.', 5300.00, 0.00, 5300.00, 25, '2026-12-30', 'solicitado');


-- ORCAMENTO_SERVICO

INSERT INTO orcamento_servico
(id_orcamento, id_servico, valor_servico)
VALUES
(1, 1, 1500.00),
(1, 3, 1800.00),
(2, 2, 2000.00),
(2, 4, 2500.00),
(3, 1, 1500.00),
(3, 5, 1200.00),
(4, 3, 1800.00),
(4, 4, 2500.00),
(4, 5, 1200.00),
(5, 1, 1500.00),
(5, 2, 2000.00),
(5, 3, 1800.00);


-- PEDIDO

INSERT INTO pedido
(id_orcamento, valor_contratado, status_pedido, observacoes)
VALUES
(2, 4200.00, 'aguardando_pagamento', 'Orcamento aprovado. Aguardando confirmacao do pagamento.'),
(4, 5000.00, 'confirmado', 'Pedido confirmado apos aprovacao do pagamento.');


-- PAGAMENTO

INSERT INTO pagamento (
    id_pedido,
    valor_pago,
    metodo_pagamento,
    status_pagamento,
    codigo_transacao,
    data_pagamento
) VALUES
(1, 4200.00, 'pix', 'pendente', NULL, NULL),
(2, 5000.00, 'cartao_credito', 'aprovado', 'LUMORA-PGTO-2026-002', '2026-11-11 14:30:00');

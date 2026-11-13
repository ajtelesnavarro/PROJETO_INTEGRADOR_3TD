
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

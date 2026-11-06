CREATE DATABASE IF NOT EXISTS db_lumora
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_lumora;

CREATE TABLE predio (
    id_predio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_predio VARCHAR(100) NOT NULL,
    cep CHAR(9) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    INDEX idx_cep (cep)
) ENGINE=InnoDB;


CREATE TABLE andar (
    id_andar INT AUTO_INCREMENT PRIMARY KEY,
    id_predio INT NOT NULL,
    numero_andar INT NOT NULL,
    descricao VARCHAR(255) NULL,
    data_cadastro DATE NULL,

    CONSTRAINT fk_andar_predio
        FOREIGN KEY (id_predio) REFERENCES predio(id_predio),

    CONSTRAINT uk_andar_predio_numero
        UNIQUE (id_predio, numero_andar)
) ENGINE=InnoDB;

CREATE TABLE setor (
    id_setor INT AUTO_INCREMENT PRIMARY KEY,
    id_andar INT NOT NULL,
    nome_setor VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,
    responsavel VARCHAR(100) NULL,

    CONSTRAINT fk_setor_andar
        FOREIGN KEY (id_andar)
        REFERENCES andar(id_andar),

    CONSTRAINT uk_setor_andar
        UNIQUE (id_andar, nome_setor)
) ENGINE=InnoDB;

CREATE TABLE ambiente (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
    id_andar INT NOT NULL,
    id_setor INT NULL;
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(255) NULL,
    capacidade_maxima INT NULL,
    horario_abertura TIME NULL,
    horario_fechamento TIME NULL,
    requer_reserva BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_ambiente_andar
        FOREIGN KEY (id_andar) REFERENCES andar(id_andar),

    CONSTRAINT chk_capacidade
        CHECK (capacidade_maxima IS NULL OR capacidade_maxima > 0),

    CONSTRAINT fk_ambiente_setor
        FOREIGN KEY (id_setor) REFERENCES setor(id_setor);

    CONSTRAINT chk_horario_ambiente
        CHECK (
            horario_abertura IS NULL
            OR horario_fechamento IS NULL
            OR horario_fechamento > horario_abertura
        )
) ENGINE=InnoDB;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    unidade VARCHAR(100) NULL,
    perfil ENUM(
        'administrador',
        'manutencao',
        'consulta',
        'seguranca',
        'visitante'
    ) NOT NULL DEFAULT 'visitante',
    cpf CHAR(11) NOT NULL,
    rg VARCHAR(20) NULL,
    foto VARCHAR(255) NULL,
    data_nascimento DATE NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT uk_usuario_cpf UNIQUE (cpf)
) ENGINE=InnoDB;

CREATE TABLE equipe (
    id_equipe INT AUTO_INCREMENT PRIMARY KEY,
    nome_equipe VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,
    status ENUM('ativa', 'inativa') NOT NULL DEFAULT 'ativa'
) ENGINE=InnoDB;

CREATE TABLE equipe_usuario (
    id_equipe_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_equipe INT NOT NULL,
    id_usuario INT NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE NULL,

    FOREIGN KEY (id_equipe)
        REFERENCES equipe(id_equipe),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    UNIQUE (id_equipe, id_usuario),

    CHECK (data_saida IS NULL OR data_saida >= data_entrada)
) ENGINE=InnoDB;

CREATE TABLE dispositivo (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo_dispositivo VARCHAR(80) NOT NULL,
    fabricante VARCHAR(100) NULL,
    modelo VARCHAR(100) NULL,
    unidade_medida VARCHAR(30) NULL,
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
        REFERENCES ambiente(id_ambiente)
) ENGINE=InnoDB;

CREATE TABLE temperatura (
    id_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    temperatura_minima DECIMAL(5,2) NOT NULL,
    temperatura_maxima DECIMAL(5,2) NOT NULL,

    CONSTRAINT uk_temperatura_ambiente UNIQUE (id_ambiente),

    CONSTRAINT fk_temperatura_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_temperatura
        CHECK (temperatura_minima <= temperatura_maxima)
) ENGINE=InnoDB;

CREATE TABLE iluminacao (
    id_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    iluminacao_minima DECIMAL(10,2) NOT NULL,
    iluminacao_maxima DECIMAL(10,2) NOT NULL,

    CONSTRAINT uk_iluminacao_ambiente UNIQUE (id_ambiente),

    CONSTRAINT fk_iluminacao_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_iluminacao
        CHECK (
            iluminacao_minima >= 0
            AND iluminacao_minima <= iluminacao_maxima
        )
) ENGINE=InnoDB;

CREATE TABLE energia (
    id_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_usuario_alteracao INT NULL,
    consumo_minimo DECIMAL(12,4) NOT NULL,
    consumo_maximo DECIMAL(12,4) NOT NULL,
    potencia_maxima DECIMAL(10,4) NOT NULL,

    CONSTRAINT uk_energia_ambiente UNIQUE (id_ambiente),

    CONSTRAINT fk_energia_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id_usuario),

    CONSTRAINT chk_limite_consumo
        CHECK (
            consumo_minimo >= 0
            AND consumo_minimo <= consumo_maximo
        ),

    CONSTRAINT chk_potencia_maxima CHECK (potencia_maxima >= 0)
) ENGINE=InnoDB;

CREATE TABLE tarifa_energia (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_alteracao INT NULL,
    valor_kwh DECIMAL(10,4) NOT NULL,
    data_inicio_vigencia DATE NOT NULL,
    data_fim_vigencia DATE NULL,

    CONSTRAINT chk_valor_tarifa CHECK (valor_kwh >= 0),
    
    CONSTRAINT fk_usuario_alteracao
        FOREIGN KEY (id_usuario_alteracao) REFERENCES usuario(id_usuario),

    CONSTRAINT chk_vigencia_tarifa
        CHECK (
            data_fim_vigencia IS NULL
            OR data_fim_vigencia >= data_inicio_vigencia
        )
) ENGINE=InnoDB;

CREATE TABLE historico_temperatura (
    id_historico_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    temperatura_medida DECIMAL(5,2) NOT NULL,
    umidade DECIMAL(5,2) NULL,
    data_temperatura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_temperatura_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_umidade
        CHECK (umidade IS NULL OR (umidade >= 0 AND umidade <= 100))
) ENGINE=InnoDB;

CREATE TABLE historico_iluminacao (
    id_historico_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    iluminacao_medida DECIMAL(10,2) NOT NULL,
    data_iluminacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_iluminacao_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_iluminacao_medida CHECK (iluminacao_medida >= 0)
) ENGINE=InnoDB;

CREATE TABLE historico_energia (
    id_historico_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_tarifa INT NULL,
    consumo_kwh DECIMAL(12,4) NOT NULL,
    potencia_kw DECIMAL(10,4) NOT NULL,
    custo_estimado DECIMAL(12,2) NULL,
    qualidade_medicao VARCHAR(50) NULL,
    data_historico_energia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_energia_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_hist_energia_tarifa
        FOREIGN KEY (id_tarifa) REFERENCES tarifa_energia(id_tarifa),

    CONSTRAINT chk_consumo_energia CHECK (consumo_kwh >= 0),
    CONSTRAINT chk_potencia_energia CHECK (potencia_kw >= 0),
    CONSTRAINT chk_custo_energia
        CHECK (custo_estimado IS NULL OR custo_estimado >= 0)
) ENGINE=InnoDB;

CREATE TABLE credenciais_acesso (
    id_credencial INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Ativa',
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    token_acesso VARCHAR(255) NOT NULL,
    tipo_credencial VARCHAR(50) NOT NULL,
    bloqueado_ate DATETIME NULL,

    CONSTRAINT uk_credencial_token UNIQUE (token_acesso),

    CONSTRAINT fk_credencial_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE permissao_acesso (
    id_permissao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_ambiente INT NOT NULL,
    horario_inicio TIME NULL,
    horario_fim TIME NULL,
    status_permissao VARCHAR(30) NOT NULL DEFAULT 'Ativa',
    permissao_acesso BOOLEAN NOT NULL DEFAULT TRUE,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    dias_semana VARCHAR(100) NULL,

    CONSTRAINT fk_permissao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),

    CONSTRAINT fk_permissao_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),

    CONSTRAINT chk_vigencia_permissao
        CHECK (data_fim IS NULL OR data_fim >= data_inicio),

    CONSTRAINT chk_horario_permissao
        CHECK (
            horario_inicio IS NULL
            OR horario_fim IS NULL
            OR horario_fim > horario_inicio
        )
) ENGINE=InnoDB;

CREATE TABLE eventos_acessos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_credencial INT NULL,
    id_ambiente INT NOT NULL,
    tipo_acesso VARCHAR(50) NOT NULL,
    decisao_acesso VARCHAR(30) NOT NULL,
    token_tentado VARCHAR(255) NULL,
    status_evento VARCHAR(50) NOT NULL,
    data_expiracao DATETIME NULL,
    data_utilizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NULL,

    CONSTRAINT fk_evento_credencial
        FOREIGN KEY (id_credencial) REFERENCES credenciais_acesso(id_credencial),

    CONSTRAINT fk_evento_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
) ENGINE=InnoDB;

CREATE TABLE reclamacoes (
    id_reclamacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_abertura INT NOT NULL,
    id_ambiente INT NULL,
    id_dispositivo INT NULL,
    id_usuario_responsavel INT NULL,
    status_chamado VARCHAR(50) NOT NULL DEFAULT 'Aberto',
    data_hora_recebido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao_usuario TEXT NOT NULL,
    prioridade VARCHAR(30) NOT NULL DEFAULT 'Media',
    categoria_problema VARCHAR(80) NULL,

    CONSTRAINT fk_reclamacao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),

    CONSTRAINT fk_reclamacao_ambiente
        FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),

    CONSTRAINT fk_reclamacao_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_reclamacao_responsavel
        FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_equipe_responsavel INT NULL,
    id_tecnico_responsavel INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    status_ocorrencia VARCHAR(50) NOT NULL DEFAULT 'Aberta',
    prioridade VARCHAR(30) NOT NULL DEFAULT 'Media',
    data_ocorrencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolvida_em DATETIME NULL,

    CONSTRAINT fk_ocorrencia_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT fk_ocorrencia_equipe
        FOREIGN KEY (id_equipe_responsavel) REFERENCES equipe_usuario(id_equipe_usuario),

    CONSTRAINT fk_ocorrencia_usuario
        FOREIGN KEY (id_tecnico_responsavel) REFERENCES equipe_usuario(id_usuario),

    CONSTRAINT chk_data_resolucao
        CHECK (resolvida_em IS NULL OR resolvida_em >= data_ocorrencia)
) ENGINE=InnoDB;

CREATE TABLE historico_ocorrencia (
    id_historico_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    data_historico_ocorrencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT NULL,
    status_anterior VARCHAR(30) NULL,
    status_posterior VARCHAR(30) NOT NULL,

    CONSTRAINT fk_hist_ocorrencia_ocorrencia
        FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia),

    CONSTRAINT fk_hist_ocorrencia_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE historico_dispositivo (
    id_historico_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    status_dispositivo ENUM('ativo', 'instavel', 'manutencao', 'inativo', 'offline') NOT NULL,
    data_historico_dispositivo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_inicio_status DATETIME NOT NULL,
    data_fim_status DATETIME NULL,
    motivo VARCHAR(255) NULL,
    consumo_estimado_kwh DECIMAL(12,4) NULL,
    custo_estimado DECIMAL(12,2) NULL,
    observacao TEXT NULL,

    CONSTRAINT fk_hist_dispositivo_dispositivo
        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),

    CONSTRAINT chk_periodo_dispositivo
        CHECK (data_fim_status IS NULL OR data_fim_status >= data_inicio_status),

    CONSTRAINT chk_consumo_estimado
        CHECK (consumo_estimado_kwh IS NULL OR consumo_estimado_kwh >= 0),

    CONSTRAINT chk_custo_estimado
        CHECK (custo_estimado IS NULL OR custo_estimado >= 0)
) ENGINE=InnoDB;


CREATE INDEX idx_dispositivo_ambiente ON dispositivo(id_ambiente);
CREATE INDEX idx_dispositivo_status ON dispositivo(status_dispositivo);
CREATE INDEX idx_ocorrencia_dispositivo ON ocorrencia(id_dispositivo);
CREATE INDEX idx_hist_temperatura_data ON historico_temperatura(data_temperatura);
CREATE INDEX idx_hist_iluminacao_data ON historico_iluminacao(data_iluminacao);
CREATE INDEX idx_hist_energia_data ON historico_energia(data_historico_energia);
CREATE INDEX idx_eventos_acessos_data ON eventos_acessos(data_utilizacao);
CREATE INDEX idx_permissao_usuario_ambiente ON permissao_acesso(id_usuario, id_ambiente);
CREATE INDEX idx_ocorrencia_status ON ocorrencia(status_ocorrencia);
CREATE INDEX idx_ocorrencia_data ON ocorrencia(data_ocorrencia);
CREATE INDEX idx_reclamacao_status ON reclamacoes(status_chamado);
CREATE INDEX idx_hist_ocorrencia_data ON historico_ocorrencia(data_historico_ocorrencia);

USE db_lumora;

INSERT INTO predio
(id_predio, nome_predio, endereco, rua, bairro, numero, complemento, estado, cep, cidade)
VALUES
(1, 'Lumora Business Center', 'Rua das Acacias, 120', 'Rua das Acacias', 'Jardim', '120', NULL, 'SP', '09080-500', 'Santo Andre');

INSERT INTO andar
(id_andar, id_predio, numero_andar, descricao, data_cadastro)
VALUES
(1, 1, 1, 'Recepcao e salas administrativas', '2024-01-10'),
(2, 1, 2, 'Salas de reuniao', '2024-01-10'),
(3, 1, 3, 'Area de atendimento', '2024-02-15'),
(4, 1, 4, 'Escritorios administrativos', '2024-03-20'),
(5, 1, 5, 'Laboratorio de tecnologia', '2024-04-05');

INSERT INTO ambiente
(id_ambiente, id_andar, nome, localizacao, capacidade_maxima, horario_abertura, horario_fechamento, requer_reserva)
VALUES
(1, 1, 'Recepcao', 'Proximo a entrada principal', 20, '07:00:00', '19:00:00', FALSE),
(2, 2, 'Sala de reunioes A', 'Ala norte', 12, '08:00:00', '20:00:00', TRUE),
(3, 3, 'Sala de atendimento', 'Ao lado dos elevadores', 15, '08:00:00', '18:00:00', FALSE),
(4, 4, 'Escritorio administrativo', 'Ala leste', 30, '07:00:00', '19:00:00', FALSE),
(5, 5, 'Laboratorio de tecnologia', 'Area restrita', 18, '08:00:00', '22:00:00', TRUE);

INSERT INTO usuario
(id_usuario, nome, email, senha_hash, telefone, unidade, perfil, cpf, rg, foto, data_nascimento, ativo)
VALUES
(1, 'Ana Souza', 'ana.souza@lumora.com.br', '$2y$12$dNrDRKBlcFKTEA6D9I28I.2koUVLLm5i9lmy2bS/phFfZ/9ENiBva', '(11) 90000-1001', 'Administracao', 'administrador', '12345678901', NULL, NULL, '1988-04-12', TRUE),
(2, 'Bruno Lima', 'bruno.lima@lumora.com.br', '$2y$12$xcI4s7mvF2/TNUpYzwADEuhuX1uZsa0tF0ldtGZMa0KGRlIt.msGG', '(11) 90000-1002', 'Manutencao', 'manutencao', '12345678902', NULL, NULL, '1990-08-21', TRUE),
(3, 'Carla Mendes', 'carla.mendes@lumora.com.br', '$2y$12$noxrWTfcAjHsgbFInXXehO9fSBHjYC8ZYuAhIl2uwLGwBBYV4q4am', '(11) 90000-1003', 'Recepcao', 'consulta', '12345678903', NULL, NULL, '1995-02-03', TRUE),
(4, 'Diego Alves', 'diego.alves@lumora.com.br', '$2y$12$OyKLcox.DPu.1UX0AFaKBeEdaI0au0nDzPlM/7ZAHJCQsp1nh2lFe', '(11) 90000-1004', 'Seguranca', 'seguranca', '12345678904', NULL, NULL, '1992-11-17', TRUE),
(5, 'Elisa Costa', 'elisa.costa@lumora.com.br', '$2y$12$YriEFH6egVd.q4viv9Txrey1vHBj4EN/b.WXpFyNchsuI8g0HX2U2', NULL, 'Visitantes', 'visitante', '12345678905', NULL, NULL, '2000-06-25', TRUE);

INSERT INTO dispositivo
(id_dispositivo, id_ambiente, id_usuario, nome, tipo_dispositivo, fabricante, modelo, unidade_medida, potencia_nominal_kw, data_dispositivo, identificador, status_dispositivo)
VALUES
(1, 1, 2, 'Sensor de temperatura da recepcao', 'Temperatura', 'SensTech', 'ST-T100', 'Celsius', 0.0120, '2024-05-10', 'LUM-SEN-TEMP-001', 'ativo'),
(2, 2, 2, 'Sensor de iluminacao da sala A', 'Iluminacao', 'LumenPro', 'LP-200', 'Lux', 0.0080, '2024-05-12', 'LUM-SEN-LUX-002', 'ativo'),
(3, 3, 2, 'Medidor de energia do atendimento', 'Energia', 'EnerMeter', 'EM-300', 'kWh', 0.0150, '2024-06-01', 'LUM-MED-ENE-003', 'instavel'),
(4, 4, 2, 'Sensor de temperatura do escritorio', 'Temperatura', 'SensTech', 'ST-T100', 'Celsius', 0.0120, '2024-06-15', 'LUM-SEN-TEMP-004', 'ativo'),
(5, 5, 2, 'Sensor de iluminacao do laboratorio', 'Iluminacao', 'LumenPro', 'LP-250', 'Lux', 0.0090, '2024-07-01', 'LUM-SEN-LUX-005', 'ativo');

INSERT INTO temperatura
(id_temperatura, id_ambiente, temperatura_minima, temperatura_maxima)
VALUES
(1, 1, 20.00, 26.00),
(2, 2, 19.00, 25.00),
(3, 3, 20.00, 27.00),
(4, 4, 20.00, 26.00),
(5, 5, 18.00, 24.00);

INSERT INTO iluminacao
(id_iluminacao, id_ambiente, iluminacao_minima, iluminacao_maxima)
VALUES
(1, 1, 150.00, 500.00),
(2, 2, 300.00, 750.00),
(3, 3, 200.00, 600.00),
(4, 4, 300.00, 700.00),
(5, 5, 500.00, 1000.00);

INSERT INTO energia
(id_energia, id_ambiente, consumo_minimo, consumo_maximo, potencia_maxima)
VALUES
(1, 1, 0.1000, 12.0000, 3.5000),
(2, 2, 0.2000, 18.0000, 5.0000),
(3, 3, 0.1500, 15.0000, 4.0000),
(4, 4, 0.3000, 25.0000, 7.5000),
(5, 5, 0.5000, 40.0000, 12.0000);

INSERT INTO tarifa_energia
(id_tarifa, valor_kwh, data_inicio_vigencia, data_fim_vigencia)
VALUES
(1, 0.7350, '2026-01-01', NULL),
(2, 0.7210, '2025-07-01', '2025-12-31'),
(3, 0.6980, '2025-01-01', '2025-06-30'),
(4, 0.6750, '2024-07-01', '2024-12-31'),
(5, 0.6500, '2024-01-01', '2024-06-30');

INSERT INTO credenciais_acesso
(id_credencial, id_usuario, status, data_cadastro, token_acesso, tipo_credencial, bloqueado_ate)
VALUES
(1, 1, 'Ativa', '2026-01-10 08:00:00', 'LUM-ANA-001', 'Cartao RFID', NULL),
(2, 2, 'Ativa', '2026-01-10 08:05:00', 'LUM-BRUNO-002', 'Cartao RFID', NULL),
(3, 3, 'Ativa', '2026-01-11 09:00:00', 'LUM-CARLA-003', 'Tag NFC', NULL),
(4, 4, 'Ativa', '2026-01-12 10:00:00', 'LUM-DIEGO-004', 'Cartao RFID', NULL),
(5, 5, 'Bloqueada', '2026-02-01 11:00:00', 'LUM-ELISA-005', 'QR Code', '2026-11-05 08:00:00');

INSERT INTO permissao_acesso
(id_permissao, id_usuario, id_ambiente, horario_inicio, horario_fim, status_permissao, permissao_acesso, data_inicio, data_fim, dias_semana)
VALUES
(1, 1, 1, '07:00:00', '19:00:00', 'Ativa', TRUE, '2026-01-01', NULL, 'Segunda a sexta'),
(2, 2, 5, '08:00:00', '22:00:00', 'Ativa', TRUE, '2026-01-01', NULL, 'Segunda a sabado'),
(3, 3, 1, '07:00:00', '18:00:00', 'Ativa', TRUE, '2026-01-01', NULL, 'Todos os dias'),
(4, 4, 4, '08:00:00', '19:00:00', 'Ativa', TRUE, '2026-02-01', NULL, 'Segunda a sexta'),
(5, 5, 5, '09:00:00', '17:00:00', 'Ativa', TRUE, '2026-11-01', '2026-12-31', 'Segunda a sexta');

INSERT INTO eventos_acessos
(id_evento, id_credencial, id_ambiente, tipo_acesso, decisao_acesso, token_tentado, status_evento, data_expiracao, data_utilizacao, motivo)
VALUES
(1, 1, 1, 'Entrada', 'Permitido', 'LUM-ANA-001', 'Registrado', NULL, '2026-11-04 08:00:00', 'Acesso autorizado'),
(2, 2, 5, 'Entrada', 'Permitido', 'LUM-BRUNO-002', 'Registrado', NULL, '2026-11-04 08:15:00', 'Acesso de manutencao'),
(3, 3, 1, 'Saida', 'Permitido', 'LUM-CARLA-003', 'Registrado', NULL, '2026-11-04 12:00:00', 'Saida registrada'),
(4, 5, 5, 'Entrada', 'Negado', 'LUM-ELISA-005', 'Bloqueado', NULL, '2026-11-04 13:20:00', 'Credencial bloqueada'),
(5, NULL, 4, 'Entrada', 'Negado', 'TOKEN-INVALIDO-999', 'Falha', NULL, '2026-11-04 14:10:00', 'Token nao reconhecido');

INSERT INTO reclamacoes
(id_reclamacao, id_usuario_abertura, id_ambiente, id_dispositivo, id_usuario_responsavel, status_chamado, data_hora_recebido, descricao_usuario, prioridade, categoria_problema)
VALUES
(1, 1, 1, 1, 2, 'Em andamento', '2026-11-01 09:15:00', 'Temperatura da recepcao acima do habitual.', 'Alta', 'Climatizacao'),
(2, 3, 2, 2, 2, 'Em andamento', '2026-11-01 10:30:00', 'Iluminacao da sala de reunioes esta fraca.', 'Media', 'Iluminacao'),
(3, 5, 5, NULL, 2, 'Aberto', '2026-11-02 14:00:00', 'Acesso ao laboratorio nao foi liberado.', 'Alta', 'Acesso'),
(4, 2, 3, 3, NULL, 'Concluido', '2026-11-02 15:20:00', 'Medidor de energia apresentou leitura inconsistente.', 'Media', 'Energia'),
(5, 4, 4, 4, 2, 'Em andamento', '2026-11-03 08:45:00', 'Sensor do escritorio esta sem atualizar as leituras.', 'Alta', 'Dispositivo');

INSERT INTO historico_temperatura
(id_historico_temperatura, id_dispositivo, temperatura_medida, umidade, data_temperatura)
VALUES
(1, 1, 27.50, 58.00, '2026-11-04 08:00:00'),
(2, 1, 26.80, 57.00, '2026-11-04 09:00:00'),
(3, 4, 23.20, 49.00, '2026-11-04 09:15:00'),
(4, 4, 24.10, NULL, '2026-11-04 10:15:00'),
(5, 1, 25.50, 55.00, '2026-11-04 11:00:00');

INSERT INTO historico_iluminacao
(id_historico_iluminacao, id_dispositivo, iluminacao_medida, data_iluminacao)
VALUES
(1, 2, 250.00, '2026-11-04 08:00:00'),
(2, 2, 320.00, '2026-11-04 09:00:00'),
(3, 5, 620.00, '2026-11-04 09:30:00'),
(4, 5, 480.00, '2026-11-04 10:30:00'),
(5, 2, 410.00, '2026-11-04 11:00:00');

INSERT INTO historico_energia
(id_historico_energia, id_dispositivo, id_tarifa, consumo_kwh, potencia_kw, custo_estimado, qualidade_medicao, data_historico_energia)
VALUES
(1, 3, 1, 2.4500, 1.2000, 1.80, 'Boa', '2026-11-04 08:00:00'),
(2, 3, 1, 2.7800, 1.3500, 2.04, 'Boa', '2026-11-04 09:00:00'),
(3, 3, 1, 3.1000, 1.5000, 2.28, 'Boa', '2026-11-04 10:00:00'),
(4, 3, 1, 2.9000, 1.4000, 2.13, 'Regular', '2026-11-04 11:00:00'),
(5, 3, 1, 3.2500, 1.6000, 2.39, 'Boa', '2026-11-04 12:00:00');

INSERT INTO ocorrencia
(id_ocorrencia, id_dispositivo, id_usuario_responsavel, titulo, descricao, status_ocorrencia, prioridade, data_ocorrencia, resolvida_em)
VALUES
(1, 1, 2, 'Temperatura acima do limite', 'Sensor registrou 27,5 graus, acima do limite configurado para a recepcao.', 'Em andamento', 'Alta', '2026-11-04 08:05:00', NULL),
(2, 2, NULL, 'Iluminacao abaixo do limite', 'Iluminacao da sala de reunioes ficou abaixo do minimo configurado.', 'Aberta', 'Media', '2026-11-04 08:10:00', NULL),
(3, 3, NULL, 'Consumo elevado de energia', 'Consumo medido se aproximou do limite definido para o ambiente.', 'Aberta', 'Alta', '2026-11-04 10:05:00', NULL),
(4, 4, 4, 'Leitura irregular do sensor', 'Foram identificadas variacoes incomuns nas leituras de temperatura.', 'Resolvida', 'Media', '2026-11-03 14:00:00', '2026-11-03 16:30:00'),
(5, 5, NULL, 'Iluminacao fora do padrao', 'Leitura de iluminacao ficou abaixo do limite minimo do laboratorio.', 'Aberta', 'Alta', '2026-11-04 10:35:00', NULL);

INSERT INTO historico_ocorrencia
(id_historico_ocorrencia, id_ocorrencia, id_usuario, data_historico_ocorrencia, observacao, status_anterior, status_posterior)
VALUES
(1, 1, 2, '2026-11-04 08:20:00', 'Responsavel iniciou a verificacao do sensor.', 'Aberta', 'Em andamento'),
(2, 2, NULL, '2026-11-04 08:10:00', 'Ocorrencia criada automaticamente pelo monitoramento.', NULL, 'Aberta'),
(3, 3, NULL, '2026-11-04 10:05:00', 'Alerta gerado automaticamente pelo monitoramento de energia.', NULL, 'Aberta'),
(4, 4, 2, '2026-11-03 16:30:00', 'Sensor reiniciado e leituras normalizadas.', 'Em andamento', 'Resolvida'),
(5, 5, NULL, '2026-11-04 10:35:00', 'Alerta automatico de iluminacao.', NULL, 'Aberta');

INSERT INTO historico_dispositivo
(id_historico_dispositivo, id_dispositivo, status_dispositivo, data_historico_dispositivo, data_inicio_status, data_fim_status, motivo, consumo_estimado_kwh, custo_estimado, observacao)
VALUES
(1, 1, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:00:00', NULL, 'Operacao normal', 0.0120, 0.01, 'Sensor enviando leituras normalmente'),
(2, 2, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:30:00', NULL, 'Operacao normal', 0.0080, 0.01, 'Sensor de iluminacao em funcionamento'),
(3, 3, 'instavel', '2026-11-04 10:00:00', '2026-11-04 09:45:00', NULL, 'Oscilacao nas medicoes', 0.0150, 0.02, 'Necessaria verificacao tecnica'),
(4, 4, 'instavel', '2026-11-03 14:00:00', '2026-11-03 14:00:00', '2026-11-03 16:30:00', 'Leituras inconsistentes', 0.0120, 0.01, 'Dispositivo apresentou leituras inconsistentes antes da manutencao'),
(5, 5, 'ativo', '2026-11-04 10:30:00', '2026-11-04 08:00:00', NULL, 'Operacao normal', 0.0090, 0.01, 'Sensor ativo no laboratorio'),
(6, 4, 'ativo', '2026-11-03 16:30:00', '2026-11-03 16:30:00', NULL, 'Retorno da manutencao', 0.0120, 0.01, 'Dispositivo voltou ao funcionamento normal');

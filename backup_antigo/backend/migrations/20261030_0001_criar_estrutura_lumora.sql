CREATE DATABASE IF NOT EXISTS lumora_smartbuilding;
USE lumora_smartbuilding;

CREATE TABLE predio (
    id_predio INT AUTO_INCREMENT PRIMARY KEY,
    nome_predio VARCHAR(100) NOT NULL,
    endereco VARCHAR(150),
    rua VARCHAR(100),
    bairro VARCHAR(80),
    complemento VARCHAR(100),
    numero VARCHAR(20),
    estado VARCHAR(50),
    cep VARCHAR(9),
    cidade VARCHAR(80)
);

CREATE TABLE andar (
    id_andar INT AUTO_INCREMENT PRIMARY KEY,
    id_predio INT NOT NULL,
    numero_andar INT NOT NULL,
    descricao VARCHAR(150),
    data_andar DATE,

    FOREIGN KEY (id_predio) REFERENCES predio(id_predio)
);

CREATE TABLE ambiente (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
    id_andar INT NOT NULL,
    localizacao VARCHAR(150),
    capacidade_maxima INT,
    requer_reserva BOOLEAN DEFAULT FALSE,
    horario_abertura TIME,
    nome VARCHAR(100) NOT NULL,
    horario_fechamento TIME,

    FOREIGN KEY (id_andar) REFERENCES andar(id_andar)
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_perfil VARCHAR(30) NOT NULL,
    telefone VARCHAR(20),
    cpf CHAR(11) UNIQUE,
    rg VARCHAR(20),
    data_nascimento DATE,
    unidade VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    foto VARCHAR(255)
);

CREATE TABLE dispositivo (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    tipo_dispositivo VARCHAR(50) NOT NULL,
    fabricante VARCHAR(100),
    modelo VARCHAR(100),
    versao VARCHAR(50),
    unidade_medida VARCHAR(30),
    data_dispositivo DATE NOT NULL,
    potencia_nominal_kw DECIMAL(10,4),

    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
);

CREATE TABLE temperatura (
    id_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL UNIQUE,
    temperatura_minima DECIMAL(5,2),
    temperatura_maxima DECIMAL(5,2),

    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
);

CREATE TABLE iluminacao (
    id_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL UNIQUE,
    iluminacao_minima DECIMAL(10,2),
    iluminacao_maxima DECIMAL(10,2),

    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
);

CREATE TABLE energia (
    id_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL UNIQUE,
    consumo_minimo DECIMAL(12,4),
    consumo_maximo DECIMAL(12,4),
    potencia_maxima DECIMAL(10,4),

    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
);

CREATE TABLE tarifa_energia (
    id_tarifa INT AUTO_INCREMENT PRIMARY KEY,
    valor_kwh DECIMAL(10,4) NOT NULL,
    data_inicio_vigencia DATE NOT NULL,
    data_fim_vigencia DATE
);

CREATE TABLE credenciais_acesso (
    id_credencial INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    tipo_credencial VARCHAR(50),
    status VARCHAR(30),
    data_cadastro DATETIME,
    bloqueado_ate DATETIME,
    token_acesso VARCHAR(255),

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE permissao_acesso (
    id_permissao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_ambiente INT NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    horario_inicio TIME,
    status_permissao VARCHAR(30),
    horario_fim TIME,
    dias_semana VARCHAR(100),

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente)
);

CREATE TABLE eventos_acessos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_ambiente INT NOT NULL,
    id_credencial INT NULL,
    motivo VARCHAR(255),
    tipo_acesso VARCHAR(50),
    decisao_acesso VARCHAR(30),
    token_tentado VARCHAR(255),
    data_expiracao DATETIME,
    data_utilizacao DATETIME,

    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),
    FOREIGN KEY (id_credencial) REFERENCES credenciais_acesso(id_credencial)
);

CREATE TABLE reclamacoes (
    id_reclamacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    status_chamado VARCHAR(30),
    data_hora_recebido DATETIME,
    descricao_usuario TEXT,
    categoria_problema VARCHAR(80),
    prioridade VARCHAR(30),

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE historico_temperatura (
    id_historico_temperatura INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    umidade DECIMAL(5,2),
    data_temperatura DATETIME NOT NULL,
    temperatura_medida DECIMAL(5,2) NOT NULL,

    FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo)
);

CREATE TABLE historico_iluminacao (
    id_historico_iluminacao INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    iluminacao_medida DECIMAL(10,2) NOT NULL,
    data_iluminacao DATETIME NOT NULL,

    FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo)
);

CREATE TABLE historico_energia (
    id_historico_energia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_tarifa INT NOT NULL,
    consumo_kwh DECIMAL(12,4) NOT NULL,
    data_historico_energia DATETIME NOT NULL,
    custo_estimado DECIMAL(12,2),
    potencia_kw DECIMAL(10,4),
    qualidade_medicao VARCHAR(50),

    FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),
    FOREIGN KEY (id_tarifa) REFERENCES tarifa_energia(id_tarifa)
);

CREATE TABLE ocorrencia (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    id_ambiente INT NOT NULL,
    id_usuario_responsavel INT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(30) NOT NULL,
    data_ocorrencia DATETIME NOT NULL,
    origem VARCHAR(30),

    FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo),
    FOREIGN KEY (id_ambiente) REFERENCES ambiente(id_ambiente),
    FOREIGN KEY (id_usuario_responsavel) REFERENCES usuario(id_usuario)
);

CREATE TABLE historico_ocorrencia (
    id_historico_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_ocorrencia INT NOT NULL,
    status_anterior VARCHAR(30),
    status_posterior VARCHAR(30),
    data_historico_ocorrencia DATETIME NOT NULL,
    observacao TEXT,

    FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia(id_ocorrencia)
);

CREATE TABLE historico_dispositivo (
    id_historico_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo INT NOT NULL,
    status_dispositivo VARCHAR(30),
    data_historico_dispositivo DATETIME NOT NULL,
    custo_estimado DECIMAL(12,2),
    data_inicio_status DATETIME,
    data_fim_status DATETIME,
    motivo VARCHAR(255),
    consumo_estimado_kwh DECIMAL(12,4),
    observacao TEXT,

    FOREIGN KEY (id_dispositivo) REFERENCES dispositivo(id_dispositivo)
);


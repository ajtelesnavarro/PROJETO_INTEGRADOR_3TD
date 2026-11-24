-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 24/11/2026 às 21:02
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_lumora`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `ambiente`
--

CREATE TABLE `ambiente` (
  `id_ambiente` int(11) NOT NULL,
  `id_andar` int(11) NOT NULL,
  `id_setor` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `localizacao` varchar(255) NOT NULL,
  `capacidade_maxima` int(11) DEFAULT NULL,
  `horario_abertura` time NOT NULL,
  `horario_fechamento` time NOT NULL
) ;

--
-- Despejando dados para a tabela `ambiente`
--

INSERT INTO `ambiente` (`id_ambiente`, `id_andar`, `id_setor`, `nome`, `localizacao`, `capacidade_maxima`, `horario_abertura`, `horario_fechamento`) VALUES
(1, 1, 1, 'Recepcao', 'Proximo a entrada principal', 20, '07:00:00', '19:00:00'),
(2, 2, 2, 'Sala de reunioes A', 'Ala norte', 12, '08:00:00', '20:00:00'),
(3, 3, 3, 'Sala de atendimento', 'Ao lado dos elevadores', 15, '08:00:00', '18:00:00'),
(4, 4, 4, 'Escritorio administrativo', 'Ala leste', 30, '07:00:00', '19:00:00'),
(5, 5, 5, 'Laboratorio de tecnologia', 'Area restrita', 18, '08:00:00', '22:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `andar`
--

CREATE TABLE `andar` (
  `id_andar` int(11) NOT NULL,
  `id_predio` int(11) NOT NULL,
  `numero_andar` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `data_cadastro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `andar`
--

INSERT INTO `andar` (`id_andar`, `id_predio`, `numero_andar`, `descricao`, `data_cadastro`) VALUES
(1, 1, 1, 'Recepcao e salas administrativas', '2024-01-10'),
(2, 1, 2, 'Salas de reuniao', '2024-01-10'),
(3, 1, 3, 'Area de atendimento', '2024-02-15'),
(4, 1, 4, 'Escritorios administrativos', '2024-03-20'),
(5, 1, 5, 'Laboratorio de tecnologia', '2024-04-05'),
(6, 5, 1, 'Andar 1', '2026-11-24'),
(7, 6, 1, 'Andar 1', '2026-11-24');

-- --------------------------------------------------------

--
-- Estrutura para tabela `credenciais_acesso`
--

CREATE TABLE `credenciais_acesso` (
  `id_credencial` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `status` enum('ativa','bloqueada','expirada') NOT NULL DEFAULT 'ativa',
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `token_hash` char(64) NOT NULL,
  `tipo_credencial` enum('cartao_rfid','tag_nfc','qr_code') NOT NULL,
  `bloqueado_ate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `credenciais_acesso`
--

INSERT INTO `credenciais_acesso` (`id_credencial`, `id_usuario`, `status`, `data_cadastro`, `token_hash`, `tipo_credencial`, `bloqueado_ate`) VALUES
(1, 1, 'ativa', '2026-01-10 08:00:00', '20dd6db76a8f11fc7e147715c50df6c199830355840e5f5eba36b73345091426', 'cartao_rfid', NULL),
(2, 2, 'ativa', '2026-01-10 08:05:00', '8683b27d52498b39c3b7edcdb9021a2ff6e2393b7a198edce4e7a5237bf3011c', 'cartao_rfid', NULL),
(3, 3, 'ativa', '2026-01-11 09:00:00', 'a0a333b953b1110e5837d8c39c6b16613cb9cd3a0fcf6a478d9e1f18be75c3e5', 'tag_nfc', NULL),
(4, 4, 'ativa', '2026-01-12 10:00:00', '6eee2f38c2e55501f4ce2a12f25fedd1cb72cc8143930baffdcf65ff8aca7141', 'cartao_rfid', NULL),
(5, 5, 'bloqueada', '2026-02-01 11:00:00', 'eefaa1f435e189e14a7f792128a37ca06d43237b6b9681ee4db40fb434b8b0fa', 'qr_code', '2026-11-05 08:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `dispositivo`
--

CREATE TABLE `dispositivo` (
  `id_dispositivo` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `tipo_dispositivo` enum('energia','iluminacao','temperatura') NOT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `unidade_medida` enum('kWh','lux','°C') DEFAULT NULL,
  `potencia_nominal_kw` decimal(10,4) DEFAULT NULL,
  `data_dispositivo` date DEFAULT NULL,
  `status_dispositivo` enum('ativo','instavel','manutencao','inativo','offline') NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `dispositivo`
--

INSERT INTO `dispositivo` (`id_dispositivo`, `id_ambiente`, `id_usuario`, `nome`, `tipo_dispositivo`, `fabricante`, `modelo`, `unidade_medida`, `potencia_nominal_kw`, `data_dispositivo`, `status_dispositivo`) VALUES
(1, 1, 2, 'Sensor de temperatura da recepcao', 'temperatura', 'SensTech', 'ST-T100', '°C', 0.0120, '2024-05-10', 'ativo'),
(2, 2, 2, 'Sensor de iluminacao da sala A', 'iluminacao', 'LumenPro', 'LP-200', 'lux', 0.0080, '2024-05-12', 'ativo'),
(3, 3, 2, 'Medidor de energia do atendimento', 'energia', 'EnerMeter', 'EM-300', 'kWh', 0.0150, '2024-06-01', 'instavel'),
(4, 4, 2, 'Sensor de temperatura do escritorio', 'temperatura', 'SensTech', 'ST-T100', '°C', 0.0120, '2024-06-15', 'ativo'),
(5, 5, 2, 'Sensor de iluminacao do laboratorio', 'iluminacao', 'LumenPro', 'LP-250', 'lux', 0.0090, '2024-07-01', 'ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `energia`
--

CREATE TABLE `energia` (
  `id_energia` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_usuario_alteracao` int(11) DEFAULT NULL,
  `consumo_minimo` decimal(12,4) NOT NULL,
  `consumo_maximo` decimal(12,4) NOT NULL,
  `potencia_maxima` decimal(10,4) NOT NULL
) ;

--
-- Despejando dados para a tabela `energia`
--

INSERT INTO `energia` (`id_energia`, `id_ambiente`, `id_usuario_alteracao`, `consumo_minimo`, `consumo_maximo`, `potencia_maxima`) VALUES
(1, 1, 1, 0.1000, 12.0000, 3.5000),
(2, 2, 1, 0.2000, 18.0000, 5.0000),
(3, 3, 1, 0.1500, 15.0000, 4.0000),
(4, 4, 1, 0.3000, 25.0000, 7.5000),
(5, 5, 1, 0.5000, 40.0000, 12.0000);

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipe`
--

CREATE TABLE `equipe` (
  `id_equipe` int(11) NOT NULL,
  `id_predio` int(11) NOT NULL,
  `nome_equipe` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `status` enum('ativa','inativa') NOT NULL DEFAULT 'ativa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `equipe`
--

INSERT INTO `equipe` (`id_equipe`, `id_predio`, `nome_equipe`, `descricao`, `status`) VALUES
(1, 1, 'Manutencao predial', 'Equipe responsavel por manutencao dos ambientes e dispositivos', 'ativa'),
(2, 1, 'Suporte tecnico', 'Equipe responsavel por suporte e verificacao tecnica', 'ativa');

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipe_usuario`
--

CREATE TABLE `equipe_usuario` (
  `id_equipe_usuario` int(11) NOT NULL,
  `id_equipe` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `data_entrada` date NOT NULL,
  `data_saida` date DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `equipe_usuario`
--

INSERT INTO `equipe_usuario` (`id_equipe_usuario`, `id_equipe`, `id_usuario`, `data_entrada`, `data_saida`) VALUES
(1, 1, 1, '2024-02-01', NULL),
(2, 2, 1, '2024-02-01', NULL),
(3, 2, 3, '2024-02-10', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos_acessos`
--

CREATE TABLE `eventos_acessos` (
  `id_evento` int(11) NOT NULL,
  `id_credencial` int(11) DEFAULT NULL,
  `id_ambiente` int(11) NOT NULL,
  `tipo_acesso` enum('entrada','saida') NOT NULL,
  `decisao_acesso` enum('permitido','negado') NOT NULL,
  `token_tentado` char(64) DEFAULT NULL,
  `status_evento` enum('processando','concluido','pendente','falha_comunicacao','bloqueado','falha') NOT NULL DEFAULT 'pendente',
  `data_expiracao` datetime DEFAULT NULL,
  `data_utilizacao` datetime NOT NULL DEFAULT current_timestamp(),
  `motivo` enum('acesso_autorizado','acesso_de_manutencao','saida_registrada','credencial_bloqueada','credencial_expirada','token_nao_reconhecido','sem_permissao','fora_do_horario_permitido','ambiente_restrito','falha_na_validacao','falha_de_comunicacao') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `eventos_acessos`
--

INSERT INTO `eventos_acessos` (`id_evento`, `id_credencial`, `id_ambiente`, `tipo_acesso`, `decisao_acesso`, `token_tentado`, `status_evento`, `data_expiracao`, `data_utilizacao`, `motivo`) VALUES
(1, 1, 1, 'entrada', 'permitido', '20dd6db76a8f11fc7e147715c50df6c199830355840e5f5eba36b73345091426', 'concluido', NULL, '2026-11-04 08:00:00', 'acesso_autorizado'),
(2, 2, 5, 'entrada', 'permitido', '8683b27d52498b39c3b7edcdb9021a2ff6e2393b7a198edce4e7a5237bf3011c', 'concluido', NULL, '2026-11-04 08:15:00', 'acesso_de_manutencao'),
(3, 3, 1, 'saida', 'permitido', 'a0a333b953b1110e5837d8c39c6b16613cb9cd3a0fcf6a478d9e1f18be75c3e5', 'concluido', NULL, '2026-11-04 12:00:00', 'saida_registrada'),
(4, 5, 5, 'entrada', 'negado', 'eefaa1f435e189e14a7f792128a37ca06d43237b6b9681ee4db40fb434b8b0fa', 'bloqueado', NULL, '2026-11-04 13:20:00', 'credencial_bloqueada'),
(5, NULL, 4, 'entrada', 'negado', 'aafddf9a843b9a4c29903890bc830e83fb4cbc7b21b415864247514185bf1d35', 'falha', NULL, '2026-11-04 14:10:00', 'token_nao_reconhecido');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_dispositivo`
--

CREATE TABLE `historico_dispositivo` (
  `id_historico_dispositivo` int(11) NOT NULL,
  `id_dispositivo` int(11) NOT NULL,
  `status_dispositivo` enum('ativo','instavel','manutencao','inativo','offline') NOT NULL,
  `data_historico_dispositivo` datetime NOT NULL DEFAULT current_timestamp(),
  `data_inicio_status` datetime NOT NULL,
  `data_fim_status` datetime DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `consumo_estimado_kwh` decimal(12,4) DEFAULT NULL,
  `custo_estimado` decimal(12,2) DEFAULT NULL,
  `observacao` text DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `historico_dispositivo`
--

INSERT INTO `historico_dispositivo` (`id_historico_dispositivo`, `id_dispositivo`, `status_dispositivo`, `data_historico_dispositivo`, `data_inicio_status`, `data_fim_status`, `motivo`, `consumo_estimado_kwh`, `custo_estimado`, `observacao`) VALUES
(1, 1, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:00:00', NULL, 'Operacao normal', 0.0120, 0.01, 'Sensor enviando leituras normalmente'),
(2, 2, 'ativo', '2026-11-04 08:00:00', '2026-11-04 07:30:00', NULL, 'Operacao normal', 0.0080, 0.01, 'Sensor de iluminacao em funcionamento'),
(3, 3, 'instavel', '2026-11-04 10:00:00', '2026-11-04 09:45:00', NULL, 'Oscilacao nas medicoes', 0.0150, 0.02, 'Necessaria verificacao tecnica'),
(4, 4, 'instavel', '2026-11-03 14:00:00', '2026-11-03 14:00:00', '2026-11-03 16:30:00', 'Leituras inconsistentes', 0.0120, 0.01, 'Dispositivo apresentou leituras inconsistentes antes da manutencao'),
(5, 5, 'ativo', '2026-11-04 10:30:00', '2026-11-04 08:00:00', NULL, 'Operacao normal', 0.0090, 0.01, 'Sensor ativo no laboratorio'),
(6, 4, 'ativo', '2026-11-03 16:30:00', '2026-11-03 16:30:00', NULL, 'Retorno da manutencao', 0.0120, 0.01, 'Dispositivo voltou ao funcionamento normal');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_energia`
--

CREATE TABLE `historico_energia` (
  `id_historico_energia` int(11) NOT NULL,
  `id_dispositivo` int(11) NOT NULL,
  `id_tarifa` int(11) DEFAULT NULL,
  `consumo_kwh` decimal(12,4) NOT NULL,
  `potencia_kw` decimal(10,4) NOT NULL,
  `custo_estimado` decimal(12,2) DEFAULT NULL,
  `qualidade_medicao` enum('boa','regular','ruim') DEFAULT NULL,
  `data_historico_energia` datetime NOT NULL DEFAULT current_timestamp()
) ;

--
-- Despejando dados para a tabela `historico_energia`
--

INSERT INTO `historico_energia` (`id_historico_energia`, `id_dispositivo`, `id_tarifa`, `consumo_kwh`, `potencia_kw`, `custo_estimado`, `qualidade_medicao`, `data_historico_energia`) VALUES
(1, 3, 1, 2.4500, 1.2000, 1.80, 'boa', '2026-11-04 08:00:00'),
(2, 3, 1, 2.7800, 1.3500, 2.04, 'boa', '2026-11-04 09:00:00'),
(3, 3, 1, 3.1000, 1.5000, 2.28, 'boa', '2026-11-04 10:00:00'),
(4, 3, 1, 2.9000, 1.4000, 2.13, 'regular', '2026-11-04 11:00:00'),
(5, 3, 1, 3.2500, 1.6000, 2.39, 'boa', '2026-11-04 12:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_iluminacao`
--

CREATE TABLE `historico_iluminacao` (
  `id_historico_iluminacao` int(11) NOT NULL,
  `id_dispositivo` int(11) NOT NULL,
  `iluminacao_medida` decimal(10,2) NOT NULL,
  `data_iluminacao` datetime NOT NULL DEFAULT current_timestamp()
) ;

--
-- Despejando dados para a tabela `historico_iluminacao`
--

INSERT INTO `historico_iluminacao` (`id_historico_iluminacao`, `id_dispositivo`, `iluminacao_medida`, `data_iluminacao`) VALUES
(1, 2, 250.00, '2026-11-04 08:00:00'),
(2, 2, 320.00, '2026-11-04 09:00:00'),
(3, 5, 620.00, '2026-11-04 09:30:00'),
(4, 5, 480.00, '2026-11-04 10:30:00'),
(5, 2, 410.00, '2026-11-04 11:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_ocorrencia`
--

CREATE TABLE `historico_ocorrencia` (
  `id_historico_ocorrencia` int(11) NOT NULL,
  `id_ocorrencia` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `data_historico_ocorrencia` datetime NOT NULL DEFAULT current_timestamp(),
  `observacao` text DEFAULT NULL,
  `status_anterior` enum('aberta','em_andamento','resolvida','cancelada') DEFAULT NULL,
  `status_posterior` enum('aberta','em_andamento','resolvida','cancelada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `historico_ocorrencia`
--

INSERT INTO `historico_ocorrencia` (`id_historico_ocorrencia`, `id_ocorrencia`, `id_usuario`, `data_historico_ocorrencia`, `observacao`, `status_anterior`, `status_posterior`) VALUES
(1, 1, 2, '2026-11-04 08:20:00', 'Responsavel iniciou a verificacao do sensor.', 'aberta', 'em_andamento'),
(2, 2, NULL, '2026-11-04 08:10:00', 'Ocorrencia criada automaticamente pelo monitoramento.', NULL, 'aberta'),
(3, 3, NULL, '2026-11-04 10:05:00', 'Alerta gerado automaticamente pelo monitoramento de energia.', NULL, 'aberta'),
(4, 4, 2, '2026-11-03 16:30:00', 'Sensor reiniciado e leituras normalizadas.', 'em_andamento', 'resolvida'),
(5, 5, NULL, '2026-11-04 10:35:00', 'Alerta automatico de iluminacao.', NULL, 'aberta');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_temperatura`
--

CREATE TABLE `historico_temperatura` (
  `id_historico_temperatura` int(11) NOT NULL,
  `id_dispositivo` int(11) NOT NULL,
  `temperatura_medida` decimal(5,2) NOT NULL,
  `umidade` decimal(5,2) DEFAULT NULL,
  `data_temperatura` datetime NOT NULL DEFAULT current_timestamp()
) ;

--
-- Despejando dados para a tabela `historico_temperatura`
--

INSERT INTO `historico_temperatura` (`id_historico_temperatura`, `id_dispositivo`, `temperatura_medida`, `umidade`, `data_temperatura`) VALUES
(1, 1, 27.50, 58.00, '2026-11-04 08:00:00'),
(2, 1, 26.80, 57.00, '2026-11-04 09:00:00'),
(3, 4, 23.20, 49.00, '2026-11-04 09:15:00'),
(4, 4, 24.10, NULL, '2026-11-04 10:15:00'),
(5, 1, 25.50, 55.00, '2026-11-04 11:00:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `iluminacao`
--

CREATE TABLE `iluminacao` (
  `id_iluminacao` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_usuario_alteracao` int(11) DEFAULT NULL,
  `iluminacao_minima` decimal(10,2) NOT NULL,
  `iluminacao_maxima` decimal(10,2) NOT NULL
) ;

--
-- Despejando dados para a tabela `iluminacao`
--

INSERT INTO `iluminacao` (`id_iluminacao`, `id_ambiente`, `id_usuario_alteracao`, `iluminacao_minima`, `iluminacao_maxima`) VALUES
(1, 1, 1, 150.00, 500.00),
(2, 2, 1, 300.00, 750.00),
(3, 3, 1, 200.00, 600.00),
(4, 4, 1, 300.00, 700.00),
(5, 5, 1, 500.00, 1000.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ocorrencia`
--

CREATE TABLE `ocorrencia` (
  `id_ocorrencia` int(11) NOT NULL,
  `id_dispositivo` int(11) NOT NULL,
  `id_usuario_abertura` int(11) DEFAULT NULL,
  `id_equipe_responsavel` int(11) DEFAULT NULL,
  `id_tecnico_responsavel` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `status_ocorrencia` enum('aberta','em_andamento','resolvida','cancelada') NOT NULL DEFAULT 'aberta',
  `prioridade` enum('baixa','media','alta') NOT NULL DEFAULT 'media',
  `data_ocorrencia` datetime NOT NULL DEFAULT current_timestamp(),
  `resolvida_em` datetime DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `ocorrencia`
--

INSERT INTO `ocorrencia` (`id_ocorrencia`, `id_dispositivo`, `id_usuario_abertura`, `id_equipe_responsavel`, `id_tecnico_responsavel`, `titulo`, `descricao`, `status_ocorrencia`, `prioridade`, `data_ocorrencia`, `resolvida_em`) VALUES
(1, 1, NULL, 1, 2, 'Temperatura acima do limite', 'Sensor registrou 27,5 graus, acima do limite configurado para a recepcao.', 'em_andamento', 'alta', '2026-11-04 08:05:00', NULL),
(2, 2, NULL, NULL, NULL, 'Iluminacao abaixo do limite', 'Iluminacao da sala de reunioes ficou abaixo do minimo configurado.', 'aberta', 'media', '2026-11-04 08:10:00', NULL),
(3, 3, NULL, 1, NULL, 'Consumo elevado de energia', 'Consumo medido se aproximou do limite definido para o ambiente.', 'aberta', 'alta', '2026-11-04 10:05:00', NULL),
(4, 4, NULL, 2, 2, 'Leitura irregular do sensor', 'Foram identificadas variacoes incomuns nas leituras de temperatura.', 'resolvida', 'media', '2026-11-03 14:00:00', '2026-11-03 16:30:00'),
(5, 5, NULL, NULL, NULL, 'Iluminacao fora do padrao', 'Leitura de iluminacao ficou abaixo do limite minimo do laboratorio.', 'aberta', 'alta', '2026-11-04 10:35:00', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamento`
--

CREATE TABLE `orcamento` (
  `id_orcamento` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nome_responsavel` varchar(150) NOT NULL,
  `nome_empresa` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `quantidade_andares` int(11) NOT NULL,
  `quantidade_ambientes` int(11) NOT NULL,
  `quantidade_dispositivos` int(11) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `valor_subtotal` decimal(12,2) DEFAULT NULL,
  `valor_desconto` decimal(12,2) NOT NULL DEFAULT 0.00,
  `valor_total` decimal(12,2) DEFAULT NULL,
  `prazo_estimado_dias` int(11) DEFAULT NULL,
  `data_solicitacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_validade` date DEFAULT NULL,
  `status_orcamento` enum('solicitado','em_analise','enviado','aprovado','recusado','expirado') NOT NULL DEFAULT 'solicitado'
) ;

--
-- Despejando dados para a tabela `orcamento`
--

INSERT INTO `orcamento` (`id_orcamento`, `id_usuario`, `nome_responsavel`, `nome_empresa`, `email`, `telefone`, `quantidade_andares`, `quantidade_ambientes`, `quantidade_dispositivos`, `descricao`, `valor_subtotal`, `valor_desconto`, `valor_total`, `prazo_estimado_dias`, `data_solicitacao`, `data_validade`, `status_orcamento`) VALUES
(1, NULL, 'Carlos Mendes', 'Edificio Central', 'carlos@edificiocentral.com.br', '(11) 98888-1001', 5, 20, 35, 'Instalacao de monitoramento de temperatura e energia.', 3300.00, 0.00, 3300.00, 20, '2026-11-13 14:56:04', '2026-12-10', 'enviado'),
(2, NULL, 'Mariana Oliveira', 'Residencial Jardim', 'mariana@residencialjardim.com.br', '(11) 98888-1002', 8, 40, 60, 'Implantacao de controle de iluminacao e acesso.', 4500.00, 300.00, 4200.00, 30, '2026-11-13 14:56:04', '2026-12-15', 'aprovado'),
(3, NULL, 'Roberto Almeida', 'Centro Empresarial Alfa', 'roberto@empresarialalfa.com.br', '(11) 98888-1003', 3, 15, 25, 'Monitoramento de temperatura e dispositivos.', 2700.00, 100.00, 2600.00, 15, '2026-11-13 14:56:04', '2026-12-20', 'em_analise'),
(4, NULL, 'Fernanda Costa', 'Shopping Nova Era', 'fernanda@shoppingnovaera.com.br', '(11) 98888-1004', 6, 50, 80, 'Monitoramento de energia, controle de acesso e dispositivos.', 5500.00, 500.00, 5000.00, 40, '2026-11-13 14:56:04', '2026-12-25', 'aprovado'),
(5, NULL, 'Lucas Ferreira', 'Hotel Bela Vista', 'lucas@hotelbelavista.com.br', '(11) 98888-1005', 4, 30, 45, 'Monitoramento de temperatura, iluminacao e energia.', 5300.00, 0.00, 5300.00, 25, '2026-11-13 14:56:04', '2026-12-30', 'solicitado'),
(6, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, 'asdasdsa', 5345.00, 0.00, 5345.00, 9, '2026-11-24 14:47:46', '2026-12-24', 'solicitado'),
(7, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, NULL, 3145.00, 0.00, 3145.00, 7, '2026-11-24 14:48:03', '2026-12-24', 'solicitado'),
(8, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, 'asdasd', 2845.00, 0.00, 2845.00, 7, '2026-11-24 14:48:13', '2026-12-24', 'aprovado'),
(9, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, 'sdadasd', 3145.00, 0.00, 3145.00, 7, '2026-11-24 15:09:54', '2026-12-24', 'aprovado'),
(10, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, 'asdasdasdads', 3845.00, 0.00, 3845.00, 7, '2026-11-24 15:27:26', '2026-12-24', 'aprovado'),
(11, NULL, '123123', '123123', 'adasd@213123', '1231231', 1, 1, 1, 'asdasdsad', 1645.00, 0.00, 1645.00, 5, '2026-11-24 15:28:35', '2026-12-24', 'aprovado'),
(12, NULL, 'aaaaaaaa', 'aaaaaa', 'aaaaaa@asaaa', '11', 1, 1, 1, 'asadad', 1345.00, 0.00, 1345.00, 5, '2026-11-24 16:26:37', '2026-12-24', 'aprovado'),
(13, NULL, 'aaaaaaaa123asd', 'aaaaaa', 'aaaaaa@asaaa', '11', 1, 1, 1, 'adasdasd', 1645.00, 0.00, 1645.00, 5, '2026-11-24 16:47:54', '2026-12-24', 'aprovado'),
(14, NULL, '111', '1111', 'adad@asdad', '1', 1, 1, 1, 'asdsad', 1645.00, 0.00, 1645.00, 5, '2026-11-24 16:58:45', '2026-12-24', 'aprovado');

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamento_servico`
--

CREATE TABLE `orcamento_servico` (
  `id_orcamento` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `valor_servico` decimal(12,2) NOT NULL
) ;

--
-- Despejando dados para a tabela `orcamento_servico`
--

INSERT INTO `orcamento_servico` (`id_orcamento`, `id_servico`, `valor_servico`) VALUES
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
(5, 3, 1800.00),
(6, 1, 1500.00),
(6, 4, 2500.00),
(6, 5, 1200.00),
(7, 3, 1800.00),
(7, 5, 1200.00),
(8, 1, 1500.00),
(8, 5, 1200.00),
(9, 3, 1800.00),
(9, 5, 1200.00),
(10, 4, 2500.00),
(10, 5, 1200.00),
(11, 1, 1500.00),
(12, 5, 1200.00),
(13, 1, 1500.00),
(14, 1, 1500.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `id_pagamento` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `valor_pago` decimal(12,2) NOT NULL,
  `metodo_pagamento` enum('pix','cartao_credito','cartao_debito','boleto','transferencia') NOT NULL,
  `status_pagamento` enum('pendente','aprovado','recusado','estornado') NOT NULL DEFAULT 'pendente',
  `codigo_transacao` varchar(150) DEFAULT NULL,
  `data_pagamento` datetime DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `pagamento`
--

INSERT INTO `pagamento` (`id_pagamento`, `id_pedido`, `valor_pago`, `metodo_pagamento`, `status_pagamento`, `codigo_transacao`, `data_pagamento`) VALUES
(1, 1, 4200.00, 'pix', 'pendente', NULL, NULL),
(2, 2, 5000.00, 'cartao_credito', 'aprovado', 'LUMORA-PGTO-2026-002', '2026-11-11 14:30:00'),
(3, 3, 2845.00, 'transferencia', 'aprovado', 'SIM-1795542511052-3', '2026-11-24 14:48:31'),
(4, 5, 3145.00, 'pix', 'aprovado', 'SIM-1795543800884-4', '2026-11-24 15:10:00'),
(5, 7, 3845.00, 'pix', 'aprovado', 'SIM-1795544851328-5', '2026-11-24 15:27:31'),
(6, 11, 1645.00, 'pix', 'aprovado', 'SIM-1795544922262-6', '2026-11-24 15:28:42'),
(7, 13, 1345.00, 'pix', 'aprovado', 'SIM-1795548402822-7', '2026-11-24 16:26:42'),
(8, 15, 1645.00, 'pix', 'aprovado', 'SIM-1795549681509-8', '2026-11-24 16:48:01'),
(9, 17, 1645.00, 'pix', 'aprovado', 'SIM-1795550330535-9', '2026-11-24 16:58:50');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_orcamento` int(11) NOT NULL,
  `data_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `valor_contratado` decimal(12,2) NOT NULL,
  `status_pedido` enum('aguardando_pagamento','confirmado','pagamento_recusado','cancelado') NOT NULL DEFAULT 'aguardando_pagamento',
  `observacoes` text DEFAULT NULL,
  `id_predio` int(11) DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_orcamento`, `data_pedido`, `valor_contratado`, `status_pedido`, `observacoes`, `id_predio`) VALUES
(1, 2, '2026-11-13 14:56:04', 4200.00, 'aguardando_pagamento', 'Orcamento aprovado. Aguardando confirmacao do pagamento.', NULL),
(2, 4, '2026-11-13 14:56:04', 5000.00, 'confirmado', 'Pedido confirmado apos aprovacao do pagamento.', NULL),
(3, 8, '2026-11-24 14:48:17', 2845.00, 'confirmado', NULL, NULL),
(5, 9, '2026-11-24 15:09:56', 3145.00, 'confirmado', NULL, NULL),
(7, 10, '2026-11-24 15:27:28', 3845.00, 'confirmado', NULL, NULL),
(11, 11, '2026-11-24 15:28:37', 1645.00, 'confirmado', NULL, NULL),
(13, 12, '2026-11-24 16:26:39', 1345.00, 'confirmado', NULL, NULL),
(15, 13, '2026-11-24 16:47:57', 1645.00, 'confirmado', NULL, 5),
(17, 14, '2026-11-24 16:58:47', 1645.00, 'confirmado', NULL, 6);

-- --------------------------------------------------------

--
-- Estrutura para tabela `permissao_acesso`
--

CREATE TABLE `permissao_acesso` (
  `id_permissao` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `horario_inicio` time DEFAULT NULL,
  `horario_fim` time DEFAULT NULL,
  `status_permissao` enum('ativa','inativa','suspensa','expirada') NOT NULL DEFAULT 'ativa',
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `dias_semana` varchar(100) DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `permissao_acesso`
--

INSERT INTO `permissao_acesso` (`id_permissao`, `id_usuario`, `id_ambiente`, `horario_inicio`, `horario_fim`, `status_permissao`, `data_inicio`, `data_fim`, `dias_semana`) VALUES
(1, 1, 1, '07:00:00', '19:00:00', 'ativa', '2026-01-01', NULL, 'Segunda a sexta'),
(2, 2, 5, '08:00:00', '22:00:00', 'ativa', '2026-01-01', NULL, 'Segunda a sabado'),
(3, 3, 1, '07:00:00', '18:00:00', 'ativa', '2026-01-01', NULL, 'Todos os dias'),
(4, 4, 4, '08:00:00', '19:00:00', 'ativa', '2026-02-01', NULL, 'Segunda a sexta'),
(5, 5, 5, '09:00:00', '17:00:00', 'ativa', '2026-11-01', '2026-12-31', 'Segunda a sexta');

-- --------------------------------------------------------

--
-- Estrutura para tabela `predio`
--

CREATE TABLE `predio` (
  `id_predio` int(11) NOT NULL,
  `nome_predio` varchar(100) NOT NULL,
  `cep` char(9) NOT NULL,
  `rua` varchar(100) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) NOT NULL,
  `tipo_empreendimento` enum('Comercial','Corporativo','Residencial','Outro') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `predio`
--

INSERT INTO `predio` (`id_predio`, `nome_predio`, `cep`, `rua`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `tipo_empreendimento`) VALUES
(1, 'Edificio Empresarial Central', '09080-500', 'Rua das Acacias', '120', NULL, 'Jardim', 'Santo Andre', 'SP', 'Corporativo'),
(2, 'Centro Empresarial Horizonte', '09020-110', 'Avenida Portugal', '450', 'Bloco A', 'Centro', 'Santo Andre', 'SP', 'Comercial'),
(3, 'Edificio Comercial Nova Era', '09110-300', 'Rua das Figueiras', '780', NULL, 'Campestre', 'Santo Andre', 'SP', 'Comercial'),
(4, 'Condominio Empresarial Park', '09210-050', 'Avenida Industrial', '950', 'Torre 2', 'Jardim', 'Santo Andre', 'SP', 'Corporativo'),
(5, 'vini', '00000-000', 'vini', 'vini', 'vini', 'vini', 'vini', 'VI', 'Corporativo'),
(6, 'sla', '11111-111', 'slasla', 'sla', 'sla', 'sla', 'sla', 'SL', 'Outro');

-- --------------------------------------------------------

--
-- Estrutura para tabela `reclamacoes`
--

CREATE TABLE `reclamacoes` (
  `id_reclamacao` int(11) NOT NULL,
  `id_usuario_abertura` int(11) NOT NULL,
  `id_ambiente` int(11) DEFAULT NULL,
  `id_dispositivo` int(11) DEFAULT NULL,
  `id_usuario_responsavel` int(11) DEFAULT NULL,
  `status_chamado` enum('aberto','em_andamento','concluido','cancelado') NOT NULL DEFAULT 'aberto',
  `data_hora_recebido` datetime NOT NULL DEFAULT current_timestamp(),
  `descricao_usuario` text NOT NULL,
  `prioridade` enum('baixa','media','alta') NOT NULL DEFAULT 'media',
  `categoria_problema` enum('climatizacao','iluminacao','acesso','energia','dispositivo','outro') DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `reclamacoes`
--

INSERT INTO `reclamacoes` (`id_reclamacao`, `id_usuario_abertura`, `id_ambiente`, `id_dispositivo`, `id_usuario_responsavel`, `status_chamado`, `data_hora_recebido`, `descricao_usuario`, `prioridade`, `categoria_problema`) VALUES
(1, 1, 1, 1, 2, 'em_andamento', '2026-11-01 09:15:00', 'Temperatura da recepcao acima do habitual.', 'alta', 'climatizacao'),
(2, 3, 2, 2, 2, 'em_andamento', '2026-11-01 10:30:00', 'Iluminacao da sala de reunioes esta fraca.', 'media', 'iluminacao'),
(3, 5, 5, NULL, 2, 'aberto', '2026-11-02 14:00:00', 'Acesso ao laboratorio nao foi liberado.', 'alta', 'acesso'),
(4, 2, 3, 3, NULL, 'concluido', '2026-11-02 15:20:00', 'Medidor de energia apresentou leitura inconsistente.', 'media', 'energia'),
(5, 4, 4, 4, 2, 'em_andamento', '2026-11-03 08:45:00', 'Sensor do escritorio esta sem atualizar as leituras.', 'alta', 'dispositivo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `servico`
--

CREATE TABLE `servico` (
  `id_servico` int(11) NOT NULL,
  `nome_servico` enum('monitoramento_temperatura','controle_iluminacao','monitoramento_energia','controle_acesso','monitoramento_dispositivos') NOT NULL,
  `valor_base` decimal(12,2) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `servico`
--

INSERT INTO `servico` (`id_servico`, `nome_servico`, `valor_base`, `descricao`) VALUES
(1, 'monitoramento_temperatura', 1500.00, 'Monitoramento da temperatura dos ambientes e identificacao de alteracoes fora dos limites configurados.'),
(2, 'controle_iluminacao', 2000.00, 'Monitoramento dos niveis de iluminacao dos ambientes conforme os limites definidos.'),
(3, 'monitoramento_energia', 1800.00, 'Acompanhamento do consumo e da potencia eletrica, com estimativa de custos de energia.'),
(4, 'controle_acesso', 2500.00, 'Gerenciamento de credenciais, permissoes e registros de entrada e saida dos ambientes.'),
(5, 'monitoramento_dispositivos', 1200.00, 'Acompanhamento do funcionamento e do status dos dispositivos instalados no predio.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `setor`
--

CREATE TABLE `setor` (
  `id_setor` int(11) NOT NULL,
  `id_andar` int(11) NOT NULL,
  `nome_setor` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `id_usuario_responsavel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `setor`
--

INSERT INTO `setor` (`id_setor`, `id_andar`, `nome_setor`, `descricao`, `id_usuario_responsavel`) VALUES
(1, 1, 'Recepcao', 'Setor de atendimento e controle de entrada', 1),
(2, 2, 'Reunioes', 'Setor de salas de reuniao', 1),
(3, 3, 'Atendimento', 'Setor de atendimento ao publico', 3),
(4, 4, 'Administracao', 'Setor administrativo', 1),
(5, 5, 'Tecnologia', 'Setor de laboratorio e tecnologia', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarifa_energia`
--

CREATE TABLE `tarifa_energia` (
  `id_tarifa` int(11) NOT NULL,
  `id_usuario_alteracao` int(11) DEFAULT NULL,
  `id_predio` int(11) NOT NULL,
  `valor_kwh` decimal(10,4) NOT NULL,
  `data_inicio_vigencia` date NOT NULL,
  `data_fim_vigencia` date DEFAULT NULL
) ;

--
-- Despejando dados para a tabela `tarifa_energia`
--

INSERT INTO `tarifa_energia` (`id_tarifa`, `id_usuario_alteracao`, `id_predio`, `valor_kwh`, `data_inicio_vigencia`, `data_fim_vigencia`) VALUES
(1, 1, 1, 0.7350, '2026-01-01', NULL),
(2, 1, 1, 0.7210, '2025-07-01', '2025-12-31'),
(3, 1, 1, 0.6980, '2025-01-01', '2025-06-30'),
(4, 1, 1, 0.6750, '2024-07-01', '2024-12-31'),
(5, 1, 1, 0.6500, '2024-01-01', '2024-06-30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `temperatura`
--

CREATE TABLE `temperatura` (
  `id_temperatura` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_usuario_alteracao` int(11) DEFAULT NULL,
  `temperatura_minima` decimal(5,2) NOT NULL,
  `temperatura_maxima` decimal(5,2) NOT NULL
) ;

--
-- Despejando dados para a tabela `temperatura`
--

INSERT INTO `temperatura` (`id_temperatura`, `id_ambiente`, `id_usuario_alteracao`, `temperatura_minima`, `temperatura_maxima`) VALUES
(1, 1, 1, 20.00, 26.00),
(2, 2, 1, 19.00, 25.00),
(3, 3, 1, 20.00, 27.00),
(4, 4, 1, 20.00, 26.00),
(5, 5, 1, 18.00, 24.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_predio` int(11) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `perfil` enum('administrador','manutencao','porteiro','locador') NOT NULL DEFAULT 'locador',
  `cpf` char(11) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `ativo` enum('ativo','inativo') NOT NULL DEFAULT 'ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_predio`, `nome`, `email`, `senha_hash`, `telefone`, `perfil`, `cpf`, `foto`, `data_nascimento`, `ativo`) VALUES
(1, 1, 'Ana Souza', 'ana.souza@lumora.com.br', '$2b$12$Ovu.vFFoSRc83PhFibn.hurUOnhl6HDj3boOaB6ycsXz6U03mSLQi', '(11) 90000-1001', 'porteiro', '12345678901', NULL, '1988-04-12', 'ativo'),
(2, 1, 'Bruno Lima', 'bruno.lima@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1002', 'manutencao', '12345678902', NULL, '1990-08-21', 'ativo'),
(3, 1, 'Carla Mendes', 'carla.mendes@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1003', 'porteiro', '12345678903', NULL, '1995-02-03', 'ativo'),
(4, 1, 'Diego Alves', 'diego.alves@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', '(11) 90000-1004', 'porteiro', '12345678904', NULL, '1992-11-17', 'ativo'),
(5, 1, 'Elisa Costa', 'elisa.costa@lumora.com.br', '$2y$12$eImiTXuWVxfM37uY4JANjQ.5/A8S9.jU522c2A/0L2j1i2o3p4q5r', NULL, 'locador', '12345678905', NULL, '2000-06-25', 'ativo'),
(14, 1, 'Carlos Oliveira', 'carlos.oliveira@lumora.com.br', '$2b$10$M9oiaNoD8g5t8FXEt6roCO7ORid/9MX9Mnd.9afp7Fq85.Si/b7fO', '(11) 98888-1001', 'locador', '98765432109', NULL, '1990-03-15', 'ativo');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `ambiente`
--
ALTER TABLE `ambiente`
  ADD PRIMARY KEY (`id_ambiente`),
  ADD KEY `fk_ambiente_andar` (`id_andar`),
  ADD KEY `fk_ambiente_setor` (`id_setor`,`id_andar`);

--
-- Índices de tabela `andar`
--
ALTER TABLE `andar`
  ADD PRIMARY KEY (`id_andar`),
  ADD UNIQUE KEY `uk_andar_predio_numero` (`id_predio`,`numero_andar`);

--
-- Índices de tabela `credenciais_acesso`
--
ALTER TABLE `credenciais_acesso`
  ADD PRIMARY KEY (`id_credencial`),
  ADD UNIQUE KEY `uk_credencial_token_hash` (`token_hash`),
  ADD KEY `fk_credencial_usuario` (`id_usuario`);

--
-- Índices de tabela `dispositivo`
--
ALTER TABLE `dispositivo`
  ADD PRIMARY KEY (`id_dispositivo`),
  ADD KEY `fk_dispositivo_ambiente` (`id_ambiente`),
  ADD KEY `fk_dispositivo_usuario` (`id_usuario`),
  ADD KEY `idx_dispositivo_status` (`status_dispositivo`);

--
-- Índices de tabela `energia`
--
ALTER TABLE `energia`
  ADD PRIMARY KEY (`id_energia`),
  ADD UNIQUE KEY `uk_energia_ambiente` (`id_ambiente`),
  ADD KEY `fk_energia_usuario_alteracao` (`id_usuario_alteracao`);

--
-- Índices de tabela `equipe`
--
ALTER TABLE `equipe`
  ADD PRIMARY KEY (`id_equipe`),
  ADD UNIQUE KEY `uk_equipe_predio` (`id_equipe`,`id_predio`),
  ADD KEY `fk_equipe_predio` (`id_predio`);

--
-- Índices de tabela `equipe_usuario`
--
ALTER TABLE `equipe_usuario`
  ADD PRIMARY KEY (`id_equipe_usuario`),
  ADD UNIQUE KEY `id_equipe` (`id_equipe`,`id_usuario`),
  ADD KEY `fk_equipe_usuario_usuario` (`id_usuario`);

--
-- Índices de tabela `eventos_acessos`
--
ALTER TABLE `eventos_acessos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `fk_evento_credencial` (`id_credencial`),
  ADD KEY `fk_evento_ambiente` (`id_ambiente`),
  ADD KEY `idx_eventos_acessos_data` (`data_utilizacao`);

--
-- Índices de tabela `historico_dispositivo`
--
ALTER TABLE `historico_dispositivo`
  ADD PRIMARY KEY (`id_historico_dispositivo`),
  ADD KEY `fk_hist_dispositivo_dispositivo` (`id_dispositivo`);

--
-- Índices de tabela `historico_energia`
--
ALTER TABLE `historico_energia`
  ADD PRIMARY KEY (`id_historico_energia`),
  ADD KEY `fk_hist_energia_dispositivo` (`id_dispositivo`),
  ADD KEY `fk_hist_energia_tarifa` (`id_tarifa`),
  ADD KEY `idx_hist_energia_data` (`data_historico_energia`);

--
-- Índices de tabela `historico_iluminacao`
--
ALTER TABLE `historico_iluminacao`
  ADD PRIMARY KEY (`id_historico_iluminacao`),
  ADD KEY `fk_hist_iluminacao_dispositivo` (`id_dispositivo`),
  ADD KEY `idx_hist_iluminacao_data` (`data_iluminacao`);

--
-- Índices de tabela `historico_ocorrencia`
--
ALTER TABLE `historico_ocorrencia`
  ADD PRIMARY KEY (`id_historico_ocorrencia`),
  ADD KEY `fk_hist_ocorrencia_ocorrencia` (`id_ocorrencia`),
  ADD KEY `fk_hist_ocorrencia_usuario` (`id_usuario`),
  ADD KEY `idx_hist_ocorrencia_data` (`data_historico_ocorrencia`);

--
-- Índices de tabela `historico_temperatura`
--
ALTER TABLE `historico_temperatura`
  ADD PRIMARY KEY (`id_historico_temperatura`),
  ADD KEY `fk_hist_temperatura_dispositivo` (`id_dispositivo`),
  ADD KEY `idx_hist_temperatura_data` (`data_temperatura`);

--
-- Índices de tabela `iluminacao`
--
ALTER TABLE `iluminacao`
  ADD PRIMARY KEY (`id_iluminacao`),
  ADD UNIQUE KEY `uk_iluminacao_ambiente` (`id_ambiente`),
  ADD KEY `fk_iluminacao_usuario_alteracao` (`id_usuario_alteracao`);

--
-- Índices de tabela `ocorrencia`
--
ALTER TABLE `ocorrencia`
  ADD PRIMARY KEY (`id_ocorrencia`),
  ADD KEY `fk_ocorrencia_dispositivo` (`id_dispositivo`),
  ADD KEY `fk_ocorrencia_equipe` (`id_equipe_responsavel`),
  ADD KEY `fk_ocorrencia_tecnico` (`id_tecnico_responsavel`),
  ADD KEY `idx_ocorrencia_status` (`status_ocorrencia`),
  ADD KEY `idx_ocorrencia_data` (`data_ocorrencia`),
  ADD KEY `fk_ocorrencia_usuario_abertura` (`id_usuario_abertura`);

--
-- Índices de tabela `orcamento`
--
ALTER TABLE `orcamento`
  ADD PRIMARY KEY (`id_orcamento`),
  ADD KEY `fk_orcamento_usuario` (`id_usuario`);

--
-- Índices de tabela `orcamento_servico`
--
ALTER TABLE `orcamento_servico`
  ADD PRIMARY KEY (`id_orcamento`,`id_servico`),
  ADD KEY `fk_orcamento_servico_servico` (`id_servico`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD KEY `fk_pagamento_pedido` (`id_pedido`);

--
-- Índices de tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD UNIQUE KEY `id_orcamento` (`id_orcamento`),
  ADD UNIQUE KEY `id_predio` (`id_predio`);

--
-- Índices de tabela `permissao_acesso`
--
ALTER TABLE `permissao_acesso`
  ADD PRIMARY KEY (`id_permissao`),
  ADD KEY `fk_permissao_ambiente` (`id_ambiente`),
  ADD KEY `idx_permissao_usuario_ambiente` (`id_usuario`,`id_ambiente`);

--
-- Índices de tabela `predio`
--
ALTER TABLE `predio`
  ADD PRIMARY KEY (`id_predio`),
  ADD KEY `idx_cep` (`cep`);

--
-- Índices de tabela `reclamacoes`
--
ALTER TABLE `reclamacoes`
  ADD PRIMARY KEY (`id_reclamacao`),
  ADD KEY `fk_reclamacao_abertura` (`id_usuario_abertura`),
  ADD KEY `fk_reclamacao_ambiente` (`id_ambiente`),
  ADD KEY `fk_reclamacao_dispositivo` (`id_dispositivo`),
  ADD KEY `fk_reclamacao_responsavel` (`id_usuario_responsavel`),
  ADD KEY `idx_reclamacao_status` (`status_chamado`);

--
-- Índices de tabela `servico`
--
ALTER TABLE `servico`
  ADD PRIMARY KEY (`id_servico`),
  ADD UNIQUE KEY `uk_nome_servico` (`nome_servico`);

--
-- Índices de tabela `setor`
--
ALTER TABLE `setor`
  ADD PRIMARY KEY (`id_setor`),
  ADD UNIQUE KEY `uk_setor_andar` (`id_andar`,`nome_setor`),
  ADD UNIQUE KEY `uk_setor_id_andar` (`id_setor`,`id_andar`),
  ADD KEY `fk_setor_usuario_responsavel` (`id_usuario_responsavel`);

--
-- Índices de tabela `tarifa_energia`
--
ALTER TABLE `tarifa_energia`
  ADD PRIMARY KEY (`id_tarifa`),
  ADD KEY `fk_tarifa_energia_predio` (`id_predio`),
  ADD KEY `fk_tarifa_usuario_alteracao` (`id_usuario_alteracao`);

--
-- Índices de tabela `temperatura`
--
ALTER TABLE `temperatura`
  ADD PRIMARY KEY (`id_temperatura`),
  ADD UNIQUE KEY `uk_temperatura_ambiente` (`id_ambiente`),
  ADD KEY `fk_temperatura_usuario_alteracao` (`id_usuario_alteracao`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uk_usuario_email` (`email`),
  ADD UNIQUE KEY `uk_usuario_cpf` (`cpf`),
  ADD KEY `fk_usuario_predio` (`id_predio`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `ambiente`
--
ALTER TABLE `ambiente`
  MODIFY `id_ambiente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `andar`
--
ALTER TABLE `andar`
  MODIFY `id_andar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `credenciais_acesso`
--
ALTER TABLE `credenciais_acesso`
  MODIFY `id_credencial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `dispositivo`
--
ALTER TABLE `dispositivo`
  MODIFY `id_dispositivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `energia`
--
ALTER TABLE `energia`
  MODIFY `id_energia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipe`
--
ALTER TABLE `equipe`
  MODIFY `id_equipe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `equipe_usuario`
--
ALTER TABLE `equipe_usuario`
  MODIFY `id_equipe_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `eventos_acessos`
--
ALTER TABLE `eventos_acessos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `historico_dispositivo`
--
ALTER TABLE `historico_dispositivo`
  MODIFY `id_historico_dispositivo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_energia`
--
ALTER TABLE `historico_energia`
  MODIFY `id_historico_energia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_iluminacao`
--
ALTER TABLE `historico_iluminacao`
  MODIFY `id_historico_iluminacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_ocorrencia`
--
ALTER TABLE `historico_ocorrencia`
  MODIFY `id_historico_ocorrencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `historico_temperatura`
--
ALTER TABLE `historico_temperatura`
  MODIFY `id_historico_temperatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `iluminacao`
--
ALTER TABLE `iluminacao`
  MODIFY `id_iluminacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ocorrencia`
--
ALTER TABLE `ocorrencia`
  MODIFY `id_ocorrencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `orcamento`
--
ALTER TABLE `orcamento`
  MODIFY `id_orcamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `permissao_acesso`
--
ALTER TABLE `permissao_acesso`
  MODIFY `id_permissao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `predio`
--
ALTER TABLE `predio`
  MODIFY `id_predio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `reclamacoes`
--
ALTER TABLE `reclamacoes`
  MODIFY `id_reclamacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `id_servico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `setor`
--
ALTER TABLE `setor`
  MODIFY `id_setor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tarifa_energia`
--
ALTER TABLE `tarifa_energia`
  MODIFY `id_tarifa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `temperatura`
--
ALTER TABLE `temperatura`
  MODIFY `id_temperatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `ambiente`
--
ALTER TABLE `ambiente`
  ADD CONSTRAINT `fk_ambiente_andar` FOREIGN KEY (`id_andar`) REFERENCES `andar` (`id_andar`),
  ADD CONSTRAINT `fk_ambiente_setor` FOREIGN KEY (`id_setor`,`id_andar`) REFERENCES `setor` (`id_setor`, `id_andar`);

--
-- Restrições para tabelas `andar`
--
ALTER TABLE `andar`
  ADD CONSTRAINT `fk_andar_predio` FOREIGN KEY (`id_predio`) REFERENCES `predio` (`id_predio`);

--
-- Restrições para tabelas `credenciais_acesso`
--
ALTER TABLE `credenciais_acesso`
  ADD CONSTRAINT `fk_credencial_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `dispositivo`
--
ALTER TABLE `dispositivo`
  ADD CONSTRAINT `fk_dispositivo_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_dispositivo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `energia`
--
ALTER TABLE `energia`
  ADD CONSTRAINT `fk_energia_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_energia_usuario_alteracao` FOREIGN KEY (`id_usuario_alteracao`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `equipe`
--
ALTER TABLE `equipe`
  ADD CONSTRAINT `fk_equipe_predio` FOREIGN KEY (`id_predio`) REFERENCES `predio` (`id_predio`);

--
-- Restrições para tabelas `equipe_usuario`
--
ALTER TABLE `equipe_usuario`
  ADD CONSTRAINT `fk_equipe_usuario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `eventos_acessos`
--
ALTER TABLE `eventos_acessos`
  ADD CONSTRAINT `fk_evento_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_evento_credencial` FOREIGN KEY (`id_credencial`) REFERENCES `credenciais_acesso` (`id_credencial`);

--
-- Restrições para tabelas `historico_dispositivo`
--
ALTER TABLE `historico_dispositivo`
  ADD CONSTRAINT `fk_hist_dispositivo_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`);

--
-- Restrições para tabelas `historico_energia`
--
ALTER TABLE `historico_energia`
  ADD CONSTRAINT `fk_hist_energia_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`),
  ADD CONSTRAINT `fk_hist_energia_tarifa` FOREIGN KEY (`id_tarifa`) REFERENCES `tarifa_energia` (`id_tarifa`);

--
-- Restrições para tabelas `historico_iluminacao`
--
ALTER TABLE `historico_iluminacao`
  ADD CONSTRAINT `fk_hist_iluminacao_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`);

--
-- Restrições para tabelas `historico_ocorrencia`
--
ALTER TABLE `historico_ocorrencia`
  ADD CONSTRAINT `fk_hist_ocorrencia_ocorrencia` FOREIGN KEY (`id_ocorrencia`) REFERENCES `ocorrencia` (`id_ocorrencia`),
  ADD CONSTRAINT `fk_hist_ocorrencia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `historico_temperatura`
--
ALTER TABLE `historico_temperatura`
  ADD CONSTRAINT `fk_hist_temperatura_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`);

--
-- Restrições para tabelas `iluminacao`
--
ALTER TABLE `iluminacao`
  ADD CONSTRAINT `fk_iluminacao_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_iluminacao_usuario_alteracao` FOREIGN KEY (`id_usuario_alteracao`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `ocorrencia`
--
ALTER TABLE `ocorrencia`
  ADD CONSTRAINT `fk_ocorrencia_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`),
  ADD CONSTRAINT `fk_ocorrencia_equipe` FOREIGN KEY (`id_equipe_responsavel`) REFERENCES `equipe` (`id_equipe`),
  ADD CONSTRAINT `fk_ocorrencia_tecnico` FOREIGN KEY (`id_tecnico_responsavel`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_ocorrencia_usuario_abertura` FOREIGN KEY (`id_usuario_abertura`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `orcamento`
--
ALTER TABLE `orcamento`
  ADD CONSTRAINT `fk_orcamento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL;

--
-- Restrições para tabelas `orcamento_servico`
--
ALTER TABLE `orcamento_servico`
  ADD CONSTRAINT `fk_orcamento_servico_orcamento` FOREIGN KEY (`id_orcamento`) REFERENCES `orcamento` (`id_orcamento`),
  ADD CONSTRAINT `fk_orcamento_servico_servico` FOREIGN KEY (`id_servico`) REFERENCES `servico` (`id_servico`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `fk_pagamento_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

--
-- Restrições para tabelas `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_pedido_orcamento` FOREIGN KEY (`id_orcamento`) REFERENCES `orcamento` (`id_orcamento`),
  ADD CONSTRAINT `fk_pedido_predio` FOREIGN KEY (`id_predio`) REFERENCES `predio` (`id_predio`);

--
-- Restrições para tabelas `permissao_acesso`
--
ALTER TABLE `permissao_acesso`
  ADD CONSTRAINT `fk_permissao_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_permissao_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `reclamacoes`
--
ALTER TABLE `reclamacoes`
  ADD CONSTRAINT `fk_reclamacao_abertura` FOREIGN KEY (`id_usuario_abertura`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_reclamacao_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_reclamacao_dispositivo` FOREIGN KEY (`id_dispositivo`) REFERENCES `dispositivo` (`id_dispositivo`),
  ADD CONSTRAINT `fk_reclamacao_responsavel` FOREIGN KEY (`id_usuario_responsavel`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `setor`
--
ALTER TABLE `setor`
  ADD CONSTRAINT `fk_setor_andar` FOREIGN KEY (`id_andar`) REFERENCES `andar` (`id_andar`),
  ADD CONSTRAINT `fk_setor_usuario_responsavel` FOREIGN KEY (`id_usuario_responsavel`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `tarifa_energia`
--
ALTER TABLE `tarifa_energia`
  ADD CONSTRAINT `fk_tarifa_energia_predio` FOREIGN KEY (`id_predio`) REFERENCES `predio` (`id_predio`),
  ADD CONSTRAINT `fk_tarifa_usuario_alteracao` FOREIGN KEY (`id_usuario_alteracao`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `temperatura`
--
ALTER TABLE `temperatura`
  ADD CONSTRAINT `fk_temperatura_ambiente` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `fk_temperatura_usuario_alteracao` FOREIGN KEY (`id_usuario_alteracao`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_predio` FOREIGN KEY (`id_predio`) REFERENCES `predio` (`id_predio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

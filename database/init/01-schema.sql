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
(id_reclamacao, id_usuario, id_ambiente, id_dispositivo, id_usuario_responsavel, status_chamado, data_hora_recebido, descricao_usuario, prioridade, categoria_problema)
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

-- Cada ocorrencia e gerada por um dispositivo. O ambiente e identificado
-- pelo relacionamento do dispositivo com o ambiente. O responsavel e opcional.
INSERT INTO ocorrencia
(id_ocorrencia, id_dispositivo, id_usuario_abertura, id_usuario_responsavel, titulo, descricao, origem, status_ocorrencia, prioridade, data_ocorrencia, resolvida_em)
VALUES
(1, 1, NULL, 2, 'Temperatura acima do limite', 'Sensor registrou 27,5 graus, acima do limite configurado para a recepcao.', 'dispositivo', 'Em andamento', 'Alta', '2026-11-04 08:05:00', NULL),
(2, 2, NULL, NULL, 'Iluminacao abaixo do limite', 'Iluminacao da sala de reunioes ficou abaixo do minimo configurado.', 'dispositivo', 'Aberta', 'Media', '2026-11-04 08:10:00', NULL),
(3, 3, NULL, NULL, 'Consumo elevado de energia', 'Consumo medido se aproximou do limite definido para o ambiente.', 'dispositivo', 'Aberta', 'Alta', '2026-11-04 10:05:00', NULL),
(4, 4, NULL, 4, 'Leitura irregular do sensor', 'Foram identificadas variacoes incomuns nas leituras de temperatura.', 'dispositivo', 'Resolvida', 'Media', '2026-11-03 14:00:00', '2026-11-03 16:30:00'),
(5, 5, NULL, NULL, 'Iluminacao fora do padrao', 'Leitura de iluminacao ficou abaixo do limite minimo do laboratorio.', 'dispositivo', 'Aberta', 'Alta', '2026-11-04 10:35:00', NULL);

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

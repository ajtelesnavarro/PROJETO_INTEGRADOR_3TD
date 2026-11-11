
export const recursos = {
    predios: {
        tabela: 'predio',
        id: 'id_predio',
        campos: [
            'nome_predio',
            'cep',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado'
        ],
        obrigatorios: [
            'nome_predio',
            'cep',
            'logradouro',
            'numero',
            'bairro',
            'cidade',
            'estado'
        ]
    },

    andares: {
        tabela: 'andar',
        id: 'id_andar',
        campos: [
            'id_predio',
            'numero_andar',
            'descricao',
            'data_cadastro'
        ],
        obrigatorios: [
            'id_predio',
            'numero_andar'
        ]
    },

    ambientes: {
        tabela: 'ambiente',
        id: 'id_ambiente',
        campos: [
            'id_andar',
            'id_setor',
            'requer_reserva',
            'nome',
            'localizacao',
            'capacidade_maxima',
            'horario_abertura',
            'horario_fechamento'
        ],
        obrigatorios: [
            'id_andar',
            'nome'
        ]
    },

    dispositivos: {
        tabela: 'dispositivo',
        id: 'id_dispositivo',
        campos: [
            'id_ambiente',
            'id_usuario',
            'nome',
            'tipo_dispositivo',
            'fabricante',
            'modelo',
            'unidade_medida',
            'potencia_nominal_kw',
            'data_dispositivo',
            'identificador',
            'status_dispositivo'
        ],
        obrigatorios: [
            'id_ambiente',
            'nome',
            'tipo_dispositivo',
            'identificador'
        ]
    },

    acessos: {
        tabela: 'eventos_acessos',
        id: 'id_evento',
        campos: [
            'id_credencial',
            'id_ambiente',
            'tipo_acesso',
            'decisao_acesso',
            'token_tentado',
            'status_evento',
            'data_expiracao',
            'data_utilizacao',
            'motivo'
        ],
        obrigatorios: [
            'id_ambiente',
            'tipo_acesso',
            'decisao_acesso'
        ]
    },

    ocorrencias: {
        tabela: 'ocorrencia',
        id: 'id_ocorrencia',
        campos: [
            'id_dispositivo',
            'id_equipe_responsavel',
            'id_tecnico_responsavel',
            'titulo',
            'descricao',
            'status_ocorrencia',
            'prioridade',
            'data_ocorrencia',
            'resolvida_em'
        ],
        obrigatorios: [
            'id_dispositivo',
            'titulo',
            'descricao'
        ]
    }
};

export const tiposLeitura = {
    temperatura: {
        tabela: 'historico_temperatura',
        id: 'id_historico_temperatura',
        campoValor: 'temperatura_medida',
        campoData: 'data_temperatura',
        unidade: '\u00B0C'
    },

    iluminacao: {
        tabela: 'historico_iluminacao',
        id: 'id_historico_iluminacao',
        campoValor: 'iluminacao_medida',
        campoData: 'data_iluminacao',
        unidade: 'lux'
    },

    energia: {
        tabela: 'historico_energia',
        id: 'id_historico_energia',
        campoValor: 'consumo_kwh',
        campoData: 'data_historico_energia',
        unidade: 'kWh'
    }
};

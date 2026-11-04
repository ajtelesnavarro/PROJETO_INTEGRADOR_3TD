
export const recursos = {
    predios: {
        tabela: 'predio',
        id: 'id_predio',
        campos: [
            'nome_predio',
            'endereco',
            'rua',
            'bairro',
            'complemento',
            'numero',
            'estado',
            'cep',
            'cidade'
        ],
        obrigatorios: ['nome_predio']
    },

    andares: {
        tabela: 'andar',
        id: 'id_andar',
        campos: [
            'id_predio',
            'numero_andar',
            'descricao',
            'data_andar'
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
            'localizacao',
            'capacidade_maxima',
            'requer_reserva',
            'horario_abertura',
            'nome',
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
            'tipo_dispositivo',
            'fabricante',
            'modelo',
            'versao',
            'unidade_medida',
            'data_dispositivo',
            'potencia_nominal_kw'
        ],
        obrigatorios: [
            'id_ambiente',
            'tipo_dispositivo'
        ]
    },

    acessos: {
        tabela: 'eventos_acessos',
        id: 'id_evento',
        campos: [
            'id_ambiente',
            'id_credencial',
            'motivo',
            'tipo_acesso',
            'decisao_acesso',
            'token_tentado',
            'data_expiracao',
            'data_utilizacao'
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
            'id_ambiente',
            'id_usuario_responsavel',
            'titulo',
            'descricao',
            'status',
            'data_ocorrencia',
            'origem'
        ],
        obrigatorios: [
            'id_dispositivo',
            'id_ambiente',
            'titulo'
        ]
    }
};

export const tiposLeitura = {
    temperatura: {
        tabela: 'historico_temperatura',
        id: 'id_historico_temperatura',
        campoValor: 'temperatura_medida',
        campoData: 'data_temperatura',
        unidade: '°C'
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

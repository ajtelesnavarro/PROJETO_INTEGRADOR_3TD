
import * as Model from '../../models/RecursoModel.js';
import { tiposLeitura } from './recursoConfig.js';
import {
    validarId,
    validarNumero,
    validarData,
    validarPeriodo
} from './validacaoService.js';

function validarTipo(tipo) {
    if (!Object.hasOwn(tiposLeitura, tipo)) {
        throw new TypeError(
            'Tipo de leitura deve ser temperatura, iluminacao ou energia.'
        );
    }

    return tipo;
}

export async function listar(filtros = {}, paginacao = {}) {
    const ambienteId = filtros.ambienteId
        ? validarId(filtros.ambienteId, 'ID do ambiente')
        : null;

    const tipo = filtros.tipo
        ? validarTipo(filtros.tipo)
        : null;

    const periodo = validarPeriodo(filtros);

    return Model.listarLeituras({
        ambienteId,
        tipo,
        ...periodo,
        limite: paginacao.limite || 50,
        offset: paginacao.offset || 0
    });
}

export async function buscar(tipoRecebido, idRecebido) {
    const tipo = validarTipo(tipoRecebido);
    const id = validarId(idRecebido, 'ID da leitura');

    const leitura = await Model.buscarLeitura(tipo, id);

    if (!leitura) {
        const erro = new Error('Leitura não encontrada.');
        erro.status = 404;
        throw erro;
    }

    return leitura;
}

export async function criar(tipoRecebido, dados) {
    const tipo = validarTipo(tipoRecebido);

    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new TypeError('Os dados da leitura devem ser um objeto.');
    }

    const camposPermitidos = {
        temperatura: [
            'dispositivo_id',
            'valor',
            'umidade',
            'data_hora'
        ],
        iluminacao: [
            'dispositivo_id',
            'valor',
            'data_hora'
        ],
        energia: [
            'dispositivo_id',
            'valor',
            'tarifa_id',
            'potencia_kw',
            'qualidade_medicao',
            'data_hora'
        ]
    };

    for (const campo of Object.keys(dados)) {
        if (!camposPermitidos[tipo].includes(campo)) {
            throw new TypeError(`Campo não permitido: ${campo}.`);
        }
    }

    const dispositivoId = validarId(
        dados.dispositivo_id,
        'ID do dispositivo'
    );

    const dispositivo = await Model.buscarDispositivo(dispositivoId);

    if (!dispositivo) {
        const erro = new Error('Dispositivo não encontrado.');
        erro.status = 404;
        throw erro;
    }

    const valor = validarNumero(dados.valor, 'Valor da leitura');

    if (tipo !== 'temperatura' && valor < 0) {
        throw new TypeError('O valor da leitura não pode ser negativo.');
    }

    const dataHora = dados.data_hora === undefined
        ? new Date()
        : validarData(dados.data_hora, 'Data da leitura');

    const leitura = {
        dispositivo_id: dispositivoId,
        valor,
        data_hora: dataHora
    };

    if (tipo === 'temperatura' && dados.umidade !== undefined) {
        leitura.umidade = validarNumero(dados.umidade, 'Umidade');

        if (leitura.umidade < 0 || leitura.umidade > 100) {
            throw new TypeError('A umidade deve estar entre 0 e 100.');
        }
    }

    if (tipo === 'energia') {
        leitura.potencia_kw = validarNumero(
            dados.potencia_kw,
            'Potência'
        );

        if (leitura.potencia_kw < 0) {
            throw new TypeError('A potência não pode ser negativa.');
        }

        if (dados.tarifa_id !== undefined && dados.tarifa_id !== null) {
            leitura.tarifa_id = validarId(
                dados.tarifa_id,
                'ID da tarifa'
            );
        }

        if (dados.qualidade_medicao !== undefined) {
            const qualidades = ['boa', 'regular', 'ruim'];

            if (!qualidades.includes(dados.qualidade_medicao)) {
                throw new TypeError(
                    'Qualidade deve ser boa, regular ou ruim.'
                );
            }

            leitura.qualidade_medicao = dados.qualidade_medicao;
        }
    }

    return Model.criarLeitura(tipo, leitura);
}

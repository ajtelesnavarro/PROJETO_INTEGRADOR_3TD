
import * as Model from '../../models/RecursoModel.js';
import { recursos } from './recursoConfig.js';
import { validarId, preparar } from './validacaoService.js';

const config = recursos.predios;

export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const id = validarId(idRecebido);
    const predio = await Model.buscar(config, id);

    if (!predio) {
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return predio;
}

export async function criar(dados) {
    const dadosValidados = preparar(config, dados);
    return Model.criar(config, dadosValidados);
}

export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);
    const dadosValidados = preparar(config, dados, true);

    if (Object.keys(dadosValidados).length === 0) {
        throw new TypeError('Informe os campos para atualização.');
    }

    const atualizou = await Model.atualizar(
        config,
        id,
        dadosValidados
    );

    if (!atualizou) {
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return buscar(id);
}

export async function excluir(idRecebido) {
    const id = validarId(idRecebido);
    const removeu = await Model.excluir(config, id);

    if (!removeu) {
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return { sucesso: true };
}

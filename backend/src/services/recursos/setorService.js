import * as Model from '../../models/RecursoModel.js';
import { recursos } from './recursoConfig.js';
import { validarId, preparar } from './validacaoService.js';

const config = recursos.setores;

export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const setor = await Model.buscar(config, validarId(idRecebido));
    if (!setor) {
        const erro = new Error('Setor não encontrado.');
        erro.status = 404;
        throw erro;
    }
    return setor;
}

export async function criar(dados) {
    return Model.criar(config, preparar(config, dados));
}

export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);
    const validados = preparar(config, dados, true);
    if (!Object.keys(validados).length) throw new TypeError('Informe os campos para atualização.');
    if (!await Model.atualizar(config, id, validados)) {
        const erro = new Error('Setor não encontrado.');
        erro.status = 404;
        throw erro;
    }
    return buscar(id);
}

export async function excluir(idRecebido) {
    if (!await Model.excluir(config, validarId(idRecebido))) {
        const erro = new Error('Setor não encontrado.');
        erro.status = 404;
        throw erro;
    }
    return { sucesso: true };
}

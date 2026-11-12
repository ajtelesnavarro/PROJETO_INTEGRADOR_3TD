import * as Model from '../../models/RecursoModel.js';
import { recursos } from './recursoConfig.js';
import { validarId } from './validacaoService.js';

const config = recursos.acessos;

export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const id = validarId(idRecebido);
    const acesso = await Model.buscar(config, id);

    if (!acesso) {
        const erro = new Error('Evento de acesso não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return acesso;
}
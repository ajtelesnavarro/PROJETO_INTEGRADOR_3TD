
import * as OrcamentoModel from '../models/OrcamentoModels.js';

export const listar = async () => {
    return await OrcamentoModel.listar();
};

export const buscarPorEmail = async (email) => {
    const orcamentos = await OrcamentoModel.buscarPorEmail(email);

    if (orcamentos.length === 0) {
        throw new Error('Nenhum orçamento encontrado para esse email.');
    }

    return orcamentos;
};

export const criar = async (dados) => {
    return await OrcamentoModel.criar(dados);
};

export const atualizar = async (id, dados) => {
    const orcamento = await OrcamentoModel.buscarPorId(id);

    if (!orcamento) {
        throw new Error('Orçamento não encontrado.');
    }

    return await OrcamentoModel.atualizar(id, dados);
};

export const excluir = async (id) => {
    const orcamento = await OrcamentoModel.buscarPorId(id);

    if (!orcamento) {
        throw new Error('Orçamento não encontrado.');
    }

    return await OrcamentoModel.excluir(id);
};

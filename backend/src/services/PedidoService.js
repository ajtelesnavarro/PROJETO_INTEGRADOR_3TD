
import * as PedidoModel from '../models/PedidoModels.js';

export const listar = async () => {
    return await PedidoModel.listar();
};

export const buscarPorOrcamento = async (id_orcamento) => {
    const pedido = await PedidoModel.buscarPorOrcamento(id_orcamento);

    if (!pedido) {
        throw new Error('Nenhum pedido encontrado para esse orçamento.');
    }

    return pedido;
};

export const criar = async (dados) => {
    const orcamento = await PedidoModel.buscarOrcamento(dados.id_orcamento);

    if (!orcamento) {
        throw new Error('Orçamento não encontrado.');
    }

    if (orcamento.status_orcamento !== 'aprovado') {
        throw new Error('Só é possível criar pedidos de orçamentos aprovados.');
    }

    const pedidoExistente = await PedidoModel.buscarPorOrcamento(dados.id_orcamento);

    if (pedidoExistente) {
        throw new Error('Já existe um pedido para esse orçamento.');
    }

    return await PedidoModel.criar(dados);
};

export const atualizar = async (id, dados) => {
    const pedido = await PedidoModel.buscarPorId(id);

    if (!pedido) {
        throw new Error('Pedido não encontrado.');
    }

    return await PedidoModel.atualizar(id, dados);
};

export const excluir = async (id) => {
    const pedido = await PedidoModel.buscarPorId(id);

    if (!pedido) {
        throw new Error('Pedido não encontrado.');
    }

    return await PedidoModel.excluir(id);
};

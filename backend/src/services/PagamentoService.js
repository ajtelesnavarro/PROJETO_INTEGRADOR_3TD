
import * as PagamentoModel from '../models/PagamentoModels.js';

const METODOS = [
    'pix',
    'cartao_credito',
    'cartao_debito',
    'boleto',
    'transferencia'
];

const STATUS = [
    'pendente',
    'aprovado',
    'recusado',
    'estornado'
];

function validarId(valor) {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError('ID inválido.');
    }

    return id;
}

function validarPagamento(dados) {
    const id_pedido = validarId(dados.id_pedido);
    const valor_pago = Number(dados.valor_pago);

    if (!Number.isFinite(valor_pago) || valor_pago <= 0) {
        throw new TypeError('O valor do pagamento deve ser maior que zero.');
    }

    if (!METODOS.includes(dados.metodo_pagamento)) {
        throw new TypeError('Método de pagamento inválido.');
    }

    const status_pagamento = dados.status_pagamento || 'pendente';

    if (!STATUS.includes(status_pagamento)) {
        throw new TypeError('Status do pagamento inválido.');
    }

    return {
        id_pedido,
        valor_pago,
        metodo_pagamento: dados.metodo_pagamento,
        status_pagamento,
        codigo_transacao: dados.codigo_transacao || null,
        data_pagamento: dados.data_pagamento || null
    };
}

// Listar todos ou filtrar pelo pedido
export async function listar(idPedido) {
    const id = idPedido ? validarId(idPedido) : null;
    return await PagamentoModel.listar(id);
}

// Buscar por ID
export async function buscarPorId(idRecebido) {
    const id = validarId(idRecebido);
    const pagamento = await PagamentoModel.buscarPorId(id);

    if (!pagamento) {
        const erro = new Error('Pagamento não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return pagamento;
}

// Criar
export async function criar(dados) {
    const pagamento = validarPagamento(dados);

    const id = await PagamentoModel.criar(pagamento);

    return await PagamentoModel.buscarPorId(id);
}

// Atualizar
export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);
    const pagamento = validarPagamento(dados);

    const existe = await PagamentoModel.buscarPorId(id);

    if (!existe) {
        const erro = new Error('Pagamento não encontrado.');
        erro.status = 404;
        throw erro;
    }

    await PagamentoModel.atualizar(id, pagamento);

    return await PagamentoModel.buscarPorId(id);
}

// Excluir
export async function excluir(idRecebido) {
    const id = validarId(idRecebido);

    const removeu = await PagamentoModel.excluir(id);

    if (!removeu) {
        const erro = new Error('Pagamento não encontrado.');
        erro.status = 404;
        throw erro;
    }
}

export function criarPagamentoService({
    pagamentoModel,
    pedidoModel
}) {

    async function buscarPorId(id) {
        const pagamento = await pagamentoModel.buscarPorId(id);
    
        if (!pagamento) {
            throw new Error("Pagamento não encontrado.");
        }
    
        return pagamento;
    }

    async function criar(dados) {
        const pedido = await pedidoModel.buscarPorId(dados.idPedido);

        if (!pedido) {
            throw new Error("Pedido não encontrado.");
        }

        if (pedido.status_pedido !== "aguardando_pagamento") {
            throw new Error("Este pedido não está aguardando pagamento.");
        }

        const metodosPermitidos = [
            "pix",
            "cartao_credito",
            "cartao_debito",
            "boleto",
            "transferencia"
        ];

        if (!metodosPermitidos.includes(dados.metodoPagamento)) {
            throw new Error("Método de pagamento inválido.");
        }

        const idPagamento = await pagamentoModel.criar({
            idPedido: dados.idPedido,
            valorPago: pedido.valor_contratado,
            metodoPagamento: dados.metodoPagamento
        });

        return { idPagamento };
    }

    return {
        criar,
        buscarPorId
    };
}
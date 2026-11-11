export function criarPedidoService({
    pedidoModel,
    orcamentoModel
}) {

    async function criar(idOrcamento) {
        const orcamento = await orcamentoModel.buscarPorId(idOrcamento);

        if (!orcamento) {
            throw new Error("Orçamento não encontrado.");
        }

        if (orcamento.status_orcamento !== "aprovado") {
            throw new Error("O orçamento precisa estar aprovado.");
        }

        const idPedido = await pedidoModel.criar({
            idOrcamento,
            valorContratado: orcamento.valor_total
        });

        return { idPedido };
    }

    async function buscarPorId(id) {
        const pedido = await pedidoModel.buscarPorId(id);

        if (!pedido) {
            throw new Error("Pedido não encontrado.");
        }

        return pedido;
    }

    return {
        criar,
        buscarPorId
    };
}
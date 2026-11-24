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

        const dadosFicticios = dados.dadosFicticios || {};
        const somenteNumeros = (valor) => String(valor || "").replace(/\D/g, "");

        if (
            dados.metodoPagamento === "pix" &&
            String(dadosFicticios.codigoPix || "").trim().length < 4
        ) {
            throw new Error("Informe o código PIX fictício para a simulação.");
        }

        if (["cartao_credito", "cartao_debito"].includes(dados.metodoPagamento)) {
            const numeroCartao = somenteNumeros(dadosFicticios.numeroCartao);
            const cvv = somenteNumeros(dadosFicticios.cvv);
            if (
                !String(dadosFicticios.titular || "").trim() ||
                numeroCartao.length < 12 ||
                numeroCartao.length > 19 ||
                !/^\d{2}\/\d{2,4}$/.test(String(dadosFicticios.validade || "")) ||
                cvv.length < 3 ||
                cvv.length > 4
            ) {
                throw new Error("Preencha os dados fictícios do cartão.");
            }
        }

        if (dados.metodoPagamento === "boleto") {
            const codigoBarras = somenteNumeros(dadosFicticios.codigoBarras);
            if (codigoBarras.length < 10 || codigoBarras.length > 48) {
                throw new Error("Informe um código de barras fictício válido.");
            }
        }

        if (
            dados.metodoPagamento === "transferencia" &&
            String(dadosFicticios.referencia || "").trim().length < 4
        ) {
            throw new Error("Informe a referência fictícia da transferência.");
        }

        const idPagamento = await pagamentoModel.criar({
            idPedido: dados.idPedido,
            valorPago: pedido.valor_contratado,
            metodoPagamento: dados.metodoPagamento
        });

        // Simula a aprovação; os dados fictícios não são armazenados.
        const codigoTransacao = `SIM-${Date.now()}-${idPagamento}`;
        await pagamentoModel.atualizarResultado(
            idPagamento,
            "aprovado",
            codigoTransacao
        );
        await pedidoModel.atualizarStatus(dados.idPedido, "confirmado");

        return { idPagamento };
    }

    return {
        criar,
        buscarPorId
    };
}

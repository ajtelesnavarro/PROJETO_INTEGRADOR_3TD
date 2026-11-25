export function criarPagamentoService({
    pagamentoModel,
    pedidoModel,
    orcamentoModel,
    provisionamentoPredioModel
}) {

    async function buscarPorId(id) {
        const pagamento = await pagamentoModel.buscarPorId(id);
    
        if (!pagamento) {
            throw new Error("Pagamento não encontrado.");
        }
    
        return pagamento;
    }

    async function buscarOrcamentoPorPedido(idPedido) {
        const pedido = await pedidoModel.buscarPorId(idPedido);

        if (!pedido) {
            throw new Error("Pedido não encontrado.");
        }

        const orcamento = await orcamentoModel.buscarPorId(pedido.id_orcamento);

        if (!orcamento) {
            throw new Error("Orçamento não encontrado.");
        }

        return orcamento;
    }

    async function buscarOrcamentoPorPagamento(idPagamento) {
        const pagamento = await pagamentoModel.buscarPorId(idPagamento);

        if (!pagamento) {
            throw new Error("Pagamento não encontrado.");
        }
        if (pagamento.status_pagamento !== "aprovado") {
            throw new Error("O pagamento ainda não foi aprovado.");
        }

        return buscarOrcamentoPorPedido(pagamento.id_pedido);
    }

    async function criarPredioDoPagamento(idPagamento, dados) {
        const camposObrigatorios = ["nome_predio", "cep", "rua", "numero", "bairro", "cidade", "estado"];
        for (const campo of camposObrigatorios) {
            if (!String(dados?.[campo] ?? "").trim()) {
                const erro = new Error(`O campo ${campo} é obrigatório.`);
                erro.status = 400;
                throw erro;
            }
        }

        const cep = String(dados.cep).replace(/\D/g, "");
        const estado = String(dados.estado).trim().toUpperCase();
        const estadosValidos = new Set([
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
            "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
            "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ]);
        if (cep.length !== 8) {
            const erro = new Error("Informe um CEP válido com 8 dígitos.");
            erro.status = 400;
            throw erro;
        }
        if (!estadosValidos.has(estado)) {
            const erro = new Error("Selecione uma UF válida.");
            erro.status = 400;
            throw erro;
        }

        return provisionamentoPredioModel.criarParaPagamento(idPagamento, {
            nome_predio: String(dados.nome_predio).trim(),
            cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
            rua: String(dados.rua).trim(),
            numero: String(dados.numero).trim(),
            complemento: String(dados.complemento || "").trim() || null,
            bairro: String(dados.bairro).trim(),
            cidade: String(dados.cidade).trim(),
            estado,
        });
    }

    async function buscarPredioDoPagamento(idPagamento) {
        const pagamento = await pagamentoModel.buscarPorId(idPagamento);
        if (!pagamento) {
            const erro = new Error("Pagamento não encontrado.");
            erro.status = 404;
            throw erro;
        }
        if (pagamento.status_pagamento !== "aprovado") {
            const erro = new Error("O pagamento ainda não foi confirmado.");
            erro.status = 409;
            throw erro;
        }
        return provisionamentoPredioModel.buscarPorPagamento(idPagamento);
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
        buscarPorId,
        buscarOrcamentoPorPedido,
        buscarOrcamentoPorPagamento,
        criarPredioDoPagamento,
        buscarPredioDoPagamento
    };
}

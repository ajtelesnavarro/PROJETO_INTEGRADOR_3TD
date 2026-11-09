export function criarOrcamentoService({ orcamentoModel }) {

    async function criar(dados) {
        if (
            !dados.nomeResponsavel ||
            !dados.nomeEmpresa ||
            !dados.email ||
            !dados.telefone ||
            !dados.quantidadeAndares ||
            !dados.quantidadeAmbientes ||
            !dados.servicosDesejados
        ) {
            throw new Error("Preencha todos os campos obrigatórios.");
        }

        // Os valores precisam ser calculados
        // conforme a regra comercial da Lumora.

        const idOrcamento = await orcamentoModel.criar({
            ...dados,
            valorSubtotal: null,
            valorDesconto: 0,
            valorTotal: null,
            prazoEstimadoDias: null,
            dataValidade: null
        });

        return { idOrcamento };
    }

    async function buscarPorId(id) {
        const orcamento = await orcamentoModel.buscarPorId(id);

        if (!orcamento) {
            throw new Error("Orçamento não encontrado.");
        }

        return orcamento;
    }

    async function atualizarStatus(id, status) {
        const orcamento = await buscarPorId(id);

        if (orcamento.status_orcamento === "aprovado" ||
            orcamento.status_orcamento === "recusado") {
            throw new Error("Este orçamento já foi finalizado.");
        }

        await orcamentoModel.atualizarStatus(id, status);
    }

    return {
        criar,
        buscarPorId,
        atualizarStatus
    };
}
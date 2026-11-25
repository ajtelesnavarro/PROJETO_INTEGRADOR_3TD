export function criarOrcamentoController({ orcamentoService }) {
    async function criar(req, res) {
        try {
            const resultado = await orcamentoService.criar(req.body);
            res.status(201).json({ sucesso: true, ...resultado });
        } catch (erro) {
            res.status(erro.status || 400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function listar(_req, res) {
        try {
            const dados = await orcamentoService.listar();
            res.json({ sucesso: true, dados });
        } catch (erro) {
            res.status(500).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const resultado = await orcamentoService.buscarPorId(req.params.id);
            res.json({ sucesso: true, dados: resultado });
        } catch (erro) {
            res.status(404).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function atualizarStatus(req, res) {
        try {
            const status = req.body.status_orcamento || req.body.status;
            const resultado = await orcamentoService.atualizarStatus(req.params.id, status);
            res.json({ sucesso: true, mensagem: "Status atualizado.", dados: resultado });
        } catch (erro) {
            res.status(400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function aprovar(req, res) {
        try {
            await orcamentoService.atualizarStatus(req.params.id, "aprovado");
            res.json({ sucesso: true, mensagem: "Orçamento aprovado." });
        } catch (erro) {
            res.status(400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function recusar(req, res) {
        try {
            await orcamentoService.atualizarStatus(req.params.id, "recusado");
            res.json({ sucesso: true, mensagem: "Orçamento recusado." });
        } catch (erro) {
            res.status(400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    return {
        criar,
        listar,
        buscarPorId,
        atualizarStatus,
        aprovar,
        recusar
    };
}

export function criarOrcamentoController({ orcamentoService }) {

    async function criar(req, res) {
        try {
            const resultado = await orcamentoService.criar(req.body);

            res.status(201).json(resultado);
        } catch (erro) {
            res.status(400).json({
                mensagem: erro.message
            });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const resultado = await orcamentoService.buscarPorId(
                req.params.id
            );

            res.json(resultado);
        } catch (erro) {
            res.status(404).json({
                mensagem: erro.message
            });
        }
    }

    async function aprovar(req, res) {
        try {
            await orcamentoService.atualizarStatus(
                req.params.id,
                "aprovado"
            );

            res.json({ mensagem: "Orçamento aprovado." });
        } catch (erro) {
            res.status(400).json({
                mensagem: erro.message
            });
        }
    }

    async function recusar(req, res) {
        try {
            await orcamentoService.atualizarStatus(
                req.params.id,
                "recusado"
            );

            res.json({ mensagem: "Orçamento recusado." });
        } catch (erro) {
            res.status(400).json({
                mensagem: erro.message
            });
        }
    }

    return {
        criar,
        buscarPorId,
        aprovar,
        recusar
    };
}
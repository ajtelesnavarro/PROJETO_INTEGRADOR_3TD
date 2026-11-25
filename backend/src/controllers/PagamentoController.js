export function criarPagamentoController({ pagamentoService }) {

    async function buscarPorId(req, res) {
        try {
            const resultado = await pagamentoService.buscarPorId(
                req.params.id
            );
    
            res.json(resultado);
        } catch (erro) {
            res.status(404).json({
                mensagem: erro.message
            });
        }
    }

    async function buscarOrcamento(req, res) {
        try {
            const resultado = await pagamentoService.buscarOrcamentoPorPagamento(
                req.params.id
            );
            res.json(resultado);
        } catch (erro) {
            res.status(erro.message === "O pagamento ainda não foi aprovado." ? 400 : 404).json({
                mensagem: erro.message
            });
        }
    }

    async function criarPredio(req, res) {
        try {
            const resultado = await pagamentoService.criarPredioDoPagamento(
                req.params.id,
                req.body
            );
            res.status(resultado.jaExistia ? 200 : 201).json({ sucesso: true, dados: resultado });
        } catch (erro) {
            res.status(erro.status || 400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function buscarPredio(req, res) {
        try {
            const resultado = await pagamentoService.buscarPredioDoPagamento(req.params.id);
            res.json({ sucesso: true, dados: resultado });
        } catch (erro) {
            res.status(erro.status || 400).json({ sucesso: false, mensagem: erro.message });
        }
    }

    async function criar(req, res) {
        try {
            const resultado = await pagamentoService.criar(req.body);

            res.status(201).json(resultado);
        } catch (erro) {
            res.status(400).json({
                mensagem: erro.message
            });
        }
    }

    return {
        criar,
        buscarPorId,
        buscarOrcamento,
        criarPredio,
        buscarPredio
    };
}

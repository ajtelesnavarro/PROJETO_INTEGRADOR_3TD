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
        buscarPorId
    };
}
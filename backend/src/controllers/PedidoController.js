export function criarPedidoController({ pedidoService }) {

    async function criar(req, res) {
        try {
            const resultado = await pedidoService.criar(
                req.body.idOrcamento
            );

            res.status(201).json(resultado);
        } catch (erro) {
            res.status(400).json({
                mensagem: erro.message
            });
        }
    }

    async function buscarPorId(req, res) {
        try {
            const resultado = await pedidoService.buscarPorId(
                req.params.id
            );

            res.json(resultado);
        } catch (erro) {
            res.status(404).json({
                mensagem: erro.message
            });
        }
    }

    return {
        criar,
        buscarPorId
    };
}

import * as PedidoService from '../services/PedidoService.js';

export const listar = async (req, res) => {
    try {
        const pedidos = await PedidoService.listar();

        res.status(200).json(pedidos);
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const buscarPorOrcamento = async (req, res) => {
    try {
        const { id_orcamento } = req.params;

        const pedido = await PedidoService.buscarPorOrcamento(id_orcamento);

        res.status(200).json(pedido);
    } catch (erro) {
        res.status(404).json({ mensagem: erro.message });
    }
};

export const criar = async (req, res) => {
    try {
        const id = await PedidoService.criar(req.body);

        res.status(201).json({
            mensagem: 'Pedido criado com sucesso!',
            id_pedido: id
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        await PedidoService.atualizar(id, req.body);

        res.status(200).json({
            mensagem: 'Pedido atualizado com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        await PedidoService.excluir(id);

        res.status(200).json({
            mensagem: 'Pedido excluído com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

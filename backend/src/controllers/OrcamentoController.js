
import * as OrcamentoService from '../services/OrcamentoService.js';

export const listar = async (req, res) => {
    try {
        const orcamentos = await OrcamentoService.listar();
        res.status(200).json(orcamentos);
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const buscarPorEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const orcamentos = await OrcamentoService.buscarPorEmail(email);

        res.status(200).json(orcamentos);
    } catch (erro) {
        res.status(404).json({ mensagem: erro.message });
    }
};

export const criar = async (req, res) => {
    try {
        const id = await OrcamentoService.criar(req.body);

        res.status(201).json({
            mensagem: 'Orçamento criado com sucesso!',
            id_orcamento: id
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        await OrcamentoService.atualizar(id, req.body);

        res.status(200).json({
            mensagem: 'Orçamento atualizado com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

export const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        await OrcamentoService.excluir(id);

        res.status(200).json({
            mensagem: 'Orçamento excluído com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({ mensagem: erro.message });
    }
};

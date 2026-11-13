
import * as PagamentoService from '../services/PagamentoService.js';

function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(400).json({
            sucesso: false,
            erro: erro.message
        });
    }

    if (erro.status) {
        return res.status(erro.status).json({
            sucesso: false,
            erro: erro.message
        });
    }

    return next(erro);
}

// Listar pagamentos
export async function listar(req, res, next) {
    try {
        const pagamentos = await PagamentoService.listar(
            req.query.id_pedido
        );

        return res.status(200).json({
            sucesso: true,
            pagamentos
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// Buscar por ID
export async function buscarPorId(req, res, next) {
    try {
        const pagamento = await PagamentoService.buscarPorId(req.params.id);

        return res.status(200).json({
            sucesso: true,
            pagamento
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// Criar pagamento
export async function criar(req, res, next) {
    try {
        const pagamento = await PagamentoService.criar(req.body);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Pagamento cadastrado com sucesso.',
            pagamento
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// Atualizar pagamento
export async function atualizar(req, res, next) {
    try {
        const pagamento = await PagamentoService.atualizar(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Pagamento atualizado com sucesso.',
            pagamento
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// Excluir pagamento
export async function excluir(req, res, next) {
    try {
        await PagamentoService.excluir(req.params.id);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Pagamento excluído com sucesso.'
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

import * as Service from '../services/RecursoService.js';

// Tratamento centralizado de erros
function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(400).json({
            sucesso: false,
            erro: erro.message
        });
    }

    if (
        Number.isInteger(erro.status) &&
        erro.status >= 400 &&
        erro.status <= 599
    ) {
        return res.status(erro.status).json({
            sucesso: false,
            erro: erro.message
        });
    }

    return next(erro);
}

export function listar(nome) {
    return async function (req, res, next) {
        try {
            const resultado = await Service.listar(
                nome,
                req.query
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado.dados,
                paginacao: resultado.paginacao
            });

        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 2. Busca por ID
export function buscar(nome) {
    return async function (req, res, next) {
        try {
            const resultado = await Service.buscar(
                nome,
                req.params.id
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });

        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 3. Criação
export function criar(nome) {
    return async function (req, res, next) {
        try {
            const resultado = await Service.criar(
                nome,
                req.body,
                req.usuario
            );

            return res.status(201).json({
                sucesso: true,
                dados: resultado
            });

        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 4. Atualização
export function atualizar(nome) {
    return async function (req, res, next) {
        try {
            const resultado = await Service.atualizar(
                nome,
                req.params.id,
                req.body
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });

        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 5. Remoção
export function excluir(nome) {
    return async function (req, res, next) {
        try {
            await Service.excluir(
                nome,
                req.params.id
            );

            return res.status(204).send();

        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 6. Relatórios
export async function relatorios(req, res, next) {
    try {
        const resultado = await Service.relatorios(
            req.query
        );

        return res.status(200).json({
            sucesso: true,
            dados: resultado
        });

    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

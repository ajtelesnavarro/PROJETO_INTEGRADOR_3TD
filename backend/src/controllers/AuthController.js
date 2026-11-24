import * as AuthService from '../services/AuthService.js';

function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(422).json({ sucesso: false, erro: erro.message });
    }
    if (erro.status) {
        return res.status(erro.status).json({ sucesso: false, erro: erro.message });
    }
    return next(erro);
}

export async function gerarToken(req, res, next) {
    try {
        const sessao = await AuthService.gerarToken(req.body);
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Autenticação realizada com sucesso',
            ...sessao
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function buscarPerfil(req, res, next) {
    try {
        const dados = await AuthService.buscarPerfil(req.usuario.id);
        return res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function atualizarPerfil(req, res, next) {
    try {
        const dados = await AuthService.atualizarPerfil(req.usuario.id, req.body);
        return res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

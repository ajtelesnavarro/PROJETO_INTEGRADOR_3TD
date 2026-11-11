import * as AuthService from '../src/services/AuthService.js';

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
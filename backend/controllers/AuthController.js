import * as AuthService from '../services/AuthService.js';

function responderErro(erro, res, next) {

    // Erros de validação dos dados recebidos.
    if (erro instanceof TypeError) {
        return res.status(422).json({
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
export async function gerarToken(req, res, next) {
    try {
        const dados = req.body;
        const sessao = await AuthService.gerarToken(dados);
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Autenticação realizada com sucesso',
            ...sessao
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }

}

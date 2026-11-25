import * as ReclamacaoService from "../services/ReclamacaoService.js";

function tratarErro(erro, res, next) {
    if (erro.status) return res.status(erro.status).json({ sucesso: false, erro: erro.message });
    return next(erro);
}

export async function buscarContexto(req, res, next) {
    try {
        const dados = await ReclamacaoService.buscarContexto(req.usuario);
        return res.json({ sucesso: true, dados });
    } catch (erro) { return tratarErro(erro, res, next); }
}

export async function listar(req, res, next) {
    try {
        const dados = await ReclamacaoService.listar(req.usuario);
        return res.json({ sucesso: true, dados });
    } catch (erro) { return tratarErro(erro, res, next); }
}

export async function criar(req, res, next) {
    try {
        const dados = await ReclamacaoService.criar(req.usuario, req.body);
        return res.status(201).json({ sucesso: true, dados, mensagem: "Reclamação registrada com sucesso." });
    } catch (erro) { return tratarErro(erro, res, next); }
}

export async function atualizar(req, res, next) {
    try {
        const dados = await ReclamacaoService.atualizar(Number(req.params.id), req.usuario, req.body);
        return res.json({ sucesso: true, dados, mensagem: "Reclamação atualizada com sucesso." });
    } catch (erro) { return tratarErro(erro, res, next); }
}

export async function mudarStatus(req, res, next) {
    try {
        const dados = await ReclamacaoService.mudarStatus(Number(req.params.id), req.usuario, req.body.status_chamado);
        return res.json({ sucesso: true, dados, mensagem: "Status atualizado com sucesso." });
    } catch (erro) { return tratarErro(erro, res, next); }
}

export async function mudarResponsavel(req, res, next) {
    try {
        const dados = await ReclamacaoService.mudarResponsavel(Number(req.params.id), req.usuario, req.body.id_usuario_responsavel);
        return res.json({ sucesso: true, dados, mensagem: "Responsável atualizado com sucesso." });
    } catch (erro) { return tratarErro(erro, res, next); }
}

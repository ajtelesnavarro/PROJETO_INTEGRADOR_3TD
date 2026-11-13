import * as UsuarioService from '../services/UsuarioService.js';

function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(422).json({
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


export async function listar(req, res, next) {
  try {
    const resultado = await UsuarioService.listar(req.query);
    return res.status(200).json({
      sucesso: true,
      dados: resultado.usuarios,
    });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}


export async function buscarPorId(req, res, next) {
  try {
    const usuario = await UsuarioService.buscarPorId(req.params.id);
    return res.status(200).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}


export async function criar(req, res, next) {
  try {
    const usuario = await UsuarioService.criar(req.body);
    return res.status(201).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}


export async function atualizar(req, res, next) {
  try {
    const usuario = await UsuarioService.atualizar(req.params.id, req.body);
    return res.status(200).json({ sucesso: true, dados: usuario });
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}


export async function excluir(req, res, next) {
  try {
    await UsuarioService.excluir(req.params.id);
    return res.status(200).json({sucesso: true, mensagem: 'Usuário excluído com sucesso.'});
  } catch (erro) {
    return responderErro(erro, res, next);
  }
}
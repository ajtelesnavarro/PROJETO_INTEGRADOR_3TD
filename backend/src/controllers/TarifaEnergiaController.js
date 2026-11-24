import * as TarifaEnergiaService from "../services/TarifaEnergiaService.js";

function responderErro(erro, res) {
  const status = erro instanceof TypeError ? 400 : erro.status || 500;
  return res.status(status).json({ sucesso: false, erro: erro.message });
}

export async function buscarAtual(req, res) {
  try {
    const dados = await TarifaEnergiaService.buscarAtual(req.params.idPredio);
    return res.json({ sucesso: true, dados });
  } catch (erro) {
    return responderErro(erro, res);
  }
}

export async function definir(req, res) {
  try {
    const dados = await TarifaEnergiaService.definir(
      req.params.idPredio,
      req.body,
      req.usuario
    );
    return res.json({ sucesso: true, dados });
  } catch (erro) {
    return responderErro(erro, res);
  }
}

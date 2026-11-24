import { pool } from "../config/database.js";
import { validarId, validarNumero } from "./recursos/validacaoService.js";

async function validarPredioDoUsuario(idPredioRecebido, usuario) {
  const idPredio = validarId(idPredioRecebido, "ID do prédio");
  const [usuarios] = await pool.query(
    "SELECT id_predio FROM usuario WHERE id_usuario = ? LIMIT 1",
    [usuario?.id]
  );
  const idPredioAtual = usuarios[0]?.id_predio;
  if (!idPredioAtual || Number(idPredioAtual) !== idPredio) {
    const erro = new Error("A tarifa só pode ser consultada ou alterada no prédio vinculado ao seu usuário.");
    erro.status = 403;
    throw erro;
  }
  return idPredio;
}

export async function buscarAtual(idPredioRecebido, usuario) {
  const idPredio = await validarPredioDoUsuario(idPredioRecebido, usuario);
  const [linhas] = await pool.query(
    `SELECT *
     FROM tarifa_energia
     WHERE id_predio = ?
       AND data_inicio_vigencia <= CURRENT_DATE
       AND (data_fim_vigencia IS NULL OR data_fim_vigencia >= CURRENT_DATE)
     ORDER BY data_inicio_vigencia DESC, id_tarifa DESC
     LIMIT 1`,
    [idPredio]
  );
  return linhas[0] || null;
}

export async function definir(idPredioRecebido, dados, usuario) {
  const idPredio = await validarPredioDoUsuario(idPredioRecebido, usuario);
  const valorKwh = validarNumero(dados?.valor_kwh, "valor por kWh");
  if (valorKwh < 0) throw new TypeError("A tarifa não pode ser negativa.");

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [predios] = await conexao.query(
      "SELECT id_predio FROM predio WHERE id_predio = ? FOR UPDATE",
      [idPredio]
    );
    if (!predios.length) throw new TypeError("Prédio não encontrado.");

    const [tarifas] = await conexao.query(
      `SELECT id_tarifa,
              DATE_FORMAT(data_inicio_vigencia, '%Y-%m-%d') AS data_inicio_vigencia
       FROM tarifa_energia
       WHERE id_predio = ? AND data_fim_vigencia IS NULL
       ORDER BY data_inicio_vigencia DESC, id_tarifa DESC
       FOR UPDATE`,
      [idPredio]
    );
    const [[{ hoje }]] = await conexao.query(
      "SELECT DATE_FORMAT(CURRENT_DATE, '%Y-%m-%d') AS hoje"
    );

    const vigenteHoje = tarifas.find((tarifa) =>
      tarifa.data_inicio_vigencia === hoje
    );

    if (vigenteHoje) {
      await conexao.query(
        `UPDATE tarifa_energia
         SET valor_kwh = ?, id_usuario_alteracao = ?
         WHERE id_tarifa = ?`,
        [valorKwh, usuario?.id ?? null, vigenteHoje.id_tarifa]
      );
    } else {
      await conexao.query(
        `UPDATE tarifa_energia
         SET data_fim_vigencia = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
         WHERE id_predio = ?
           AND data_fim_vigencia IS NULL
           AND data_inicio_vigencia < CURRENT_DATE`,
        [idPredio]
      );
      await conexao.query(
        `INSERT INTO tarifa_energia
          (id_usuario_alteracao, id_predio, valor_kwh, data_inicio_vigencia)
         VALUES (?, ?, ?, CURRENT_DATE)`,
        [usuario?.id ?? null, idPredio, valorKwh]
      );
    }

    await conexao.commit();
    const [atual] = await conexao.query(
      `SELECT *
       FROM tarifa_energia
       WHERE id_predio = ?
         AND data_inicio_vigencia <= CURRENT_DATE
         AND (data_fim_vigencia IS NULL OR data_fim_vigencia >= CURRENT_DATE)
       ORDER BY data_inicio_vigencia DESC, id_tarifa DESC
       LIMIT 1`,
      [idPredio]
    );
    return atual[0] || null;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

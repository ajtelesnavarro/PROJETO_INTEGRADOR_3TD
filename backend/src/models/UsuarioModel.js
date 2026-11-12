
import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function'
  ? dbModule.criarPool()
  : dbModule.pool;

export async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    `SELECT id_usuario, nome, email, senha_hash, perfil, ativo
     FROM usuario
     WHERE email = ?`,
    [email]
  );

  return linhas[0] || null;
}

export async function criar({
  nome,
  email,
  senhaHash,
  telefone,
  cpf,
  data_nascimento
}) {
  const sql = `
    INSERT INTO usuario (
      nome,
      email,
      senha_hash,
      telefone,
      perfil,
      cpf,
      data_nascimento
    )
    VALUES (?, ?, ?, ?, 'visitante', ?, ?)
  `;

  const [resultado] = await pool.query(sql, [
    nome,
    email,
    senhaHash,
    telefone || null,
    cpf,
    data_nascimento || null
  ]);

  return {
    id_usuario: resultado.insertId,
    nome,
    email,
    perfil: 'visitante'
  };
}

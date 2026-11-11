import { criarPool } from '../config/database.js';
export async function buscarPorEmail(email) {
  const [linhas] = await criarPool().query('SELECT id, nome, email, senha_hash, perfil, ativo FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return linhas[0] || null;
}

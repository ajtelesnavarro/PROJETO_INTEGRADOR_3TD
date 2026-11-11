import { criarPool } from '../config/database.js';

export async function buscarPorEmail(email) {
    const [linhas] = await criarPool().query(
        `SELECT
            id_usuario,
            nome,
            email,
            senha_hash,
            perfil,
            ativo
         FROM usuario
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    return linhas[0] || null;
}

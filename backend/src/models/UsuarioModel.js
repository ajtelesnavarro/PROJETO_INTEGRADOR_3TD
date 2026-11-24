
import { pool } from "../config/database.js";

export async function buscarPorEmail(email) {
    const [linhas] = await pool.query(
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

export async function buscarPerfilPorId(idUsuario) {
    const [linhas] = await pool.query(
        `SELECT u.id_usuario, u.id_predio, u.nome, u.email, u.perfil,
                u.cpf, u.telefone, u.data_nascimento, u.foto,
                p.nome_predio
         FROM usuario u
         LEFT JOIN predio p ON p.id_predio = u.id_predio
         WHERE u.id_usuario = ?
         LIMIT 1`,
        [idUsuario]
    );

    return linhas[0] || null;
}

export async function emailEmUso(email, idUsuario) {
    const [linhas] = await pool.query(
        'SELECT id_usuario FROM usuario WHERE email = ? AND id_usuario <> ? LIMIT 1',
        [email, idUsuario]
    );
    return linhas.length > 0;
}

export async function atualizarPerfil(idUsuario, dados) {
    const campos = ['nome = ?', 'email = ?', 'cpf = ?', 'telefone = ?', 'data_nascimento = ?'];
    const valores = [dados.nome, dados.email, dados.cpf, dados.telefone, dados.data_nascimento];

    if (dados.senha_hash) {
        campos.push('senha_hash = ?');
        valores.push(dados.senha_hash);
    }
    if (dados.foto !== undefined) {
        campos.push('foto = ?');
        valores.push(dados.foto);
    }

    valores.push(idUsuario);
    await pool.query(`UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`, valores);
}

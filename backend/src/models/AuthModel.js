
import { pool } from '../config/database.js';

export async function buscarPorEmail(email) {
    const [linhas] = await pool.query(
        `SELECT
            id_usuario,
            id_predio,
            nome,
            email,
            senha_hash,
            telefone,
            perfil,
            cpf,
            foto,
            data_nascimento,
            ativo
        FROM usuario
        WHERE email = ?
        LIMIT 1`,
        [email]
    );

    return linhas[0] || null;
}

export async function buscarPorCpf(cpf) {
    const [linhas] = await pool.query(
        `SELECT id_usuario FROM usuario WHERE cpf = ? LIMIT 1`,
        [cpf]
    );
    return linhas[0] || null;
}

export async function buscarPorId(id) {
    const [linhas] = await pool.query(
        `SELECT
            id_usuario,
            id_predio,
            nome,
            email,
            telefone,
            perfil,
            cpf,
            foto,
            data_nascimento,
            ativo
        FROM usuario
        WHERE id_usuario = ?
        LIMIT 1`,
        [id]
    );

    return linhas[0] || null;
}

export async function atualizarPerfil(id, usuario) {
    const [resultado] = await pool.query(
        `UPDATE usuario
         SET nome = ?, email = ?, telefone = ?, cpf = ?, data_nascimento = ?,
             foto = ?, senha_hash = COALESCE(?, senha_hash)
         WHERE id_usuario = ?`,
        [usuario.nome, usuario.email, usuario.telefone, usuario.cpf,
         usuario.data_nascimento, usuario.foto, usuario.senha_hash, id]
    );
    return resultado.affectedRows > 0;
}

export async function criar(usuario) {
    const sql = `
        INSERT INTO usuario (
            id_predio,
            nome,
            email,
            senha_hash,
            telefone,
            perfil,
            cpf,
            foto,
            data_nascimento,
            ativo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        usuario.id_predio,
        usuario.nome,
        usuario.email,
        usuario.senha_hash,
        usuario.telefone,
        usuario.perfil,
        usuario.cpf,
        usuario.foto,
        usuario.data_nascimento,
        usuario.ativo
    ];

    const [resultado] = await pool.query(sql, valores);

    return {
        id_usuario: resultado.insertId,
        ...usuario
    };
}

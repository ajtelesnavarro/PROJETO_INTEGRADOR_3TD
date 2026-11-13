
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

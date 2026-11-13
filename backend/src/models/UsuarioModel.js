import * as dbModule from '../config/database.js';

const pool = typeof dbModule.criarPool === 'function' ? dbModule.criarPool() : dbModule.pool;

// Busca usuário pelo e-mail
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

// Busca usuário pelo ID
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

// Cadastra um novo usuário
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
        usuario.id_predio ?? null,
        usuario.nome,
        usuario.email,
        usuario.senha_hash,
        usuario.telefone ?? null,
        usuario.perfil || "visitante",
        usuario.cpf,
        usuario.foto ?? null,
        usuario.data_nascimento ?? null,
        usuario.ativo || "ativo"
    ];

    const [resultado] = await pool.query(sql, valores);

    return {
        id_usuario: resultado.insertId,
        ...usuario
    };
}

// Atualiza os dados de um usuário
export async function atualizar(id, usuario) {
    const sql = `
        UPDATE usuario SET
            id_predio = ?,
            nome = ?,
            email = ?,
            telefone = ?,
            perfil = ?,
            cpf = ?,
            foto = ?,
            data_nascimento = ?,
            ativo = ?
        WHERE id_usuario = ?
    `;

    const valores = [
        usuario.id_predio ?? null,
        usuario.nome,
        usuario.email,
        usuario.telefone ?? null,
        usuario.perfil,
        usuario.cpf,
        usuario.foto ?? null,
        usuario.data_nascimento ?? null,
        usuario.ativo,
        id
    ];

    const [resultado] = await pool.query(sql, valores);

    return resultado.affectedRows > 0;
}

// Exclui um usuário pelo ID
export async function excluir(id) {
    const [resultado] = await pool.query(
        "DELETE FROM usuario WHERE id_usuario = ?",
        [id]
    );

    return resultado.affectedRows > 0;
}

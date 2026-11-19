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

// Cria o usuário, a credencial e as permissões em uma única transação.
export async function criarComAcesso(usuario, credencial, permissoes) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [resultadoUsuario] = await connection.query(
            `INSERT INTO usuario (id_predio, nome, email, senha_hash, telefone, perfil, cpf, foto, data_nascimento, ativo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario.id_predio, usuario.nome, usuario.email, usuario.senha_hash,
             usuario.telefone, usuario.perfil, usuario.cpf, usuario.foto,
             usuario.data_nascimento, usuario.ativo]
        );
        const idUsuario = resultadoUsuario.insertId;
        await connection.query(
            `INSERT INTO credenciais_acesso (id_usuario, token_hash, tipo_credencial, status)
             VALUES (?, ?, ?, ?)`,
            [idUsuario, credencial.token_hash, credencial.tipo_credencial, credencial.status]
        );
        for (const permissao of permissoes) {
            await connection.query(
                `INSERT INTO permissao_acesso
                 (id_usuario, id_ambiente, horario_inicio, horario_fim, status_permissao, data_inicio, data_fim, dias_semana)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [idUsuario, permissao.id_ambiente, permissao.horario_inicio,
                 permissao.horario_fim, permissao.status_permissao,
                 permissao.data_inicio, permissao.data_fim, permissao.dias_semana]
            );
        }
        await connection.commit();
        return {
            id_usuario: idUsuario,
            id_predio: usuario.id_predio,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            perfil: usuario.perfil,
            cpf: usuario.cpf,
            foto: usuario.foto,
            data_nascimento: usuario.data_nascimento,
            ativo: usuario.ativo,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function listarAmbientes() {
    const [linhas] = await pool.query(
        `SELECT a.id_ambiente, a.nome, a.localizacao, a.horario_abertura,
                a.horario_fechamento, an.numero_andar
         FROM ambiente a JOIN andar an ON an.id_andar = a.id_andar
         ORDER BY an.numero_andar, a.nome`
    );
    return linhas;
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

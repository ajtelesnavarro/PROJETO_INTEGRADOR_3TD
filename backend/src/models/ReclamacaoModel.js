import { pool } from "../config/database.js";

const SELECT_RECLAMACOES = `
    SELECT
        r.id_reclamacao,
        r.id_usuario_abertura,
        r.id_ambiente,
        r.id_dispositivo,
        r.id_usuario_responsavel,
        r.status_chamado,
        DATE_FORMAT(r.data_hora_recebido, '%Y-%m-%dT%H:%i:%s') AS data_hora_recebido,
        r.descricao_usuario,
        r.prioridade,
        r.categoria_problema
    FROM reclamacoes r
    LEFT JOIN ambiente a ON a.id_ambiente = r.id_ambiente
    LEFT JOIN andar an ON an.id_andar = a.id_andar
    LEFT JOIN dispositivo d ON d.id_dispositivo = r.id_dispositivo
    LEFT JOIN ambiente ad ON ad.id_ambiente = d.id_ambiente
    LEFT JOIN andar andv ON andv.id_andar = ad.id_andar
`;

export async function listar(idUsuario, perfil, idPredio) {
    const parametros = [];
    let filtro;

    if (perfil === "locador") {
        filtro = "r.id_usuario_abertura = ?";
        parametros.push(idUsuario);
    } else if (idPredio) {
        filtro = "(an.id_predio = ? OR andv.id_predio = ?)";
        parametros.push(idPredio, idPredio);
    } else {
        filtro = "r.id_usuario_abertura = ?";
        parametros.push(idUsuario);
    }

    const [linhas] = await pool.query(
        `${SELECT_RECLAMACOES} WHERE ${filtro} ORDER BY r.data_hora_recebido DESC, r.id_reclamacao DESC`,
        parametros
    );
    return linhas;
}

export async function buscarPorId(id, idUsuario, perfil, idPredio) {
    const parametros = [id];
    let filtro;
    if (perfil === "locador") {
        filtro = "r.id_usuario_abertura = ?";
        parametros.push(idUsuario);
    } else if (idPredio) {
        filtro = "(an.id_predio = ? OR andv.id_predio = ?)";
        parametros.push(idPredio, idPredio);
    } else {
        filtro = "r.id_usuario_abertura = ?";
        parametros.push(idUsuario);
    }
    const [linhas] = await pool.query(
        `${SELECT_RECLAMACOES} WHERE r.id_reclamacao = ? AND ${filtro} LIMIT 1`,
        parametros
    );
    return linhas[0] || null;
}


export async function buscarContexto(idPredio) {
    if (!idPredio) return { usuarios: [], ambientes: [], dispositivos: [], andares: [] };
    const [usuarios] = await pool.query(
        `SELECT id_usuario, id_predio, nome, email, telefone, perfil
         FROM usuario WHERE id_predio = ? AND ativo = 'ativo' ORDER BY nome ASC`,
        [idPredio]
    );
    const [andares] = await pool.query(
        `SELECT id_andar, id_predio, numero_andar, descricao
         FROM andar WHERE id_predio = ? ORDER BY numero_andar ASC`,
        [idPredio]
    );
    const [ambientes] = await pool.query(
        `SELECT a.id_ambiente, a.id_andar, a.nome, a.localizacao
         FROM ambiente a INNER JOIN andar an ON an.id_andar = a.id_andar
         WHERE an.id_predio = ? ORDER BY a.nome ASC`,
        [idPredio]
    );
    const [dispositivos] = await pool.query(
        `SELECT d.id_dispositivo, d.id_ambiente, d.nome, d.tipo_dispositivo
         FROM dispositivo d
         INNER JOIN ambiente a ON a.id_ambiente = d.id_ambiente
         INNER JOIN andar an ON an.id_andar = a.id_andar
         WHERE an.id_predio = ? ORDER BY d.nome ASC`,
        [idPredio]
    );
    return { usuarios, ambientes, dispositivos, andares };
}

export async function obterPredioUsuario(idUsuario) {
    const [linhas] = await pool.query(
        "SELECT id_predio FROM usuario WHERE id_usuario = ? LIMIT 1",
        [idUsuario]
    );
    return linhas[0]?.id_predio ?? null;
}

export async function validarAmbiente(idAmbiente, idPredio) {
    if (!idPredio) return false;
    const [linhas] = await pool.query(
        `SELECT a.id_ambiente FROM ambiente a
         INNER JOIN andar an ON an.id_andar = a.id_andar
         WHERE a.id_ambiente = ? AND an.id_predio = ? LIMIT 1`,
        [idAmbiente, idPredio]
    );
    return Boolean(linhas.length);
}

export async function validarDispositivo(idDispositivo, idAmbiente, idPredio) {
    if (!idPredio) return false;
    const [linhas] = await pool.query(
        `SELECT d.id_dispositivo FROM dispositivo d
         INNER JOIN ambiente a ON a.id_ambiente = d.id_ambiente
         INNER JOIN andar an ON an.id_andar = a.id_andar
         WHERE d.id_dispositivo = ?
           AND an.id_predio = ?
           AND (? IS NULL OR d.id_ambiente = ?)
         LIMIT 1`,
        [idDispositivo, idPredio, idAmbiente, idAmbiente]
    );
    return Boolean(linhas.length);
}

export async function validarResponsavel(idResponsavel, idPredio) {
    if (idResponsavel == null) return true;
    if (!idPredio) return false;
    const [linhas] = await pool.query(
        `SELECT id_usuario FROM usuario
         WHERE id_usuario = ? AND ativo = 'ativo'
           AND id_predio = ?
         LIMIT 1`,
        [idResponsavel, idPredio]
    );
    return Boolean(linhas.length);
}

export async function criar(dados) {
    const [resultado] = await pool.query(
        `INSERT INTO reclamacoes
            (id_usuario_abertura, id_ambiente, id_dispositivo,
             id_usuario_responsavel, status_chamado, descricao_usuario,
             prioridade, categoria_problema)
         VALUES (?, ?, ?, ?, 'aberto', ?, ?, ?)`,
        [
            dados.id_usuario_abertura,
            dados.id_ambiente,
            dados.id_dispositivo,
            dados.id_usuario_responsavel,
            dados.descricao_usuario,
            dados.prioridade,
            dados.categoria_problema
        ]
    );
    return resultado.insertId;
}

export async function atualizar(id, dados) {
    await pool.query(
        `UPDATE reclamacoes SET
            id_ambiente = ?, id_dispositivo = ?, id_usuario_responsavel = ?,
            descricao_usuario = ?, prioridade = ?, categoria_problema = ?
         WHERE id_reclamacao = ?`,
        [dados.id_ambiente, dados.id_dispositivo, dados.id_usuario_responsavel,
            dados.descricao_usuario, dados.prioridade, dados.categoria_problema, id]
    );
}

export async function atualizarStatus(id, status) {
    await pool.query(
        "UPDATE reclamacoes SET status_chamado = ? WHERE id_reclamacao = ?",
        [status, id]
    );
}

export async function atualizarResponsavel(id, idResponsavel) {
    await pool.query(
        "UPDATE reclamacoes SET id_usuario_responsavel = ? WHERE id_reclamacao = ?",
        [idResponsavel, id]
    );
}

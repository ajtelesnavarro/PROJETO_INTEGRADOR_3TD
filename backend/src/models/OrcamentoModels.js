
import { pool } from '../config/database.js';

export const listar = async () => {
    const [resultado] = await pool.query(
        'SELECT * FROM orcamento ORDER BY data_solicitacao DESC'
    );

    return resultado;
};

export const buscarPorEmail = async (email) => {
    const [resultado] = await pool.query(
        'SELECT * FROM orcamento WHERE email = ?',
        [email]
    );

    return resultado;
};

export const buscarPorId = async (id) => {
    const [resultado] = await pool.query(
        'SELECT * FROM orcamento WHERE id_orcamento = ?',
        [id]
    );

    return resultado[0];
};

export const criar = async (dados) => {
    const {
        id_usuario,
        nome_responsavel,
        nome_empresa,
        email,
        telefone,
        quantidade_andares,
        quantidade_ambientes,
        quantidade_dispositivos,
        descricao,
        valor_subtotal,
        valor_desconto,
        valor_total,
        prazo_estimado_dias,
        data_validade,
        status_orcamento
    } = dados;

    const [resultado] = await pool.query(
        `INSERT INTO orcamento (
            id_usuario,
            nome_responsavel,
            nome_empresa,
            email,
            telefone,
            quantidade_andares,
            quantidade_ambientes,
            quantidade_dispositivos,
            descricao,
            valor_subtotal,
            valor_desconto,
            valor_total,
            prazo_estimado_dias,
            data_validade,
            status_orcamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_usuario ?? null,
            nome_responsavel,
            nome_empresa,
            email,
            telefone,
            quantidade_andares,
            quantidade_ambientes,
            quantidade_dispositivos ?? null,
            descricao ?? null,
            valor_subtotal ?? null,
            valor_desconto ?? 0,
            valor_total ?? null,
            prazo_estimado_dias ?? null,
            data_validade ?? null,
            status_orcamento ?? 'solicitado'
        ]
    );

    return resultado.insertId;
};

export const atualizar = async (id, dados) => {
    const {
        id_usuario,
        nome_responsavel,
        nome_empresa,
        email,
        telefone,
        quantidade_andares,
        quantidade_ambientes,
        quantidade_dispositivos,
        descricao,
        valor_subtotal,
        valor_desconto,
        valor_total,
        prazo_estimado_dias,
        data_validade,
        status_orcamento
    } = dados;

    const [resultado] = await pool.query(
        `UPDATE orcamento SET
            id_usuario = ?,
            nome_responsavel = ?,
            nome_empresa = ?,
            email = ?,
            telefone = ?,
            quantidade_andares = ?,
            quantidade_ambientes = ?,
            quantidade_dispositivos = ?,
            descricao = ?,
            valor_subtotal = ?,
            valor_desconto = ?,
            valor_total = ?,
            prazo_estimado_dias = ?,
            data_validade = ?,
            status_orcamento = ?
        WHERE id_orcamento = ?`,
        [
            id_usuario ?? null,
            nome_responsavel,
            nome_empresa,
            email,
            telefone,
            quantidade_andares,
            quantidade_ambientes,
            quantidade_dispositivos ?? null,
            descricao ?? null,
            valor_subtotal ?? null,
            valor_desconto ?? 0,
            valor_total ?? null,
            prazo_estimado_dias ?? null,
            data_validade ?? null,
            status_orcamento ?? 'solicitado',
            id
        ]
    );

    return resultado.affectedRows;
};

export const excluir = async (id) => {
    const [resultado] = await pool.query(
        'DELETE FROM orcamento WHERE id_orcamento = ?',
        [id]
    );

    return resultado.affectedRows;
};

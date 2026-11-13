
import { pool } from '../config/database.js';

export const listar = async () => {
    const [resultado] = await pool.query(
        'SELECT * FROM pedido ORDER BY data_pedido DESC'
    );

    return resultado;
};

export const buscarPorOrcamento = async (id_orcamento) => {
    const [resultado] = await pool.query(
        'SELECT * FROM pedido WHERE id_orcamento = ?',
        [id_orcamento]
    );

    return resultado[0];
};

export const buscarPorId = async (id) => {
    const [resultado] = await pool.query(
        'SELECT * FROM pedido WHERE id_pedido = ?',
        [id]
    );

    return resultado[0];
};

export const buscarOrcamento = async (id_orcamento) => {
    const [resultado] = await pool.query(
        'SELECT * FROM orcamento WHERE id_orcamento = ?',
        [id_orcamento]
    );

    return resultado[0];
};

export const criar = async (dados) => {
    const {
        id_orcamento,
        valor_contratado,
        status_pedido,
        observacoes
    } = dados;

    const [resultado] = await pool.query(
        `INSERT INTO pedido (
            id_orcamento,
            valor_contratado,
            status_pedido,
            observacoes
        ) VALUES (?, ?, ?, ?)`,
        [
            id_orcamento,
            valor_contratado,
            status_pedido ?? 'aguardando_pagamento',
            observacoes ?? null
        ]
    );

    return resultado.insertId;
};

export const atualizar = async (id, dados) => {
    const {
        valor_contratado,
        status_pedido,
        observacoes
    } = dados;

    const [resultado] = await pool.query(
        `UPDATE pedido SET
            valor_contratado = ?,
            status_pedido = ?,
            observacoes = ?
        WHERE id_pedido = ?`,
        [
            valor_contratado,
            status_pedido,
            observacoes,
            id
        ]
    );

    return resultado.affectedRows;
};

export const excluir = async (id) => {
    const [resultado] = await pool.query(
        'DELETE FROM pedido WHERE id_pedido = ?',
        [id]
    );

    return resultado.affectedRows;
};

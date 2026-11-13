import { pool } from '../config/database.js';

// Listar pagamentos, podendo filtrar pelo pedido
export async function listar(id_pedido) {
    let sql = `
        SELECT p.id_pagamento, p.id_pedido, p.valor_pago,
               p.metodo_pagamento, p.status_pagamento,
               p.codigo_transacao, p.data_pagamento
        FROM pagamento p
    `;

    const valores = [];

    if (id_pedido) {
        sql += ' WHERE p.id_pedido = ?';
        valores.push(id_pedido);
    }

    sql += ' ORDER BY p.id_pagamento';

    const [linhas] = await pool.query(sql, valores);
    return linhas;
}

// Buscar pagamento pelo ID
export async function buscarPorId(id) {
    const [linhas] = await pool.query(
        `SELECT * FROM pagamento WHERE id_pagamento = ?`,
        [id]
    );

    return linhas[0] || null;
}

// Criar pagamento
export async function criar(pagamento) {
    const sql = `
        INSERT INTO pagamento
        (id_pedido, valor_pago, metodo_pagamento,
         status_pagamento, codigo_transacao, data_pagamento)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        pagamento.id_pedido,
        pagamento.valor_pago,
        pagamento.metodo_pagamento,
        pagamento.status_pagamento,
        pagamento.codigo_transacao,
        pagamento.data_pagamento
    ];

    const [resultado] = await pool.query(sql, valores);

    return resultado.insertId;
}

// Atualizar pagamento
export async function atualizar(id, pagamento) {
    const sql = `
        UPDATE pagamento
        SET id_pedido = ?, valor_pago = ?,
            metodo_pagamento = ?, status_pagamento = ?,
            codigo_transacao = ?, data_pagamento = ?
        WHERE id_pagamento = ?
    `;

    const valores = [
        pagamento.id_pedido,
        pagamento.valor_pago,
        pagamento.metodo_pagamento,
        pagamento.status_pagamento,
        pagamento.codigo_transacao,
        pagamento.data_pagamento,
        id
    ];

    const [resultado] = await pool.query(sql, valores);
    return resultado.affectedRows > 0;
}

// Excluir pagamento
export async function excluir(id) {
    const [resultado] = await pool.query(
        'DELETE FROM pagamento WHERE id_pagamento = ?',
        [id]
    );

    return resultado.affectedRows > 0;
}

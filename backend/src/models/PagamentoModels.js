export function criarPagamentoModel({ pool }) {

    async function criar(dados) {
        const [resultado] = await pool.query(
            `INSERT INTO pagamento (
                id_pedido,
                valor_pago,
                metodo_pagamento,
                status_pagamento
            ) VALUES (?, ?, ?, ?)`,
            [
                dados.idPedido,
                dados.valorPago,
                dados.metodoPagamento,
                "pendente"
            ]
        );

        return resultado.insertId;
    }

    async function buscarPorId(id) {
        const [resultado] = await pool.query(
            "SELECT * FROM pagamento WHERE id_pagamento = ?",
            [id]
        );
    
        return resultado[0];
    }

    async function atualizarResultado(id, status, codigoTransacao) {
        await pool.query(
            `UPDATE pagamento
             SET status_pagamento = ?,
                 codigo_transacao = ?,
                 data_pagamento = CURRENT_TIMESTAMP
             WHERE id_pagamento = ?`,
            [status, codigoTransacao, id]
        );
    }

    return {
        criar,
        buscarPorId,
        atualizarResultado
    };
}
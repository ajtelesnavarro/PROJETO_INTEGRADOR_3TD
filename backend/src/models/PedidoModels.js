export function criarPedidoModel({ pool }) {

    async function criar(dados) {
        const [resultado] = await pool.query(
            `INSERT INTO pedido (
                id_orcamento,
                valor_contratado,
                status_pedido,
                observacoes
            ) VALUES (?, ?, ?, ?)`,
            [
                dados.idOrcamento,
                dados.valorContratado,
                "aguardando_pagamento",
                dados.observacoes || null
            ]
        );

        return resultado.insertId;
    }

    async function buscarPorId(id) {
        const [resultado] = await pool.query(
            `SELECT p.*, o.nome_empresa, o.nome_responsavel,
                    o.servicos_desejados, o.prazo_estimado_dias
             FROM pedido p
             INNER JOIN orcamento o
             ON p.id_orcamento = o.id_orcamento
             WHERE p.id_pedido = ?`,
            [id]
        );

        return resultado[0];
    }

    async function atualizarStatus(id, status) {
        await pool.query(
            "UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?",
            [status, id]
        );
    }

    return {
        criar,
        buscarPorId,
        atualizarStatus
    };
}
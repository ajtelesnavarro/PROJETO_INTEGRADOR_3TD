export function criarProvisionamentoPredioModel({ pool }) {
  async function buscarPorPagamento(idPagamento) {
    const [resultado] = await pool.query(
      `SELECT b.*
       FROM pagamento pg
       INNER JOIN pedido p ON p.id_pedido = pg.id_pedido
       INNER JOIN predio b ON b.id_predio = p.id_predio
       WHERE pg.id_pagamento = ? AND pg.status_pagamento = 'aprovado'`,
      [idPagamento]
    );
    return resultado[0] || null;
  }

  async function criarParaPagamento(idPagamento, dadosPredio) {
    const conexao = await pool.getConnection();

    try {
      await conexao.beginTransaction();

      const [pagamentos] = await conexao.query(
        `SELECT pg.status_pagamento, p.id_pedido, p.status_pedido,
                o.id_usuario,
                p.id_predio, o.quantidade_andares
         FROM pagamento pg
         INNER JOIN pedido p ON p.id_pedido = pg.id_pedido
         INNER JOIN orcamento o ON o.id_orcamento = p.id_orcamento
         WHERE pg.id_pagamento = ?
         FOR UPDATE`,
        [idPagamento]
      );

      const pagamento = pagamentos[0];
      if (!pagamento) {
        const erro = new Error("Pagamento não encontrado.");
        erro.status = 404;
        throw erro;
      }
      if (pagamento.status_pagamento !== "aprovado" || pagamento.status_pedido !== "confirmado") {
        const erro = new Error("O pagamento ainda não foi confirmado.");
        erro.status = 409;
        throw erro;
      }
      if (pagamento.id_predio) {
        if (pagamento.id_usuario) {
          await conexao.query(
            "UPDATE usuario SET id_predio = ? WHERE id_usuario = ?",
            [pagamento.id_predio, pagamento.id_usuario]
          );
        }
        await conexao.commit();
        return { id_predio: pagamento.id_predio, jaExistia: true };
      }

      const [resultadoPredio] = await conexao.query(
        `INSERT INTO predio (
           nome_predio, cep, rua, numero, complemento, bairro, cidade, estado
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dadosPredio.nome_predio,
          dadosPredio.cep,
          dadosPredio.rua,
          dadosPredio.numero,
          dadosPredio.complemento || null,
          dadosPredio.bairro,
          dadosPredio.cidade,
          dadosPredio.estado,
        ]
      );

      const idPredio = resultadoPredio.insertId;
      const quantidadeAndares = Math.min(Math.max(Number(pagamento.quantidade_andares) || 0, 0), 200);
      for (let numeroAndar = 1; numeroAndar <= quantidadeAndares; numeroAndar += 1) {
        await conexao.query(
          `INSERT INTO andar (id_predio, numero_andar, descricao, data_cadastro)
           VALUES (?, ?, ?, CURRENT_DATE)`,
          [idPredio, numeroAndar, `Andar ${numeroAndar}`]
        );
      }

      await conexao.query(
        "UPDATE pedido SET id_predio = ? WHERE id_pedido = ?",
        [idPredio, pagamento.id_pedido]
      );
      if (pagamento.id_usuario) {
        await conexao.query(
          "UPDATE usuario SET id_predio = ? WHERE id_usuario = ?",
          [idPredio, pagamento.id_usuario]
        );
      }
      await conexao.commit();
      return { id_predio: idPredio, jaExistia: false, quantidade_andares: quantidadeAndares };
    } catch (erro) {
      await conexao.rollback();
      throw erro;
    } finally {
      conexao.release();
    }
  }

  return { buscarPorPagamento, criarParaPagamento };
}

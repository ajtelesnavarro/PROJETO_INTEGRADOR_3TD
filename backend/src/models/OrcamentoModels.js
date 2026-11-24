export function criarOrcamentoModel({ pool }) {
  async function buscarServicosPorNome(nomes) {
    if (!nomes.length) return [];
    const [servicos] = await pool.query(
      "SELECT id_servico, nome_servico, valor_base FROM servico WHERE nome_servico IN (?)",
      [nomes]
    );
    return servicos.map((servico) => ({
      id: servico.nome_servico,
      idServico: servico.id_servico,
      nomeServico: servico.nome_servico,
      preco: Number(servico.valor_base),
    }));
  }

  async function criar(dados) {
    const [resultado] = await pool.query(
      `INSERT INTO orcamento (
        id_usuario, nome_responsavel, nome_empresa, email, telefone,
        quantidade_andares, quantidade_ambientes, quantidade_dispositivos,
        descricao, valor_subtotal, valor_desconto, valor_total,
        prazo_estimado_dias, data_validade, status_orcamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.idUsuario ?? null,
        dados.nomeResponsavel,
        dados.nomeEmpresa,
        dados.email,
        dados.telefone || "",
        dados.quantidadeAndares,
        dados.quantidadeAmbientes,
        dados.quantidadeDispositivos ?? null,
        dados.descricao ?? null,
        dados.valorSubtotal ?? null,
        dados.valorDesconto ?? 0,
        dados.valorTotal ?? null,
        dados.prazoEstimadoDias ?? null,
        dados.dataValidade ?? null,
        dados.statusOrcamento || "solicitado",
      ]
    );

    const idOrcamento = resultado.insertId;
    for (const item of dados.servicosDetalhes || []) {
      await pool.query(
        `INSERT INTO orcamento_servico (id_orcamento, id_servico, valor_servico)
         VALUES (?, ?, ?)`,
        [idOrcamento, item.idServico, item.preco]
      );
    }
    return idOrcamento;
  }

  async function listar() {
    const [orcamentos] = await pool.query(
      "SELECT * FROM orcamento ORDER BY id_orcamento DESC"
    );
    let vinculos = [];
    try {
      const [rows] = await pool.query(
        `SELECT os.id_orcamento, os.id_servico, os.valor_servico, s.nome_servico
         FROM orcamento_servico os
         LEFT JOIN servico s ON s.id_servico = os.id_servico`
      );
      vinculos = rows;
    } catch {
      vinculos = [];
    }
    return orcamentos.map((orc) => ({
      ...orc,
      servicos: vinculos.filter((v) => v.id_orcamento === orc.id_orcamento),
    }));
  }

  async function buscarPorId(id) {
    const [resultado] = await pool.query(
      "SELECT * FROM orcamento WHERE id_orcamento = ?",
      [id]
    );
    if (!resultado.length) return null;

    const [servicos] = await pool.query(
      `SELECT os.id_servico, os.valor_servico, s.nome_servico, s.descricao
       FROM orcamento_servico os
       INNER JOIN servico s ON s.id_servico = os.id_servico
       WHERE os.id_orcamento = ?`,
      [id]
    );
    return { ...resultado[0], servicos };
  }

  async function atualizarStatus(id, status) {
    await pool.query(
      "UPDATE orcamento SET status_orcamento = ? WHERE id_orcamento = ?",
      [status, id]
    );
  }

  return { criar, listar, buscarPorId, buscarServicosPorNome, atualizarStatus };
}

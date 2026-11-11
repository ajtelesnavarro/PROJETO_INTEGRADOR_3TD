export function criarOrcamentoModel({ pool }) {
    async function criar(dados) {
        const [resultado] = await pool.query(
            `INSERT INTO orcamento (
                id_usuario,
                nome_responsavel,
                nome_empresa,
                email,
                telefone,
                endereco_empresa,
                quantidade_andares,
                quantidade_ambientes,
                quantidade_dispositivos,
                servicos_desejados,
                descricao,
                valor_subtotal,
                valor_desconto,
                valor_total,
                prazo_estimado_dias,
                data_validade,
                status_orcamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dados.idUsuario,
                dados.nomeResponsavel,
                dados.nomeEmpresa,
                dados.email,
                dados.telefone,
                dados.enderecoEmpresa,
                dados.quantidadeAndares,
                dados.quantidadeAmbientes,
                dados.quantidadeDispositivos,
                dados.servicosDesejados,
                dados.descricao,
                dados.valorSubtotal,
                dados.valorDesconto,
                dados.valorTotal,
                dados.prazoEstimadoDias,
                dados.dataValidade,
                "solicitado"
            ]
        );

        return resultado.insertId;
    }

    async function buscarPorId(id) {
        const [resultado] = await pool.query(
            "SELECT * FROM orcamento WHERE id_orcamento = ?",
            [id]
        );

        return resultado[0];
    }

    async function atualizarStatus(id, status) {
        await pool.query(
            "UPDATE orcamento SET status_orcamento = ? WHERE id_orcamento = ?",
            [status, id]
        );
    }

    return {
        criar,
        buscarPorId,
        atualizarStatus
    };
}
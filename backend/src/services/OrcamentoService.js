import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
const TABELA_SERVICOS = {
  monitoramento_temperatura: { chave: "temperatura", preco: 480 },
  controle_iluminacao: { chave: "iluminacao", preco: 620 },
  monitoramento_energia: { chave: "energia", preco: 750 },
  controle_acesso: { chave: "acesso", preco: 890 },
  monitoramento_dispositivos: { chave: "dispositivo", preco: 540 },
};

const STATUS_VALIDOS = [
  "solicitado",
  "em_analise",
  "enviado",
  "aprovado",
  "recusado",
  "expirado",
];

export function criarOrcamentoService({ orcamentoModel }) {
  async function criar(dados) {
    const nomeResponsavel = dados.nomeResponsavel || dados.nome_responsavel;
    const nomeEmpresa = dados.nomeEmpresa || dados.nome_empresa;
    const email = dados.email;
    const telefone = dados.telefone || "";
    const quantidadeAndares = Number(
      dados.quantidadeAndares ?? dados.quantidade_andares ?? 0
    );
    const quantidadeAmbientes = Number(
      dados.quantidadeAmbientes ?? dados.quantidade_ambientes ?? 0
    );
    const quantidadeDispositivos = Number(
      dados.quantidadeDispositivos ?? dados.quantidade_dispositivos ?? 0
    );
    const servicosRecebidos = dados.servicosDesejados ?? dados.servicos ?? [];

    const servicosLista = Array.isArray(servicosRecebidos)
      ? servicosRecebidos
      : [];

    const servicosDesejados = Array.isArray(servicosRecebidos)
      ? servicosRecebidos.join(", ")
      : String(servicosRecebidos).trim();

    if (
      !nomeResponsavel ||
      !nomeEmpresa ||
      !email ||
      quantidadeAndares <= 0 ||
      quantidadeAmbientes <= 0
    ) {
      throw new Error(
        "Preencha todos os campos obrigatórios (empresa, responsável, e-mail, andares e ambientes)."
      );
    }

    const servicosDetalhes = servicosLista.map((id) => ({
      id,
      ...(TABELA_SERVICOS[id] || { chave: id, preco: 0 }),
    }));

    const totalServicos = servicosDetalhes.reduce((acc, s) => acc + s.preco, 0);
    const totalEstrutura =
      quantidadeAndares * 95 +
      quantidadeAmbientes * 32 +
      quantidadeDispositivos * 18;

    const valorSubtotal =
      dados.valorSubtotal !== undefined
        ? Number(dados.valorSubtotal)
        : totalServicos + totalEstrutura;

    const percentualDesconto = Number(dados.descontoPercentual ?? 0);
    const valorDesconto =
      dados.valorDesconto !== undefined
        ? Number(dados.valorDesconto)
        : Number((valorSubtotal * (percentualDesconto / 100)).toFixed(2));

    const valorTotal =
      dados.valorTotal !== undefined
        ? Number(dados.valorTotal)
        : Number((valorSubtotal - valorDesconto).toFixed(2));

    const prazoEstimadoDias = Number(
      dados.prazoEstimadoDias ?? dados.prazo_estimado_dias ?? 15
    );
    const validade = new Date();
    validade.setDate(validade.getDate() + prazoEstimadoDias);
    const dataValidade =
      dados.dataValidade || validade.toISOString().slice(0, 10);

    const descricaoBase = (dados.descricao || "").trim();
    const tagServicos = servicosLista.length
      ? `[servicos:${servicosLista.join(",")}]`
      : "";
    const descricaoFinal =
      [descricaoBase, tagServicos].filter(Boolean).join(" ").trim() || null;

    let idUsuario = dados.idUsuario ?? null;
    if (!idUsuario && dados.senha) {
      const emailNormalizado = String(email).trim().toLowerCase();
      const [[existente]] = await pool.query("SELECT id_usuario, perfil FROM usuario WHERE email = ? LIMIT 1", [emailNormalizado]);
      if (existente) {
        idUsuario = existente.id_usuario;
        if (existente.perfil === "locador") {
          const senhaHash = await bcrypt.hash(String(dados.senha), 12);
          await pool.query("UPDATE usuario SET nome = ?, telefone = ?, senha_hash = ?, ativo = 'ativo' WHERE id_usuario = ?", [nomeResponsavel, telefone, senhaHash, idUsuario]);
        }
      } else {
        const [[predio]] = await pool.query("SELECT id_predio FROM predio ORDER BY id_predio ASC LIMIT 1");
        if (!predio) throw new Error("Nenhum prédio disponível para vincular o usuário.");
        const senhaHash = await bcrypt.hash(String(dados.senha), 12);
        let cpf = String(Math.floor(10000000000 + Math.random() * 89999999999));
        while (true) {
          const [[cpfExistente]] = await pool.query("SELECT id_usuario FROM usuario WHERE cpf = ? LIMIT 1", [cpf]);
          if (!cpfExistente) break;
          cpf = String(Math.floor(10000000000 + Math.random() * 89999999999));
        }
        const [novo] = await pool.query(`INSERT INTO usuario (id_predio, nome, email, senha_hash, telefone, perfil, cpf, ativo) VALUES (?, ?, ?, ?, ?, 'locador', ?, 'ativo')`, [predio.id_predio, nomeResponsavel, emailNormalizado, senhaHash, telefone || null, cpf]);
        idUsuario = novo.insertId;
      }
    }

    const idOrcamento = await orcamentoModel.criar({
      idUsuario,
      nomeResponsavel,
      nomeEmpresa,
      email,
      telefone,
      quantidadeAndares,
      quantidadeAmbientes,
      quantidadeDispositivos: quantidadeDispositivos || null,
      servicosDesejados,
      descricao: descricaoFinal,
      valorSubtotal,
      valorDesconto,
      valorTotal,
      prazoEstimadoDias,
      dataValidade,
      servicosDetalhes,
    });

    const criado = await orcamentoModel.buscarPorId(idOrcamento);
    return { idOrcamento, dados: criado };
  }

  async function listar() {
    return orcamentoModel.listar();
  }

  async function buscarPorId(id) {
    const orcamento = await orcamentoModel.buscarPorId(id);

    if (!orcamento) {
      throw new Error("Orçamento não encontrado.");
    }

    return orcamento;
  }

  async function atualizarStatus(id, status) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new Error("Status de orçamento inválido.");
    }

    await buscarPorId(id);
    await orcamentoModel.atualizarStatus(id, status);
    return buscarPorId(id);
  }

  return {
    criar,
    listar,
    buscarPorId,
    atualizarStatus,
  };
}

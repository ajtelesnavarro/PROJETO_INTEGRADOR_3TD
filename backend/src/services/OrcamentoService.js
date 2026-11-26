const STATUS_VALIDOS = [
  "solicitado",
  "em_analise",
  "enviado",
  "aprovado",
  "recusado",
  "expirado",
];
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+$/;

export function criarOrcamentoService({ orcamentoModel }) {
  async function criar(dados) {
    const nomeRecebido = dados.nomeResponsavel || dados.nome_responsavel;
    const nomeResponsavel = typeof nomeRecebido === "string" ? nomeRecebido.trim() : "";
    const empresaRecebida = dados.nomeEmpresa || dados.nome_empresa;
    const nomeEmpresa = typeof empresaRecebida === "string" ? empresaRecebida.trim() : "";
    const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : "";
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
    const percentualDesconto = Number(dados.descontoPercentual ?? 0);
    const servicosRecebidos = dados.servicosDesejados ?? dados.servicos ?? [];
    const servicosLista = [...new Set(
      (Array.isArray(servicosRecebidos) ? servicosRecebidos : [servicosRecebidos])
        .map((id) => String(id).trim())
        .filter(Boolean)
    )];

    if (
      !nomeResponsavel ||
      !nomeEmpresa ||
      !REGEX_EMAIL.test(email) ||
      nomeResponsavel.length > 150 ||
      nomeEmpresa.length > 150 ||
      email.length > 150 ||
      telefone.length > 20 ||
      !Number.isFinite(quantidadeAndares) || quantidadeAndares <= 0 ||
      !Number.isFinite(quantidadeAmbientes) || quantidadeAmbientes <= 0 ||
      !Number.isFinite(quantidadeDispositivos) || quantidadeDispositivos < 0 ||
      !Number.isFinite(percentualDesconto) || percentualDesconto < 0 || percentualDesconto > 100
    ) {
      throw new Error(
        "Preencha todos os campos obrigatórios (empresa, responsável, e-mail, andares e ambientes)."
      );
    }

    if (servicosLista.length === 0) {
      throw new Error("Selecione pelo menos um serviço para o orçamento.");
    }

    const servicosDetalhes = await orcamentoModel.buscarServicosPorNome(servicosLista);
    if (servicosDetalhes.length !== servicosLista.length) {
      throw new Error("Um ou mais serviços selecionados são inválidos.");
    }

    const totalServicos = servicosDetalhes.reduce((acc, s) => acc + s.preco, 0);
    const totalEstrutura =
      quantidadeAndares * 95 +
      quantidadeAmbientes * 32 +
      quantidadeDispositivos * 18;

    const valorSubtotal = Number((totalServicos + totalEstrutura).toFixed(2));
    const valorDesconto = Number((valorSubtotal * (percentualDesconto / 100)).toFixed(2));
    const valorTotal = Number((valorSubtotal - valorDesconto).toFixed(2));

    const prazoCalculado = Math.max(
      5,
      Math.ceil(quantidadeAndares / 2) +
        Math.ceil(quantidadeAmbientes / 10) +
        Math.ceil(quantidadeDispositivos / 20) +
        servicosDetalhes.length * 2
    );
    const prazoInformado = dados.prazoEstimadoDias ?? dados.prazo_estimado_dias;
    const prazoEstimadoDias =
      prazoInformado === undefined || prazoInformado === null || prazoInformado === ""
        ? prazoCalculado
        : Number(prazoInformado);
    if (!Number.isInteger(prazoEstimadoDias) || prazoEstimadoDias < 0) {
      throw new Error("A validade do orçamento deve ser um número de dias válido.");
    }
    const validadeCalculada = new Date();
    validadeCalculada.setUTCDate(validadeCalculada.getUTCDate() + 30);
    const dataValidade =
      dados.dataValidade ??
      dados.data_validade ??
      validadeCalculada.toISOString().slice(0, 10);

    const descricaoBase = (dados.descricao || "").trim();
    const descricaoFinal = descricaoBase || null;
    const idOrcamento = await orcamentoModel.criar({
      nomeResponsavel,
      nomeEmpresa,
      email,
      telefone,
      quantidadeAndares,
      quantidadeAmbientes,
      quantidadeDispositivos: quantidadeDispositivos || null,
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

  async function listarServicos() {
    return orcamentoModel.listarServicos();
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
    listarServicos,
    buscarPorId,
    atualizarStatus,
  };
}

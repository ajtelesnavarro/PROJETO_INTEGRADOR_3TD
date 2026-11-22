"use client";

import { useEffect, useState } from "react";
import "./reclamacoes.css";

/*
  API usada por esta página (resposta: { dados } | erro: { erro }):

  GET   /auth/me                       usuário logado: id_usuario, nome, perfil
  GET   /reclamacoes                   locador recebe só as dele (o backend filtra)
  POST  /reclamacoes                   o id_usuario_abertura vem do token
  PUT   /reclamacoes/:id               edita a reclamação
  PATCH /reclamacoes/:id/status        corpo: { status_chamado }
  PATCH /reclamacoes/:id/responsavel   corpo: { id_usuario_responsavel }
  GET   /usuarios                      id_usuario, nome, perfil
  GET   /ambientes                     id_ambiente, nome
  GET   /dispositivos                  id_dispositivo, id_ambiente, nome

  Os campos têm o mesmo nome das colunas do banco (ex.: status_chamado).
*/

/* ---------- Constantes (iguais aos ENUMs do banco) ---------- */

const statusChamado = {
  aberto: { rotulo: "Aberto", cor: "amber" },
  em_andamento: { rotulo: "Em andamento", cor: "blue" },
  concluido: { rotulo: "Concluído", cor: "green" },
  cancelado: { rotulo: "Cancelado", cor: "gray" },
};

const prioridades = {
  baixa: { rotulo: "Baixa", cor: "green" },
  media: { rotulo: "Média", cor: "amber" },
  alta: { rotulo: "Alta", cor: "red" },
};

const categorias = {
  climatizacao: "Climatização",
  iluminacao: "Iluminação",
  acesso: "Acesso",
  energia: "Energia",
  dispositivo: "Dispositivo",
  outro: "Outro",
};

const perfis = {
  administrador: "Administrador",
  manutencao: "Manutenção",
  porteiro: "Porteiro",
  locador: "Locador",
};

const etapas = [
  { status: "aberto", rotulo: "Recebida" },
  { status: "em_andamento", rotulo: "Em andamento" },
  { status: "concluido", rotulo: "Concluída" },
];

const filtrosIniciais = { busca: "", status: "todos", prioridade: "todos", categoria: "todos" };

const formularioVazio = {
  id_ambiente: "",
  id_dispositivo: "",
  id_usuario_responsavel: "",
  prioridade: "media",
  categoria_problema: "",
  descricao_usuario: "",
};

/* ---------- Funções auxiliares ---------- */

function obterUrlApi() {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
  return base.endsWith("/api/v1") ? base : base.endsWith("/api") ? `${base}/v1` : `${base}/api/v1`;
}

// Chamada à API com o token do login. Devolve o campo "dados" da resposta.
async function chamarApi(caminho, metodo = "GET", corpo) {
  const token = localStorage.getItem("lumora_token");
  if (!token) throw new Error("Sua sessão expirou. Entre novamente.");

  const resposta = await fetch(`${obterUrlApi()}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const resultado = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível concluir a operação.");
  return resultado.dados;
}

function mensagemDoErro(e) {
  return e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message;
}

function formatarData(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function acharPorId(lista, campo, id) {
  return lista.find((item) => item[campo] === id);
}

// Regra do banco: precisa de ambiente OU dispositivo. Devolve o erro ou null.
function validarFormulario(formulario) {
  if (!formulario.descricao_usuario.trim()) return "Descreva o problema.";
  if (!formulario.id_ambiente && !formulario.id_dispositivo) {
    return "Informe o ambiente ou o dispositivo afetado.";
  }
  return null;
}

// Converte os textos do formulário em números/null para enviar à API.
function montarDados(formulario) {
  const numero = (valor) => (valor === "" || valor == null ? null : Number(valor));
  return {
    id_ambiente: numero(formulario.id_ambiente),
    id_dispositivo: numero(formulario.id_dispositivo),
    id_usuario_responsavel: numero(formulario.id_usuario_responsavel),
    prioridade: formulario.prioridade,
    categoria_problema: formulario.categoria_problema || null,
    descricao_usuario: formulario.descricao_usuario.trim(),
  };
}

function Icone({ nome, tamanho = 18 }) {
  const desenhos = {
    busca: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    mais: <path d="M12 5v14M5 12h14" />,
    alerta: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4m0 3h.01" /></>,
    relogio: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    bandeira: <><path d="M5 21V4" /><path d="M5 4h12l-2 4 2 4H5" /></>,
    ambiente: <><path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" /></>,
    dispositivo: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" /></>,
    usuario: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    ferramenta: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
    filtro: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    seta: <path d="M5 12h14m-5-5 5 5-5 5" />,
    editar: <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" />,
    fechar: <path d="m6 6 12 12M18 6 6 18" />,
    proibido: <><circle cx="12" cy="12" r="9" /><path d="m5.7 5.7 12.6 12.6" /></>,
    iniciar: <path d="M7 4v16l13-8L7 4Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    caixa: <><path d="M3 13h5l1 3h6l1-3h5" /><path d="M5 5h14l2 8v6H3v-6l2-8Z" /></>,
  };

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {desenhos[nome]}
    </svg>
  );
}

function Selo({ cor, children }) {
  return <span className={`rec-badge ${cor}`}>{children}</span>;
}

/* ---------- Página ---------- */

export default function Reclamacoes({ toast }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [reclamacoes, setReclamacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  const [idSelecionado, setIdSelecionado] = useState(null);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioVazio);

  // Carrega tudo ao abrir a página
  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const [eu, lista, pessoas, locais, aparelhos] = await Promise.all([
          chamarApi("/auth/me"),
          chamarApi("/reclamacoes"),
          chamarApi("/usuarios"),
          chamarApi("/ambientes"),
          chamarApi("/dispositivos"),
        ]);
        if (!ativo) return;
        setUsuarioLogado(eu);
        setReclamacoes(lista);
        setUsuarios(pessoas);
        setAmbientes(locais);
        setDispositivos(aparelhos);
      } catch (e) {
        if (ativo) setErro(mensagemDoErro(e));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();
    return () => { ativo = false; };
  }, []);

  function mostrarAviso(texto) {
    if (toast) return toast(texto);
    setAviso(texto);
    window.setTimeout(() => setAviso(""), 2600);
  }

  function atualizarNaLista(id, alteracoes) {
    setReclamacoes((lista) =>
      lista.map((r) => (r.id_reclamacao === id ? { ...r, ...alteracoes } : r))
    );
  }

  function alterarFiltro(campo, valor) {
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarCampo(campo, valor) {
    setFormulario((atual) => {
      const novo = { ...atual, [campo]: valor };
      if (campo === "id_ambiente") novo.id_dispositivo = ""; // o dispositivo pode não ser do novo ambiente
      return novo;
    });
  }

  function abrirNova() {
    setIdEditando(null);
    setFormulario(formularioVazio);
    setModalAberto(true);
  }

  function abrirEdicao() {
    setIdEditando(selecionada.id_reclamacao);
    setFormulario({
      id_ambiente: selecionada.id_ambiente ?? "",
      id_dispositivo: selecionada.id_dispositivo ?? "",
      id_usuario_responsavel: selecionada.id_usuario_responsavel ?? "",
      prioridade: selecionada.prioridade,
      categoria_problema: selecionada.categoria_problema ?? "",
      descricao_usuario: selecionada.descricao_usuario,
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario(formularioVazio);
  }

  async function salvarReclamacao(evento) {
    evento.preventDefault();

    const mensagemErro = validarFormulario(formulario);
    if (mensagemErro) return mostrarAviso(mensagemErro);

    const dados = montarDados(formulario);

    try {
      if (idEditando) {
        const atualizada = await chamarApi(`/reclamacoes/${idEditando}`, "PUT", dados);
        atualizarNaLista(idEditando, atualizada ?? dados);
        setIdSelecionado(idEditando);
        mostrarAviso("Reclamação atualizada.");
      } else {
        const criada = await chamarApi("/reclamacoes", "POST", dados);
        setReclamacoes((lista) => [...lista, criada]);
        setIdSelecionado(criada.id_reclamacao);
        mostrarAviso("Reclamação registrada.");
      }
      fecharModal();
    } catch (e) {
      mostrarAviso(mensagemDoErro(e));
    }
  }

  async function mudarStatus(novoStatus) {
    try {
      await chamarApi(`/reclamacoes/${selecionada.id_reclamacao}/status`, "PATCH", { status_chamado: novoStatus });
      atualizarNaLista(selecionada.id_reclamacao, { status_chamado: novoStatus });
      mostrarAviso(`Status alterado para "${statusChamado[novoStatus].rotulo}".`);
    } catch (e) {
      mostrarAviso(mensagemDoErro(e));
    }
  }

  function cancelarReclamacao() {
    if (window.confirm(`Deseja cancelar a reclamação #${selecionada.id_reclamacao}?`)) {
      mudarStatus("cancelado");
    }
  }

  async function mudarResponsavel(valor) {
    const idResponsavel = valor === "" ? null : Number(valor);
    try {
      await chamarApi(`/reclamacoes/${selecionada.id_reclamacao}/responsavel`, "PATCH", { id_usuario_responsavel: idResponsavel });
      atualizarNaLista(selecionada.id_reclamacao, { id_usuario_responsavel: idResponsavel });
      mostrarAviso("Responsável atualizado.");
    } catch (e) {
      mostrarAviso(mensagemDoErro(e));
    }
  }

  if (carregando) {
    return <div className="rec-page"><div className="rec-empty-list"><b>Carregando reclamações...</b></div></div>;
  }

  if (erro) {
    return <div className="rec-page"><div className="rec-empty-list"><b>{erro}</b></div></div>;
  }

  /* ----- Dados calculados para a tela ----- */

  const ehLocador = usuarioLogado?.perfil === "locador";

  // o locador só vê as dele (o backend também deve garantir isso)
  const minhas = ehLocador
    ? reclamacoes.filter((r) => r.id_usuario_abertura === usuarioLogado.id_usuario)
    : reclamacoes;

  const termo = filtros.busca.toLowerCase().trim();
  const filtradas = minhas
    .filter((r) => {
      const ambiente = acharPorId(ambientes, "id_ambiente", r.id_ambiente)?.nome ?? "";
      const solicitante = acharPorId(usuarios, "id_usuario", r.id_usuario_abertura)?.nome ?? "";
      return (
        (r.descricao_usuario.toLowerCase().includes(termo) ||
          ambiente.toLowerCase().includes(termo) ||
          solicitante.toLowerCase().includes(termo) ||
          `#${r.id_reclamacao}`.includes(termo)) &&
        (filtros.status === "todos" || r.status_chamado === filtros.status) &&
        (filtros.prioridade === "todos" || r.prioridade === filtros.prioridade) &&
        (filtros.categoria === "todos" || r.categoria_problema === filtros.categoria)
      );
    })
    .sort((a, b) => b.data_hora_recebido.localeCompare(a.data_hora_recebido));

  const contar = (status) => minhas.filter((r) => r.status_chamado === status).length;
  const altaPrioridade = minhas.filter(
    (r) => r.prioridade === "alta" && ["aberto", "em_andamento"].includes(r.status_chamado)
  ).length;

  const selecionada = minhas.find((r) => r.id_reclamacao === idSelecionado) ?? filtradas[0];
  const solicitante = acharPorId(usuarios, "id_usuario", selecionada?.id_usuario_abertura);
  const responsavel = acharPorId(usuarios, "id_usuario", selecionada?.id_usuario_responsavel);
  const ambiente = acharPorId(ambientes, "id_ambiente", selecionada?.id_ambiente);
  const dispositivo = acharPorId(dispositivos, "id_dispositivo", selecionada?.id_dispositivo);

  const etapaAtual = etapas.findIndex((e) => e.status === selecionada?.status_chamado);
  const equipe = usuarios.filter((u) => u.perfil !== "locador");
  const dispositivosDoAmbiente = dispositivos.filter(
    (d) => !formulario.id_ambiente || d.id_ambiente === Number(formulario.id_ambiente)
  );

  // locador só edita e cancela enquanto o atendimento não começou
  const podeEditar = !ehLocador || selecionada?.status_chamado === "aberto";
  const podeCancelar = ehLocador
    ? selecionada?.status_chamado === "aberto"
    : !["cancelado", "concluido"].includes(selecionada?.status_chamado);

  const mensagemLocador = {
    aberto: "Recebemos sua reclamação. Ela está aguardando o início do atendimento.",
    em_andamento: responsavel
      ? `${responsavel.nome} está cuidando do seu chamado.`
      : "A equipe já está cuidando do seu chamado.",
    concluido: "O problema foi resolvido. Se ele voltar, abra uma nova reclamação.",
  }[selecionada?.status_chamado];

  return (
    <div className="rec-page">
      <header className="rec-heading">
        <div>
          <span className="rec-eyebrow">{ehLocador ? "SUPORTE AO LOCADOR" : "CENTRAL DE CHAMADOS"}</span>
          <h1>{ehLocador ? "Minhas reclamações" : "Reclamações"}</h1>
          <p>
            {ehLocador
              ? "Relate problemas nos espaços que você utiliza e acompanhe o andamento."
              : "Acompanhe os problemas relatados nos ambientes e dispositivos do edifício."}
          </p>
        </div>

        <button className="rec-primary" onClick={abrirNova}>
          <Icone nome="mais" tamanho={17} />
          Nova reclamação
        </button>
      </header>

      <section className={`rec-summary ${ehLocador ? "three" : ""}`}>
        <div className="rec-summary-item">
          <span className="rec-summary-icon amber"><Icone nome="caixa" /></span>
          <div><strong>{contar("aberto")}</strong><span>Abertas</span></div>
        </div>
        <div className="rec-summary-item">
          <span className="rec-summary-icon blue"><Icone nome="ferramenta" /></span>
          <div><strong>{contar("em_andamento")}</strong><span>Em andamento</span></div>
        </div>
        <div className="rec-summary-item">
          <span className="rec-summary-icon green"><Icone nome="check" /></span>
          <div><strong>{contar("concluido")}</strong><span>Concluídas</span></div>
        </div>
        {!ehLocador && (
          <div className="rec-summary-item">
            <span className="rec-summary-icon red"><Icone nome="alerta" /></span>
            <div><strong>{altaPrioridade}</strong><span>Alta prioridade em aberto</span></div>
          </div>
        )}
      </section>

      <div className="rec-workspace">
        {/* ---------- Lista ---------- */}
        <section className="rec-list-panel">
          <div className="rec-list-heading">
            <div>
              <span className="rec-section-label">{ehLocador ? "SEUS CHAMADOS" : "FILA DE ATENDIMENTO"}</span>
              <h2>{ehLocador ? "Reclamações que você abriu" : "Reclamações registradas"}</h2>
            </div>
            <span className="rec-count">{filtradas.length} registros</span>
          </div>

          <div className="rec-search">
            <Icone nome="busca" tamanho={17} />
            <input
              value={filtros.busca}
              onChange={(e) => alterarFiltro("busca", e.target.value)}
              placeholder="Buscar por descrição, ambiente ou solicitante..."
            />
          </div>

          <div className="rec-filters">
            <label>
              <Icone nome="filtro" tamanho={14} />
              <select value={filtros.status} onChange={(e) => alterarFiltro("status", e.target.value)}>
                <option value="todos">Todos os status</option>
                {Object.entries(statusChamado).map(([valor, item]) => (
                  <option key={valor} value={valor}>{item.rotulo}</option>
                ))}
              </select>
            </label>

            {!ehLocador && (
              <label>
                <Icone nome="bandeira" tamanho={14} />
                <select value={filtros.prioridade} onChange={(e) => alterarFiltro("prioridade", e.target.value)}>
                  <option value="todos">Todas as prioridades</option>
                  {Object.entries(prioridades).map(([valor, item]) => (
                    <option key={valor} value={valor}>{item.rotulo}</option>
                  ))}
                </select>
              </label>
            )}

            <label>
              <Icone nome="ferramenta" tamanho={14} />
              <select value={filtros.categoria} onChange={(e) => alterarFiltro("categoria", e.target.value)}>
                <option value="todos">Todas as categorias</option>
                {Object.entries(categorias).map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>{rotulo}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rec-list">
            {filtradas.length === 0 ? (
              <div className="rec-empty-list">
                <Icone nome="busca" tamanho={25} />
                <b>{ehLocador && minhas.length === 0 ? "Você ainda não abriu reclamações" : "Nenhuma reclamação encontrada"}</b>
                <span>
                  {ehLocador && minhas.length === 0
                    ? 'Use o botão "Nova reclamação" para relatar um problema.'
                    : "Tente alterar os filtros ou a busca."}
                </span>
              </div>
            ) : (
              filtradas.map((r) => (
                <button
                  key={r.id_reclamacao}
                  className={`rec-list-item ${selecionada?.id_reclamacao === r.id_reclamacao ? "selected" : ""}`}
                  onClick={() => setIdSelecionado(r.id_reclamacao)}
                >
                  <span className={`rec-list-symbol ${prioridades[r.prioridade].cor}`}>
                    <Icone nome="alerta" tamanho={19} />
                  </span>
                  <span className="rec-list-copy">
                    <strong>{r.descricao_usuario}</strong>
                    <small>
                      #{r.id_reclamacao} · {acharPorId(ambientes, "id_ambiente", r.id_ambiente)?.nome ?? acharPorId(dispositivos, "id_dispositivo", r.id_dispositivo)?.nome}
                    </small>
                    <span className="rec-list-meta">
                      <Selo cor={statusChamado[r.status_chamado].cor}>{statusChamado[r.status_chamado].rotulo}</Selo>
                      <span>{formatarData(r.data_hora_recebido)}</span>
                    </span>
                  </span>
                  <Icone nome="seta" tamanho={16} />
                </button>
              ))
            )}
          </div>

          <div className="rec-list-footer">
            <span>Edifício Empresarial Central</span>
            <span>Central de chamados</span>
          </div>
        </section>

        {/* ---------- Detalhes ---------- */}
        <section className="rec-detail-panel">
          {selecionada ? (
            <>
              <div className="rec-detail-top">
                <div className={`rec-detail-symbol ${prioridades[selecionada.prioridade].cor}`}>
                  <Icone nome="alerta" tamanho={25} />
                </div>
                <div className="rec-detail-actions">
                  {podeEditar && (
                    <button className="rec-icon-button" onClick={abrirEdicao} title="Editar reclamação">
                      <Icone nome="editar" tamanho={17} />
                    </button>
                  )}
                  <button className="rec-icon-button danger" onClick={cancelarReclamacao} disabled={!podeCancelar} title="Cancelar reclamação">
                    <Icone nome="proibido" tamanho={17} />
                  </button>
                </div>
              </div>

              <span className="rec-section-label">CHAMADO #{selecionada.id_reclamacao}</span>
              <h2 className="rec-detail-title">{selecionada.descricao_usuario}</h2>

              <div className="rec-badges">
                <Selo cor={statusChamado[selecionada.status_chamado].cor}>{statusChamado[selecionada.status_chamado].rotulo}</Selo>
                {!ehLocador && (
                  <Selo cor={prioridades[selecionada.prioridade].cor}>
                    Prioridade {prioridades[selecionada.prioridade].rotulo.toLowerCase()}
                  </Selo>
                )}
                {selecionada.categoria_problema && <Selo cor="slate">{categorias[selecionada.categoria_problema]}</Selo>}
              </div>

              {selecionada.status_chamado === "cancelado" ? (
                <div className="rec-cancelled">
                  <Icone nome="proibido" tamanho={17} />
                  Esta reclamação foi cancelada e não será atendida.
                </div>
              ) : (
                <div className="rec-progress">
                  {etapas.map((etapa, indice) => (
                    <div
                      key={etapa.status}
                      className={`rec-step ${indice < etapaAtual ? "done" : ""} ${indice === etapaAtual ? "current" : ""}`}
                    >
                      <span className="rec-step-dot">{indice <= etapaAtual && <Icone nome="check" tamanho={11} />}</span>
                      <small>{etapa.rotulo}</small>
                    </div>
                  ))}
                </div>
              )}

              {ehLocador && mensagemLocador && (
                <div className="rec-user-message">
                  <Icone nome="info" tamanho={17} />
                  <p>{mensagemLocador}</p>
                </div>
              )}

              <div className="rec-detail-grid">
                <div className="rec-info-box">
                  <span><Icone nome="ambiente" tamanho={17} /></span>
                  <small>AMBIENTE</small>
                  <strong>{ambiente?.nome ?? "Não informado"}</strong>
                </div>
                <div className="rec-info-box">
                  <span><Icone nome="dispositivo" tamanho={17} /></span>
                  <small>DISPOSITIVO</small>
                  <strong>{dispositivo?.nome ?? "Não informado"}</strong>
                </div>
                {ehLocador ? (
                  <div className="rec-info-box">
                    <span><Icone nome="ferramenta" tamanho={17} /></span>
                    <small>RESPONSÁVEL</small>
                    <strong>{responsavel?.nome ?? "Aguardando definição"}</strong>
                    {responsavel && <em>{perfis[responsavel.perfil]}</em>}
                  </div>
                ) : (
                  <div className="rec-info-box">
                    <span><Icone nome="usuario" tamanho={17} /></span>
                    <small>ABERTA POR</small>
                    <strong>{solicitante?.nome ?? "—"}</strong>
                    {solicitante && <em>{perfis[solicitante.perfil]}</em>}
                  </div>
                )}
                <div className="rec-info-box">
                  <span><Icone nome="relogio" tamanho={17} /></span>
                  <small>RECEBIDA EM</small>
                  <strong>{formatarData(selecionada.data_hora_recebido)}</strong>
                </div>
              </div>

              {/* Só a equipe define responsável e muda o status */}
              {!ehLocador && (
                <>
                  <div className="rec-assign">
                    <div>
                      <span className="rec-section-label">ATENDIMENTO</span>
                      <h3>Responsável pelo chamado</h3>
                    </div>
                    <select
                      value={selecionada.id_usuario_responsavel ?? ""}
                      onChange={(e) => mudarResponsavel(e.target.value)}
                      disabled={selecionada.status_chamado === "cancelado"}
                    >
                      <option value="">Sem responsável</option>
                      {equipe.map((u) => (
                        <option key={u.id_usuario} value={u.id_usuario}>{u.nome} · {perfis[u.perfil]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="rec-status-actions">
                    {selecionada.status_chamado === "aberto" && (
                      <button className="rec-primary" onClick={() => mudarStatus("em_andamento")}>
                        <Icone nome="iniciar" tamanho={14} />
                        Iniciar atendimento
                      </button>
                    )}
                    {selecionada.status_chamado === "em_andamento" && (
                      <button className="rec-primary" onClick={() => mudarStatus("concluido")}>
                        <Icone nome="check" tamanho={16} />
                        Concluir chamado
                      </button>
                    )}
                    {["concluido", "cancelado"].includes(selecionada.status_chamado) && (
                      <button className="rec-cancel" onClick={() => mudarStatus("aberto")}>
                        Reabrir chamado
                      </button>
                    )}
                  </div>
                </>
              )}

              <div className="rec-note">
                <Icone nome="info" tamanho={17} />
                <p>
                  {ehLocador
                    ? "Você pode editar ou cancelar a reclamação enquanto o atendimento não começar. Depois disso, acompanhe o andamento por aqui."
                    : "Para investigar o problema, consulte o histórico de leituras e as ocorrências do dispositivo vinculado. Os valores medidos não ficam guardados na reclamação."}
                </p>
              </div>
            </>
          ) : (
            <div className="rec-no-selection">
              <span><Icone nome="caixa" tamanho={30} /></span>
              <h2>Selecione uma reclamação</h2>
              <p>Escolha um chamado na lista para ver os detalhes e atualizar o status.</p>
            </div>
          )}
        </section>
      </div>

      {/* ---------- Modal ---------- */}
      {modalAberto && (
        <div className="rec-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && fecharModal()}>
          <form className="rec-modal" onSubmit={salvarReclamacao}>
            <div className="rec-modal-header">
              <div>
                <span className="rec-section-label">CENTRAL DE CHAMADOS</span>
                <h2>{idEditando ? "Editar reclamação" : "Nova reclamação"}</h2>
                <p>{idEditando ? "Atualize as informações do chamado." : `Será aberta em nome de ${usuarioLogado.nome}.`}</p>
              </div>
              <button type="button" className="rec-icon-button" onClick={fecharModal}>
                <Icone nome="fechar" />
              </button>
            </div>

            <div className="rec-form-grid">
              <label>
                Ambiente
                <select value={formulario.id_ambiente} onChange={(e) => alterarCampo("id_ambiente", e.target.value)}>
                  <option value="">Selecione o ambiente</option>
                  {ambientes.map((a) => (
                    <option key={a.id_ambiente} value={a.id_ambiente}>{a.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Dispositivo
                <select value={formulario.id_dispositivo} onChange={(e) => alterarCampo("id_dispositivo", e.target.value)}>
                  <option value="">Selecione o dispositivo</option>
                  {dispositivosDoAmbiente.map((d) => (
                    <option key={d.id_dispositivo} value={d.id_dispositivo}>{d.nome}</option>
                  ))}
                </select>
              </label>

              <label className={ehLocador ? "full" : undefined}>
                Categoria
                <select value={formulario.categoria_problema} onChange={(e) => alterarCampo("categoria_problema", e.target.value)}>
                  <option value="">Sem categoria</option>
                  {Object.entries(categorias).map(([valor, rotulo]) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                  ))}
                </select>
              </label>

              {!ehLocador && (
                <>
                  <label>
                    Prioridade
                    <select value={formulario.prioridade} onChange={(e) => alterarCampo("prioridade", e.target.value)}>
                      {Object.entries(prioridades).map(([valor, item]) => (
                        <option key={valor} value={valor}>{item.rotulo}</option>
                      ))}
                    </select>
                  </label>

                  <label className="full">
                    Responsável pelo atendimento
                    <select value={formulario.id_usuario_responsavel} onChange={(e) => alterarCampo("id_usuario_responsavel", e.target.value)}>
                      <option value="">Definir depois</option>
                      {equipe.map((u) => (
                        <option key={u.id_usuario} value={u.id_usuario}>{u.nome} · {perfis[u.perfil]}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              <label className="full">
                Descrição do problema *
                <textarea
                  value={formulario.descricao_usuario}
                  onChange={(e) => alterarCampo("descricao_usuario", e.target.value)}
                  placeholder="Ex.: O ar-condicionado da sala não está resfriando."
                  rows="3"
                  required
                />
              </label>
            </div>

            <div className="rec-form-footer">
              <span>* Informe ao menos o ambiente ou o dispositivo</span>
              <div>
                <button type="button" className="rec-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="rec-primary">
                  <Icone nome="check" tamanho={16} />
                  {idEditando ? "Salvar alterações" : "Registrar reclamação"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {aviso && <div className="rec-toast"><Icone nome="check" tamanho={16} />{aviso}</div>}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import "./reclamacoes.css";

/* ---------- Dados de apoio (espelham as tabelas do db_lumora) ---------- */

const usuarios = [
  { id: 1, nome: "Ana Souza", perfil: "Administrador" },
  { id: 2, nome: "Bruno Lima", perfil: "Manutenção" },
  { id: 3, nome: "Carla Mendes", perfil: "Porteiro" },
  { id: 4, nome: "Diego Alves", perfil: "Porteiro" },
  { id: 5, nome: "Elisa Costa", perfil: "Locador" },
];

const ambientes = [
  { id: 1, nome: "Recepção" },
  { id: 2, nome: "Sala de reuniões A" },
  { id: 3, nome: "Sala de atendimento" },
  { id: 4, nome: "Escritório administrativo" },
  { id: 5, nome: "Laboratório de tecnologia" },
];

const dispositivos = [
  { id: 1, idAmbiente: 1, nome: "Sensor de temperatura da recepção" },
  { id: 2, idAmbiente: 2, nome: "Sensor de iluminação da sala A" },
  { id: 3, idAmbiente: 3, nome: "Medidor de energia do atendimento" },
  { id: 4, idAmbiente: 4, nome: "Sensor de temperatura do escritório" },
  { id: 5, idAmbiente: 5, nome: "Sensor de iluminação do laboratório" },
];

const STATUS = {
  aberto: { label: "Aberto", tone: "amber" },
  em_andamento: { label: "Em andamento", tone: "blue" },
  concluido: { label: "Concluído", tone: "green" },
  cancelado: { label: "Cancelado", tone: "gray" },
};

const PRIORIDADE = {
  baixa: { label: "Baixa", tone: "green" },
  media: { label: "Média", tone: "amber" },
  alta: { label: "Alta", tone: "red" },
};

const CATEGORIA = {
  climatizacao: "Climatização",
  iluminacao: "Iluminação",
  acesso: "Acesso",
  energia: "Energia",
  dispositivo: "Dispositivo",
  outro: "Outro",
};

const initialComplaints = [
  {
    id: 1,
    idUsuarioAbertura: 1,
    idAmbiente: 1,
    idDispositivo: 1,
    idResponsavel: 2,
    status: "em_andamento",
    dataHora: "2026-11-01T09:15",
    descricao: "Temperatura da recepção acima do habitual.",
    prioridade: "alta",
    categoria: "climatizacao",
  },
  {
    id: 2,
    idUsuarioAbertura: 3,
    idAmbiente: 2,
    idDispositivo: 2,
    idResponsavel: 2,
    status: "em_andamento",
    dataHora: "2026-11-01T10:30",
    descricao: "Iluminação da sala de reuniões está fraca.",
    prioridade: "media",
    categoria: "iluminacao",
  },
  {
    id: 3,
    idUsuarioAbertura: 5,
    idAmbiente: 5,
    idDispositivo: null,
    idResponsavel: 2,
    status: "aberto",
    dataHora: "2026-11-02T14:00",
    descricao: "Acesso ao laboratório não foi liberado.",
    prioridade: "alta",
    categoria: "acesso",
  },
  {
    id: 4,
    idUsuarioAbertura: 2,
    idAmbiente: 3,
    idDispositivo: 3,
    idResponsavel: null,
    status: "concluido",
    dataHora: "2026-11-02T15:20",
    descricao: "Medidor de energia apresentou leitura inconsistente.",
    prioridade: "media",
    categoria: "energia",
  },
  {
    id: 5,
    idUsuarioAbertura: 4,
    idAmbiente: 4,
    idDispositivo: 4,
    idResponsavel: 2,
    status: "em_andamento",
    dataHora: "2026-11-03T08:45",
    descricao: "Sensor do escritório está sem atualizar as leituras.",
    prioridade: "alta",
    categoria: "dispositivo",
  },
];

const emptyForm = {
  idUsuarioAbertura: "",
  idAmbiente: "",
  idDispositivo: "",
  idResponsavel: "",
  prioridade: "media",
  categoria: "",
  descricao: "",
};

/* ---------- Utilidades ---------- */

const byId = (list, id) => list.find((item) => item.id === id);

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Icon({ name, size = 18 }) {
  const icons = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4m0 3h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    flag: <><path d="M5 21V4" /><path d="M5 4h12l-2 4 2 4H5" /></>,
    room: <><path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" /></>,
    device: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    tool: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    edit: <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    ban: <><circle cx="12" cy="12" r="9" /><path d="m5.7 5.7 12.6 12.6" /></>,
    play: <path d="M7 4v16l13-8L7 4Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    inbox: <><path d="M3 13h5l1 3h6l1-3h5" /><path d="M5 5h14l2 8v6H3v-6l2-8Z" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Badge({ tone, children }) {
  return <span className={`rec-badge ${tone}`}>{children}</span>;
}

/* ---------- Página ---------- */

export default function Reclamacoes({ toast }) {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedId, setSelectedId] = useState(initialComplaints[0]?.id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const selected = complaints.find((item) => item.id === selectedId);

  const count = (status) => complaints.filter((c) => c.status === status).length;
  const highPriorityOpen = complaints.filter(
    (c) => c.prioridade === "alta" && ["aberto", "em_andamento"].includes(c.status)
  ).length;

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return complaints
      .filter((item) => {
        const ambiente = byId(ambientes, item.idAmbiente)?.nome ?? "";
        const solicitante = byId(usuarios, item.idUsuarioAbertura)?.nome ?? "";

        const matchesSearch =
          item.descricao.toLowerCase().includes(term) ||
          ambiente.toLowerCase().includes(term) ||
          solicitante.toLowerCase().includes(term) ||
          `#${item.id}`.includes(term);

        return (
          matchesSearch &&
          (statusFilter === "Todos" || item.status === statusFilter) &&
          (priorityFilter === "Todos" || item.prioridade === priorityFilter) &&
          (categoryFilter === "Todos" || item.categoria === categoryFilter)
        );
      })
      .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  }, [complaints, search, statusFilter, priorityFilter, categoryFilter]);

  const notify = (text) => {
    if (toast) {
      toast(text);
    } else {
      setMessage(text);
      window.setTimeout(() => setMessage(""), 2600);
    }
  };

  const updateForm = (field, value) =>
    setForm((current) => {
      const next = { ...current, [field]: value };
      // ao trocar o ambiente, limpa o dispositivo que não pertence a ele
      if (field === "idAmbiente") next.idDispositivo = "";
      return next;
    });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      idUsuarioAbertura: item.idUsuarioAbertura ?? "",
      idAmbiente: item.idAmbiente ?? "",
      idDispositivo: item.idDispositivo ?? "",
      idResponsavel: item.idResponsavel ?? "",
      prioridade: item.prioridade,
      categoria: item.categoria ?? "",
      descricao: item.descricao,
    });
    setModalOpen(true);
  };

  const saveComplaint = (event) => {
    event.preventDefault();

    if (!form.idUsuarioAbertura || !form.descricao.trim()) {
      notify("Informe o solicitante e a descrição do problema.");
      return;
    }

    // regra do banco: chk_reclamacao_local
    if (!form.idAmbiente && !form.idDispositivo) {
      notify("Informe o ambiente ou o dispositivo afetado.");
      return;
    }

    const toNumber = (v) => (v === "" ? null : Number(v));

    const data = {
      idUsuarioAbertura: Number(form.idUsuarioAbertura),
      idAmbiente: toNumber(form.idAmbiente),
      idDispositivo: toNumber(form.idDispositivo),
      idResponsavel: toNumber(form.idResponsavel),
      prioridade: form.prioridade,
      categoria: form.categoria || null,
      descricao: form.descricao.trim(),
    };

    if (editingId) {
      setComplaints((current) =>
        current.map((item) => (item.id === editingId ? { ...item, ...data } : item))
      );
      setSelectedId(editingId);
      notify("Reclamação atualizada.");
    } else {
      const newId = Math.max(0, ...complaints.map((c) => c.id)) + 1;
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

      setComplaints((current) => [
        ...current,
        { id: newId, status: "aberto", dataHora: now.toISOString().slice(0, 16), ...data },
      ]);
      setSelectedId(newId);
      notify("Reclamação registrada.");
    }

    setModalOpen(false);
    setForm(emptyForm);
  };

  const changeStatus = (status) => {
    if (!selected) return;
    setComplaints((current) =>
      current.map((item) => (item.id === selected.id ? { ...item, status } : item))
    );
    notify(`Status alterado para "${STATUS[status].label}".`);
  };

  const cancelComplaint = () => {
    if (!selected) return;
    const confirmed = window.confirm(`Deseja cancelar a reclamação #${selected.id}?`);
    if (confirmed) changeStatus("cancelado");
  };

  const assignResponsible = (value) => {
    setComplaints((current) =>
      current.map((item) =>
        item.id === selected.id
          ? { ...item, idResponsavel: value === "" ? null : Number(value) }
          : item
      )
    );
    notify("Responsável atualizado.");
  };

  const formDevices = dispositivos.filter(
    (d) => !form.idAmbiente || d.idAmbiente === Number(form.idAmbiente)
  );

  /* dados derivados da reclamação selecionada */
  const sel = selected && {
    solicitante: byId(usuarios, selected.idUsuarioAbertura),
    responsavel: byId(usuarios, selected.idResponsavel),
    ambiente: byId(ambientes, selected.idAmbiente),
    dispositivo: byId(dispositivos, selected.idDispositivo),
  };

  const steps = [
    { key: "aberto", label: "Recebida" },
    { key: "em_andamento", label: "Em andamento" },
    { key: "concluido", label: "Concluída" },
  ];
  const stepIndex = selected ? steps.findIndex((s) => s.key === selected.status) : -1;

  return (
    <div className="rec-page">
      <header className="rec-heading">
        <div>
          <span className="rec-eyebrow">CENTRAL DE CHAMADOS</span>
          <h1>Reclamações</h1>
          <p>Acompanhe os problemas relatados nos ambientes e dispositivos do edifício.</p>
        </div>

        <button className="rec-primary" onClick={openNew}>
          <Icon name="plus" size={17} />
          Nova reclamação
        </button>
      </header>

      <section className="rec-summary">
        <div className="rec-summary-item">
          <span className="rec-summary-icon amber"><Icon name="inbox" /></span>
          <div><strong>{count("aberto")}</strong><span>Abertas</span></div>
        </div>
        <div className="rec-summary-item">
          <span className="rec-summary-icon blue"><Icon name="tool" /></span>
          <div><strong>{count("em_andamento")}</strong><span>Em andamento</span></div>
        </div>
        <div className="rec-summary-item">
          <span className="rec-summary-icon green"><Icon name="check" /></span>
          <div><strong>{count("concluido")}</strong><span>Concluídas</span></div>
        </div>
        <div className="rec-summary-item">
          <span className="rec-summary-icon red"><Icon name="alert" /></span>
          <div><strong>{highPriorityOpen}</strong><span>Alta prioridade em aberto</span></div>
        </div>
      </section>

      <div className="rec-workspace">
        {/* ---------- Lista ---------- */}
        <section className="rec-list-panel">
          <div className="rec-list-heading">
            <div>
              <span className="rec-section-label">FILA DE ATENDIMENTO</span>
              <h2>Reclamações registradas</h2>
            </div>
            <span className="rec-count">{filtered.length} registros</span>
          </div>

          <div className="rec-search">
            <Icon name="search" size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descrição, ambiente ou solicitante..."
            />
          </div>

          <div className="rec-filters">
            <label>
              <Icon name="filter" size={14} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Todos">Todos os status</option>
                {Object.entries(STATUS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
            </label>
            <label>
              <Icon name="flag" size={14} />
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="Todos">Todas as prioridades</option>
                {Object.entries(PRIORIDADE).map(([key, p]) => (
                  <option key={key} value={key}>{p.label}</option>
                ))}
              </select>
            </label>
            <label>
              <Icon name="tool" size={14} />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="Todos">Todas as categorias</option>
                {Object.entries(CATEGORIA).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rec-list">
            {filtered.length === 0 ? (
              <div className="rec-empty-list">
                <Icon name="search" size={25} />
                <b>Nenhuma reclamação encontrada</b>
                <span>Tente alterar os filtros ou a busca.</span>
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  className={`rec-list-item ${selectedId === item.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className={`rec-list-symbol ${PRIORIDADE[item.prioridade].tone}`}>
                    <Icon name="alert" size={19} />
                  </span>
                  <span className="rec-list-copy">
                    <strong>{item.descricao}</strong>
                    <small>
                      #{item.id} · {byId(ambientes, item.idAmbiente)?.nome ?? byId(dispositivos, item.idDispositivo)?.nome}
                    </small>
                    <span className="rec-list-meta">
                      <Badge tone={STATUS[item.status].tone}>{STATUS[item.status].label}</Badge>
                      <span>{formatDate(item.dataHora)}</span>
                    </span>
                  </span>
                  <Icon name="arrow" size={16} />
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
          {selected ? (
            <>
              <div className="rec-detail-top">
                <div className={`rec-detail-symbol ${PRIORIDADE[selected.prioridade].tone}`}>
                  <Icon name="alert" size={25} />
                </div>
                <div className="rec-detail-actions">
                  <button className="rec-icon-button" onClick={() => openEdit(selected)} title="Editar reclamação">
                    <Icon name="edit" size={17} />
                  </button>
                  <button
                    className="rec-icon-button danger"
                    onClick={cancelComplaint}
                    disabled={selected.status === "cancelado" || selected.status === "concluido"}
                    title="Cancelar reclamação"
                  >
                    <Icon name="ban" size={17} />
                  </button>
                </div>
              </div>

              <span className="rec-section-label">CHAMADO #{selected.id}</span>
              <h2 className="rec-detail-title">{selected.descricao}</h2>

              <div className="rec-badges">
                <Badge tone={STATUS[selected.status].tone}>{STATUS[selected.status].label}</Badge>
                <Badge tone={PRIORIDADE[selected.prioridade].tone}>
                  Prioridade {PRIORIDADE[selected.prioridade].label.toLowerCase()}
                </Badge>
                {selected.categoria && <Badge tone="slate">{CATEGORIA[selected.categoria]}</Badge>}
              </div>

              {/* progresso */}
              {selected.status === "cancelado" ? (
                <div className="rec-cancelled">
                  <Icon name="ban" size={17} />
                  Esta reclamação foi cancelada e não será atendida.
                </div>
              ) : (
                <div className="rec-progress">
                  {steps.map((step, index) => (
                    <div
                      key={step.key}
                      className={`rec-step ${index < stepIndex ? "done" : ""} ${index === stepIndex ? "current" : ""}`}
                    >
                      <span className="rec-step-dot">
                        {index <= stepIndex && <Icon name="check" size={11} />}
                      </span>
                      <small>{step.label}</small>
                    </div>
                  ))}
                </div>
              )}

              <div className="rec-detail-grid">
                <div className="rec-info-box">
                  <span><Icon name="room" size={17} /></span>
                  <small>AMBIENTE</small>
                  <strong>{sel.ambiente?.nome ?? "Não informado"}</strong>
                </div>
                <div className="rec-info-box">
                  <span><Icon name="device" size={17} /></span>
                  <small>DISPOSITIVO</small>
                  <strong>{sel.dispositivo?.nome ?? "Não informado"}</strong>
                </div>
                <div className="rec-info-box">
                  <span><Icon name="user" size={17} /></span>
                  <small>ABERTA POR</small>
                  <strong>{sel.solicitante?.nome ?? "—"}</strong>
                  <em>{sel.solicitante?.perfil}</em>
                </div>
                <div className="rec-info-box">
                  <span><Icon name="clock" size={17} /></span>
                  <small>RECEBIDA EM</small>
                  <strong>{formatDate(selected.dataHora)}</strong>
                </div>
              </div>

              <div className="rec-assign">
                <div>
                  <span className="rec-section-label">ATENDIMENTO</span>
                  <h3>Responsável pelo chamado</h3>
                </div>
                <select
                  value={selected.idResponsavel ?? ""}
                  onChange={(e) => assignResponsible(e.target.value)}
                  disabled={selected.status === "cancelado"}
                >
                  <option value="">Sem responsável</option>
                  {usuarios
                    .filter((u) => u.perfil !== "Locador")
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.nome} · {u.perfil}</option>
                    ))}
                </select>
              </div>

              <div className="rec-status-actions">
                {selected.status === "aberto" && (
                  <button className="rec-primary" onClick={() => changeStatus("em_andamento")}>
                    <Icon name="play" size={14} />
                    Iniciar atendimento
                  </button>
                )}
                {selected.status === "em_andamento" && (
                  <button className="rec-primary" onClick={() => changeStatus("concluido")}>
                    <Icon name="check" size={16} />
                    Concluir chamado
                  </button>
                )}
                {(selected.status === "concluido" || selected.status === "cancelado") && (
                  <button className="rec-cancel" onClick={() => changeStatus("aberto")}>
                    Reabrir chamado
                  </button>
                )}
              </div>

              <div className="rec-note">
                <Icon name="info" size={17} />
                <p>
                  Para investigar o problema, consulte o histórico de leituras e as
                  ocorrências do dispositivo vinculado. Os valores medidos não ficam
                  guardados na reclamação.
                </p>
              </div>
            </>
          ) : (
            <div className="rec-no-selection">
              <span><Icon name="inbox" size={30} /></span>
              <h2>Selecione uma reclamação</h2>
              <p>Escolha um chamado na lista para ver os detalhes e atualizar o status.</p>
            </div>
          )}
        </section>
      </div>

      {/* ---------- Modal ---------- */}
      {modalOpen && (
        <div
          className="rec-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <form className="rec-modal" onSubmit={saveComplaint}>
            <div className="rec-modal-header">
              <div>
                <span className="rec-section-label">CENTRAL DE CHAMADOS</span>
                <h2>{editingId ? "Editar reclamação" : "Nova reclamação"}</h2>
                <p>Descreva o problema e indique onde ele acontece.</p>
              </div>
              <button type="button" className="rec-icon-button" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="rec-form-grid">
              <label className="full">
                Solicitante *
                <select
                  value={form.idUsuarioAbertura}
                  onChange={(e) => updateForm("idUsuarioAbertura", e.target.value)}
                  required
                >
                  <option value="">Selecione quem está abrindo o chamado</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome} · {u.perfil}</option>
                  ))}
                </select>
              </label>

              <label>
                Ambiente
                <select value={form.idAmbiente} onChange={(e) => updateForm("idAmbiente", e.target.value)}>
                  <option value="">Selecione o ambiente</option>
                  {ambientes.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Dispositivo
                <select value={form.idDispositivo} onChange={(e) => updateForm("idDispositivo", e.target.value)}>
                  <option value="">Selecione o dispositivo</option>
                  {formDevices.map((d) => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Categoria
                <select value={form.categoria} onChange={(e) => updateForm("categoria", e.target.value)}>
                  <option value="">Sem categoria</option>
                  {Object.entries(CATEGORIA).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                Prioridade
                <select value={form.prioridade} onChange={(e) => updateForm("prioridade", e.target.value)}>
                  {Object.entries(PRIORIDADE).map(([key, p]) => (
                    <option key={key} value={key}>{p.label}</option>
                  ))}
                </select>
              </label>

              <label className="full">
                Responsável pelo atendimento
                <select value={form.idResponsavel} onChange={(e) => updateForm("idResponsavel", e.target.value)}>
                  <option value="">Definir depois</option>
                  {usuarios
                    .filter((u) => u.perfil !== "Locador")
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.nome} · {u.perfil}</option>
                    ))}
                </select>
              </label>

              <label className="full">
                Descrição do problema *
                <textarea
                  value={form.descricao}
                  onChange={(e) => updateForm("descricao", e.target.value)}
                  placeholder="Ex.: O ar-condicionado da sala não está resfriando."
                  rows="3"
                  required
                />
              </label>
            </div>

            <div className="rec-form-footer">
              <span>* Informe ao menos o ambiente ou o dispositivo</span>
              <div>
                <button type="button" className="rec-cancel" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="rec-primary">
                  <Icon name="check" size={16} />
                  {editingId ? "Salvar alterações" : "Registrar reclamação"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {message && (
        <div className="rec-toast">
          <Icon name="check" size={16} />
          {message}
        </div>
      )}
    </div>
  );
}

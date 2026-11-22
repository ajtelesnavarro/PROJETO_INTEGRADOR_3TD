"use client";

import { useEffect, useMemo, useState } from "react";
import "./ocorrencias.css";
import { apiFetch, unwrap } from "../../../lib/api";

const initialOccurrences = [
  {
    id: "OC-1842",
    title: "Temperatura acima do limite",
    priority: "Alta",
    category: "Climatização",
    requester: "Marina Costa",
    responsible: "Carlos Mendes",
    status: "Em andamento",
    opened: "Hoje, 09:42",
    description: "Temperatura acima do limite definido para o ambiente.",
    location: "Sala de Servidores",
  },
  {
    id: "OC-1841",
    title: "Falha na iluminação",
    priority: "Média",
    category: "Iluminação",
    requester: "Ana Souza",
    responsible: "Equipe Elétrica",
    status: "Aberta",
    opened: "Hoje, 08:18",
    description: "Algumas luminárias apresentam funcionamento irregular.",
    location: "Recepção",
  },
  {
    id: "OC-1839",
    title: "Tentativa de acesso negada",
    priority: "Alta",
    category: "Acesso",
    requester: "Bruno Lima",
    responsible: "Rafael Nunes",
    status: "Aberta",
    opened: "Ontem, 17:31",
    description: "Registro de tentativa de acesso com credencial inválida.",
    location: "Entrada principal",
  },
  {
    id: "OC-1835",
    title: "Consumo de energia elevado",
    priority: "Baixa",
    category: "Energia",
    requester: "Elisa Costa",
    responsible: "Equipe Predial",
    status: "Em andamento",
    opened: "Ontem, 14:05",
    description: "Consumo acima da média registrada para o ambiente.",
    location: "Auditório",
  },
];

const responsibleOptions = [
  "Carlos Mendes",
  "Rafael Nunes",
  "Equipe Elétrica",
  "Equipe Predial",
];

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    alert: <><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
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
      {paths[name]}
    </svg>
  );
}

function Status({ value }) {
  const className = value.toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`oc-status ${className}`}>
      <i />
      {value}
    </span>
  );
}

function Priority({ value }) {
  return (
    <span className={`oc-priority ${value.toLowerCase()}`}>
      <i />
      {value}
    </span>
  );
}

export default function Ocorrencias() {
  const [occurrences, setOccurrences] = useState(initialOccurrences);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Climatização",
    priority: "Média",
    requester: "",
    responsible: "Equipe Predial",
    location: "",
    description: "",
  });

  useEffect(() => {
    apiFetch("/ocorrencias?limite=200").then((res) => {
      const rows = unwrap(res);
      const statusMap = { aberta: "Aberta", em_andamento: "Em andamento", resolvida: "Resolvida", cancelada: "Cancelada" };
      const priorityMap = { baixa: "Baixa", media: "Média", alta: "Alta" };
      const mapped = rows.map((r) => ({ id: `OC-${r.id_ocorrencia}`, dbId: r.id_ocorrencia, title: r.titulo, priority: priorityMap[r.prioridade] || r.prioridade, category: "Operação", requester: r.id_usuario_abertura ? `Usuário ${r.id_usuario_abertura}` : "—", responsible: r.id_tecnico_responsavel ? `Usuário ${r.id_tecnico_responsavel}` : "Equipe Predial", status: statusMap[r.status_ocorrencia] || r.status_ocorrencia, opened: r.data_ocorrencia ? new Date(r.data_ocorrencia).toLocaleString("pt-BR") : "—", description: r.descricao, location: r.id_dispositivo ? `Dispositivo ${r.id_dispositivo}` : "—" }));
      if (mapped.length) setOccurrences(mapped);
    }).catch(() => {});

    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((item) => {
      const term = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.requester.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "Todos" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "Todas" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [occurrences, search, statusFilter, priorityFilter]);

  const openCount = occurrences.filter(
    (item) => item.status === "Aberta"
  ).length;

  const progressCount = occurrences.filter(
    (item) => item.status === "Em andamento"
  ).length;

  const resolvedCount = occurrences.filter(
    (item) => item.status === "Resolvida"
  ).length;

  const highPriorityCount = occurrences.filter(
    (item) => item.priority === "Alta" && item.status !== "Resolvida"
  ).length;

  async function updateStatus(id, newStatus) {
    const item = occurrences.find((x) => x.id === id);
    const map = { "Aberta": "aberta", "Em andamento": "em_andamento", "Resolvida": "resolvida", "Cancelada": "cancelada" };
    try { if (item?.dbId) await apiFetch(`/ocorrencias/${item.dbId}`, { method: "PATCH", body: JSON.stringify({ status_ocorrencia: map[newStatus] || newStatus }) }); } catch (error) { setToast(error.message); return; }
    setOccurrences((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    setSelected((current) =>
      current?.id === id ? { ...current, status: newStatus } : current
    );

    setToast(`${id} atualizado com sucesso.`);
  }

  function updateResponsible(id, responsible) {
    setOccurrences((current) =>
      current.map((item) =>
        item.id === id ? { ...item, responsible } : item
      )
    );

    setToast("Responsável atualizado.");
  }

  async function createOccurrence(e) {
    e.preventDefault();
    try {
      const devices = unwrap(await apiFetch("/dispositivos?limite=1"));
      if (!devices?.[0]) throw new Error("Cadastre um dispositivo antes de criar uma ocorrência.");
      const priorityMap = { "Baixa": "baixa", "Média": "media", "Alta": "alta" };
      const res = await apiFetch("/ocorrencias", { method: "POST", body: JSON.stringify({ id_dispositivo: devices[0].id_dispositivo, titulo: form.title, descricao: form.description || form.title, prioridade: priorityMap[form.priority] || "media" }) });
      const r = unwrap(res);
      const created = { ...form, id: `OC-${r.id_ocorrencia}`, dbId: r.id_ocorrencia, status: "Aberta", opened: "Agora", location: form.location || "—" };
      setOccurrences((current) => [created, ...current]); setForm({title:"",category:"Climatização",priority:"Média",requester:"",responsible:"Equipe Predial",location:"",description:""}); setModalOpen(false); setToast("Nova ocorrência cadastrada.");
    } catch (error) { setToast(error.message); }
    return;

    const nextNumber =
      Math.max(
        1842,
        ...occurrences.map((item) => Number(item.id.replace("OC-", "")) || 0)
      ) + 1;

    const newOccurrence = {
      ...form,
      id: `OC-${nextNumber}`,
      status: "Aberta",
      opened: "Agora",
    };

    setOccurrences((current) => [newOccurrence, ...current]);

    setForm({
      title: "",
      category: "Climatização",
      priority: "Média",
      requester: "",
      responsible: "Equipe Predial",
      location: "",
      description: "",
    });

    setModalOpen(false);
    setToast("Nova ocorrência cadastrada.");
  }

  return (
    <div className="oc-page">
      <div className="oc-heading">
        <div>
          <span className="oc-eyebrow">GESTÃO OPERACIONAL</span>
          <h1>Ocorrências</h1>
          <p>
            Acompanhe chamados, identifique problemas e gerencie as equipes
            responsáveis pelo edifício.
          </p>
        </div>

        <button className="oc-primary-button" onClick={() => setModalOpen(true)}>
          <Icon name="plus" size={17} />
          Nova ocorrência
        </button>
      </div>

      <section className="oc-stats">
        <article className="oc-stat-card">
          <div className="oc-stat-icon purple">
            <Icon name="list" size={19} />
          </div>
          <span>Total de ocorrências</span>
          <strong>{occurrences.length}</strong>
          <small>Registros cadastrados</small>
        </article>

        <article className="oc-stat-card">
          <div className="oc-stat-icon orange">
            <Icon name="alert" size={19} />
          </div>
          <span>Em aberto</span>
          <strong>{openCount}</strong>
          <small>Aguardando atendimento</small>
        </article>

        <article className="oc-stat-card">
          <div className="oc-stat-icon blue">
            <Icon name="clock" size={19} />
          </div>
          <span>Em andamento</span>
          <strong>{progressCount}</strong>
          <small>Em atendimento pela equipe</small>
        </article>

        <article className="oc-stat-card">
          <div className="oc-stat-icon green">
            <Icon name="check" size={19} />
          </div>
          <span>Resolvidas</span>
          <strong>{resolvedCount}</strong>
          <small>Atendimentos concluídos</small>
        </article>
      </section>

      <section className="oc-priority-banner">
        <div className="oc-priority-banner-icon">
          <Icon name="alert" size={20} />
        </div>
        <div>
          <strong>{highPriorityCount} ocorrências de alta prioridade</strong>
          <p>Verifique os chamados que precisam de atenção prioritária.</p>
        </div>
        <button
          onClick={() => {
            setPriorityFilter("Alta");
            setStatusFilter("Todos");
          }}
        >
          Ver ocorrências <Icon name="arrow" size={15} />
        </button>
      </section>

      <section className="oc-panel">
        <div className="oc-panel-heading">
          <div>
            <span className="oc-section-label">CENTRAL DE ATENDIMENTO</span>
            <h2>Lista de ocorrências</h2>
            <p>Consulte e atualize os registros do edifício.</p>
          </div>

          <div className="oc-view-switch">
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
              aria-label="Visualização em tabela"
            >
              <Icon name="list" size={17} />
              Tabela
            </button>

            <button
              className={view === "kanban" ? "active" : ""}
              onClick={() => setView("kanban")}
              aria-label="Visualização em Kanban"
            >
              <Icon name="grid" size={17} />
              Kanban
            </button>
          </div>
        </div>

        <div className="oc-toolbar">
          <div className="oc-search">
            <Icon name="search" size={17} />
            <input
              type="text"
              placeholder="Buscar por ID, título ou solicitante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className="oc-filter">
            <Icon name="filter" size={15} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos os status</option>
              <option value="Aberta">Aberta</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Resolvida">Resolvida</option>
            </select>
          </label>

          <label className="oc-filter">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="Todas">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </label>

          <span className="oc-result-count">
            {filteredOccurrences.length} resultados
          </span>
        </div>

        {view === "table" ? (
          <div className="oc-table-wrapper">
            <table className="oc-table">
              <thead>
                <tr>
                  <th>OCORRÊNCIA</th>
                  <th>PRIORIDADE</th>
                  <th>SOLICITANTE</th>
                  <th>RESPONSÁVEL</th>
                  <th>STATUS</th>
                  <th>ABERTURA</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>

              <tbody>
                {filteredOccurrences.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        className="oc-occurrence-link"
                        onClick={() => setSelected(item)}
                      >
                        <strong>{item.title}</strong>
                        <small>{item.id} · {item.category}</small>
                      </button>
                    </td>

                    <td><Priority value={item.priority} /></td>

                    <td>{item.requester}</td>

                    <td>
                      <select
                        className="oc-responsible-select"
                        value={item.responsible}
                        onChange={(e) =>
                          updateResponsible(item.id, e.target.value)
                        }
                      >
                        {responsibleOptions.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </td>

                    <td><Status value={item.status} /></td>

                    <td className="oc-date">{item.opened}</td>

                    <td>
                      <button
                        className="oc-action-button"
                        onClick={() => setSelected(item)}
                      >
                        Detalhes
                        <Icon name="arrow" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOccurrences.length === 0 && (
              <div className="oc-empty">
                <Icon name="search" size={25} />
                <strong>Nenhuma ocorrência encontrada</strong>
                <p>Tente alterar os filtros ou o termo da busca.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="oc-kanban">
            {["Aberta", "Em andamento", "Resolvida"].map((status) => {
              const items = filteredOccurrences.filter(
                (item) => item.status === status
              );

              return (
                <div className="oc-kanban-column" key={status}>
                  <div className="oc-kanban-heading">
                    <div>
                      <i className={`oc-kanban-dot ${status.toLowerCase().replaceAll(" ", "-")}`} />
                      <strong>{status}</strong>
                    </div>
                    <span>{items.length}</span>
                  </div>

                  {items.map((item) => (
                    <article className="oc-kanban-card" key={item.id}>
                      <div className="oc-kanban-card-top">
                        <span>{item.id}</span>
                        <Priority value={item.priority} />
                      </div>

                      <h3>{item.title}</h3>
                      <p>{item.category} · {item.location}</p>

                      <div className="oc-kanban-card-footer">
                        <span>{item.requester}</span>
                        <button onClick={() => setSelected(item)}>
                          Detalhes <Icon name="arrow" size={13} />
                        </button>
                      </div>

                      {status !== "Resolvida" && (
                        <button
                          className="oc-kanban-resolve"
                          onClick={() =>
                            updateStatus(
                              item.id,
                              status === "Aberta" ? "Em andamento" : "Resolvida"
                            )
                          }
                        >
                          {status === "Aberta"
                            ? "Iniciar atendimento"
                            : "Marcar como resolvida"}
                        </button>
                      )}
                    </article>
                  ))}

                  {items.length === 0 && (
                    <div className="oc-kanban-empty">Nenhum registro</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="oc-modal-overlay" onMouseDown={() => setModalOpen(false)}>
          <section
            className="oc-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="oc-modal-heading">
              <div>
                <span className="oc-section-label">NOVO REGISTRO</span>
                <h2>Cadastrar ocorrência</h2>
                <p>Preencha as informações para abrir um novo chamado.</p>
              </div>

              <button
                className="oc-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={createOccurrence}>
              <label>
                Título da ocorrência
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex.: Falha no sistema de iluminação"
                />
              </label>

              <div className="oc-form-grid">
                <label>
                  Categoria
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Climatização</option>
                    <option>Iluminação</option>
                    <option>Acesso</option>
                    <option>Energia</option>
                    <option>Dispositivos</option>
                    <option>Outros</option>
                  </select>
                </label>

                <label>
                  Prioridade
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                  </select>
                </label>
              </div>

              <div className="oc-form-grid">
                <label>
                  Solicitante
                  <input
                    required
                    value={form.requester}
                    onChange={(e) => setForm({ ...form, requester: e.target.value })}
                    placeholder="Nome do solicitante"
                  />
                </label>

                <label>
                  Responsável
                  <select
                    value={form.responsible}
                    onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                  >
                    {responsibleOptions.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Ambiente
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex.: Sala de reuniões"
                />
              </label>

              <label>
                Descrição
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva o problema encontrado..."
                />
              </label>

              <div className="oc-modal-actions">
                <button
                  type="button"
                  className="oc-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="oc-primary-button">
                  <Icon name="check" size={16} />
                  Cadastrar ocorrência
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selected && (
        <div className="oc-modal-overlay" onMouseDown={() => setSelected(null)}>
          <section
            className="oc-modal oc-details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="oc-modal-heading">
              <div>
                <span className="oc-section-label">{selected.id}</span>
                <h2>{selected.title}</h2>
                <p>{selected.category} · {selected.location || "Ambiente não informado"}</p>
              </div>

              <button
                className="oc-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Fechar"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="oc-detail-badges">
              <Priority value={selected.priority} />
              <Status value={selected.status} />
            </div>

            <div className="oc-detail-grid">
              <div>
                <span>Solicitante</span>
                <strong>{selected.requester}</strong>
              </div>
              <div>
                <span>Data de abertura</span>
                <strong>{selected.opened}</strong>
              </div>
            </div>

            <label className="oc-detail-responsible">
              Responsável pelo atendimento
              <select
                value={selected.responsible}
                onChange={(e) => {
                  updateResponsible(selected.id, e.target.value);
                  setSelected({ ...selected, responsible: e.target.value });
                }}
              >
                {responsibleOptions.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>

            <div className="oc-description">
              <span>Descrição</span>
              <p>{selected.description || "Nenhuma descrição informada."}</p>
            </div>

            <div className="oc-detail-actions">
              {selected.status === "Aberta" && (
                <button
                  className="oc-primary-button"
                  onClick={() => updateStatus(selected.id, "Em andamento")}
                >
                  Iniciar atendimento
                </button>
              )}

              {selected.status === "Em andamento" && (
                <button
                  className="oc-primary-button"
                  onClick={() => updateStatus(selected.id, "Resolvida")}
                >
                  <Icon name="check" size={16} />
                  Marcar como resolvida
                </button>
              )}

              {selected.status === "Resolvida" && (
                <button
                  className="oc-cancel-button"
                  onClick={() => updateStatus(selected.id, "Em andamento")}
                >
                  Reabrir ocorrência
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="oc-toast">
          <span><Icon name="check" size={16} /></span>
          {toast}
        </div>
      )}
    </div>
  );
}
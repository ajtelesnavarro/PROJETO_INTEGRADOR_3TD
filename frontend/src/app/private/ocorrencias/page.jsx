"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import { obterPredioAtual } from "@/services/predioAtual";
import "./ocorrencias.css";

function Icon({ name, size = 18 }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    alert: (
      <>
        <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4m0 4h.01" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
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
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    <span className={`oc-priority ${slug}`}>
      <i />
      {value}
    </span>
  );
}

const STATUS_DB_TO_UI = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  resolvida: "Resolvida",
  cancelada: "Cancelada",
};

const STATUS_UI_TO_DB = {
  Aberta: "aberta",
  "Em andamento": "em_andamento",
  Resolvida: "resolvida",
};

const PRIO_DB_TO_UI = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const TIPO_LABEL = {
  temperatura: "Climatização",
  iluminacao: "Iluminação",
  energia: "Energia",
};

export default function Ocorrencias() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [rawOccurrences, setRawOccurrences] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    title: "",
    id_dispositivo: "",
    priority: "media",
    responsibleKey: "",
    description: "",
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const carregarDados = useCallback(async () => {
    try {
      const [resPerfil, resOc, resDisp, resAmb, resAndares, resEq] =
        await Promise.all([
          requisicaoAPI("/auth/me"),
          requisicaoAPI("/ocorrencias?limite=200"),
          requisicaoAPI("/dispositivos?limite=200"),
          requisicaoAPI("/ambientes?limite=200"),
          requisicaoAPI("/andares?limite=200"),
          requisicaoAPI("/equipes"),
        ]);

      const usuarioAtual = resPerfil.dados || resPerfil;
      setUsuarioLogado(usuarioAtual);
      const ehManutencao =
        String(usuarioAtual?.perfil || "").toLowerCase() === "manutencao";
      const listaOc = resOc.dados || [];
      const idPredioAtual = Number(obterPredioAtual()?.id_predio);
      const idsAndares = new Set(
        (resAndares.dados || [])
          .filter((andar) => Number(andar.id_predio) === idPredioAtual)
          .map((andar) => Number(andar.id_andar)),
      );
      const listaAmb = (resAmb.dados || []).filter((amb) =>
        idsAndares.has(Number(amb.id_andar)),
      );
      const idsAmbientes = new Set(
        listaAmb.map((amb) => Number(amb.id_ambiente)),
      );
      const listaDisp = (resDisp.dados || []).filter(
        (disp) =>
          idsAmbientes.has(Number(disp.id_ambiente)) &&
          (!ehManutencao ||
            Number(disp.id_usuario) === Number(usuarioAtual.id)),
      );
      const idsDispositivos = new Set(
        listaDisp.map((disp) => Number(disp.id_dispositivo)),
      );
      const listaEq = (resEq.dados || []).filter(
        (eq) => Number(eq.id_predio) === idPredioAtual,
      );

      const perfilUsuario = String(usuarioAtual?.perfil || "").toLowerCase();
      setRawOccurrences(
        ehManutencao
          ? listaOc.filter(
              (oc) =>
                Number(oc.id_tecnico_responsavel) ===
                Number(usuarioAtual.id_usuario ?? usuarioAtual.id),
            )
          : listaOc.filter(
              (oc) =>
                idsDispositivos.has(Number(oc.id_dispositivo)) ||
                (perfilUsuario === "funcionario" &&
                  Number(oc.id_tecnico_responsavel) ===
                    Number(usuarioAtual.id_usuario ?? usuarioAtual.id)),
            ),
      );
      setDispositivos(listaDisp);
      setAmbientes(listaAmb);
      setEquipes(listaEq);
      setUsuarios(
        (resEq.usuarios || []).filter(
          (usuario) => Number(usuario.id_predio) === idPredioAtual,
        ),
      );

      setForm((prev) => ({
        ...prev,
        id_dispositivo:
          prev.id_dispositivo ||
          (listaDisp[0]?.id_dispositivo
            ? String(listaDisp[0].id_dispositivo)
            : ""),
        responsibleKey: prev.responsibleKey || "",
      }));
    } catch (erro) {
      setToast(erro.message || "Erro ao carregar ocorrências.");
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const responsibleOptions = useMemo(() => {
    const equipesOperacionais = equipes.filter((eq) => {
      const nome = String(eq.nome_equipe || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

      return nome === "manutencao predial" || nome === "suporte tecnico";
    });

    return [
      { key: "", label: "Não atribuído" },
      ...equipesOperacionais.map((eq) => ({
        key: `eq:${eq.id_equipe}`,
        label: eq.nome_equipe,
      })),
    ];
  }, [equipes]);

  const occurrences = useMemo(() => {
    return rawOccurrences.map((oc) => {
      const disp = dispositivos.find(
        (d) => d.id_dispositivo === oc.id_dispositivo,
      );
      const amb = ambientes.find((a) => a.id_ambiente === disp?.id_ambiente);
      const eq = equipes.find((e) => e.id_equipe === oc.id_equipe_responsavel);
      const tec = usuarios.find(
        (u) => u.id_usuario === oc.id_tecnico_responsavel,
      );

      let responsibleKey = "";
      let responsibleLabel = "Não atribuído";
      if (tec) {
        responsibleKey = `tec:${tec.id_usuario}`;
        responsibleLabel = `${tec.nome} (Técnico)`;
      } else if (eq) {
        responsibleKey = `eq:${eq.id_equipe}`;
        responsibleLabel = eq.nome_equipe;
      }

      const opened = oc.data_ocorrencia
        ? new Date(oc.data_ocorrencia).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—";

      return {
        rawId: oc.id_ocorrencia,
        id: `OC-${String(oc.id_ocorrencia).padStart(4, "0")}`,
        title: oc.titulo,
        priority: PRIO_DB_TO_UI[oc.prioridade] || "Média",
        category: TIPO_LABEL[disp?.tipo_dispositivo] || "Dispositivos",
        requester: disp?.nome || `Dispositivo #${oc.id_dispositivo}`,
        responsibleKey,
        responsible: responsibleLabel,
        status: STATUS_DB_TO_UI[oc.status_ocorrencia] || "Aberta",
        opened,
        description: oc.descricao,
        location: amb?.nome || "Ambiente não informado",
      };
    });
  }, [rawOccurrences, dispositivos, ambientes, equipes, usuarios]);

  const selected = useMemo(
    () => occurrences.find((o) => o.rawId === selectedId) || null,
    [occurrences, selectedId],
  );

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((item) => {
      const term = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.requester.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "Todos" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "Todas" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [occurrences, search, statusFilter, priorityFilter]);

  const openCount = occurrences.filter(
    (item) => item.status === "Aberta",
  ).length;
  const progressCount = occurrences.filter(
    (item) => item.status === "Em andamento",
  ).length;
  const resolvedCount = occurrences.filter(
    (item) => item.status === "Resolvida",
  ).length;
  const highPriorityCount = occurrences.filter(
    (item) => item.priority === "Alta" && item.status !== "Resolvida",
  ).length;

  async function updateStatus(item, newStatus) {
    try {
      const statusDb = STATUS_UI_TO_DB[newStatus] || "aberta";
      const payload = {
        status_ocorrencia: statusDb,
        resolvida_em:
          statusDb === "resolvida"
            ? new Date().toISOString().slice(0, 19).replace("T", " ")
            : null,
      };

      await requisicaoAPI(`/ocorrencias/${item.rawId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setToast(`${item.id} atualizado com sucesso.`);
      carregarDados();
    } catch (erro) {
      setToast(erro.message || "Erro ao atualizar status.");
    }
  }

  async function updateResponsible(item, key) {
    try {
      const payload = {
        id_equipe_responsavel: key.startsWith("eq:")
          ? Number(key.slice(3))
          : null,
        id_tecnico_responsavel: key.startsWith("tec:")
          ? Number(key.slice(4))
          : null,
      };

      await requisicaoAPI(`/ocorrencias/${item.rawId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setToast("Responsável atualizado.");
      carregarDados();
    } catch (erro) {
      setToast(erro.message || "Erro ao atualizar responsável.");
    }
  }

  async function createOccurrence(e) {
    e.preventDefault();

    if (!form.id_dispositivo) {
      setToast("Cadastre ou selecione um dispositivo primeiro.");
      return;
    }

    try {
      const payload = {
        id_dispositivo: Number(form.id_dispositivo),
        titulo: form.title.trim(),
        descricao:
          form.description.trim() ||
          "Ocorrência registrada via painel operacional.",
        prioridade: form.priority,
        status_ocorrencia: "aberta",
        id_equipe_responsavel: form.responsibleKey.startsWith("eq:")
          ? Number(form.responsibleKey.slice(3))
          : null,
        id_tecnico_responsavel: form.responsibleKey.startsWith("tec:")
          ? Number(form.responsibleKey.slice(4))
          : null,
      };

      await requisicaoAPI("/ocorrencias", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
      }));
      setModalOpen(false);
      setToast("Nova ocorrência cadastrada no banco.");
      carregarDados();
    } catch (erro) {
      setToast(erro.message || "Erro ao cadastrar ocorrência.");
    }
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

        {usuarioLogado?.perfil === "administrador" && (
          <button
            className="oc-primary-button"
            onClick={() => setModalOpen(true)}
          >
            <Icon name="plus" size={17} />
            Nova ocorrência
          </button>
        )}
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
              placeholder="Buscar por ID, título, dispositivo ou ambiente..."
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
                  <th>DISPOSITIVO</th>
                  <th>RESPONSÁVEL</th>
                  <th>STATUS</th>
                  <th>ABERTURA</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>

              <tbody>
                {filteredOccurrences.map((item) => (
                  <tr key={item.rawId}>
                    <td>
                      <button
                        className="oc-occurrence-link"
                        onClick={() => setSelectedId(item.rawId)}
                      >
                        <strong>{item.title}</strong>
                        <small>
                          {item.id} · {item.location}
                        </small>
                      </button>
                    </td>

                    <td>
                      <Priority value={item.priority} />
                    </td>

                    <td>{item.requester}</td>

                    <td>
                      <select
                        className="oc-responsible-select"
                        value={item.responsibleKey}
                        disabled={usuarioLogado?.perfil !== "administrador"}
                        onChange={(e) =>
                          updateResponsible(item, e.target.value)
                        }
                      >
                        {responsibleOptions.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <Status value={item.status} />
                    </td>

                    <td className="oc-date">{item.opened}</td>

                    <td>
                      <button
                        className="oc-action-button"
                        onClick={() => setSelectedId(item.rawId)}
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
                <p>Tente alterar os filtros ou cadastre uma nova ocorrência.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="oc-kanban">
            {["Aberta", "Em andamento", "Resolvida"].map((status) => {
              const items = filteredOccurrences.filter(
                (item) => item.status === status,
              );

              return (
                <div className="oc-kanban-column" key={status}>
                  <div className="oc-kanban-heading">
                    <div>
                      <i
                        className={`oc-kanban-dot ${status.toLowerCase().replaceAll(" ", "-")}`}
                      />
                      <strong>{status}</strong>
                    </div>
                    <span>{items.length}</span>
                  </div>

                  {items.map((item) => (
                    <article className="oc-kanban-card" key={item.rawId}>
                      <div className="oc-kanban-card-top">
                        <span>{item.id}</span>
                        <Priority value={item.priority} />
                      </div>

                      <h3>{item.title}</h3>
                      <p>
                        {item.category} · {item.location}
                      </p>

                      <div className="oc-kanban-card-footer">
                        <span>{item.requester}</span>
                        <button onClick={() => setSelectedId(item.rawId)}>
                          Detalhes <Icon name="arrow" size={13} />
                        </button>
                      </div>

                      {status !== "Resolvida" && (
                        <button
                          className="oc-kanban-resolve"
                          onClick={() =>
                            updateStatus(
                              item,
                              status === "Aberta"
                                ? "Em andamento"
                                : "Resolvida",
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

      {modalOpen && usuarioLogado?.perfil === "administrador" && (
        <div
          className="oc-modal-overlay"
          onMouseDown={() => setModalOpen(false)}
        >
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
                  placeholder="Ex.: Falha no sensor de iluminação"
                />
              </label>

              <div className="oc-form-grid">
                <label>
                  Dispositivo vinculado
                  <select
                    required
                    value={form.id_dispositivo}
                    onChange={(e) =>
                      setForm({ ...form, id_dispositivo: e.target.value })
                    }
                  >
                    <option value="">Selecione um dispositivo...</option>
                    {dispositivos.map((d) => {
                      const amb = ambientes.find(
                        (a) => a.id_ambiente === d.id_ambiente,
                      );
                      return (
                        <option key={d.id_dispositivo} value={d.id_dispositivo}>
                          {d.nome} {amb ? `(${amb.nome})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label>
                  Prioridade
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </label>
              </div>

              <label>
                Responsável pelo atendimento
                <select
                  value={form.responsibleKey}
                  onChange={(e) =>
                    setForm({ ...form, responsibleKey: e.target.value })
                  }
                >
                  {responsibleOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Descrição
                <textarea
                  required
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
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
        <div
          className="oc-modal-overlay"
          onMouseDown={() => setSelectedId(null)}
        >
          <section
            className="oc-modal oc-details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="oc-modal-heading">
              <div>
                <span className="oc-section-label">{selected.id}</span>
                <h2>{selected.title}</h2>
                <p>
                  {selected.category} · {selected.location}
                </p>
              </div>

              <button
                className="oc-modal-close"
                onClick={() => setSelectedId(null)}
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
                <span>Dispositivo</span>
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
                value={selected.responsibleKey}
                onChange={(e) => updateResponsible(selected, e.target.value)}
              >
                {responsibleOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
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
                  onClick={() => updateStatus(selected, "Em andamento")}
                >
                  Iniciar atendimento
                </button>
              )}

              {selected.status === "Em andamento" && (
                <button
                  className="oc-primary-button"
                  onClick={() => updateStatus(selected, "Resolvida")}
                >
                  <Icon name="check" size={16} />
                  Marcar como resolvida
                </button>
              )}

              {selected.status === "Resolvida" && (
                <button
                  className="oc-cancel-button"
                  onClick={() => updateStatus(selected, "Em andamento")}
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
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

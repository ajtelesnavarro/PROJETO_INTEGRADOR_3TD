
"use client";

import { useMemo, useState } from "react";
import "./equipes.css";

const teamSeed = [
  {
    id: 1,
    name: "Equipe de Manutenção",
    abbreviation: "MAN",
    color: "#4775D1",
    description: "Responsável pela conservação e pelo funcionamento da estrutura predial.",
    members: [
      {
        id: 1,
        name: "Carlos Mendes",
        role: "Coordenador",
        email: "carlos.mendes@lumora.com",
        phone: "(11) 98765-4321",
        status: "Ativo",
        since: "12/03/2024",
      },
      {
        id: 2,
        name: "Rafael Nunes",
        role: "Técnico de manutenção",
        email: "rafael.nunes@lumora.com",
        phone: "(11) 98765-4322",
        status: "Ativo",
        since: "18/04/2024",
      },
      {
        id: 3,
        name: "Lucas Ferreira",
        role: "Eletricista",
        email: "lucas.ferreira@lumora.com",
        phone: "(11) 98765-4323",
        status: "Ausente",
        since: "05/06/2024",
      },
      {
        id: 4,
        name: "Marcos Oliveira",
        role: "Técnico hidráulico",
        email: "marcos.oliveira@lumora.com",
        phone: "(11) 98765-4324",
        status: "Ativo",
        since: "21/08/2024",
      },
    ],
  },
  {
    id: 2,
    name: "Equipe de Tecnologia",
    abbreviation: "TEC",
    color: "#8060C8",
    description: "Responsável pelo monitoramento dos dispositivos, sistemas e recursos tecnológicos.",
    members: [
      {
        id: 5,
        name: "Ana Souza",
        role: "Coordenadora",
        email: "ana.souza@lumora.com",
        phone: "(11) 98765-4325",
        status: "Ativo",
        since: "10/02/2024",
      },
      {
        id: 6,
        name: "Pedro Almeida",
        role: "Analista de sistemas",
        email: "pedro.almeida@lumora.com",
        phone: "(11) 98765-4326",
        status: "Ativo",
        since: "15/05/2024",
      },
      {
        id: 7,
        name: "Juliana Costa",
        role: "Técnica de automação",
        email: "juliana.costa@lumora.com",
        phone: "(11) 98765-4327",
        status: "Ausente",
        since: "09/07/2024",
      },
    ],
  },
  {
    id: 3,
    name: "Equipe de Segurança",
    abbreviation: "SEG",
    color: "#C18A45",
    description: "Responsável pelo controle de acesso e pela segurança do edifício.",
    members: [
      {
        id: 8,
        name: "Roberto Lima",
        role: "Coordenador",
        email: "roberto.lima@lumora.com",
        phone: "(11) 98765-4328",
        status: "Ativo",
        since: "08/01/2024",
      },
      {
        id: 9,
        name: "Fernanda Alves",
        role: "Agente de segurança",
        email: "fernanda.alves@lumora.com",
        phone: "(11) 98765-4329",
        status: "Ativo",
        since: "11/03/2024",
      },
      {
        id: 10,
        name: "Diego Santos",
        role: "Agente de segurança",
        email: "diego.santos@lumora.com",
        phone: "(11) 98765-4330",
        status: "Ausente",
        since: "19/09/2024",
      },
    ],
  },
];

const icons = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.45 3a2 2 0 0 1-.57 1.7L7.7 9.7a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 1.7-.57l3 .45a2 2 0 0 1 1.72 2Z" />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  edit: (
    <>
      <path d="m16 4 4 4M4 20l4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
    </>
  ),
  close: <path d="m18 6-12 12M6 6l12 12" />,
  check: <path d="m5 12 4 4L19 6" />,
  shield: (
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
  ),
  filter: (
    <>
      <path d="M4 6h16M7 12h10m-7 6h4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2" />
    </>
  ),
};

function Icon({ name, size = 18 }) {
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

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const emptyForm = {
  name: "",
  role: "",
  email: "",
  phone: "",
  status: "Ativo",
  since: new Date().toLocaleDateString("pt-BR"),
};

export default function Page() {
  const [teams, setTeams] = useState(teamSeed);
  const [activeTeam, setActiveTeam] = useState(1);
  const [selectedMember, setSelectedMember] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState("");

  const team = teams.find((item) => item.id === activeTeam);

  const allMembers = useMemo(
    () => teams.flatMap((item) => item.members),
    [teams]
  );

  const activeMembers = allMembers.filter(
    (member) => member.status === "Ativo"
  ).length;

  const absentMembers = allMembers.filter(
    (member) => member.status === "Ausente"
  ).length;

  const visibleMembers = useMemo(() => {
    if (!team) return [];

    return team.members.filter((member) => {
      const term = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term);

      const matchesFilter =
        filter === "Todos" || member.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [team, search, filter]);

  const selected = team?.members.find(
    (member) => member.id === selectedMember
  );

  function changeTeam(id) {
    const nextTeam = teams.find((item) => item.id === id);

    if (!nextTeam) return;

    setActiveTeam(id);
    setSelectedMember(nextTeam.members[0]?.id ?? null);
    setSearch("");
    setFilter("Todos");
  }

  function openNewMember() {
    setEditingMember(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditMember(member) {
    setEditingMember(member.id);
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      status: member.status,
      since: member.since,
    });
    setModalOpen(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveMember(event) {
    event.preventDefault();

    if (!team) return;

    if (editingMember) {
      setTeams((current) =>
        current.map((item) =>
          item.id === activeTeam
            ? {
                ...item,
                members: item.members.map((member) =>
                  member.id === editingMember
                    ? { ...member, ...form }
                    : member
                ),
              }
            : item
        )
      );

      setFeedback("Integrante atualizado com sucesso.");
      setSelectedMember(editingMember);
    } else {
      const newMember = {
        id: Date.now(),
        ...form,
      };

      setTeams((current) =>
        current.map((item) =>
          item.id === activeTeam
            ? { ...item, members: [...item.members, newMember] }
            : item
        )
      );

      setSelectedMember(newMember.id);
      setFeedback("Integrante cadastrado com sucesso.");
    }

    setModalOpen(false);
    setSearch("");
    setFilter("Todos");
  }

  function deleteMember(memberId) {
    const member = team?.members.find((item) => item.id === memberId);

    if (!member) return;

    if (!window.confirm(`Deseja realmente excluir ${member.name}?`)) {
      return;
    }

    setTeams((current) =>
      current.map((item) =>
        item.id === activeTeam
          ? {
              ...item,
              members: item.members.filter(
                (person) => person.id !== memberId
              ),
            }
          : item
      )
    );

    setSelectedMember(
      team.members.find((person) => person.id !== memberId)?.id ?? null
    );
    setFeedback("Integrante removido da equipe.");
  }

  function toggleMemberStatus(memberId) {
    setTeams((current) =>
      current.map((item) =>
        item.id === activeTeam
          ? {
              ...item,
              members: item.members.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      status:
                        member.status === "Ativo" ? "Ausente" : "Ativo",
                    }
                  : member
              ),
            }
          : item
      )
    );
  }

  return (
    <div className="tm-overview">
      <header className="tm-page-title">
        <div>
          <span className="tm-page-eyebrow">GESTÃO DE PESSOAS</span>
          <h1>Equipes e usuários</h1>
          <p>Gerencie as equipes e os funcionários vinculados ao edifício.</p>
        </div>

        <button className="tm-primary-button" onClick={openNewMember}>
          <Icon name="plus" size={17} />
          Adicionar integrante
        </button>
      </header>

      {feedback && (
        <div className="tm-feedback">
          <Icon name="check" size={17} />
          {feedback}
          <button onClick={() => setFeedback("")} aria-label="Fechar aviso">
            <Icon name="close" size={15} />
          </button>
        </div>
      )}

      <section className="tm-overview-grid">
        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-blue">
            <Icon name="briefcase" size={20} />
          </div>
          <div>
            <span>Equipes cadastradas</span>
            <strong>{teams.length.toString().padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-purple">
            <Icon name="users" size={20} />
          </div>
          <div>
            <span>Total de integrantes</span>
            <strong>{allMembers.length.toString().padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-green">
            <Icon name="check" size={20} />
          </div>
          <div>
            <span>Integrantes ativos</span>
            <strong>{activeMembers.toString().padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-orange">
            <Icon name="clock" size={20} />
          </div>
          <div>
            <span>Ausentes</span>
            <strong>{absentMembers.toString().padStart(2, "0")}</strong>
          </div>
        </div>
      </section>

      <section className="tm-management">
        <aside className="tm-team-sidebar">
          <div className="tm-sidebar-heading">
            <div>
              <span className="tm-section-label">CADASTROS</span>
              <h2>Equipes</h2>
            </div>
            <span className="tm-team-count">{teams.length}</span>
          </div>

          <div className="tm-team-list">
            {teams.map((item) => (
              <button
                key={item.id}
                className={`tm-team-option ${
                  activeTeam === item.id ? "active" : ""
                }`}
                onClick={() => changeTeam(item.id)}
              >
                <span
                  className="tm-team-symbol"
                  style={{ "--team-color": item.color }}
                >
                  {item.abbreviation}
                </span>

                <span className="tm-team-option-info">
                  <strong>{item.name}</strong>
                  <small>
                    {item.members.length} integrante
                    {item.members.length !== 1 ? "s" : ""}
                  </small>
                </span>
              </button>
            ))}
          </div>

          <div className="tm-sidebar-footer">
            <Icon name="shield" size={18} />
            <div>
              <strong>Estrutura do edifício</strong>
              <span>Organização interna</span>
            </div>
          </div>
        </aside>

        <main className="tm-members-area">
          {team && (
            <>
              <div className="tm-team-header">
                <div>
                  <span className="tm-section-label">EQUIPE SELECIONADA</span>
                  <h2>{team.name}</h2>
                  <p>{team.description}</p>
                </div>
                <span
                  className="tm-team-code"
                  style={{ "--team-color": team.color }}
                >
                  {team.abbreviation}
                </span>
              </div>

              <div className="tm-list-toolbar">
                <div className="tm-search">
                  <Icon name="search" size={17} />
                  <input
                    type="text"
                    placeholder="Buscar por nome, função ou e-mail..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Limpar busca"
                    >
                      <Icon name="close" size={15} />
                    </button>
                  )}
                </div>

                <label className="tm-filter">
                  <Icon name="filter" size={16} />
                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label="Filtrar por situação"
                  >
                    <option value="Todos">Todas as situações</option>
                    <option value="Ativo">Ativos</option>
                    <option value="Ausente">Ausentes</option>
                  </select>
                </label>
              </div>

              <div className="tm-table-heading">
                <div>
                  <h3>Integrantes da equipe</h3>
                  <span>{visibleMembers.length} registro(s) encontrado(s)</span>
                </div>
                <button className="tm-add-inline" onClick={openNewMember}>
                  <Icon name="plus" size={16} />
                  Novo integrante
                </button>
              </div>

              <div className="tm-table-wrap">
                <table className="tm-members-table">
                  <thead>
                    <tr>
                      <th>Funcionário</th>
                      <th>Função</th>
                      <th>Contato</th>
                      <th>Situação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={
                          selectedMember === member.id ? "selected-row" : ""
                        }
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <td>
                          <div className="tm-employee">
                            <span
                              className="tm-employee-avatar"
                              style={{ "--team-color": team.color }}
                            >
                              {getInitials(member.name)}
                            </span>
                            <div>
                              <strong>{member.name}</strong>
                              <small>{member.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{member.role}</td>
                        <td>{member.phone}</td>
                        <td>
                          <span
                            className={`tm-status ${
                              member.status === "Ativo" ? "active" : "absent"
                            }`}
                          >
                            <span />
                            {member.status}
                          </span>
                        </td>
                        <td>
                          <div className="tm-row-actions">
                            <button
                              title="Editar integrante"
                              aria-label={`Editar ${member.name}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedMember(member.id);
                                openEditMember(member);
                              }}
                            >
                              <Icon name="edit" size={16} />
                            </button>
                            <button
                              className="tm-delete-action"
                              title="Excluir integrante"
                              aria-label={`Excluir ${member.name}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteMember(member.id);
                              }}
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {visibleMembers.length === 0 && (
                  <div className="tm-empty">
                    <Icon name="search" size={25} />
                    <strong>Nenhum integrante encontrado</strong>
                    <p>Altere os filtros ou tente buscar por outro termo.</p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setFilter("Todos");
                      }}
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>

              <div className="tm-table-footer">
                <span>
                  Exibindo {visibleMembers.length} de {team.members.length}{" "}
                  integrantes
                </span>
                <span>Dados da equipe selecionada</span>
              </div>
            </>
          )}
        </main>

        <aside className="tm-inspector">
          <div className="tm-inspector-heading">
            <div>
              <span className="tm-section-label">DETALHES</span>
              <h3>Funcionário</h3>
            </div>
            <Icon name="user" size={19} />
          </div>

          {selected ? (
            <>
              <div className="tm-profile">
                <div
                  className="tm-profile-avatar"
                  style={{ "--team-color": team.color }}
                >
                  {getInitials(selected.name)}
                </div>
                <h3>{selected.name}</h3>
                <span>{selected.role}</span>
                <span
                  className={`tm-status ${
                    selected.status === "Ativo" ? "active" : "absent"
                  }`}
                >
                  <span />
                  {selected.status}
                </span>
              </div>

              <div className="tm-detail-section">
                <span className="tm-info-label">DADOS DE CONTATO</span>
                <div className="tm-detail-row">
                  <Icon name="mail" size={17} />
                  <div>
                    <small>E-mail</small>
                    <strong>{selected.email}</strong>
                  </div>
                </div>
                <div className="tm-detail-row">
                  <Icon name="phone" size={17} />
                  <div>
                    <small>Telefone</small>
                    <strong>{selected.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="tm-detail-section">
                <span className="tm-info-label">VÍNCULO COM A EQUIPE</span>
                <div className="tm-detail-row">
                  <Icon name="briefcase" size={17} />
                  <div>
                    <small>Equipe</small>
                    <strong>{team.name}</strong>
                  </div>
                </div>
                <div className="tm-detail-row">
                  <Icon name="calendar" size={17} />
                  <div>
                    <small>Data de entrada</small>
                    <strong>{selected.since}</strong>
                  </div>
                </div>
              </div>

              <div className="tm-profile-actions">
                <button
                  className="tm-edit-button"
                  onClick={() => openEditMember(selected)}
                >
                  <Icon name="edit" size={16} />
                  Editar cadastro
                </button>

                <button
                  className="tm-toggle-button"
                  onClick={() => toggleMemberStatus(selected.id)}
                >
                  {selected.status === "Ativo"
                    ? "Marcar como ausente"
                    : "Marcar como ativo"}
                </button>
              </div>
            </>
          ) : (
            <div className="tm-inspector-empty">
              <Icon name="user" size={27} />
              <strong>Nenhum funcionário selecionado</strong>
              <p>Selecione um registro na lista para consultar os detalhes.</p>
            </div>
          )}
        </aside>
      </section>

      {modalOpen && (
        <div className="tm-modal-overlay" onMouseDown={() => setModalOpen(false)}>
          <section
            className="tm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tm-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="tm-modal-header">
              <div>
                <span className="tm-section-label">GESTÃO DE PESSOAS</span>
                <h2 id="tm-modal-title">
                  {editingMember ? "Editar integrante" : "Novo integrante"}
                </h2>
                <p>Preencha os dados do funcionário e seu vínculo com a equipe.</p>
              </div>
              <button
                className="tm-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <form onSubmit={saveMember}>
              <div className="tm-form-grid">
                <label className="tm-form-full">
                  Nome completo
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Ex.: João da Silva"
                    required
                  />
                </label>

                <label>
                  Função
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    placeholder="Ex.: Técnico"
                    required
                  />
                </label>

                <label>
                  Telefone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </label>

                <label className="tm-form-full">
                  E-mail
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="funcionario@lumora.com"
                    required
                  />
                </label>

                <label>
                  Data de entrada
                  <input
                    name="since"
                    value={form.since}
                    onChange={handleFormChange}
                    placeholder="DD/MM/AAAA"
                    required
                  />
                </label>

                <label>
                  Situação
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Ausente">Ausente</option>
                  </select>
                </label>
              </div>

              <div className="tm-modal-footer">
                <button
                  type="button"
                  className="tm-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="tm-primary-button">
                  <Icon name="check" size={16} />
                  {editingMember ? "Salvar alterações" : "Cadastrar integrante"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

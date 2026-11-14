
"use client";

import { useState } from "react";
import "./equipes.css";

const teamSeed = [
  {
    id: 1,
    name: "Equipe de Manutenção",
    abbreviation: "MAN",
    color: "#6485E8",
    description:
      "Responsável pela conservação e pelo funcionamento da estrutura predial.",
    members: [
      {
        id: 1,
        name: "Carlos Mendes",
        role: "Coordenador",
        email: "carlos.mendes@lumora.com",
        phone: "(11) 98765-4321",
        status: "Ativo",
        leader: true,
        since: "12/03/2024",
      },
      {
        id: 2,
        name: "Rafael Nunes",
        role: "Técnico de manutenção",
        email: "rafael.nunes@lumora.com",
        phone: "(11) 98765-4322",
        status: "Ativo",
        leader: false,
        since: "18/04/2024",
      },
      {
        id: 3,
        name: "Lucas Ferreira",
        role: "Eletricista",
        email: "lucas.ferreira@lumora.com",
        phone: "(11) 98765-4323",
        status: "Ausente",
        leader: false,
        since: "05/06/2024",
      },
      {
        id: 4,
        name: "Marcos Oliveira",
        role: "Técnico hidráulico",
        email: "marcos.oliveira@lumora.com",
        phone: "(11) 98765-4324",
        status: "Ativo",
        leader: false,
        since: "21/08/2024",
      },
    ],
  },
  {
    id: 2,
    name: "Equipe de Tecnologia",
    abbreviation: "TEC",
    color: "#9672D8",
    description:
      "Responsável pelo monitoramento dos dispositivos, sistemas e recursos tecnológicos.",
    members: [
      {
        id: 5,
        name: "Ana Souza",
        role: "Coordenadora",
        email: "ana.souza@lumora.com",
        phone: "(11) 98765-4325",
        status: "Ativo",
        leader: true,
        since: "10/02/2024",
      },
      {
        id: 6,
        name: "Pedro Almeida",
        role: "Analista de sistemas",
        email: "pedro.almeida@lumora.com",
        phone: "(11) 98765-4326",
        status: "Ativo",
        leader: false,
        since: "15/05/2024",
      },
      {
        id: 7,
        name: "Juliana Costa",
        role: "Técnica de automação",
        email: "juliana.costa@lumora.com",
        phone: "(11) 98765-4327",
        status: "Ausente",
        leader: false,
        since: "09/07/2024",
      },
    ],
  },
  {
    id: 3,
    name: "Equipe de Segurança",
    abbreviation: "SEG",
    color: "#D49A55",
    description:
      "Responsável pelo controle de acesso, acompanhamento de eventos e segurança do edifício.",
    members: [
      {
        id: 8,
        name: "Roberto Lima",
        role: "Coordenador",
        email: "roberto.lima@lumora.com",
        phone: "(11) 98765-4328",
        status: "Ativo",
        leader: true,
        since: "08/01/2024",
      },
      {
        id: 9,
        name: "Fernanda Alves",
        role: "Agente de segurança",
        email: "fernanda.alves@lumora.com",
        phone: "(11) 98765-4329",
        status: "Ativo",
        leader: false,
        since: "11/03/2024",
      },
      {
        id: 10,
        name: "Diego Santos",
        role: "Agente de segurança",
        email: "diego.santos@lumora.com",
        phone: "(11) 98765-4330",
        status: "Ausente",
        leader: false,
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
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
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
  shield: (
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  filter: (
    <>
      <path d="M4 6h16M7 12h10m-7 6h4" />
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
    >
      {icons[name]}
    </svg>
  );
}

export default function Page() {
  const [teams, setTeams] = useState(teamSeed);
  const [activeTeam, setActiveTeam] = useState(1);
  const [selectedMember, setSelectedMember] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const team = teams.find((item) => item.id === activeTeam);

  if (!team) return null;

  const allMembers = teams.flatMap((item) => item.members);
  const totalMembers = allMembers.length;

  const activeMembers = allMembers.filter(
    (member) => member.status === "Ativo"
  ).length;

  const absentMembers = totalMembers - activeMembers;

  const members = team.members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "Todos" ||
      (filter === "Coordenadores" && member.leader) ||
      (filter === "Integrantes" && !member.leader) ||
      (filter === "Ativos" && member.status === "Ativo") ||
      (filter === "Ausentes" && member.status === "Ausente");

    return matchesSearch && matchesFilter;
  });

  const leader = team.members.find((member) => member.leader);
  const visibleLeader = members.some((member) => member.leader);
  const visibleMembers = members.filter((member) => !member.leader);

  const selected = team.members.find(
    (member) => member.id === selectedMember
  );

  function changeTeam(id) {
    const nextTeam = teams.find((item) => item.id === id);

    if (!nextTeam) return;

    setActiveTeam(id);
    setSelectedMember(nextTeam.members[0]?.id ?? 0);
    setSearch("");
    setFilter("Todos");
  }

  function toggleMemberStatus(memberId) {
    const member = team.members.find(
      (item) => item.id === memberId
    );

    if (!member) return;

    const nextStatus =
      member.status === "Ativo" ? "Ausente" : "Ativo";

    setTeams((current) =>
      current.map((item) => ({
        ...item,
        members: item.members.map((person) =>
          person.id === memberId
            ? { ...person, status: nextStatus }
            : person
        ),
      }))
    );
  }

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return (
    <div className="tm-overview">
      <div className="tm-page-title">
        <div>
          <span className="tm-page-eyebrow">GESTÃO DE PESSOAS</span>
          <h1>Equipes e usuários</h1>
          <p>
            Visualize a organização das equipes e acompanhe os integrantes
            do edifício.
          </p>
        </div>

        <button
          className="tm-new-team"
          onClick={() =>
            alert("Cadastro de equipe disponível para integração.")
          }
        >
          <Icon name="plus" size={17} />
          Nova equipe
        </button>
      </div>

      <div className="tm-overview-grid">
        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-blue">
            <Icon name="users" size={20} />
          </div>
          <div>
            <span>Equipes cadastradas</span>
            <strong>{String(teams.length).padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-purple">
            <Icon name="user" size={20} />
          </div>
          <div>
            <span>Total de integrantes</span>
            <strong>{String(totalMembers).padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-green">
            <Icon name="activity" size={20} />
          </div>
          <div>
            <span>Integrantes ativos</span>
            <strong>{String(activeMembers).padStart(2, "0")}</strong>
          </div>
        </div>

        <div className="tm-overview-item">
          <div className="tm-overview-icon tm-icon-orange">
            <Icon name="clock" size={20} />
          </div>
          <div>
            <span>Ausentes</span>
            <strong>{String(absentMembers).padStart(2, "0")}</strong>
          </div>
        </div>
      </div>

      <div className="tm-workspace">
        <aside className="tm-team-nav">
          <div className="tm-nav-heading">
            <span className="tm-section-label">ORGANIZAÇÃO</span>
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
                style={{ "--team-color": item.color }}
              >
                <span className="tm-team-symbol">
                  {item.abbreviation.slice(0, 1)}
                </span>

                <span className="tm-team-option-info">
                  <strong>{item.name}</strong>
                  <small>{item.members.length} integrantes</small>
                </span>

                <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>

          <div className="tm-nav-bottom">
            <div className="tm-nav-bottom-icon">
              <Icon name="shield" size={18} />
            </div>
            <div>
              <strong>Organização Lumora</strong>
              <span>Estrutura do edifício</span>
            </div>
          </div>
        </aside>

        <section className="tm-network-area">
          <div className="tm-network-heading">
            <div>
              <span className="tm-section-label">MAPA DA EQUIPE</span>
              <h2>{team.name}</h2>
              <p>{team.description}</p>
            </div>

            <span
              className="tm-member-count"
              style={{ "--team-color": team.color }}
            >
              <Icon name="users" size={15} />
              {team.members.length} pessoas
            </span>
          </div>

          <div className="tm-tools">
            <div className="tm-search">
              <Icon name="search" size={17} />
              <input
                type="text"
                placeholder="Buscar integrante..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div className="tm-filter">
              <Icon name="filter" size={16} />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filtrar integrantes"
              >
                <option value="Todos">Todos</option>
                <option value="Coordenadores">Coordenadores</option>
                <option value="Integrantes">Integrantes</option>
                <option value="Ativos">Ativos</option>
                <option value="Ausentes">Ausentes</option>
              </select>
            </div>
          </div>

          <div className="tm-network">
            <div className="tm-network-caption">
              <span>ESTRUTURA HIERÁRQUICA</span>
              <span>{members.length} resultados</span>
            </div>

            {members.length === 0 ? (
              <div className="tm-empty">
                <div className="tm-empty-icon">
                  <Icon name="search" size={24} />
                </div>
                <strong>Nenhum integrante encontrado</strong>
                <p>
                  Tente alterar a busca ou selecionar outro filtro.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("Todos");
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="tm-hierarchy">
                {visibleLeader && leader && (
                  <button
                    className={`tm-person-node tm-leader-node ${
                      selectedMember === leader.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedMember(leader.id)}
                    style={{ "--team-color": team.color }}
                  >
                    <span className="tm-person-avatar">
                      {initials(leader.name)}
                    </span>

                    <span className="tm-person-data">
                      <strong>{leader.name}</strong>
                      <small>{leader.role}</small>
                    </span>

                    <span className="tm-leader-tag">LIDERANÇA</span>

                    <span
                      className={`tm-node-status ${
                        leader.status === "Ativo" ? "online" : "offline"
                      }`}
                    />
                  </button>
                )}

                {visibleMembers.length > 0 && (
                  <>
                    {visibleLeader && (
                      <>
                        <div className="tm-connector-vertical" />
                        <div className="tm-connector-horizontal" />
                      </>
                    )}

                    <div className="tm-members">
                      {visibleMembers.map((member) => (
                        <button
                          key={member.id}
                          className={`tm-person-node tm-member-node ${
                            selectedMember === member.id ? "selected" : ""
                          }`}
                          onClick={() => setSelectedMember(member.id)}
                          style={{ "--team-color": team.color }}
                        >
                          <span className="tm-person-avatar">
                            {initials(member.name)}
                          </span>

                          <span className="tm-person-data">
                            <strong>{member.name}</strong>
                            <small>{member.role}</small>
                          </span>

                          <span
                            className={`tm-node-status ${
                              member.status === "Ativo"
                                ? "online"
                                : "offline"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="tm-network-footer">
              <div>
                <span className="tm-legend-dot online" />
                Ativo
              </div>
              <div>
                <span className="tm-legend-dot offline" />
                Ausente
              </div>
              <span className="tm-network-footer-note">
                Selecione uma pessoa para ver os detalhes
              </span>
            </div>
          </div>
        </section>

        <aside className="tm-inspector">
          <div className="tm-inspector-top">
            <span className="tm-section-label">PERFIL DO INTEGRANTE</span>
            <span className="tm-inspector-mark">
              <Icon name="user" size={17} />
            </span>
          </div>

          {selected ? (
            <>
              <div className="tm-profile">
                <div
                  className="tm-profile-avatar"
                  style={{ "--team-color": team.color }}
                >
                  {initials(selected.name)}
                </div>

                <h3>{selected.name}</h3>
                <span>{selected.role}</span>

                <div
                  className={`tm-profile-status ${
                    selected.status === "Ativo" ? "online" : "offline"
                  }`}
                >
                  <span />
                  {selected.status}
                </div>
              </div>

              <div className="tm-inspector-divider" />

              <div className="tm-info-group">
                <span className="tm-info-label">CONTATO</span>

                <div className="tm-info-row">
                  <Icon name="mail" size={17} />
                  <div>
                    <small>E-mail</small>
                    <strong>{selected.email}</strong>
                  </div>
                </div>

                <div className="tm-info-row">
                  <Icon name="phone" size={17} />
                  <div>
                    <small>Telefone</small>
                    <strong>{selected.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="tm-inspector-divider" />

              <div className="tm-info-group">
                <span className="tm-info-label">INFORMAÇÕES</span>

                <div className="tm-info-row">
                  <Icon name="users" size={17} />
                  <div>
                    <small>Equipe</small>
                    <strong>{team.name}</strong>
                  </div>
                </div>

                <div className="tm-info-row">
                  <Icon name="calendar" size={17} />
                  <div>
                    <small>Data de entrada</small>
                    <strong>{selected.since}</strong>
                  </div>
                </div>

                <div className="tm-info-row">
                  <Icon name="shield" size={17} />
                  <div>
                    <small>Função</small>
                    <strong>
                      {selected.leader ? "Coordenador" : "Integrante"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="tm-inspector-divider" />

              <button
                className={`tm-status-action ${
                  selected.status === "Ativo" ? "mark-absent" : "mark-active"
                }`}
                onClick={() => toggleMemberStatus(selected.id)}
              >
                {selected.status === "Ativo" ? (
                  <>
                    <Icon name="clock" size={17} />
                    Marcar como ausente
                  </>
                ) : (
                  <>
                    <Icon name="check" size={17} />
                    Marcar como ativo
                  </>
                )}
              </button>

              <p className="tm-inspector-note">
                A alteração de status é demonstrativa e ainda não está
                conectada ao banco de dados.
              </p>
            </>
          ) : (
            <div className="tm-inspector-empty">
              <Icon name="user" size={28} />
              <strong>Nenhum integrante selecionado</strong>
              <p>
                Selecione uma pessoa no mapa para visualizar as informações.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

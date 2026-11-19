"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import "./equipes.css";
import { PredioContexto } from "@/components/PrivateLayoutClient";

// Dados de demonstração exibidos na lista de equipes.
const equipesIniciais = [
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

function obterIniciais(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Valores iniciais dos formulários.
const formularioUsuarioVazio = {
  name: "",
  role: "",
  email: "",
  phone: "",
  status: "Ativo",
  since: new Date().toLocaleDateString("pt-BR"),
  cpf: "",
  senha: "",
  perfil: "locador",
  data_nascimento: "",
};

const formularioEquipeVazio = {
  name: "",
  abbreviation: "",
  color: "#4775D1",
  description: "",
};

// URL base usada pelas chamadas da página.
function obterApiUrl() {
  const configurada = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api")
    .replace(/\/+$/, "");
  return configurada.endsWith("/api") ? configurada : `${configurada}/api`;
}

function lerArquivoComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    leitor.readAsDataURL(arquivo);
  });
}

export default function EquipesPage() {
  // O prédio atual vem do perfil do administrador carregado pelo cabeçalho.
  const { idPredioSelecionado } = useContext(PredioContexto);

  // Estado da página e dos modais.
  const [teams, setTeams] = useState(equipesIniciais);
  const [activeTeam, setActiveTeam] = useState(1);
  const [selectedMember, setSelectedMember] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState(formularioEquipeVazio);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(formularioUsuarioVazio);
  const [feedback, setFeedback] = useState("");
  const [registrationStep, setRegistrationStep] = useState(1);
  const [credential, setCredential] = useState({
    token: "",
    tipo_credencial: "qr_code",
  });
  const [permissions, setPermissions] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [registrationError, setRegistrationError] = useState("");
  const [savingRegistration, setSavingRegistration] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (!photoPreview) return undefined;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  useEffect(() => {
    if (!modalOpen || editingMember) return;

    let ativo = true;
    async function carregarAmbientes() {
      try {
        const token = window.localStorage.getItem("lumora_token");
        const response = await fetch(`${obterApiUrl()}/usuarios/ambientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.erro || "Não foi possível carregar os ambientes.");
        }
        if (ativo) setEnvironments(data.dados || []);
      } catch (error) {
        if (!ativo) return;
        setRegistrationError(error.message === "Failed to fetch"
          ? "Não foi possível conectar à API. Confira se o servidor está ativo e tente novamente."
          : error.message);
      }
    }

    carregarAmbientes();
    return () => { ativo = false; };
  }, [modalOpen, editingMember]);

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

  function selecionarEquipe(id) {
    const nextTeam = teams.find((item) => item.id === id);

    if (!nextTeam) return;

    setActiveTeam(id);
    setSelectedMember(nextTeam.members[0]?.id ?? null);
    setSearch("");
    setFilter("Todos");
  }

  function abrirCadastroUsuario() {
    setEditingMember(null);
    setForm(formularioUsuarioVazio);
    setRegistrationStep(1);
    setCredential({ token: "", tipo_credencial: "qr_code" });
    setPermissions([]);
    setRegistrationError("");
    setPhotoFile(null);
    setPhotoPreview("");
    setModalOpen(true);
  }

  function abrirCadastroEquipe() {
    setTeamForm(formularioEquipeVazio);
    setTeamModalOpen(true);
  }

  function salvarEquipe(event) {
    event.preventDefault();
    const newTeam = {
      id: Date.now(),
      ...teamForm,
      name: teamForm.name.trim(),
      abbreviation: teamForm.abbreviation.trim().slice(0, 4).toUpperCase(),
      members: [],
    };
    setTeams((current) => [...current, newTeam]);
    setActiveTeam(newTeam.id);
    setSelectedMember(null);
    setSearch("");
    setFilter("Todos");
    setFeedback("Grupo criado com sucesso.");
    setTeamModalOpen(false);
  }

  function abrirEdicaoIntegrante(member) {
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

  function alterarCampoFormulario(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function atualizarIntegrante() {
    setTeams((current) => current.map((item) => item.id === activeTeam
      ? {
          ...item,
          members: item.members.map((member) => member.id === editingMember
            ? { ...member, ...form }
            : member),
        }
      : item));
    setFeedback("Integrante atualizado com sucesso.");
    setSelectedMember(editingMember);
  }

  async function cadastrarUsuario() {
    if (!idPredioSelecionado) {
      setRegistrationError("O prédio do administrador ainda não foi carregado pelo cabeçalho.");
      return false;
    }
    if (!permissions.length) {
      setRegistrationError("Adicione pelo menos uma permissão de ambiente.");
      return false;
    }

    setSavingRegistration(true);
    setRegistrationError("");
    try {
      const token = window.localStorage.getItem("lumora_token");
      const foto_upload = photoFile ? await lerArquivoComoDataUrl(photoFile) : null;
      const response = await fetch(`${obterApiUrl()}/usuarios/com-acesso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario: {
            nome: form.name,
            email: form.email,
            senha: form.senha,
            cpf: form.cpf,
            telefone: form.phone,
            perfil: form.perfil,
            data_nascimento: form.data_nascimento || null,
            id_predio: idPredioSelecionado,
            foto_upload,
          },
          credencial: credential,
          permissoes,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.erro || "Não foi possível cadastrar o usuário.");
      }

      const novoIntegrante = {
        id: data.dados.id_usuario,
        name: form.name,
        role: form.perfil,
        email: form.email,
        phone: form.phone,
        status: "Ativo",
        since: new Date().toLocaleDateString("pt-BR"),
      };
      setTeams((current) => current.map((item) => item.id === activeTeam
        ? { ...item, members: [...item.members, novoIntegrante] }
        : item));
      setSelectedMember(novoIntegrante.id);
      setFeedback("Usuário, credencial e permissões cadastrados com sucesso.");
      return true;
    } catch (error) {
      setRegistrationError(error.message === "Failed to fetch"
        ? "Não foi possível conectar à API. Confira se o servidor está ativo e tente novamente."
        : error.message);
      return false;
    } finally {
      setSavingRegistration(false);
    }
  }

  async function salvarIntegrante(event) {
    event.preventDefault();
    if (!team) return;

    if (editingMember) {
      atualizarIntegrante();
    } else if (registrationStep < 3) {
      setRegistrationStep((step) => step + 1);
      return;
    } else {
      const cadastroConcluido = await cadastrarUsuario();
      if (!cadastroConcluido) return;
    }

    setModalOpen(false);
    setSearch("");
    setFilter("Todos");
  }

  function excluirIntegrante(memberId) {
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

  function alternarStatusIntegrante(memberId) {
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

        <div className="tm-page-actions">
          <button className="tm-primary-button tm-secondary-action" onClick={abrirCadastroEquipe}>
            <Icon name="plus" size={17} />
            Criar grupo
          </button>
          <button className="tm-primary-button" onClick={abrirCadastroUsuario}>
            <Icon name="plus" size={17} />
            Registrar usuário
          </button>
        </div>
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
                onClick={() => selecionarEquipe(item.id)}
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
                <button className="tm-add-inline" onClick={abrirCadastroUsuario}>
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
                              {obterIniciais(member.name)}
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
                                abrirEdicaoIntegrante(member);
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
                                excluirIntegrante(member.id);
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
                  {obterIniciais(selected.name)}
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
                  onClick={() => abrirEdicaoIntegrante(selected)}
                >
                  <Icon name="edit" size={16} />
                  Editar cadastro
                </button>

                <button
                  className="tm-toggle-button"
                  onClick={() => alternarStatusIntegrante(selected.id)}
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
                  {editingMember ? "Editar integrante" : "Cadastrar usuário"}
                </h2>
                <p>{editingMember ? "Atualize os dados do integrante." : `Etapa ${registrationStep} de 3 · cadastro de usuário e acesso.`}</p>
              </div>
              <button
                className="tm-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <form onSubmit={salvarIntegrante}>
              {editingMember ? <div className="tm-form-grid">
                <label className="tm-form-full">
                  Nome completo
                  <input
                    name="name"
                    value={form.name}
                    onChange={alterarCampoFormulario}
                    placeholder="Ex.: João da Silva"
                    required
                  />
                </label>

                <label>
                  Função
                  <input
                    name="role"
                    value={form.role}
                    onChange={alterarCampoFormulario}
                    placeholder="Ex.: Técnico"
                    required
                  />
                </label>

                <label>
                  Telefone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={alterarCampoFormulario}
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
                    onChange={alterarCampoFormulario}
                    placeholder="funcionario@lumora.com"
                    required
                  />
                </label>

                <label>
                  Data de entrada
                  <input
                    name="since"
                    value={form.since}
                    onChange={alterarCampoFormulario}
                    placeholder="DD/MM/AAAA"
                    required
                  />
                </label>

                <label>
                  Situação
                  <select
                    name="status"
                    value={form.status}
                    onChange={alterarCampoFormulario}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Ausente">Ausente</option>
                  </select>
                </label>
              </div> : <>
                {registrationStep === 1 && <div className="tm-form-grid">
                  <label className="tm-form-full">Nome completo<input name="name" value={form.name} onChange={alterarCampoFormulario} required /></label>
                  <label>E-mail<input type="email" name="email" value={form.email} onChange={alterarCampoFormulario} required /></label>
                  <label>Senha inicial<input type="password" name="senha" value={form.senha} onChange={alterarCampoFormulario} minLength={8} required /></label>
                  <label>CPF (11 números)<input name="cpf" value={form.cpf} onChange={alterarCampoFormulario} inputMode="numeric" maxLength={14} required /></label>
                  <label>Telefone<input name="phone" value={form.phone} onChange={alterarCampoFormulario} /></label>
                  <label>Perfil<select name="perfil" value={form.perfil} onChange={alterarCampoFormulario}><option value="administrador">Administrador</option><option value="manutencao">Manutenção</option><option value="porteiro">Porteiro</option><option value="locador">Locador</option></select></label>
                  <label>Data de nascimento<input type="date" name="data_nascimento" value={form.data_nascimento} onChange={alterarCampoFormulario} /></label>
                  <label className="tm-form-full tm-photo-field">Foto do usuário (opcional)<input className="tm-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                    const arquivo = event.target.files?.[0];
                    if (!arquivo) return;
                    if (!/^image\/(png|jpeg|webp)$/.test(arquivo.type) || arquivo.size > 2 * 1024 * 1024) {
                      setRegistrationError("Selecione uma imagem PNG, JPG ou WebP de até 2 MB.");
                      event.target.value = "";
                      setPhotoFile(null);
                      setPhotoPreview("");
                      return;
                    }
                    setRegistrationError("");
                    setPhotoFile(arquivo);
                    setPhotoPreview(URL.createObjectURL(arquivo));
                  }} /></label>
                  {photoPreview && <div className="tm-photo-preview tm-form-full"><img src={photoPreview} alt="Prévia da foto selecionada" /><span>{photoFile?.name}</span></div>}
                </div>}
                {registrationStep === 2 && <div className="tm-form-grid">
                  <label>Tipo de credencial<select value={credential.tipo_credencial} onChange={(event) => setCredential((current) => ({ ...current, tipo_credencial: event.target.value }))}><option value="qr_code">QR Code</option><option value="cartao_rfid">Cartão RFID</option><option value="tag_nfc">Tag NFC</option></select></label>
                  <label className="tm-form-full">Token da credencial<input value={credential.token} onChange={(event) => setCredential((current) => ({ ...current, token: event.target.value }))} placeholder="Digite ou cole o token único" required /></label>
                  <p className="tm-form-full tm-step-help">Este token identifica o cartão, tag ou QR Code. O sistema salva somente o hash do token.</p>
                </div>}
                {registrationStep === 3 && <div className="tm-form-grid">
                  <p className="tm-form-full">Selecione os ambientes e configure a vigência e os horários permitidos.</p>
                  {permissions.map((permission, index) => <div className="tm-permission-card tm-form-full" key={index}>
                    <label>Ambiente<select value={permission.id_ambiente} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, id_ambiente: event.target.value } : item))} required><option value="">Selecione</option>{environments.map((env) => <option key={env.id_ambiente} value={env.id_ambiente}>{env.nome} · Andar {env.numero_andar} · {env.localizacao}</option>)}</select></label>
                    <label>Data inicial<input type="date" value={permission.data_inicio} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, data_inicio: event.target.value } : item))} required /></label>
                    <label>Data final (opcional)<input type="date" value={permission.data_fim} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, data_fim: event.target.value } : item))} /></label>
                    <label>Horário inicial<input type="time" value={permission.horario_inicio} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, horario_inicio: event.target.value } : item))} /></label>
                    <label>Horário final<input type="time" value={permission.horario_fim} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, horario_fim: event.target.value } : item))} /></label>
                    <label className="tm-form-full">Dias da semana (opcional)<input value={permission.dias_semana} onChange={(event) => setPermissions((items) => items.map((item, i) => i === index ? { ...item, dias_semana: event.target.value } : item))} placeholder="Ex.: seg,ter,qua,qui,sex" /></label>
                    <button type="button" className="tm-cancel-button" onClick={() => setPermissions((items) => items.filter((_, i) => i !== index))}>Remover ambiente</button>
                  </div>)}
                  <button type="button" className="tm-add-inline tm-form-full" onClick={() => setPermissions((items) => [...items, { id_ambiente: "", data_inicio: new Date().toISOString().slice(0, 10), data_fim: "", horario_inicio: "", horario_fim: "", dias_semana: "" }])}>+ Adicionar ambiente</button>
                  {environments.length === 0 && <p className="tm-form-full">Não há ambientes disponíveis para selecionar.</p>}
                </div>}
                {registrationError && <p className="tm-registration-error" role="alert">{registrationError}</p>}
              </>}

              <div className="tm-modal-footer">
                <button
                  type="button"
                  className="tm-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                {!editingMember && registrationStep > 1 && <button type="button" className="tm-cancel-button" onClick={() => setRegistrationStep((step) => step - 1)}>Voltar</button>}
                <button type="submit" className="tm-primary-button" disabled={savingRegistration}>
                  <Icon name="check" size={16} />
                  {editingMember ? "Salvar alterações" : registrationStep < 3 ? "Avançar" : savingRegistration ? "Cadastrando..." : "Concluir cadastro"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {teamModalOpen && (
        <div className="tm-modal-overlay" onMouseDown={() => setTeamModalOpen(false)}>
          <section
            className="tm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tm-team-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="tm-modal-header">
              <div>
                <span className="tm-section-label">GESTÃO DE PESSOAS</span>
                <h2 id="tm-team-modal-title">Criar grupo</h2>
                <p>Informe os dados do novo grupo de trabalho.</p>
              </div>
              <button className="tm-modal-close" onClick={() => setTeamModalOpen(false)} aria-label="Fechar">
                <Icon name="close" size={19} />
              </button>
            </div>
            <form onSubmit={salvarEquipe}>
              <div className="tm-form-grid">
                <label className="tm-form-full">
                  Nome do grupo
                  <input autoFocus value={teamForm.name} onChange={(event) => setTeamForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ex.: Equipe de Limpeza" required />
                </label>
                <label>
                  Sigla
                  <input maxLength={4} value={teamForm.abbreviation} onChange={(event) => setTeamForm((current) => ({ ...current, abbreviation: event.target.value.toUpperCase() }))} placeholder="Ex.: LIM" required />
                </label>
                <label>
                  Cor do grupo
                  <input type="color" value={teamForm.color} onChange={(event) => setTeamForm((current) => ({ ...current, color: event.target.value }))} />
                </label>
                <label className="tm-form-full">
                  Descrição
                  <input value={teamForm.description} onChange={(event) => setTeamForm((current) => ({ ...current, description: event.target.value }))} placeholder="Descreva as responsabilidades do grupo" required />
                </label>
              </div>
              <div className="tm-modal-footer">
                <button type="button" className="tm-cancel-button" onClick={() => setTeamModalOpen(false)}>Cancelar</button>
                <button type="submit" className="tm-primary-button"><Icon name="check" size={16} />Criar grupo</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

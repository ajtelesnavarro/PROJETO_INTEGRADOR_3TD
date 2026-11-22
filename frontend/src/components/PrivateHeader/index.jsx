
"use client";

import { useEffect, useRef, useState } from "react";
import "./header.css";

function HeaderIcon({ name, size = 18 }) {
  const icons = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    building: <path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    alert: <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />,
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

export default function Header({
  setSidebar,
  sidebar,
  buildingName = "Edifício cadastrado",
  buildings = [],
  onBuildingChange,
  userName = "Usuário",
  userRole = "Administrador",
}) {
  const [alerts, setAlerts] = useState(false);
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const searchRef = useRef(null);
  const buildingRef = useRef(null);
  const profileRef = useRef(null);

  // Atalhos e fechamento dos menus
  useEffect(() => {
    function handleShortcut(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setBuildingOpen(false);
        setAlerts(false);
        setProfileOpen(false);
      }
    }

    function handleOutsideClick(event) {
      if (
        buildingRef.current &&
        !buildingRef.current.contains(event.target)
      ) {
        setBuildingOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    const token = window.localStorage.getItem("lumora_token");

    if (!token) {
      setProfileError("Sessão não encontrada. Entre novamente para ver seus dados.");
      return () => {
        ativo = false;
      };
    }

    async function carregarPerfil() {
      setProfileLoading(true);
      try {
        const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
        const apiUrl = configuredApiUrl.endsWith("/api")
          ? configuredApiUrl
          : `${configuredApiUrl}/api`;
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.erro || data.message || "Não foi possível carregar os dados do usuário.");
        }

        if (ativo) {
          const perfil = data.dados ?? data.usuario ?? data;
          setProfileData(perfil);

          const idPredio = perfil.id_predio;
          if (idPredio) {
            const predio = buildings.find(
              (item) => Number(item.id_predio ?? item.id) === Number(idPredio)
            ) ?? { id_predio: Number(idPredio) };
            setSelectedBuilding(predio);
            onBuildingChange?.(predio);
          }
        }
      } catch (error) {
        if (ativo) {
          setProfileError(error instanceof Error ? error.message : "Não foi possível carregar os dados do usuário.");
        }
      } finally {
        if (ativo) setProfileLoading(false);
      }
    }

    carregarPerfil();
    return () => {
      ativo = false;
    };
  }, []);

  // Mantém o prédio selecionado sincronizado com a lista recebida
  useEffect(() => {
    if (selectedBuilding) {
      const atualizado = buildings.find(
        (item) =>
          (item.id_predio ?? item.id) ===
          (selectedBuilding.id_predio ?? selectedBuilding.id)
      );

      if (atualizado) {
        setSelectedBuilding(atualizado);
      }
    }
  }, [buildings]);

  function selecionarPredio(predio) {
    setSelectedBuilding(predio);
    setBuildingOpen(false);

    // Informa ao componente pai qual prédio foi selecionado
    onBuildingChange?.(predio);
  }

  const nomePredio =
    selectedBuilding?.nome ??
    selectedBuilding?.nome_predio ??
    selectedBuilding?.name ??
    buildingName;

  const nomeUsuario = profileData?.nome ?? userName;
  const perfilUsuario = profileData?.perfil ?? userRole;
  const perfilLabels = {
    administrador: "Administrador",
    manutencao: "Manutenção",
    porteiro: "Porteiro",
    funcionario: "Funcionário",
  };
  const nomePerfil = perfilLabels[String(perfilUsuario).toLowerCase()] ?? perfilUsuario;
  const initials = nomeUsuario
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="lumora-header">
      <div className="lumora-header-left">
        {!sidebar && (
          <button
            type="button"
            className="lumora-open-sidebar"
            onClick={() => setSidebar(true)}
            aria-label="Abrir menu lateral"
            title="Abrir menu"
          >
            <i className="bi bi-arrows-angle-expand"></i>
          </button>
        )}
      </div>

      <div className="lumora-header-actions">

        {/* SELETOR DE EDIFÍCIOS */}
        <div className="lumora-building-selector" ref={buildingRef}>
          <div className="lumora-building-info">
            <span className="lumora-building-icon">
              <HeaderIcon name="building" size={17} />
            </span>

            <span className="lumora-building-text">
              <small>PRÉDIO ATUAL</small>
              <b title={nomePredio}>{nomePredio}</b>
            </span>

            <button
              type="button"
              className={`lumora-building-toggle ${
                buildingOpen ? "active" : ""
              }`}
              onClick={() => setBuildingOpen(!buildingOpen)}
              aria-label="Selecionar edifício"
              aria-expanded={buildingOpen}
              title="Trocar edifício"
            >
              <HeaderIcon name="chevron" size={16} />
            </button>
          </div>

          {buildingOpen && (
            <div className="lumora-building-dropdown">
              <div className="lumora-building-dropdown-heading">
                <div>
                  <b>Seus edifícios</b>
                  <small>Selecione um prédio para acessar</small>
                </div>

                <span>{buildings.length}</span>
              </div>

              <div className="lumora-building-list">
                {buildings.length > 0 ? (
                  buildings.map((predio, index) => {
                    const id = predio.id_predio ?? predio.id ?? index;

                    const nome =
                      predio.nome ??
                      predio.nome_predio ??
                      predio.name ??
                      "Edifício sem nome";

                    const idSelecionado =
                      selectedBuilding?.id_predio ??
                      selectedBuilding?.id;

                    const atual =
                      idSelecionado != null
                        ? idSelecionado === id
                        : nome === nomePredio;

                    return (
                      <button
                        type="button"
                        key={id}
                        className={`lumora-building-option ${
                          atual ? "selected" : ""
                        }`}
                        onClick={() => selecionarPredio(predio)}
                      >
                        <span className="lumora-building-option-icon">
                          <HeaderIcon name="building" size={17} />
                        </span>

                        <span className="lumora-building-option-info">
                          <b>{nome}</b>
                          <small>
                            {predio.cidade
                              ? `${predio.cidade}${
                                  predio.estado ? ` - ${predio.estado}` : ""
                                }`
                              : "Edifício cadastrado"}
                          </small>
                        </span>

                        {atual && (
                          <i className="bi bi-check2 lumora-building-check" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="lumora-building-empty">
                    <HeaderIcon name="building" size={22} />
                    <b>Nenhum edifício encontrado</b>
                    <span>Os edifícios cadastrados aparecerão aqui.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lumora-header-divider" />

        {/* NOTIFICAÇÕES */}
        <div className="lumora-alert-wrapper">
          <button
            className={`lumora-header-icon ${alerts ? "selected" : ""}`}
            onClick={() => setAlerts(!alerts)}
            aria-label="Notificações"
            aria-expanded={alerts}
          >
            <HeaderIcon name="bell" />
            <i className="lumora-alert-count">3</i>
          </button>

          {alerts && (
            <>
              <button
                className="lumora-dropdown-overlay"
                onClick={() => setAlerts(false)}
                aria-label="Fechar notificações"
              />

              <div className="lumora-alert-dropdown">
                <div className="lumora-alert-heading">
                  <div>
                    <b>Notificações</b>
                    <span>Atividades recentes do sistema</span>
                  </div>
                  <span className="lumora-alert-new">3 novas</span>
                </div>

                <div className="lumora-alert-item">
                  <span className="lumora-alert-symbol danger">
                    <HeaderIcon name="alert" size={16} />
                  </span>
                  <div>
                    <b>Dispositivo requer atenção</b>
                    <p>Um dispositivo está com funcionamento irregular</p>
                    <small>Há 4 minutos</small>
                  </div>
                </div>

                <div className="lumora-alert-item">
                  <span className="lumora-alert-symbol warning">
                    <HeaderIcon name="alert" size={16} />
                  </span>
                  <div>
                    <b>Temperatura acima do limite</b>
                    <p>Verifique as condições do ambiente monitorado</p>
                    <small>Há 12 minutos</small>
                  </div>
                </div>

                <div className="lumora-alert-item">
                  <span className="lumora-alert-symbol info">
                    <HeaderIcon name="building" size={16} />
                  </span>
                  <div>
                    <b>Atualização do sistema</b>
                    <p>Os dados operacionais foram atualizados</p>
                    <small>Há 25 minutos</small>
                  </div>
                </div>

                <button
                  className="lumora-alert-footer"
                  onClick={() => setAlerts(false)}
                >
                  Fechar notificações
                </button>
              </div>
            </>
          )}
        </div>

        {/* PERFIL */}
        <div className="lumora-profile" ref={profileRef}>
          <button
            type="button"
            className="lumora-profile-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Abrir informações do usuário"
            aria-expanded={profileOpen}
            aria-haspopup="dialog"
          >
            <span className="lumora-profile-avatar">
              {initials || "U"}
              <i />
            </span>

            <span className="lumora-profile-info">
              <b>{nomeUsuario}</b>
              <small>{nomePerfil}</small>
            </span>

            <span className={`lumora-profile-chevron ${profileOpen ? "open" : ""}`}>
              <HeaderIcon name="chevron" size={15} />
            </span>
          </button>

          {profileOpen && (
            <section className="lumora-profile-dropdown" role="dialog" aria-label="Informações do usuário">
              <div className="lumora-profile-dropdown-heading">
                <b>Dados do usuário</b>
                <small>Informações da sua conta</small>
              </div>
              {profileLoading ? (
                <p className="lumora-profile-state">Carregando dados...</p>
              ) : profileError ? (
                <p className="lumora-profile-state error" role="alert">{profileError}</p>
              ) : profileData ? (
                <dl className="lumora-profile-fields">
                  {[
                    ["ID do usuário", profileData.id_usuario],
                    ["ID do prédio", profileData.id_predio],
                    ["Nome", profileData.nome],
                    ["E-mail", profileData.email],
                    ["Telefone", profileData.telefone],
                    ["Perfil", nomePerfil],
                    ["CPF", profileData.cpf],
                    ["Foto", profileData.foto],
                    ["Data de nascimento", profileData.data_nascimento],
                    ["Situação", profileData.ativo],
                    ["Senha", "Protegida por segurança"],
                  ].map(([label, value]) => {
                    const exibido = value == null || value === ""
                      ? "Não informado"
                      : label === "Data de nascimento" && /^\d{4}-\d{2}-\d{2}/.test(String(value))
                        ? String(value).slice(0, 10).split("-").reverse().join("/")
                        : String(value);

                    return (
                      <div className="lumora-profile-field" key={label}>
                        <dt>{label}</dt>
                        <dd title={exibido}>{exibido}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="lumora-profile-state">Não há dados disponíveis.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </header>
  );
}

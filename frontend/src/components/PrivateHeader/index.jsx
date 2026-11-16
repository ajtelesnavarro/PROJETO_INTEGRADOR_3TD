
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
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const searchRef = useRef(null);
  const buildingRef = useRef(null);

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
      }
    }

    function handleOutsideClick(event) {
      if (
        buildingRef.current &&
        !buildingRef.current.contains(event.target)
      ) {
        setBuildingOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleOutsideClick);
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

  const initials = userName
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
        <div className="lumora-profile">
          <span className="lumora-profile-avatar">
            {initials || "U"}
            <i />
          </span>

          <span className="lumora-profile-info">
            <b>{userName}</b>
            <small>{userRole}</small>
          </span>

          <HeaderIcon name="chevron" size={15} />
        </div>
      </div>
    </header>
  );
}

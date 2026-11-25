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
  userName = "Usuário",
  userRole = "Administrador",
  onLogout,
}) {
  const [alerts, setAlerts] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

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
  <HeaderIcon name="menu" />
  </button>
)}
      </div>

      <div className="lumora-header-actions">

        <div className="lumora-header-divider" />

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

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="lumora-profile"
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
          <span className="lumora-profile-avatar">
            {initials || "U"}
            <i />
          </span>

          <span className="lumora-profile-info">
            <b>{userName}</b>
            <small>{userRole}</small>
          </span>

          <HeaderIcon name="chevron" size={15} />
        </button>
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "6px",
                minWidth: "160px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
                zIndex: 50,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout?.();
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
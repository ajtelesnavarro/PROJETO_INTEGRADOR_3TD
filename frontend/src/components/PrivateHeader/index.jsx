"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./header.css";

function HeaderIcon({ name, size = 18 }) {
  const icons = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    ),
    building: (
      <path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" />
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    alert: (
      <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
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
      {icons[name]}
    </svg>
  );
}

export default function Header({
  setSidebar,
  sidebar,
  buildingName = "Edifício cadastrado",
  userName = "Usuário",
  userRole = "Tanto faz",
  userPhoto = "",
  onLogout,
}) {
  const router = useRouter();
  const [alertasAbertos, setAlertasAbertos] = useState(false);
  const [alertas, setAlertas] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => setPhotoFailed(false), [userPhoto]);
  const photoUrl = userPhoto && !/^(https?:|data:|blob:)/i.test(userPhoto)
    ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "").replace(/\/api\/v1$/, "")}${userPhoto.startsWith("/") ? "" : "/"}${userPhoto}`
    : userPhoto;

  // Atalho Ctrl + K
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

  // Carrega os alertas automaticamente
  useEffect(() => {
    let ativo = true;

    const carregarAlertas = async () => {
      try {
        const resposta = await requisicaoAPI("/alertas-limites");

        if (ativo) {
          setAlertas(resposta.dados || []);
        }
      } catch {
        if (ativo) {
          setAlertas([]);
        }
      }
    };

    carregarAlertas();

    // Atualiza a cada 60 segundos
    const intervalo = window.setInterval(carregarAlertas, 60_000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
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

        {/* PRÉDIO ATUAL */}
        <div className="lumora-building-info">
          <span className="lumora-building-icon">
            <HeaderIcon name="building" size={17} />
          </span>

          <span className="lumora-building-text">
            <small>PRÉDIO ATUAL</small>
            <b>{buildingName}</b>
          </span>
        </div>

        <div className="lumora-header-divider" />

        {/* NOTIFICAÇÕES */}
        <div className="lumora-alert-wrapper">
          <button
            type="button"
            className={`lumora-header-icon ${
              alertasAbertos ? "selected" : ""
            }`}
            onClick={async () => {
              const novoEstado = !alertasAbertos;

              setAlertasAbertos(novoEstado);

              // Ao abrir o sino, busca novamente os dados
              if (novoEstado) {
                try {
                  const resposta = await requisicaoAPI(
                    "/alertas-limites"
                  );

                  setAlertas(resposta.dados || []);
                } catch {
                  // Mantém os alertas anteriores caso a API falhe
                }
              }
            }}
            aria-label="Notificações"
            aria-expanded={alertasAbertos}
          >
            <HeaderIcon name="bell" />

            {/* Quantidade de alertas */}
            {alertas.length > 0 && (
              <i className="lumora-alert-count">
                {alertas.length > 99 ? "99+" : alertas.length}
              </i>
            )}
          </button>

          {alertasAbertos && (
            <>
              <button
                type="button"
                className="lumora-dropdown-overlay"
                onClick={() => setAlertasAbertos(false)}
                aria-label="Fechar notificações"
              />

              <div className="lumora-alert-dropdown">

                <div className="lumora-alert-heading">
                  <div>
                    <b>Notificações</b>

                    <span>
                      Leituras fora dos limites do prédio atual
                    </span>
                  </div>

                  {alertas.length > 0 && (
                    <span className="lumora-alert-new">
                      {alertas.length} ativas
                    </span>
                  )}
                </div>

                {alertas.length > 0 ? (
                  alertas.map((alerta, indice) => {

                    let titulo;

                    if (alerta.tipo === "temperatura") {
                      titulo = "Temperatura";
                    } else if (alerta.tipo === "iluminacao") {
                      titulo = "Iluminação";
                    } else if (alerta.motivo === "potencia") {
                      titulo = "Potência elétrica";
                    } else {
                      titulo = "Consumo de energia";
                    }

                    const direcao = alerta.direcao || (
                      Number(alerta.valor) > Number(alerta.limite_maximo)
                        ? "acima"
                        : "abaixo"
                    );

                    let limite;

                    if (alerta.motivo === "potencia") {
                      limite =
                        "máximo " +
                        Number(
                          alerta.limite_maximo
                        ).toLocaleString("pt-BR") +
                        " " +
                        alerta.unidade;
                    } else {
                      limite =
                        Number(
                          alerta.limite_minimo
                        ).toLocaleString("pt-BR") +
                        "–" +
                        Number(
                          alerta.limite_maximo
                        ).toLocaleString("pt-BR") +
                        " " +
                        alerta.unidade;
                    }

                    return (
                      <button
                        type="button"
                        className="lumora-alert-item"
                        key={
                          alerta.id_dispositivo +
                          "-" +
                          alerta.tipo +
                          "-" +
                          alerta.motivo +
                          "-" +
                          indice
                        }
                        onClick={() => {
                          setAlertasAbertos(false);
                          router.push(`/private/historico-dispositivos?registro=${alerta.id_historico_dispositivo || ""}&dispositivo=${alerta.id_dispositivo}`);
                        }}
                      >
                        <span className="lumora-alert-symbol danger">
                          <HeaderIcon name="alert" size={16} />
                        </span>

                        <span className="lumora-alert-copy">
                          <b>
                            {titulo} {direcao} do limite
                          </b>

                          <p>
                            {alerta.ambiente} ·{" "}
                            {alerta.dispositivo}:{" "}
                            {Number(alerta.valor).toLocaleString(
                              "pt-BR"
                            )}{" "}
                            {alerta.unidade} ({limite})
                          </p>

                          <small>
                            {alerta.data_hora
                              ? new Date(
                                  alerta.data_hora
                                ).toLocaleString("pt-BR")
                              : "Leitura recente"}
                          </small>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="lumora-alert-empty">
                    Nenhuma leitura fora dos limites configurados.
                  </p>
                )}

                <button
                  type="button"
                  className="lumora-alert-footer"
                  onClick={() => setAlertasAbertos(false)}
                >
                  Fechar notificações
                </button>
              </div>
            </>
          )}
        </div>

        {/* PERFIL */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="lumora-profile"
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span className="lumora-profile-avatar">
              {photoUrl && !photoFailed ? (
                <img src={photoUrl} alt={`Foto de ${userName}`} onError={() => setPhotoFailed(true)} />
              ) : (initials || "U")}
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
                boxShadow:
                  "0 10px 25px rgba(15, 23, 42, 0.12)",
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

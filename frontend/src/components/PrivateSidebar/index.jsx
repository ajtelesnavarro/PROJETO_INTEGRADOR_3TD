"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./sidebar.css";
import { apiFetch, unwrap } from "@/components/lib/api";
import { PERMISSOES_POR_PERFIL } from "@/components/RoleGuard";

// PERMISSÕES DE PERFIL são centralizadas no RoleGuard.
// PÁGINAS DO SISTEMA
const nav = [
  { id: "dashboard", label: "Dashboard", meta: "Visão geral", icon: "grid", href: "/private/dashboard" },
  { id: "predios", label: "Prédios & Andares", meta: "Prédio · andar · setor", icon: "building", href: "/private/predios" },
  { id: "ambientes", label: "Ambientes & Climatização", meta: "Temperatura · energia", icon: "rooms", href: "/private/ambientes" },
  { id: "dispositivos", label: "Dispositivos IoT", meta: "Dispositivo · histórico", icon: "cpu", href: "/private/dispositivos" },
  { id: "acessos", label: "Controle de Acesso", meta: "Credenciais · eventos", icon: "shield", href: "/private/acessos" },
  { id: "ocorrencias", label: "Ocorrências & Chamados", meta: "Ocorrências · reclamações", icon: "ticket", href: "/private/ocorrencias" },
  { id: "orcamentos", label: "Finanças & Orçamentos", meta: "Tarifas · pagamentos", icon: "wallet", href: "/private/orcamentos" },
  { id: "equipes", label: "Equipes & Usuários", meta: "Usuário · equipe", icon: "users", href: "/private/equipes" },
  { id: "historico", label: "Histórico", meta: "Leituras · acessos · ocorrências", icon: "ticket", href: "/private/historico" },
  { id: "versao", label: "Versão do sistema", meta: "Notas de versão", icon: "grid", href: "/private/versao" },
  { id: "perfil", label: "Meu Perfil", meta: "Conta", icon: "house", href: "/private/perfil" },
  { id: "reclamacoes", label: "Reclamações", meta: "Usuário · ambiente · dispositivo", icon: "chat", href: "/private/reclamacoes" },
];



const icons = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  building: <path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" />,
  rooms: <path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" />,
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Z" />
      <path d="M13 8h3m-3 4h3m-3 4h3" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 6h16v14H3zM3 9V4h13v2" />
      <path d="M15 12h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
    </>
  ),
  users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8m13 18v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  house: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  chat: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.4-.7L4 20l1.3-3.5A7 7 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z" />
      <path d="M8 10h8m-8 3h5" />
    </>
  ),
};

function Icon({ name, size = 19 }) {
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

function Logo() {
  return (
    <div className="lumora-logo">
      <div className="lumora-logo-symbol">
        <img src="/images/logo.png" alt="Logo Lumora" />
      </div>
      <div className="lumora-logo-text">
        <b>LUMORA</b>
        <span>EDIFÍCIOS INTELIGENTES</span>
      </div>
    </div>
  );
}

export default function Sidebar({ sidebar, setSidebar }) {
  
  const pathname = usePathname();
  const router = useRouter();

  const [linksVisiveis, setLinksVisiveis] = useState([]);

  useEffect(() => {
    let ativo = true;
    apiFetch("/auth/me")
      .then((data) => {
        const usuario = unwrap(data);
        const permitidas = PERMISSOES_POR_PERFIL[usuario.perfil] || [];
        if (ativo) setLinksVisiveis(nav.filter((item) => permitidas.includes(item.id)));
      })
      .catch(() => { if (ativo) setLinksVisiveis([]); });
    return () => { ativo = false; };
  }, [pathname]);

  // useEffect(() => {
  //   const token = localStorage.getItem("lumora_token");

  //   if (!token) {
  //     setLinksVisiveis([]);
  //     router.push("/private/acessos");
  //     return;
  //   }

  //   fetch("http://localhost:8080/api/auth/me", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.status === 401 || res.status === 403) {
  //         localStorage.removeItem("lumora_token");
  //         setLinksVisiveis([]);
  //         router.push("/private/acessos");
  //         throw new Error("Usuário não autenticado");
  //       }
  //       return res.json();
  //     })
  //     .then((dados) => {
  //       const permissoes = permissoesPorPerfil[dados.perfil] || [];
  //       const filtrados = nav.filter((item) => permissoes.includes(item.id));
  //       setLinksVisiveis(filtrados);
  //     })
  //     .catch((err) => console.error("Erro de autenticação:", err));
  // }, [pathname, router]);

  // if (linksVisiveis.length === 0) setTeste(false);

  return (
    <>
      <aside className={`lumora-sidebar ${sidebar ? "open" : ""}`}>
        <div className="lumora-sidebar-top">
          <Logo />
          <button
            type="button"
            className="lumora-mobile-close"
            onClick={() => setSidebar(false)}
            aria-label="Fechar menu"
            title="Fechar menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="lumora-navigation">
          <span className="lumora-nav-label">PLATAFORMA</span>
          {/* {test === true && */}
          {/* // (linksVisiveis.length > 0 ? linksVisiveis :  */}
          {linksVisiveis.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`lumora-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebar?.(false)}
              >
                <span className="lumora-nav-icon">
                  <Icon name={item.icon} size={item.icon === "chat" ? 22 : 19} />
                </span>
                <span className="lumora-nav-text">
                  <b>{item.label}</b>
                  <small>{item.meta}</small>
                </span>
                {active && <i className="lumora-nav-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="lumora-sidebar-footer">
          <div className="lumora-storage">
            <div className="lumora-storage-heading">
              <span>Capacidade da rede</span>
              <b>78%</b>
            </div>
            <div className="lumora-storage-bar">
              <i />
            </div>
            <small>1.014 de 1.300 dispositivos</small>
          </div>
        </div>
      </aside>

      {sidebar && (
        <button
          className="lumora-sidebar-overlay"
          onClick={() => setSidebar(false)}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}

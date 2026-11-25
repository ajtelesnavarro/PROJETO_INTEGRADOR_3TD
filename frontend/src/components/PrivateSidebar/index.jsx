
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { podeAcessar } from "@/components/RoleGuard";
import "./sidebar.css";

const nav = [
  {
    id: "dashboard",
    label: "Dashboard",
    meta: "Visão geral",
    icon: "grid",
    href: "/private/dashboard",
  },
  {
    id: "buildings",
    label: "Setores & Andares",
    meta: "Andar · setor",
    icon: "building",
    href: "/private/andares",
  },
  {
    id: "rooms",
    label: "Ambientes & Climatização",
    meta: "Temperatura · energia",
    icon: "rooms",
    href: "/private/ambientes",
  },
  {
    id: "devices",
    label: "Dispositivos IoT",
    meta: "Dispositivo · histórico",
    icon: "cpu",
    href: "/private/dispositivos",
  },
  {
    id: "device-history",
    label: "Histórico de dispositivos",
    meta: "Status · ocorrências",
    icon: "cpu",
    href: "/private/historico-dispositivos",
  },
  {
    id: "access",
    label: "Controle de Acesso",
    meta: "Credenciais · eventos",
    icon: "shield",
    href: "/private/acessos",
  },
  {
    id: "tickets",
    label: "Ocorrências & Chamados",
    meta: "Ocorrências · ações",
    icon: "ticket",
    href: "/private/ocorrencias",
  },
  {
    id: "finance",
    label: "Finanças & Orçamentos",
    meta: "Tarifas · pagamentos",
    icon: "wallet",
    href: "/private/orcamentos",
  },
  {
    id: "teams",
    label: "Equipes & Usuários",
    meta: "Usuário · equipe",
    icon: "users",
    href: "/private/equipes",
  },
 {
  id: "reclamacoes",
  label: "Reclamações",
  meta: "Adicionar e acompanhar solicitações",
  icon: "message-square-warning",
  href: "/private/reclamacoes",
},
  {
    id: "perfil",
    label: "Minha Conta",
    meta: "Dados pessoais",
    icon: "user-round",
    href: "/private/perfil",
  },
];

const icons = {
  grid: <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>,
  building: <path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" />,
  rooms: <path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" />,
  cpu: <>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" />
  </>,
  shield: <>
    <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  ticket: <>
    <path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Z" />
    <path d="M13 8h3m-3 4h3m-3 4h3" />
  </>,
  wallet: <>
    <path d="M3 6h16v14H3zM3 9V4h13v2" />
    <path d="M15 12h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
  </>,
  users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8m13 18v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "user-round": <>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="8" r="4" />
  </>,
  "message-square-warning": <>
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    <path d="M12 8v4m0 3h.01" />
  </>,
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
        <img src="/images/logo.png" alt="" />
      </div>

      <div className="lumora-logo-text">
        <b>LUMORA</b>
        <span>EDIFÍCIOS INTELIGENTES</span>
      </div>
    </div>
  );
}

export default function Sidebar({ sidebar, setSidebar, perfil }) {
  const pathname = usePathname();

  const itensVisiveis = nav.filter((item) =>
    podeAcessar(perfil, item.href)
  );

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

          {itensVisiveis.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`lumora-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebar?.(false)}
              >
                <span className="lumora-nav-icon">
                  <Icon name={item.icon} />
                </span>

                <span className="lumora-nav-text">
                  <b>{item.label}</b>
                  <small>{item.meta}</small>
                </span>

                {active && <i className="lumora-nav-indicator" />}

                {item.id === "dashboard" && (
                  <em className="lumora-live-tag">AO VIVO</em>
                )}
              </Link>
            );
          })}
        </nav>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css";

const items = [
  { label: "Início", detail: "Visão geral do locador", icon: "home", href: "/private/dashboard" },
  { label: "Perfil do locador", detail: "Seus dados e permissões", icon: "user", href: "/private/perfil" },
  { label: "Adicionar reclamação", detail: "Registrar uma solicitação", icon: "plus", href: "/private/reclamacoes/nova" },
  { label: "Histórico de reclamações", detail: "Acompanhar solicitações", icon: "history", href: "/private/reclamacoes" },
];

const paths = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5m4-1v5l3 2" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function SidebarUsuario({ sidebar = true, setSidebar }) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`user-sidebar ${sidebar ? "is-open" : ""}`} aria-label="Menu do locador">
        <div className="user-sidebar-brand">
          <Link href="/private/dashboard" className="user-brand" onClick={() => setSidebar?.(false)}>
            <span className="user-brand-mark"><img src="/images/logo.png" alt="" /></span>
            <span className="user-brand-name"><b>LUMORA</b><small>EDIFÍCIOS INTELIGENTES</small></span>
          </Link>
          <button className="user-sidebar-close" type="button" onClick={() => setSidebar?.(false)} aria-label="Fechar menu">
            <Icon name="close" />
          </button>
        </div>

        <div className="user-sidebar-welcome">
          <span className="user-welcome-icon"><Icon name="user" /></span>
          <div><small>ÁREA DO USUÁRIO</small><b>Locador</b></div>
        </div>

        <nav className="user-sidebar-nav">
          <span className="user-sidebar-label">MINHA CONTA</span>
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`user-sidebar-link ${active ? "active" : ""}`} onClick={() => setSidebar?.(false)}>
                <span className="user-sidebar-icon"><Icon name={item.icon} /></span>
                <span className="user-sidebar-copy"><b>{item.label}</b><small>{item.detail}</small></span>
                {active && <i className="user-sidebar-active-mark" />}
              </Link>
            );
          })}
        </nav>

        <div className="user-sidebar-footer">
          <span className="user-footer-mark">L</span>
          <div><b>Seu espaço, conectado.</b><small>Gestão simples com a Lumora</small></div>
        </div>
      </aside>
      {sidebar && <button className="user-sidebar-overlay" onClick={() => setSidebar?.(false)} aria-label="Fechar menu" />}
    </>
  );
}

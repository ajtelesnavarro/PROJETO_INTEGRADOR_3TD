
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.css";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <i data-lucide="building-2" className="logo-icon" />
                    <div>
                        <h2>LUMORA</h2>
                        <span>EDIFÍCIOS INTELIGENTES</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">

                <div className="nav-section">
                    <span className="section-title">MENU PRINCIPAL</span>

                    <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
                        <i className="bi bi-grid-1x2-fill"></i> Dashboard
                    </Link>

                    <Link href="/dashboard/predios" className={pathname === "/dashboard/predios" ? "active" : ""}>
                        <i className="bi bi-buildings"></i> Prédios
                    </Link>

                    <Link href="/dashboard/ambientes" className={pathname === "/dashboard/ambientes" ? "active" : ""}>
                        <i className="bi bi-door-open"></i> Ambientes
                    </Link>

                    <Link href="/dashboard/dispositivos" className={pathname === "/dashboard/dispositivos" ? "active" : ""}>
                        <i className="bi bi-cpu"></i> Dispositivos
                    </Link>

                    <Link href="/dashboard/historico" className={pathname === "/dashboard/historico" ? "active" : ""}>
                        <i className="bi bi-clock-history"></i> Histórico
                    </Link>

                    <Link href="/dashboard/controle_de_acessos" className={pathname === "/dashboard/controle_de_acessos" ? "active" : ""}>
                        <i className="bi bi-shield-lock"></i> Controle de acesso
                    </Link>

                    <Link href="/dashboard/ocorrencias" className={pathname === "/dashboard/ocorrencias" ? "active" : ""}>
                        <i className="bi bi-exclamation-triangle"></i> Ocorrências
                    </Link>

                    <Link href="/dashboard/relatorios" className={pathname === "/dashboard/relatorios" ? "active" : ""}>
                        <i className="bi bi-bar-chart-line"></i> Relatórios
                    </Link>
                </div>

                <div className="nav-section">
                    <span className="section-title">ADMINISTRAÇÃO</span>

                    <Link href="/dashboard/usuarios" className={pathname === "/dashboard/usuarios" ? "active" : ""}>
                        <i className="bi bi-people"></i> Usuários
                    </Link>

                    <Link href="/dashboard/configuracoes" className={pathname === "/dashboard/configuracoes" ? "active" : ""}>
                        <i className="bi bi-gear"></i> Configurações
                    </Link>

                    <Link href="/dashboard/sobre" className={pathname === "/dashboard/sobre" ? "active" : ""}>
                        <i className="bi bi-info-circle"></i> Sobre
                    </Link>
                </div>

            </nav>
        </aside>
    );
}

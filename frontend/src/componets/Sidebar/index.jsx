import Link from "next/link";

export default function Sidebar() {
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
                    <Link href={"/dashboard"}>Dashboard</Link>
                    <Link href={"/dashboard/predios"}>Prédios</Link>
                    <Link href={"#"}>Ambiente</Link>
                    <Link href={"/dashboard/predios/dispositivos"}>Dispositivos</Link>
                    <Link href={"/dashboard/predios/dispositivos/historico"}>Histórico</Link>
                    <Link href={"/dashboard/predios/dispositivos/historico/controle_de_acessos"}>Controle de acesso</Link>
                    <Link href={"/dashboard/predios/dispositivos/historico/controle_de_acessos/ocorrencias"}>Ocorrências</Link>
                    <Link href={"#"}>Relatórios</Link>
                </div>
                <div className="nav-section">
                    <span className="section-title">ADMINISTRAÇÃO</span>
                    <Link href={"/dashboard/predios/dispositivos/historico/controle_de_acessos/ocorrencias/usuarios"}>Usuários</Link>
                    <Link href={"/dashboard/predios/dispositivos/historico/controle_de_acessos/ocorrencias/usuarios/configuracoes"}>Relatórios</Link>
                    <Link href={"/dashboard/predios/dispositivos/historico/controle_de_acessos/ocorrencias/usuarios/configuracoes/sobre"}>Relatórios</Link>
                </div>
            </nav>
        </aside>
    )
}
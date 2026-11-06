
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
                    <ul>
                        <li className="active">
                        <a href="index.html">
                            <i data-lucide="layout-dashboard" /> Dashboard{" "}
                        </a>
                        </li>
                        <li>
                        <a href="predio.html">
                            <i data-lucide="building" /> Prédios{" "}
                        </a>
                        </li>
                        <li>
                        <a href="#">
                            <i data-lucide="layers" /> Ambientes{" "}
                        </a>
                        </li>
                        <li>
                        <a href="dispositivos.html">
                            <i data-lucide="cpu" /> Dispositivos e Sensores{" "}
                        </a>
                        </li>
                        <li>
                        <a href="leituras.html">
                            <i data-lucide="activity" /> Leituras{" "}
                        </a>
                        </li>
                        <li>
                        <a href="controle_acessos.html">
                            <i data-lucide="door-open" /> Controle de Acessos{" "}
                        </a>
                        </li>
                        <li>
                        <a href="ocorrencias.html">
                            <i data-lucide="alert-triangle" /> Ocorrências{" "}
                            <span className="badge">5</span>
                        </a>
                        </li>
                        <li>
                        <a href="#">
                            <i data-lucide="file-text" /> Relatórios{" "}
                        </a>
                        </li>
                    </ul>
                </div>
                <div className="nav-section">
                <span className="section-title">ADMINISTRAÇÃO</span>
                    <ul>
                        <li>
                        <a href="usuario.html">
                            <i data-lucide="users" /> Usuários{" "}
                        </a>
                        </li>
                        <li>
                        <a href="configuracoes.html">
                            <i data-lucide="settings" /> Configurações{" "}
                        </a>
                        </li>
                        <li>
                        <a href="sobre.html">
                            <i data-lucide="help-circle" /> Sobre o Sistema{" "}
                        </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    )
}
import './sidebar.css';

export default function Sidebar() {
    return (
        <>
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                <i data-lucide="building-2" class="logo-icon"></i>
                <div>
                    <h2>LUMORA</h2>
                    <span>EDIFÍCIOS INTELIGENTES</span>
                </div>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section">
                <span class="section-title">MENU PRINCIPAL</span>
                <ul>
                    <li class="active"><a href="index.html"><i data-lucide="layout-dashboard"></i> Dashboard </a></li>
                    <li><a href="predio.html"><i data-lucide="building"></i> Prédios </a></li>
                    <li><a href="#"><i data-lucide="layers"></i> Ambientes </a></li>
                    <li><a href="dispositivos.html"><i data-lucide="cpu"></i> Dispositivos e Sensores </a></li>
                    <li><a href="leituras.html"><i data-lucide="activity"></i> Leituras </a></li>
                    <li><a href="controle_acessos.html"><i data-lucide="door-open"></i> Controle de Acessos </a></li>
                    <li><a href="ocorrencias.html"><i data-lucide="alert-triangle"></i> Ocorrências <span class="badge">5</span></a></li>
                    <li><a href="#"><i data-lucide="file-text"></i> Relatórios </a></li>
                </ul>
                </div>

                <div class="nav-section">
                <span class="section-title">ADMINISTRAÇÃO</span>
                <ul>
                    <li><a href="usuario.html"><i data-lucide="users"></i> Usuários </a></li>
                    <li><a href="configuracoes.html"><i data-lucide="settings"></i> Configurações </a></li>
                    <li><a href="sobre.html"><i data-lucide="help-circle"></i> Sobre o Sistema </a></li>
                </ul>
                </div>
            </nav>
        </aside>
        </>
    )
}
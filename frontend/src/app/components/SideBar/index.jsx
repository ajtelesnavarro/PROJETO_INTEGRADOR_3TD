import "@/app/dashboard_global.css";
import "@/app/globals.css";

export default function SideBar() {
    return (
        <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i data-lucide="building-2" className="logo-icon"></i>
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
              <li className="active"><a href="index.html"><i data-lucide="layout-dashboard"></i> Dashboard </a></li>
              <li><a href="predio.html"><i data-lucide="building"></i> Prédios </a></li>
              <li><a href="#"><i data-lucide="layers"></i> Ambientes </a></li>
              <li><a href="dispositivos.html"><i data-lucide="cpu"></i> Dispositivos e Sensores </a></li>
              <li><a href="leituras.html"><i data-lucide="activity"></i> Leituras </a></li>
              <li><a href="controle_acessos.html"><i data-lucide="door-open"></i> Controle de Acessos </a></li>
              <li><a href="ocorrencias.html"><i data-lucide="alert-triangle"></i> Ocorrências <span className="badge">5</span></a></li>
              <li><a href="#"><i data-lucide="file-text"></i> Relatórios </a></li>
            </ul>
          </div>

          <div className="nav-section">
            <span className="section-title">ADMINISTRAÇÃO</span>
            <ul>
              <li><a href="usuario.html"><i data-lucide="users"></i> Usuários </a></li>
              <li><a href="configuracoes.html"><i data-lucide="settings"></i> Configurações </a></li>
              <li><a href="sobre.html"><i data-lucide="help-circle"></i> Sobre o Sistema </a></li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="status-item">
            <span className="status-dot green"></span>
            <span>Sistema operacional</span>
            <span className="status-ms">API - 32 ms</span>
          </div>
          <div className="eco-mode">
            <i data-lucide="leaf"></i>
            <span>Modo sustentável</span>
          </div>
          <button className="cookie-btn">Gerenciar cookies ou desativar</button>
        </div>
      </aside>
    );
  }
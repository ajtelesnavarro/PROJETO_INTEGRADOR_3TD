export default function VisitanteDashboard() {
  return (
      <div className="app-container">
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

        <main className="main-content">
          <header className="top-header">
            <div className="breadcrumb">
              <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
              <h1 className="title">Dashboard</h1>
            </div>

            <div className="header-actions">
              <div className="search-global">
                <i data-lucide="search"></i>
                <input type="text" placeholder="Buscar no sistema..." />
                  <kbd>⌘ K</kbd>
              </div>
              <button className="icon-btn"><i data-lucide="bell"></i></button>
              <div className="user-profile">
                <div className="avatar">MC</div>
                <div className="user-info">
                  <span className="user-name">Marina Costa</span>
                  <span className="user-role">Administrador</span>
                </div>
                <i data-lucide="chevron-down"></i>
              </div>
            </div>
          </header>

          <div className="content-body">
            <div className="page-title-bar">
              <div>
                <h2>Bom dia, Marina.</h2>
                <p>Acompanhe o desempenho dos seus edifícios em tempo real.</p>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card">
                <span className="card-title">Prédios cadastrados</span>
                <div className="card-value">04</div>
              </div>
              <div className="card">
                <span className="card-title">Ambientes monitorados</span>
                <div className="card-value">38</div>
              </div>
              <div className="card">
                <span className="card-title">Dispositivos online</span>
                <div className="card-value">126</div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
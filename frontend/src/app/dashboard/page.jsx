export default function dashoboard() {
    return (
        <main className="main-content">
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Dashboard</h1>
                </div>
                <div className="header-actions">
                <div className="search-global">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar no sistema..." />
                </div>
                <button className="icon-btn">
                    <i data-lucide="bell" />
                </button>
                <div className="user-profile">
                    <div className="avatar">MC</div>
                    <div className="user-info">
                    <span className="user-name">Marina Costa</span>
                    <span className="user-role">Administrador</span>
                    </div>
                    <i data-lucide="chevron-down" />
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
    )
}
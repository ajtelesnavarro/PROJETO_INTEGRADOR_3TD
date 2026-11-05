export default function dashoboard() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Dashboard</h1>
                </div>

                <div class="header-actions">
                <div class="search-global">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar no sistema..."/>
                </div>
                <button class="icon-btn"><i data-lucide="bell"></i></button>
                <div class="user-profile">
                    <div class="avatar">MC</div>
                    <div class="user-info">
                    <span class="user-name">Marina Costa</span>
                    <span class="user-role">Administrador</span>
                    </div>
                    <i data-lucide="chevron-down"></i>
                </div>
                </div>
            </header>

            <div class="content-body">
                <div class="page-title-bar">
                <div>
                    <h2>Bom dia, Marina.</h2>
                    <p>Acompanhe o desempenho dos seus edifícios em tempo real.</p>
                </div>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Prédios cadastrados</span>
                    <div class="card-value">04</div>
                </div>
                <div class="card">
                    <span class="card-title">Ambientes monitorados</span>
                    <div class="card-value">38</div>
                </div>
                <div class="card">
                    <span class="card-title">Dispositivos online</span>
                    <div class="card-value">126</div>
                </div>
                </div>
            </div>
        </main>
    )
}
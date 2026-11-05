export default function configuracoes() {
    return(
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Configurações</h1>
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
                    <h2>Configurações</h2>
                    <p>Configure os parâmetros e acompanhe as informações deste módulo.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Nova configuração
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Itens ativos</span>
                    <div class="card-value">24</div>
                </div>
                <div class="card">
                    <span class="card-title">Atualizados hoje</span>
                    <div class="card-value">08</div>
                </div>
                <div class="card">
                    <span class="card-title">Pendências</span>
                    <div class="card-value">02</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em configurações..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>ITEM</th>
                        <th>DESCRIÇÃO</th>
                        <th>ATUALIZAÇÃO</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">Limites operacionais</td>
                        <td class="text-muted">Temperatura, energia e iluminação</td>
                        <td class="text-muted">Hoje, 09:42</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Notificações</td>
                        <td class="text-muted">E-mail e alertas no sistema</td>
                        <td class="text-muted">Ontem, 16:20</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Integração REST</td>
                        <td class="text-muted">localhost:3001/api/v1</td>
                        <td class="text-muted">25 nov. 2025</td>
                        <td><span class="tag-status blue"><span class="dot"></span> Demonstração</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    </tbody>
                </table>

                <div class="table-footer">
                    <span class="footer-info">Mostrando 3 registros</span>
                    <div class="pagination">
                    <button class="page-btn" disabled>Anterior</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">Próxima</button>
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}
export default function usuarios() {
    return(
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Usuários</h1>
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
                    <h2>Usuários</h2>
                    <p>Administre usuários, perfis e permissões de acesso.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Novo usuário
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Usuários ativos</span>
                    <div class="card-value">48</div>
                </div>
                <div class="card">
                    <span class="card-title">Administradores</span>
                    <div class="card-value">04</div>
                </div>
                <div class="card">
                    <span class="card-title">Acessos hoje</span>
                    <div class="card-value">36</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em usuários..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>USUÁRIO</th>
                        <th>E-MAIL</th>
                        <th>PERFIL</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">Marina Costa</td>
                        <td class="text-muted">marina@lumora.com.br</td>
                        <td class="text-muted">Administrador</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Paulo Mendes</td>
                        <td class="text-muted">paulo@lumora.com.br</td>
                        <td class="text-muted">Manutenção</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Roberto Alves</td>
                        <td class="text-muted">roberto@lumora.com.br</td>
                        <td class="text-muted">Porteiro</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Beatriz Freitas</td>
                        <td class="text-muted">beatriz@lumora.com.br</td>
                        <td class="text-muted">Visitante</td>
                        <td><span class="tag-status green"><span class="dot"></span> Ativo</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    </tbody>
                </table>

                <div class="table-footer">
                    <span class="footer-info">Mostrando 4 registros</span>
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
export default function controle_de_acesso() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Controle de Acessos</h1>
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
                    <h2>Controle de Acessos</h2>
                    <p>Acompanhe entradas, saídas e autorizações em tempo real.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Registrar acesso
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Acessos hoje</span>
                    <div class="card-value">284</div>
                </div>
                <div class="card">
                    <span class="card-title">Presentes</span>
                    <div class="card-value">96</div>
                </div>
                <div class="card">
                    <span class="card-title">Negados</span>
                    <div class="card-value">03</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em controle de acessos..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>PESSOA</th>
                        <th>PERFIL</th>
                        <th>LOCAL</th>
                        <th>HORÁRIO</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">Marina Costa</td>
                        <td class="text-muted">Colaboradora</td>
                        <td class="text-muted">Portaria principal</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:42</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Rafael Lima</td>
                        <td class="text-muted">Visitante</td>
                        <td class="text-muted">Bloco A</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:36</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Paulo Mendes</td>
                        <td class="text-muted">Manutenção</td>
                        <td class="text-muted">Data Center</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:21</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Ana Souza</td>
                        <td class="text-muted">Colaboradora</td>
                        <td class="text-muted">Portaria principal</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:04</span></td>
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
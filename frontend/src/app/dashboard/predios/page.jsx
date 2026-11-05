export default function predios() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Prédios</h1>
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
                    <h2>Prédios</h2>
                    <p>Cadastre e acompanhe todas as unidades conectadas à plataforma.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Novo prédio
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Total de prédios</span>
                    <div class="card-value">04</div>
                </div>
                <div class="card">
                    <span class="card-title">Área monitorada</span>
                    <div class="card-value">18.240 m²</div>
                </div>
                <div class="card">
                    <span class="card-title">Operacionais</span>
                    <div class="card-value">04</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em prédios..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>PRÉDIO</th>
                        <th>ENDEREÇO</th>
                        <th>AMBIENTES</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">Unidade SENAI AAP</td>
                        <td class="text-muted">São Paulo, SP</td>
                        <td class="text-muted">18 ambientes</td>
                        <td><span class="tag-status green"><span class="dot"></span> Operacional</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Bloco Administrativo</td>
                        <td class="text-muted">São Paulo, SP</td>
                        <td class="text-muted">8 ambientes</td>
                        <td><span class="tag-status green"><span class="dot"></span> Operacional</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Centro de Treinamento</td>
                        <td class="text-muted">São Paulo, SP</td>
                        <td class="text-muted">7 ambientes</td>
                        <td><span class="tag-status green"><span class="dot"></span> Operacional</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">Anexo Técnico</td>
                        <td class="text-muted">São Paulo, SP</td>
                        <td class="text-muted">5 ambientes</td>
                        <td><span class="tag-status green"><span class="dot"></span> Operacional</span></td>
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
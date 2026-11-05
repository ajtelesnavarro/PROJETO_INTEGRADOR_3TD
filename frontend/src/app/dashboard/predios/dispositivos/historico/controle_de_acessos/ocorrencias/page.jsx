export default function ocorrencias() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Ocorrências</h1>
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
                    <h2>Ocorrências</h2>
                    <p>Registre, priorize e acompanhe incidentes operacionais.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Nova ocorrência
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Abertas</span>
                    <div class="card-value">05</div>
                </div>
                <div class="card">
                    <span class="card-title">Em atendimento</span>
                    <div class="card-value">03</div>
                </div>
                <div class="card">
                    <span class="card-title">Resolvidas no mês</span>
                    <div class="card-value">42</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em ocorrências..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>OCORRÊNCIA</th>
                        <th>LOCAL</th>
                        <th>RESPONSÁVEL</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">#OC-1042 · Temperatura elevada</td>
                        <td class="text-muted">Oficina Mecânica</td>
                        <td class="text-muted">Equipe HVAC</td>
                        <td><span class="tag-status green"><span class="dot"></span> Aberta</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">#OC-1041 · Consumo atípico</td>
                        <td class="text-muted">Data Center</td>
                        <td class="text-muted">Paulo Mendes</td>
                        <td><span class="tag-status green-light"><span class="dot"></span> Em Atendimento</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">#OC-1039 · Sensor desconectado</td>
                        <td class="text-muted">Sala 08</td>
                        <td class="text-muted">Carla Dias</td>
                        <td><span class="tag-status green-light"><span class="dot"></span> Em Atendimento</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">#OC-1034 · Acesso não autorizado</td>
                        <td class="text-muted">Bloco C</td>
                        <td class="text-muted">Segurança</td>
                        <td><span class="tag-status green-light"><span class="dot"></span> Resolvida</span></td>
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
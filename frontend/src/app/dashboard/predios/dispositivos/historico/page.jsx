export default function historico() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Histórico</h1>
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
                    <h2>Leituras</h2>
                    <p>Consulte o histórico consolidado de telemetria dos sensores.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Exportar leituras
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Leituras hoje</span>
                    <div class="card-value">18.492</div>
                </div>
                <div class="card">
                    <span class="card-title">Frequência média</span>
                    <div class="card-value">30 s</div>
                </div>
                <div class="card">
                    <span class="card-title">Última sincronização</span>
                    <div class="card-value">Agora</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em leituras..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>SENSOR</th>
                        <th>LEITURA</th>
                        <th>AMBIENTE</th>
                        <th>HORÁRIO</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">TMP-A203</td>
                        <td class="text-muted">24,2 °C</td>
                        <td class="text-muted">Lab. Eletrônica</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:48:32</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">NRG-DC01</td>
                        <td class="text-muted">42,4 kWh</td>
                        <td class="text-muted">Data Center</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:48:30</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">LUX-B108</td>
                        <td class="text-muted">680 lux</td>
                        <td class="text-muted">Sala 03</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:48:28</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">HUM-C002</td>
                        <td class="text-muted">54%</td>
                        <td class="text-muted">Oficina Mecânica</td>
                        <td><span class="tag-status green"><span class="dot"></span> 10:48:24</span></td>
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
export default function dispositivos() {
    return (
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Dispositivos e Sensores</h1>
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
                    <h2>Dispositivos e Sensores</h2>
                    <p>Gerencie dispositivos, conectividade e manutenção preventiva.</p>
                </div>
                <button class="btn-primary">
                    <i data-lucide="plus"></i> Adicionar dispositivo
                </button>
                </div>

                <div class="cards-grid">
                <div class="card">
                    <span class="card-title">Dispositivos</span>
                    <div class="card-value">130</div>
                </div>
                <div class="card">
                    <span class="card-title">Online</span>
                    <div class="card-value">126</div>
                </div>
                <div class="card">
                    <span class="card-title">Offline</span>
                    <div class="card-value">04</div>
                </div>
                </div>

                <div class="table-container">
                <div class="table-actions">
                    <div class="search-table">
                    <i data-lucide="search"></i>
                    <input type="text" placeholder="Buscar em dispositivos e sensores..."/>
                    </div>
                    <button class="btn-secondary">
                    <i data-lucide="sliders-horizontal"></i> Filtros
                    </button>
                </div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>DISPOSITIVO</th>
                        <th>TIPO</th>
                        <th>AMBIENTE</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="font-bold">TMP-A203</td>
                        <td class="text-muted">Temperatura</td>
                        <td class="text-muted">Lab. Eletrônica</td>
                        <td><span class="tag-status green"><span class="dot"></span> Online</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">NRG-DC01</td>
                        <td class="text-muted">Energia</td>
                        <td class="text-muted">Data Center</td>
                        <td><span class="tag-status green"><span class="dot"></span> Online</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">LUX-B108</td>
                        <td class="text-muted">Luminosidade</td>
                        <td class="text-muted">Sala 03</td>
                        <td><span class="tag-status amber"><span class="dot"></span> Atenção</span></td>
                        <td class="text-right"><button class="btn-icon-table"><i data-lucide="more-horizontal"></i></button></td>
                    </tr>
                    <tr>
                        <td class="font-bold">ACC-P001</td>
                        <td class="text-muted">Acesso</td>
                        <td class="text-muted">Portaria principal</td>
                        <td><span class="tag-status green"><span class="dot"></span> Online</span></td>
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
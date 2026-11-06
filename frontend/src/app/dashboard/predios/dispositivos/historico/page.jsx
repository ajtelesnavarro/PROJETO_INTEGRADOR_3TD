export default function historico() {
    return (
        <main className="main-content">
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Histórico</h1>
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
                    <h2>Leituras</h2>
                    <p>Consulte o histórico consolidado de telemetria dos sensores.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Exportar leituras
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Leituras hoje</span>
                    <div className="card-value">18.492</div>
                </div>
                <div className="card">
                    <span className="card-title">Frequência média</span>
                    <div className="card-value">30 s</div>
                </div>
                <div className="card">
                    <span className="card-title">Última sincronização</span>
                    <div className="card-value">Agora</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar em leituras..." />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>SENSOR</th>
                        <th>LEITURA</th>
                        <th>AMBIENTE</th>
                        <th>HORÁRIO</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">TMP-A203</td>
                        <td className="text-muted">24,2 °C</td>
                        <td className="text-muted">Lab. Eletrônica</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:48:32
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">NRG-DC01</td>
                        <td className="text-muted">42,4 kWh</td>
                        <td className="text-muted">Data Center</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:48:30
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">LUX-B108</td>
                        <td className="text-muted">680 lux</td>
                        <td className="text-muted">Sala 03</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:48:28
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">HUM-C002</td>
                        <td className="text-muted">54%</td>
                        <td className="text-muted">Oficina Mecânica</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:48:24
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="table-footer">
                    <span className="footer-info">Mostrando 4 registros</span>
                    <div className="pagination">
                    <button className="page-btn" disabled="">
                        Anterior
                    </button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">Próxima</button>
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}
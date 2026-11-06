export default function dispositivos() {
    return (
        <>
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Dispositivos e Sensores</h1>
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
                    <h2>Dispositivos e Sensores</h2>
                    <p>Gerencie dispositivos, conectividade e manutenção preventiva.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Adicionar dispositivo
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Dispositivos</span>
                    <div className="card-value">130</div>
                </div>
                <div className="card">
                    <span className="card-title">Online</span>
                    <div className="card-value">126</div>
                </div>
                <div className="card">
                    <span className="card-title">Offline</span>
                    <div className="card-value">04</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input
                        type="text"
                        placeholder="Buscar em dispositivos e sensores..."
                    />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>DISPOSITIVO</th>
                        <th>TIPO</th>
                        <th>AMBIENTE</th>
                        <th>STATUS</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">TMP-A203</td>
                        <td className="text-muted">Temperatura</td>
                        <td className="text-muted">Lab. Eletrônica</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Online
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
                        <td className="text-muted">Energia</td>
                        <td className="text-muted">Data Center</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Online
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
                        <td className="text-muted">Luminosidade</td>
                        <td className="text-muted">Sala 03</td>
                        <td>
                        <span className="tag-status amber">
                            <span className="dot" /> Atenção
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">ACC-P001</td>
                        <td className="text-muted">Acesso</td>
                        <td className="text-muted">Portaria principal</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Online
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
        </>
    )
}
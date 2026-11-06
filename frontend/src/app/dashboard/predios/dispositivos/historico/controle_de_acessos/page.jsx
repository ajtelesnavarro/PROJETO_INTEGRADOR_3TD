export default function controle_de_acesso() {
    return (
        <>
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Controle de Acessos</h1>
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
                    <h2>Controle de Acessos</h2>
                    <p>Acompanhe entradas, saídas e autorizações em tempo real.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Registrar acesso
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Acessos hoje</span>
                    <div className="card-value">284</div>
                </div>
                <div className="card">
                    <span className="card-title">Presentes</span>
                    <div className="card-value">96</div>
                </div>
                <div className="card">
                    <span className="card-title">Negados</span>
                    <div className="card-value">03</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar em controle de acessos..." />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>PESSOA</th>
                        <th>PERFIL</th>
                        <th>LOCAL</th>
                        <th>HORÁRIO</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">Marina Costa</td>
                        <td className="text-muted">Colaboradora</td>
                        <td className="text-muted">Portaria principal</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:42
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Rafael Lima</td>
                        <td className="text-muted">Visitante</td>
                        <td className="text-muted">Bloco A</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:36
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Paulo Mendes</td>
                        <td className="text-muted">Manutenção</td>
                        <td className="text-muted">Data Center</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:21
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Ana Souza</td>
                        <td className="text-muted">Colaboradora</td>
                        <td className="text-muted">Portaria principal</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> 10:04
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
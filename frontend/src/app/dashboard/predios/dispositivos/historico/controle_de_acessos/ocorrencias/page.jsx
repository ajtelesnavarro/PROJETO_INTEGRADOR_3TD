export default function ocorrencias() {
    return (
        <main className="main-content">
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Ocorrências</h1>
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
                    <h2>Ocorrências</h2>
                    <p>Registre, priorize e acompanhe incidentes operacionais.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Nova ocorrência
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Abertas</span>
                    <div className="card-value">05</div>
                </div>
                <div className="card">
                    <span className="card-title">Em atendimento</span>
                    <div className="card-value">03</div>
                </div>
                <div className="card">
                    <span className="card-title">Resolvidas no mês</span>
                    <div className="card-value">42</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar em ocorrências..." />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>OCORRÊNCIA</th>
                        <th>LOCAL</th>
                        <th>RESPONSÁVEL</th>
                        <th>STATUS</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">#OC-1042 · Temperatura elevada</td>
                        <td className="text-muted">Oficina Mecânica</td>
                        <td className="text-muted">Equipe HVAC</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Aberta
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">#OC-1041 · Consumo atípico</td>
                        <td className="text-muted">Data Center</td>
                        <td className="text-muted">Paulo Mendes</td>
                        <td>
                        <span className="tag-status green-light">
                            <span className="dot" /> Em Atendimento
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">#OC-1039 · Sensor desconectado</td>
                        <td className="text-muted">Sala 08</td>
                        <td className="text-muted">Carla Dias</td>
                        <td>
                        <span className="tag-status green-light">
                            <span className="dot" /> Em Atendimento
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">#OC-1034 · Acesso não autorizado</td>
                        <td className="text-muted">Bloco C</td>
                        <td className="text-muted">Segurança</td>
                        <td>
                        <span className="tag-status green-light">
                            <span className="dot" /> Resolvida
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
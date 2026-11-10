export default function configuracoes() {
    return(
        <>
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Configurações</h1>
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
                    <h2>Configurações</h2>
                    <p>Configure os parâmetros e acompanhe as informações deste módulo.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Nova configuração
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Itens ativos</span>
                    <div className="card-value">24</div>
                </div>
                <div className="card">
                    <span className="card-title">Atualizados hoje</span>
                    <div className="card-value">08</div>
                </div>
                <div className="card">
                    <span className="card-title">Pendências</span>
                    <div className="card-value">02</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar em configurações..." />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ITEM</th>
                        <th>DESCRIÇÃO</th>
                        <th>ATUALIZAÇÃO</th>
                        <th>STATUS</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">Limites operacionais</td>
                        <td className="text-muted">Temperatura, energia e iluminação</td>
                        <td className="text-muted">Hoje, 09:42</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Ativo
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Notificações</td>
                        <td className="text-muted">E-mail e alertas no sistema</td>
                        <td className="text-muted">Ontem, 16:20</td>
                        <td>
                        <span className="tag-status green">
                            <span className="dot" /> Ativo
                        </span>
                        </td>
                        <td className="text-right">
                        <button className="btn-icon-table">
                            <i data-lucide="more-horizontal" />
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Integração REST</td>
                        <td className="text-muted">localhost:3001/api/v1</td>
                        <td className="text-muted">25 nov. 2025</td>
                        <td>
                        <span className="tag-status blue">
                            <span className="dot" /> Demonstração
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
                    <span className="footer-info">Mostrando 3 registros</span>
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
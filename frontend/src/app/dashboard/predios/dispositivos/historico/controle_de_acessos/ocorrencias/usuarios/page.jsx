export default function usuarios() {
    return(
        <>
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Usuários</h1>
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
                    <h2>Usuários</h2>
                    <p>Administre usuários, perfis e permissões de acesso.</p>
                </div>
                <button className="btn-primary">
                    <i data-lucide="plus" /> Novo usuário
                </button>
                </div>
                <div className="cards-grid">
                <div className="card">
                    <span className="card-title">Usuários ativos</span>
                    <div className="card-value">48</div>
                </div>
                <div className="card">
                    <span className="card-title">Administradores</span>
                    <div className="card-value">04</div>
                </div>
                <div className="card">
                    <span className="card-title">Acessos hoje</span>
                    <div className="card-value">36</div>
                </div>
                </div>
                <div className="table-container">
                <div className="table-actions">
                    <div className="search-table">
                    <i data-lucide="search" />
                    <input type="text" placeholder="Buscar em usuários..." />
                    </div>
                    <button className="btn-secondary">
                    <i data-lucide="sliders-horizontal" /> Filtros
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>USUÁRIO</th>
                        <th>E-MAIL</th>
                        <th>PERFIL</th>
                        <th>STATUS</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold">Marina Costa</td>
                        <td className="text-muted">marina@lumora.com.br</td>
                        <td className="text-muted">Administrador</td>
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
                        <td className="font-bold">Paulo Mendes</td>
                        <td className="text-muted">paulo@lumora.com.br</td>
                        <td className="text-muted">Manutenção</td>
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
                        <td className="font-bold">Roberto Alves</td>
                        <td className="text-muted">roberto@lumora.com.br</td>
                        <td className="text-muted">Porteiro</td>
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
                        <td className="font-bold">Beatriz Freitas</td>
                        <td className="text-muted">beatriz@lumora.com.br</td>
                        <td className="text-muted">Visitante</td>
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
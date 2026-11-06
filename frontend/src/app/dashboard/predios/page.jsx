export default function predios() {
    return (
        <>
            <header className="top-header">
                <div className="breadcrumb">
                    <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                    <h1 className="title">Prédios</h1>
                </div>
                <div className="header-actions">
                    <div className="search-global">
                        <i data-lucide="search" />
                        <input type="text" placeholder="Buscar no sistema..." />
                    </div>
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
                        <h2>Prédios</h2>
                        <p>Cadastre e acompanhe todas as unidades conectadas à plataforma.</p>
                    </div>
                    <button className="btn-primary">
                        <i data-lucide="plus" /> Novo prédio
                    </button>
                    </div>
                    <div className="cards-grid">
                    <div className="card">
                        <span className="card-title">Total de prédios</span>
                        <div className="card-value">04</div>
                    </div>
                    <div className="card">
                        <span className="card-title">Área monitorada</span>
                        <div className="card-value">18.240 m²</div>
                    </div>
                    <div className="card">
                        <span className="card-title">Operacionais</span>
                        <div className="card-value">04</div>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-actions">
                        <div className="search-table">
                        <i data-lucide="search" />
                        <input type="text" placeholder="Buscar em prédios..." />
                        </div>
                        <button className="btn-secondary">
                        <i data-lucide="sliders-horizontal" /> Filtros
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>PRÉDIO</th>
                            <th>ENDEREÇO</th>
                            <th>AMBIENTES</th>
                            <th>STATUS</th>
                            <th />
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="font-bold">Unidade SENAI AAP</td>
                            <td className="text-muted">São Paulo, SP</td>
                            <td className="text-muted">18 ambientes</td>
                            <td>
                            <span className="tag-status green">
                                <span className="dot" /> Operacional
                            </span>
                            </td>
                            <td className="text-right">
                            <button className="btn-icon-table">
                                <i data-lucide="more-horizontal" />
                            </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Bloco Administrativo</td>
                            <td className="text-muted">São Paulo, SP</td>
                            <td className="text-muted">8 ambientes</td>
                            <td>
                            <span className="tag-status green">
                                <span className="dot" /> Operacional
                            </span>
                            </td>
                            <td className="text-right">
                            <button className="btn-icon-table">
                                <i data-lucide="more-horizontal" />
                            </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Centro de Treinamento</td>
                            <td className="text-muted">São Paulo, SP</td>
                            <td className="text-muted">7 ambientes</td>
                            <td>
                            <span className="tag-status green">
                                <span className="dot" /> Operacional
                            </span>
                            </td>
                            <td className="text-right">
                            <button className="btn-icon-table">
                                <i data-lucide="more-horizontal" />
                            </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Anexo Técnico</td>
                            <td className="text-muted">São Paulo, SP</td>
                            <td className="text-muted">5 ambientes</td>
                            <td>
                            <span className="tag-status green">
                                <span className="dot" /> Operacional
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
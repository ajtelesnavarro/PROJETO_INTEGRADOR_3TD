export default function sobre() {
    return(
        <>
            <header className="top-header">
                <div className="breadcrumb">
                <span className="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 className="title">Sobre o Sistema</h1>
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
                <div className="center-content">
                <div className="about-card">
                    <div className="brand-logo">
                    <i data-lucide="building-2" className="brand-icon" />
                    <h2>LUMORA</h2>
                    <span>EDIFÍCIOS INTELIGENTES</span>
                    </div>
                    <span className="version-tag">VERSÃO ACADÊMICA 1.0</span>
                    <div className="about-description">
                    <h1>Tecnologia para edifícios mais inteligentes e sustentáveis.</h1>
                    <p>
                        O Lumora SmartBuilding é um sistema de monitoramento e gerenciamento
                        desenvolvido para o Projeto Integrador do curso Técnico em
                        Desenvolvimento de Sistemas.
                    </p>
                    </div>
                    <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                        <i data-lucide="shield-check" />
                        </div>
                        <h3>Segurança</h3>
                        <p>Controle de acessos e alertas críticos em tempo real.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                        <i data-lucide="leaf" />
                        </div>
                        <h3>Sustentabilidade</h3>
                        <p>Indicadores para reduzir consumo e impacto ambiental.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                        <i data-lucide="gauge" />
                        </div>
                        <h3>Eficiência</h3>
                        <p>Dados operacionais para decisões rápidas e precisas.</p>
                    </div>
                    </div>
                    <div className="about-footer">
                    <span>
                        SENAI Armando de Arruda Pereira · Técnico em Desenvolvimento de
                        Sistemas · 2025
                    </span>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}
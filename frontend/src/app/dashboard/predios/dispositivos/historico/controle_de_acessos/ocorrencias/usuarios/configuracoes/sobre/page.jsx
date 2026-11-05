export default function sobre() {
    return(
        <main class="main-content">
            <header class="top-header">
                <div class="breadcrumb">
                <span class="subtitle">MONITORAMENTO INTELIGENTE</span>
                <h1 class="title">Sobre o Sistema</h1>
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
                <div class="center-content">
                <div class="about-card">
                    <div class="brand-logo">
                    <i data-lucide="building-2" class="brand-icon"></i>
                    <h2>LUMORA</h2>
                    <span>EDIFÍCIOS INTELIGENTES</span>
                    </div>
                    <span class="version-tag">VERSÃO ACADÊMICA 1.0</span>

                    <div class="about-description">
                    <h1>Tecnologia para edifícios mais inteligentes e sustentáveis.</h1>
                    <p>
                        O Lumora SmartBuilding é um sistema de monitoramento e gerenciamento desenvolvido para o Projeto Integrador do curso Técnico em Desenvolvimento de Sistemas.
                    </p>
                    </div>

                    <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon"><i data-lucide="shield-check"></i></div>
                        <h3>Segurança</h3>
                        <p>Controle de acessos e alertas críticos em tempo real.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon"><i data-lucide="leaf"></i></div>
                        <h3>Sustentabilidade</h3>
                        <p>Indicadores para reduzir consumo e impacto ambiental.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon"><i data-lucide="gauge"></i></div>
                        <h3>Eficiência</h3>
                        <p>Dados operacionais para decisões rápidas e precisas.</p>
                    </div>
                    </div>

                    <div class="about-footer">
                    <span>SENAI Armando de Arruda Pereira · Técnico em Desenvolvimento de Sistemas · 2025</span>
                    </div>
                </div>
                </div>
            </div>
        </main>
    )
}
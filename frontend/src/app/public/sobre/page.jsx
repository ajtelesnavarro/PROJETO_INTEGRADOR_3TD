import Link from "next/link";
import "./sobre.css";

export default function Sobre() {
  return (
    <>
      <section className="inner-hero about-hero">
        <div className="container inner-hero-grid">
          <div>
            <div className="pill"><span className="pulse"></span> A LUMORA</div>
            <h1>Edifícios mais inteligentes. <em>Um futuro mais eficiente.</em></h1>
          </div>
          <p>A Lumora conecta tecnologia, pessoas e infraestrutura para transformar a maneira como os edifícios são acompanhados, operados e evoluem.</p>
        </div>
      </section>

      <section className="about-image-section">
        <div className="container">
          <div className="about-image">
            <div className="about-image-shade"></div>
            <div className="about-image-copy">
              <span>TECNOLOGIA A SERVIÇO DOS ESPAÇOS</span>
              <h2>O futuro da gestão predial acontece agora.</h2>
            </div>
            <div className="about-image-note"><b>01 / 03</b><span>Conectividade · Eficiência · Inteligência</span></div>
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-grid">
          <div>
            <div className="section-kicker">01 — NOSSA HISTÓRIA</div>
            <h2>Uma nova perspectiva para <span>cada edifício.</span></h2>
          </div>
          <div>
            <p>A Lumora nasceu com uma ideia simples: edifícios podem funcionar melhor quando as informações certas estão disponíveis no momento certo. Por isso, desenvolvemos uma proposta que aproxima tecnologia e operação, tornando a gestão mais clara e integrada.</p>
            <p>Reunimos dados de sensores, energia, ambientes, acessos e ocorrências em uma visão centralizada. Assim, equipes conseguem acompanhar o que acontece, identificar oportunidades e agir com mais segurança.</p>
            <p>Mais do que conectar dispositivos, queremos ajudar pessoas a tomar decisões melhores sobre os espaços que utilizam e administram todos os dias.</p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container mission-grid">
          <article className="mission-card mission-main">
            <span>02 — NOSSO PROPÓSITO</span>
            <h2>Dar inteligência aos espaços para melhorar a experiência de quem vive e trabalha neles.</h2>
          </article>
          <article className="mission-card">
            <div className="mission-icon">◎</div>
            <span>MISSÃO</span>
            <h3>Simplificar a gestão</h3>
            <p>Transformar dados operacionais em informações acessíveis que apoiem decisões mais rápidas e conscientes.</p>
          </article>
          <article className="mission-card">
            <div className="mission-icon">↗</div>
            <span>VISÃO</span>
            <h3>Construir o amanhã</h3>
            <p>Contribuir para edifícios conectados, eficientes, seguros e preparados para os desafios do futuro.</p>
          </article>
        </div>
      </section>

      <section className="values-dark">
        <div className="container">
          <div className="section-kicker light">03 — O QUE NOS MOVE</div>
          <h2 className="values-heading">Princípios que orientam<br/>cada conexão.</h2>
          <div className="values-grid">
            <Value n="01" title="Clareza" text="Informações complexas apresentadas de forma simples, visual e objetiva." />
            <Value n="02" title="Eficiência" text="Tecnologia que ajuda a identificar oportunidades e reduzir desperdícios." />
            <Value n="03" title="Segurança" text="Acompanhamento organizado para apoiar ambientes mais confiáveis." />
            <Value n="04" title="Inovação" text="Evolução constante para acompanhar as necessidades de cada operação." />
          </div>
        </div>
      </section>

      <section className="section about-platform">
        <div className="container">
          <div className="section-kicker">04 — COMO GERAMOS VALOR</div>
          <div className="platform-heading">
            <h2>Uma visão completa da operação.</h2>
            <p>Uma plataforma pensada para aproximar dados, equipes e decisões em uma única experiência.</p>
          </div>
          <div className="platform-grid">
            <Platform n="01" title="Conectar" text="Integração de dispositivos, sensores e sistemas para reunir informações do edifício." icon="⌁"/>
            <Platform n="02" title="Compreender" text="Indicadores e históricos que ajudam a entender padrões e identificar mudanças." icon="◉"/>
            <Platform n="03" title="Agir" text="Acompanhamento de alertas e ocorrências para apoiar uma rotina mais organizada." icon="↗"/>
          </div>
        </div>
      </section>

      <section className="section audience-section">
        <div className="container audience">
          <div><div className="section-kicker">05 — FEITA PARA PESSOAS</div><h2>Tecnologia que aproxima toda a equipe.</h2><p className="audience-copy">Cada pessoa tem uma responsabilidade diferente na operação. A Lumora organiza as informações para que cada perfil acompanhe o que é importante.</p></div>
          <div className="roles">
            <span>Administrador <small>Visão geral e indicadores</small></span>
            <span>Manutenção <small>Alertas e ocorrências</small></span>
            <span>Portaria <small>Controle e acompanhamento</small></span>
            <span>Gestão <small>Dados para decisões</small></span>
          </div>
        </div>
      </section>

      <section className="section centered-cta">
        <div className="container">
          <div className="section-kicker">06 — VAMOS CONVERSAR?</div>
          <h2>Seu edifício pode ir mais longe.</h2>
          <p>Descubra como a inteligência conectada pode transformar a rotina da sua operação.</p>
          <Link href="/orcamento" className="button primary">Conhecer nossas soluções →</Link>
        </div>
      </section>
    </>
  );
}

function Value({ n, title, text }) {
  return <article className="value"><span>{n}</span><h3>{title}</h3><p>{text}</p></article>;
}

function Platform({ n, title, text, icon }) {
  return <article className="platform-card"><span className="platform-number">{n}</span><div className="platform-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>;
}

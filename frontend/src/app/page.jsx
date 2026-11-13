import Link from "next/link";
import Reveal from "@/components/animations/Reveal";

export default async function Home() {
  return (
    <>
      <section className="hero hero-video">
        <video
          className="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85"
          aria-hidden="true"
        >
          <source src="https://videos.pexels.com/video-files/6775051/6775051-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="container hero-layout">
          <Reveal className="hero-copy">
            <div className="pill"><span className="pulse"></span> SMART BUILDING, REIMAGINED</div>
            <h1>O futuro do seu edifício <em>começa aqui.</em></h1>
            <p>
              Uma plataforma inteligente para conectar ambientes, dispositivos,
              energia, acessos e ocorrências em uma visão única.
            </p>
            <div className="hero-buttons">
              <Link href="/orcamento" className="button primary">Começar um projeto <span>→</span></Link>
              <Link href="/sobre" className="button secondary">Conhecer a Lumora <span>↗</span></Link>
            </div>
            <div className="trusted">
              <span>Feito para operações mais inteligentes</span>
              <div className="trust-line"><i></i><i></i><i></i><i></i><i></i></div>
            </div>
          </Reveal>


        </div>
      </section>

      <section className="ticker">
        <div className="ticker-track">
          <span>MONITORAMENTO</span><b>✦</b><span>ENERGIA</span><b>✦</b><span>IOT</span><b>✦</b>
          <span>AUTOMAÇÃO</span><b>✦</b><span>SEGURANÇA</span><b>✦</b><span>SMART BUILDING</span><b>✦</b>
          <span>MONITORAMENTO</span><b>✦</b><span>ENERGIA</span><b>✦</b><span>IOT</span>
        </div>
      </section>

      <section className="section intro">
        <div className="container">
          <div className="section-kicker">01 — UMA NOVA FORMA DE GERENCIAR</div>
          <div className="intro-grid">
            <h2>Não basta ter dados.<br /><span>É preciso entendê-los.</span></h2>
            <div>
              <p className="lead">A Lumora transforma informações espalhadas pelo edifício em uma experiência de gestão clara, centralizada e inteligente.</p>
              <Link href="/sobre" className="under-link">Conheça nossa visão <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bento-section">
        <div className="container">
          <div className="section-heading">
            <div><div className="section-kicker">02 — ECOSSISTEMA</div><h2>Tudo conectado.<br />Tudo sob controle.</h2></div>
            <p>Do sensor ao painel, o Lumora cria uma camada inteligente sobre a operação do seu edifício.</p>
          </div>

          <div className="bento">
            <article className="bento-card bento-large dark">
              <div className="card-number">01</div>
              <div className="visual-radar"><div className="radar-circle c1"></div><div className="radar-circle c2"></div><div className="radar-circle c3"></div><span className="radar-core"></span><span className="radar-point p1"></span><span className="radar-point p2"></span><span className="radar-point p3"></span></div>
              <div className="bottom-copy"><span>MONITORAMENTO EM TEMPO REAL</span><h3>Veja o que acontece<br />enquanto acontece.</h3></div>
            </article>

            <article className="bento-card energy">
              <div className="card-number">02</div>
              <span className="small-label">ENERGIA</span>
              <div className="energy-value">−18<span>%</span></div>
              <p>Potencial de redução<br />no consumo.</p>
              <div className="energy-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            </article>

            <article className="bento-card incidents">
              <div className="card-number">03</div>
              <span className="small-label">OCORRÊNCIAS</span>
              <div className="incident-row"><span className="incident-icon">!</span><div><b>Sensor de temperatura</b><small>Em atendimento</small></div><span className="arrow">↗</span></div>
              <div className="incident-row"><span className="incident-icon green-bg">✓</span><div><b>Iluminação · Sala 04</b><small>Resolvida</small></div><span className="arrow">↗</span></div>
            </article>

            <article className="bento-card access">
              <div className="card-number">04</div>
              <div className="access-content"><span className="small-label">ACESSOS</span><strong>1.284</strong><p>eventos registrados</p></div>
              <div className="access-orbit"><span>✓</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section architecture">
        <div className="container">
          <div className="section-kicker">03 — COMO FUNCIONA</div>
          <div className="architecture-grid">
            <div><h2>Uma arquitetura pensada para crescer junto com seu edifício.</h2><p>O sistema organiza ambientes, dispositivos, leituras, acessos e ocorrências em uma estrutura preparada para evolução.</p><Link href="/orcamento" className="button primary">Falar com a Lumora →</Link></div>
            <div className="layers">
              <div className="layer active"><span>01</span><div><b>Dados</b><small>Temperatura · iluminação · energia · acessos</small></div><i>↗</i></div>
              <div className="layer"><span>02</span><div><b>Inteligência</b><small>Alertas · histórico · indicadores · análise</small></div><i>↗</i></div>
              <div className="layer"><span>03</span><div><b>Decisão</b><small>Ocorrências · manutenção · gestão operacional</small></div><i>↗</i></div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics">
        <div className="container metrics-grid">
          <div><strong>01</strong><span>plataforma centralizada</span></div>
          <div><strong>04</strong><span>perfis de acesso</span></div>
          <div><strong>24/7</strong><span>visão operacional</span></div>
          <div><strong>100%</strong><span>responsiva</span></div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-box">
          <div className="cta-glow"></div>
          <div className="section-kicker light">04 — PRÓXIMO PASSO</div>
          <h2>Seu edifício já tem futuro.<br /><em>Agora dê inteligência a ele.</em></h2>
          <p>Conte para a Lumora o que você quer transformar.</p>
          <Link href="/orcamento" className="button white">Solicitar orçamento <span>→</span></Link>
        </div>
      </section>
    </>
  );
}
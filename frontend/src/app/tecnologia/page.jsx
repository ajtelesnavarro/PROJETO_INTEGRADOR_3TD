"use client";

import Link from "next/link";
import "./tecnologia.css";

const layers = [
  { n: "01", title: "Dispositivos e sensores", text: "A base física do edifício: equipamentos, medidores e sensores que podem fornecer informações sobre os ambientes e a infraestrutura.", icon: "⌁", tags: ["Sensores", "Medidores", "Equipamentos"] },
  { n: "02", title: "Conectividade e integração", text: "Uma camada para reunir informações de diferentes sistemas. As integrações são definidas conforme os recursos e protocolos disponíveis em cada projeto.", icon: "⌘", tags: ["Integrações", "Conectividade", "Compatibilidade"] },
  { n: "03", title: "Plataforma e inteligência", text: "Os dados são organizados em uma visão centralizada, com indicadores, históricos e regras que ajudam a transformar sinais em contexto.", icon: "◈", tags: ["Dados", "Indicadores", "Regras"] },
  { n: "04", title: "Experiência e decisões", text: "Informações apresentadas de forma clara para que gestores e equipes acompanhem a operação e identifiquem onde agir.", icon: "↗", tags: ["Painéis", "Alertas", "Relatórios"] },
];
const pillars = [
  ["Integração por projeto", "Cada edifício tem uma infraestrutura própria. Por isso, avaliamos os sistemas existentes antes de definir como conectar e apresentar os dados."],
  ["Dados com contexto", "Um número isolado diz pouco. Histórico, identificação do ambiente e indicadores ajudam a interpretar o que está acontecendo."],
  ["Acesso organizado", "A experiência pode ser estruturada por perfis e responsabilidades, respeitando as regras de acesso definidas para cada operação."],
  ["Evolução contínua", "A arquitetura permite começar pelas prioridades mais relevantes e ampliar o escopo conforme as necessidades e integrações do edifício."],
];

export default function Tecnologia() {
  return (
    <main className="technology-page">
    <section className="technology-hero">
      <div className="tech-hero-glow" />
      <div className="container tech-hero-grid">
        <div className="tech-hero-copy">
          <div className="pill dark-pill"><span className="pulse"/> POR DENTRO DA LUMORA</div>
          <h1>Tecnologia que conecta o edifício à <em>inteligência.</em></h1>
          <p>Uma arquitetura pensada para aproximar infraestrutura, dados e pessoas. A Lumora organiza informações prediais em uma experiência integrada, clara e preparada para evoluir.</p>
          <div className="hero-buttons"><Link href="/orcamento" className="button white">Fale com nosso time <span>↗</span></Link><a href="#arquitetura" className="button tech-outline">Conheça a arquitetura ↓</a></div>
          <div className="tech-hero-foot"><span><i/> CONECTIVIDADE</span><span><i/> VISIBILIDADE</span><span><i/> CONTROLE</span></div>
        </div>
        <div className="tech-atom" aria-label="Ilustração conceitual de um átomo, representando sistemas conectados">
          <div className="atom-spin">
            {[0, 1, 2].map((i) => (
              <div className={`atom-orbit atom-orbit-${i + 1}`} style={{ "--d": `${3 + i * 0.7}s` }} key={i}>
                <div className="atom-ring" />
                <div className="electron-set"><div className="electron-x"><div className="electron-y"><span className="electron" /></div></div></div>
                <div className="electron-set second"><div className="electron-x"><div className="electron-y"><span className="electron" /></div></div></div>
              </div>
            ))}
          </div>
          <div className="atom-core">
          </div>
        </div>
      </div>
    </section>

    <section className="tech-manifesto section"><div className="container tech-manifesto-grid"><div><div className="section-kicker">01 — NOSSA VISÃO DE TECNOLOGIA</div><h2>Não é sobre ter mais sistemas. É sobre <em>fazer tudo conversar.</em></h2></div><div><p>Edifícios inteligentes dependem de informações que normalmente estão distribuídas entre equipamentos, plataformas e equipes. A tecnologia da Lumora parte do princípio de que uma visão integrada facilita o acompanhamento e dá mais contexto às decisões.</p><p className="tech-note">A arquitetura e as integrações são dimensionadas de acordo com a infraestrutura e os objetivos de cada edifício.</p></div></div></section>

    <section className="tech-architecture" id="arquitetura"><div className="container"><div className="section-heading"><div><div className="section-kicker">02 — COMO A TECNOLOGIA SE ORGANIZA</div><h2>Quatro camadas.<br/><span>Uma visão integrada.</span></h2></div><p>Uma representação conceitual do caminho que transforma informações da infraestrutura em recursos úteis para a gestão.</p></div>
      <div className="architecture-layout"><div className="architecture-stack">{layers.map((item,i)=><article className={`architecture-layer layer-${i+1}`} key={item.n}><div className="layer-icon">{item.icon}</div><div className="layer-copy"><h3>{item.title}</h3><p>{item.text}</p><div className="solution-tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div></div>
    </div></section>

    <section className="tech-pillars section"><div className="container"><div className="section-kicker">03 — PRINCÍPIOS DA PLATAFORMA</div><div className="tech-pillars-heading"><h2>Uma base tecnológica<br/><em>feita para evoluir.</em></h2><p>Mais do que conectar dispositivos, uma solução inteligente precisa ser compreensível, adaptável e alinhada à realidade de quem opera o edifício.</p></div><div className="tech-pillars-grid">{pillars.map(([title,text],i)=><article key={title}><span>0{i+1}</span><div className="pillar-symbol">{["⌘","◉","◇","↗"][i]}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="tech-security"><div className="container security-grid"><div className="security-visual"><div className="security-orbit orbit-1"/><div className="security-orbit orbit-2"/><div className="security-shield">◇<small>DATA CARE</small></div><span className="security-chip chip-a">ACESSO</span><span className="security-chip chip-b">CONTEXTO</span><span className="security-chip chip-c">GESTÃO</span></div><div className="security-copy"><div className="section-kicker">04 — CONFIANÇA E GOVERNANÇA</div><h2>Informação organizada. <em>Gestão responsável.</em></h2><p>Uma operação conectada também precisa de critérios claros para lidar com informações e acessos. Por isso, cada projeto deve considerar responsabilidades, permissões e boas práticas adequadas ao ambiente.</p><ul><li><span>✓</span> Definição de perfis e responsabilidades</li><li><span>✓</span> Organização dos acessos à plataforma</li><li><span>✓</span> Integrações avaliadas conforme cada infraestrutura</li><li><span>✓</span> Transparência sobre dados e funcionalidades disponíveis</li></ul><small className="security-disclaimer">Os recursos efetivos de segurança e governança dependem do escopo, das integrações e da configuração contratada para cada projeto.</small></div></div></section>

    <section className="tech-cta section"><div className="container"><div className="section-kicker">05 — TECNOLOGIA APLICADA À SUA REALIDADE</div><h2>Seu edifício tem uma estrutura única.<br/><em>A tecnologia também pode ser.</em></h2><p>Vamos entender sua infraestrutura, seus desafios e as possibilidades de integração.</p><Link href="/orcamento" className="button primary">Converse com a Lumora <span>→</span></Link></div></section>
  </main>
  )
}

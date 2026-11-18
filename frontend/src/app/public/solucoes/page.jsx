"use client";

import Link from "next/link";
import Image from "next/image";
import "./solucoes.css";

const solutions = [
  {
    n: "01",
    icon: "◉",
    title: "Monitoramento inteligente",
    text: "Acompanhe em uma visão centralizada as condições dos ambientes, dispositivos e sistemas conectados.",
    tags: ["Sensores", "Status", "Histórico"],
  },
  {
    n: "02",
    icon: "ϟ",
    title: "Gestão de energia",
    text: "Visualize padrões de consumo, identifique variações e encontre oportunidades para uma operação mais eficiente.",
    tags: ["Consumo", "Indicadores", "Eficiência"],
  },
  {
    n: "03",
    icon: "⌁",
    title: "Automação de ambientes",
    text: "Organize regras e rotinas para apoiar o controle de iluminação, climatização e outros recursos prediais.",
    tags: ["Rotinas", "Integrações", "Conforto"],
  },
  {
    n: "04",
    icon: "◇",
    title: "Controle de acessos",
    text: "Centralize eventos e informações de acesso para facilitar o acompanhamento e a gestão da segurança.",
    tags: ["Eventos", "Permissões", "Rastreabilidade"],
  },
  {
    n: "05",
    icon: "!",
    title: "Alertas e ocorrências",
    text: "Tenha visibilidade sobre eventos importantes, acompanhe o andamento e organize o tratamento de ocorrências.",
    tags: ["Alertas", "Prioridades", "Acompanhamento"],
  },
  {
    n: "06",
    icon: "▤",
    title: "Relatórios e indicadores",
    text: "Transforme registros operacionais em informações claras para apoiar análises e decisões do dia a dia.",
    tags: ["Relatórios", "Dados", "Decisão"],
  },
];

const steps = [
  [
    "01",
    "Conectar",
    "Mapeamos os sistemas, dispositivos e informações relevantes para a operação.",
  ],
  [
    "02",
    "Centralizar",
    "Organizamos os dados em uma experiência única, clara e fácil de acompanhar.",
  ],
  [
    "03",
    "Evoluir",
    "Acompanhamos indicadores e oportunidades para aprimorar a gestão continuamente.",
  ],
];

const faqs = [
  [
    "A Lumora funciona em qualquer edifício?",
    "A proposta pode ser adaptada a diferentes tipos de edifícios, considerando a infraestrutura, os sistemas existentes e os objetivos de cada operação.",
  ],
  [
    "É possível integrar equipamentos que já existem?",
    "A possibilidade depende dos protocolos, fabricantes e interfaces disponíveis em cada equipamento. O levantamento técnico identifica as integrações viáveis.",
  ],
  [
    "Quais informações podem ser acompanhadas?",
    "Conforme os dispositivos e integrações disponíveis, podem ser acompanhados dados de ambiente, energia, status de equipamentos, acessos e ocorrências.",
  ],
  [
    "Como começo um projeto?",
    "Envie uma solicitação pela página de orçamento. Com as informações iniciais, é possível entender o cenário e definir os próximos passos de avaliação.",
  ],
];

export default function Solucoes() {
  return (
    <main>
      {/* HERO */}
      <section className="solutions-hero">
        <div className="container solutions-hero-grid">
          <div className="solutions-hero-content">
            <div className="pill">
              <span className="pulse" />
              ECOSSISTEMA LUMORA
            </div>

            <h1>
              Seu edifício, conectado a uma{" "}
              <em>operação mais inteligente.</em>
            </h1>

            <p>
              Uma visão integrada para acompanhar ambientes, energia, acessos
              e ocorrências — com informações organizadas para apoiar
              decisões melhores.
            </p>

            <div className="hero-buttons">
              <Link href="/orcamento" className="button primary">
                Planejar meu projeto <span>→</span>
              </Link>

              <a href="#catalogo" className="button secondary">
                Explorar soluções ↓
              </a>
            </div>
          </div>

          <div className="solutions-form-card">
            <div className="solutions-form-heading">
              <span className="solutions-form-mark">
                <Image src="/images/logo.png" alt="Lumora" width={38} height={38} />
              </span>
              <div>
                <span>A DIFERENÇA LUMORA</span>
                <h2>Da operação fragmentada à visão integrada</h2>
              </div>
            </div>
            <p className="solutions-form-intro">
              Compare um cenário com informações isoladas a uma operação conectada e acompanhada em um só lugar.
            </p>
            <div className="solutions-impact-chart" role="img" aria-label="Comparação ilustrativa de informações integradas, visibilidade e agilidade.">
              <div className="impact-legend">
                <span><i className="isolated-key" /> Sistemas isolados</span>
                <span><i className="lumora-key" /> Com Lumora</span>
              </div>
              {[
                ["Informações integradas", 30, 90],
                ["Visibilidade da operação", 38, 94],
                ["Agilidade nas respostas", 42, 86],
              ].map(([label, isolated, lumora]) => (
                <div className="impact-row" key={label}>
                  <div className="impact-label">{label}</div>
                  <div className="impact-comparison">
                    <div className="impact-measure">
                      <div className="impact-value"><span>Isolados</span><b>{isolated}%</b></div>
                      <div className="impact-track"><i className="impact-bar isolated" style={{ width: `${isolated}%` }} /></div>
                    </div>
                    <div className="impact-measure">
                      <div className="impact-value"><span>Com Lumora</span><b>{lumora}%</b></div>
                      <div className="impact-track"><i className="impact-bar lumora" style={{ width: `${lumora}%` }} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ul className="solutions-benefit-list">
              <li><span>✓</span> Informações centralizadas para a equipe</li>
              <li><span>✓</span> Alertas e indicadores para apoiar decisões</li>
            </ul>
            <small className="solutions-example-note">Exemplo ilustrativo. Os resultados variam conforme cada projeto.</small>
          </div>
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="solutions-intro section">
        <div className="container solutions-intro-grid">
          <div>
            <div className="section-kicker">
              01 — UMA PLATAFORMA, VÁRIAS POSSIBILIDADES
            </div>

            <h2>
              Menos informações isoladas. <span>Mais visão do todo.</span>
            </h2>
          </div>

          <p>
            Uma operação predial envolve muitos sistemas e equipes. A Lumora
            propõe reunir essas informações em uma experiência centralizada,
            que ajuda a entender o cenário e agir com mais contexto.
          </p>
        </div>
      </section>

      {/* CATÁLOGO DE SOLUÇÕES */}
      <section className="solution-catalog" id="catalogo">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">02 — NOSSAS SOLUÇÕES</div>
              <h2>
                Inteligência em cada
                <br />
                parte da operação.
              </h2>
            </div>

            <p>
              Recursos que podem ser combinados de acordo com a estrutura e
              as prioridades de cada edifício.
            </p>
          </div>

          <div className="solution-grid">
            {solutions.map((item) => (
              <article className="solution-card" key={item.n}>
                <div className="solution-card-top">
                  <span>{item.n} / 06</span>
                  <i>{item.icon}</i>
                </div>

                <h3>{item.title}</h3>
                <p>{item.text}</p>

                <div className="solution-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="section solution-process">
        <div className="container">
          <div className="section-kicker">03 — DA CONEXÃO À DECISÃO</div>

          <div className="process-heading">
            <h2>
              Uma jornada simples.
              <br />
              <em>Uma visão mais completa.</em>
            </h2>

            <p>
              Uma implantação começa pelo entendimento da operação e evolui
              conforme as necessidades do edifício.
            </p>
          </div>

          <div className="process-grid">
            {steps.map(([n, title, text]) => (
              <article key={n}>
                <span>{n}</span>
                <div className="process-line" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES */}
      <section className="solutions-faq">
        <div className="container faq-grid">
          <div>
            <div className="section-kicker">04 — DÚVIDAS FREQUENTES</div>

            <h2>O que você precisa saber.</h2>

            <p>
              Algumas respostas para ajudar a entender como uma solução de
              Smart Building pode se encaixar na sua operação.
            </p>

            <Link className="under-link" href="/orcamento">
              Converse com a Lumora <span>→</span>
            </Link>
          </div>

          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span>＋</span>
                </summary>

                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="section centered-cta">
        <div className="container">
          <div className="section-kicker">05 — SEU PRÓXIMO PASSO</div>

          <h2>Vamos pensar no futuro do seu edifício?</h2>

          <p>
            Conte um pouco sobre sua estrutura e os desafios da sua operação.
          </p>

          <Link href="/public/orcamento" className="button primary">
            Solicitar uma conversa →
          </Link>
        </div>
      </section>
    </main>
  );
}

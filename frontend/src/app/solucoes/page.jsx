
"use client";

import { useRef } from "react";
import Link from "next/link";
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
  const visualRef = useRef(null);

  const handleVisualMove = (e) => {
    const visual = visualRef.current;

    if (!visual) return;

    const rect = visual.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    visual.style.setProperty("--orbit-x", `${x * 12}px`);
    visual.style.setProperty("--orbit-y", `${y * 12}px`);

    visual.style.setProperty("--core-x", `${x * -8}px`);
    visual.style.setProperty("--core-y", `${y * -8}px`);

    visual.style.setProperty("--label-a-x", `${x * 17}px`);
    visual.style.setProperty("--label-a-y", `${y * 17}px`);

    visual.style.setProperty("--label-b-x", `${x * -15}px`);
    visual.style.setProperty("--label-b-y", `${y * 12}px`);

    visual.style.setProperty("--label-c-x", `${x * 13}px`);
    visual.style.setProperty("--label-c-y", `${y * -16}px`);
  };

  const handleVisualLeave = () => {
    const visual = visualRef.current;

    if (!visual) return;

    const properties = [
      "--orbit-x",
      "--orbit-y",
      "--core-x",
      "--core-y",
      "--label-a-x",
      "--label-a-y",
      "--label-b-x",
      "--label-b-y",
      "--label-c-x",
      "--label-c-y",
    ];

    properties.forEach((property) => {
      visual.style.setProperty(property, "0px");
    });
  };

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

          {/* ILUSTRAÇÃO INTERATIVA */}
          <div
            className="solutions-visual"
            ref={visualRef}
            onPointerMove={handleVisualMove}
            onPointerLeave={handleVisualLeave}
          >
            <div className="solution-orbit orbit-a" />
            <div className="solution-orbit orbit-b" />

            {/* PAINEL CENTRAL */}
            <div className="solution-core">
              <div className="lumora-dashboard">
                <div className="dashboard-header">
                  <div>
                    <span className="dashboard-kicker">
                      LUMORA SMARTBUILDING
                    </span>

                    <h3>Visão geral da operação</h3>

                    <small>Edifício inteligente • Exemplo</small>
                  </div>

                  <span className="dashboard-live">
                    <i />
                    AO VIVO
                  </span>
                </div>

                <div className="dashboard-period">
                  <span>Monitoramento predial</span>
                  <span>Hoje ▾</span>
                </div>

                <div className="dashboard-metrics">
                  <div>
                    <small>Energia</small>
                    <strong>
                      42,8 <span>kW</span>
                    </strong>
                  </div>

                  <div>
                    <small>Ambientes</small>
                    <strong>
                      24 <span>ativos</span>
                    </strong>
                  </div>

                  <div>
                    <small>Dispositivos</small>
                    <strong>
                      18 <span>online</span>
                    </strong>
                  </div>
                </div>

                <div className="dashboard-chart">
                  <div className="chart-heading">
                    <div>
                      <strong>Consumo de energia</strong>
                      <small>Histórico de hoje</small>
                    </div>

                    <span>kWh</span>
                  </div>

                  <svg
                    viewBox="0 0 320 105"
                    preserveAspectRatio="none"
                    aria-label="Gráfico ilustrativo de consumo de energia"
                    role="img"
                  >
                    <defs>
                      <linearGradient
                        id="lumoraChartFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#7C3AED"
                          stopOpacity=".35"
                        />
                        <stop
                          offset="100%"
                          stopColor="#7C3AED"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 78 C25 72 30 45 60 57 S95 75 120 43 S155 52 180 35 S215 58 240 28 S285 45 320 14 L320 105 L0 105 Z"
                      fill="url(#lumoraChartFill)"
                    />

                    <path
                      d="M0 78 C25 72 30 45 60 57 S95 75 120 43 S155 52 180 35 S215 58 240 28 S285 45 320 14"
                      fill="none"
                      stroke="#A78BFA"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    <circle cx="240" cy="28" r="4" fill="#60A5FA" />
                  </svg>

                  <div className="chart-hours">
                    <span>00h</span>
                    <span>06h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>24h</span>
                  </div>
                </div>

                <div className="dashboard-alert">
                  <span className="alert-icon">✦</span>

                  <div>
                    <strong>Análise inteligente</strong>
                    <p>
                      Identificada uma oportunidade de otimização no consumo
                      de energia.
                    </p>
                  </div>
                </div>

                <div className="dashboard-footer">
                  <span>
                    <i />
                    Sistemas conectados
                  </span>

                  <strong>LUMORA</strong>
                </div>
              </div>
            </div>

            {/* ETIQUETAS DE DIFERENCIAIS */}
            <div className="orbit-label label-a">
              <b>ϟ</b>
              <div>
                <strong>ENERGIA</strong>
                <small>Consumo inteligente</small>
              </div>
            </div>

            <div className="orbit-label label-b">
              <b>◉</b>
              <div>
                <strong>AMBIENTES</strong>
                <small>Monitoramento integrado</small>
              </div>
            </div>

            <div className="orbit-label label-c">
              <b>⌘</b>
              <div>
                <strong>OPERAÇÃO</strong>
                <small>Gestão centralizada</small>
              </div>
            </div>
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

          <Link href="/orcamento" className="button primary">
            Solicitar uma conversa →
          </Link>
        </div>
      </section>
    </main>
  );
}

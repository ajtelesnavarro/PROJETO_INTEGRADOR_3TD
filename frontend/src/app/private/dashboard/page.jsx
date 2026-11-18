"use client";

import "./dashboard.css";
import { useEffect, useState } from "react";

const FORM_VAZIO = {
  nome: "",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  cep: "",
  complemento: "",
};

function Icon({ name, size = 18 }) {
  const paths = {
    building: <><path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4M8 8h1m6 0h1M8 12h1m6 0h1" /></>,
    rooms: <><path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" /></>,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" /></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    thermo: <><path d="M14 14.8V5a4 4 0 0 0-8 0v9.8a6 6 0 1 0 8 0Z" /><path d="M10 7v9" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    alert: <><path d="M12 9v4m0 4h.01" /><path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>,
    activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function PageTitle({ toast }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);

  useEffect(() => {
    if (!modalAberto) return;
    function onKey(e) {
      if (e.key === "Escape") fechar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalAberto]);

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function fechar() {
    setModalAberto(false);
    setForm(FORM_VAZIO);
  }

  function cadastrar(e) {
    e.preventDefault();
    // Na integração: enviar `form` para a API aqui.
    console.log("Novo prédio:", form);
    fechar();
    toast("Prédio cadastrado com sucesso!");
  }

  return (
    <>
      <div className="dash-title">
        <div>
          <span className="dash-eyebrow">CENTRAL DE OPERAÇÕES</span>
          <h1>Dashboard</h1>
          <p>Acompanhe os indicadores e a situação operacional do edifício.</p>
        </div>

        <div className="dash-title-right">
          <button
            className="pa-primary-button"
            onClick={() => setModalAberto(true)}
          >
            <span>＋</span>
            Adicionar prédio
          </button>

          <span className="dash-demo">
            <i />
            Ambiente de demonstração
          </span>
          <span className="dash-date">
            <Icon name="clock" size={15} />
            Visão geral
          </span>
        </div>
      </div>

      
{modalAberto && (
  <div className="dash-modal-backdrop" onMouseDown={fechar}>
    <form
      className="dash-modal"
      onSubmit={cadastrar}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="dash-modal-heading">
        <div>
          <span className="dash-modal-eyebrow">
            ESTRUTURA PREDIAL
          </span>
          <h2>Novo prédio</h2>
          <p>Preencha os dados para cadastrar um edifício.</p>
        </div>

        <button
          type="button"
          className="dash-modal-close"
          onClick={fechar}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      <div className="dash-modal-fields">
        <label htmlFor="nome_predio">
          Nome do prédio *
          <input
            id="nome_predio"
            required
            autoFocus
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            placeholder="Ex.: Edifício Empresarial Central"
          />
        </label>

        <div className="dash-form-row">
          <label htmlFor="estado">
            Estado *
            <input
              id="estado"
              required
              value={form.estado}
              onChange={(e) => atualizar("estado", e.target.value)}
              placeholder="SP"
            />
          </label>

          <label htmlFor="cidade">
            Cidade *
            <input
              id="cidade"
              required
              value={form.cidade}
              onChange={(e) => atualizar("cidade", e.target.value)}
              placeholder="Santo André"
            />
          </label>
        </div>

        <div className="dash-form-row">
          <label htmlFor="bairro">
            Bairro
            <input
              id="bairro"
              value={form.bairro}
              onChange={(e) => atualizar("bairro", e.target.value)}
              placeholder="Ex.: Centro"
            />
          </label>

          <label htmlFor="cep">
            CEP *
            <input
              id="cep"
              required
              inputMode="numeric"
              maxLength={9}
              value={form.cep}
              onChange={(e) => atualizar("cep", e.target.value)}
              placeholder="00000-000"
            />
          </label>
        </div>

        <div className="dash-form-row dash-form-row-street">
          <label htmlFor="rua">
            Rua *
            <input
              id="rua"
              required
              value={form.rua}
              onChange={(e) => atualizar("rua", e.target.value)}
              placeholder="Nome da rua"
            />
          </label>

          <label htmlFor="numero">
            Número
            <input
              id="numero"
              type="number"
              min={0}
              value={form.numero}
              onChange={(e) => atualizar("numero", e.target.value)}
              placeholder="Nº"
            />
          </label>
        </div>

        <label htmlFor="complemento">
          Complemento
          <input
            id="complemento"
            value={form.complemento}
            onChange={(e) => atualizar("complemento", e.target.value)}
            placeholder="Bloco, torre, sala..."
          />
        </label>
      </div>

      <div className="dash-modal-actions">
        <button
          type="button"
          className="dash-modal-cancel"
          onClick={fechar}
        >
          Cancelar
        </button>

        <button type="submit" className="dash-primary-button">
          Cadastrar prédio
          <span>＋</span>
        </button>
      </div>
    </form>
  </div>
      )}
    </>
  );
}

function MetricCard({ icon, label, value, description, color, footer }) {
  return (
    <article className="dash-metric">
      <div className="dash-metric-top">
        <span className={`dash-metric-icon ${color}`}>
          <Icon name={icon} size={20} />
        </span>
        <span className="dash-metric-label">{label}</span>
        <span className="dash-metric-more">
          <Icon name="more" size={18} />
        </span>
      </div>

      <div className="dash-metric-value">{value}</div>
      <p className="dash-metric-description">{description}</p>

      {footer && <div className="dash-metric-footer">{footer}</div>}
    </article>
  );
}

function Status({ value }) {
  const classes = {
    "Aberta": "open",
    "Em andamento": "progress",
    "Resolvida": "success",
    "Alta": "danger",
    "Média": "warning",
    "Baixa": "normal",
  };

  return (
    <span className={`dash-status ${classes[value] || "normal"}`}>
      <i />
      {value}
    </span>
  );
}

function EnergyChart({ range }) {
  const labels = {
    Hoje: ["06h", "08h", "10h", "12h", "14h", "16h", "18h"],
    "7 dias": ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    "30 dias": ["01", "05", "10", "15", "20", "25", "30"],
  };

  const paths = {
    Hoje: "M0 140 C45 125 65 100 110 112 S180 145 225 95 S300 75 350 90 S410 45 465 60 S540 80 590 35 S650 45 700 20",
    "7 dias": "M0 130 C45 110 65 80 110 95 S180 120 225 70 S300 85 350 55 S410 75 465 45 S540 70 590 35 S650 55 700 25",
    "30 dias": "M0 150 C45 125 65 135 110 95 S180 110 225 80 S300 100 350 65 S410 80 465 55 S540 70 590 45 S650 40 700 25",
  };

  return (
    <div className="dash-chart">
      <div className="dash-chart-y">
        <span>1000</span>
        <span>750</span>
        <span>500</span>
        <span>250</span>
        <span>0</span>
      </div>

      <div className="dash-chart-main">
        <svg viewBox="0 0 700 190" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4779e8" stopOpacity=".24" />
              <stop offset="100%" stopColor="#4779e8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[1, 48, 95, 142, 189].map((y) => (
            <line key={y} x1="0" x2="700" y1={y} y2={y} className="dash-grid-line" />
          ))}

          <path
            d={`${paths[range]} L700 190 L0 190 Z`}
            fill="url(#dashArea)"
          />

          <path
            d={paths[range]}
            className="dash-energy-line"
          />

          <path
            d="M0 105 C50 90 90 115 140 95 S220 110 280 92 S360 100 420 85 S500 95 560 80 S640 85 700 70"
            className="dash-temp-line"
          />
        </svg>

        <div className="dash-chart-x">
          {labels[range].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeviceHealth() {
  const devices = [
    { label: "Ativos", value: "126", color: "green" },
    { label: "Instáveis", value: "02", color: "yellow" },
    { label: "Manutenção", value: "01", color: "blue" },
    { label: "Offline", value: "01", color: "red" },
  ];

  return (
    <section className="dash-panel dash-health">
      <div className="dash-panel-heading">
        <div>
          <span className="dash-section-label">MONITORAMENTO</span>
          <h2>Saúde dos dispositivos</h2>
        </div>
        <span className="dash-heading-icon">
          <Icon name="cpu" />
        </span>
      </div>

      <div className="dash-health-content">
        <div className="dash-ring">
          <svg viewBox="0 0 120 120">
            <circle className="dash-ring-track" cx="60" cy="60" r="47" />
            <circle className="dash-ring-online" cx="60" cy="60" r="47" pathLength="100" />
            <circle className="dash-ring-warning" cx="60" cy="60" r="47" pathLength="100" />
            <circle className="dash-ring-maintenance" cx="60" cy="60" r="47" pathLength="100" />
            <circle className="dash-ring-offline" cx="60" cy="60" r="47" pathLength="100" />
          </svg>
          <div className="dash-ring-center">
            <strong>130</strong>
            <span>Dispositivos</span>
          </div>
        </div>

        <div className="dash-health-legend">
          {devices.map((item) => (
            <div key={item.label}>
              <span className={`dash-legend-dot ${item.color}`} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-health-note">
        <Icon name="activity" size={16} />
        <span>Indicadores ilustrativos para demonstração</span>
      </div>
    </section>
  );
}

function Incidents({ toast }) {
  const [items, setItems] = useState([
    {
      id: "OC-1842",
      category: "Climatização",
      requester: "Marina Costa",
      owner: "Carlos Mendes",
      status: "Em andamento",
      priority: "Alta",
      opened: "15/11/2026 · 09:42",
    },
    {
      id: "OC-1841",
      category: "Iluminação",
      requester: "Ana Souza",
      owner: "Equipe Elétrica",
      status: "Aberta",
      priority: "Média",
      opened: "15/11/2026 · 08:18",
    },
    {
      id: "OC-1839",
      category: "Controle de acesso",
      requester: "Bruno Lima",
      owner: "Rafael Nunes",
      status: "Aberta",
      priority: "Alta",
      opened: "14/11/2026 · 17:31",
    },
  ]);

  function resolve(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Resolvida" } : item
      )
    );

    toast(`${id} marcado como resolvido.`);
  }

  const active = items.filter((item) => item.status !== "Resolvida").length;

  return (
    <section className="dash-panel dash-incidents">
      <div className="dash-panel-heading dash-incidents-heading">
        <div>
          <span className="dash-section-label">CENTRAL DE AÇÕES</span>
          <h2>
            Ocorrências recentes
            <span className="dash-count">{active}</span>
          </h2>
          <p>Registros que precisam de acompanhamento da equipe.</p>
        </div>

        <button className="dash-link" onClick={() => setModalAberto(true)}>
          Ver todas <Icon name="arrow" size={15} />
        </button>
      </div>

      <div className="dash-table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
              <th>IDENTIFICAÇÃO</th>
              <th>OCORRÊNCIA</th>
              <th>SOLICITANTE</th>
              <th>RESPONSÁVEL</th>
              <th>PRIORIDADE</th>
              <th>STATUS</th>
              <th>AÇÃO</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={item.status === "Resolvida" ? "is-resolved" : ""}>
                <td>
                  <strong>{item.id}</strong>
                  <small>{item.opened}</small>
                </td>
                <td>
                  <strong>{item.category}</strong>
                  <small>Registro de demonstração</small>
                </td>
                <td>{item.requester}</td>
                <td>{item.owner}</td>
                <td><Status value={item.priority} /></td>
                <td><Status value={item.status} /></td>
                <td>
                  <button
                    className="dash-resolve"
                    disabled={item.status === "Resolvida"}
                    onClick={() => resolve(item.id)}
                  >
                    {item.status === "Resolvida" ? (
                      <><Icon name="check" size={14} /> Resolvida</>
                    ) : "Resolver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState("7 dias");
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    window.clearTimeout(window.__lumoraToast);
    window.__lumoraToast = window.setTimeout(() => setToast(""), 2800);
  }

  return (
    <div className="lumora-dashboard">
      <PageTitle toast={showToast} />

      <div className="dash-demo-notice">
        <span><Icon name="alert" size={17} /></span>
        <p>
          <strong>Dados demonstrativos.</strong> Os indicadores abaixo são exemplos visuais
          e ainda não representam informações consultadas no banco de dados.
        </p>
      </div>

      <section className="dash-metrics">
        <MetricCard
          icon="building"
          label="Edifício"
          value="01"
          description="Unidade cadastrada"
          color="blue"
          footer={<span><Icon name="pin" size={13} /> Estrutura principal</span>}
        />

        <MetricCard
          icon="rooms"
          label="Ambientes"
          value="38"
          description="Ambientes cadastrados"
          color="purple"
          footer={<span>Distribuídos pelos andares</span>}
        />

        <MetricCard
          icon="cpu"
          label="Dispositivos IoT"
          value="130"
          description="Dispositivos demonstrativos"
          color="cyan"
          footer={<span>126 ativos · 4 em atenção</span>}
        />

        <MetricCard
          icon="bolt"
          label="Consumo de energia"
          value="842"
          description="kWh · valor ilustrativo"
          color="orange"
          footer={<span>Período de referência: 7 dias</span>}
        />
      </section>

      <section className="dash-analytics">
        <div className="dash-panel dash-chart-panel">
          <div className="dash-panel-heading">
            <div>
              <span className="dash-section-label">DESEMPENHO ENERGÉTICO</span>
              <h2>Consumo e temperatura</h2>
              <p>Acompanhamento ilustrativo dos indicadores do edifício.</p>
            </div>

            <div className="dash-range">
              {["Hoje", "7 dias", "30 dias"].map((item) => (
                <button
                  key={item}
                  className={range === item ? "active" : ""}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-chart-legend">
            <div>
              <i className="energy" />
              <span>Consumo de energia</span>
              <strong>842 kWh</strong>
            </div>
            <div>
              <i className="temperature" />
              <span>Temperatura média</span>
              <strong>23,5 °C</strong>
            </div>
          </div>

          <EnergyChart range={range} />
        </div>

        <DeviceHealth />
      </section>

      <Incidents toast={showToast} />

      {toast && (
        <div className="dash-toast">
          <span><Icon name="check" size={16} /></span>
          {toast}
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { requisicaoAPI } from "@/services/api";
import "./dashboard.css";

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
    "Cancelada": "normal",
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

function buildSmoothPath(values, maxVal) {
  const safeMax = Math.max(maxVal, 1);
  const points = values.map((v, idx) => {
    const x = values.length === 1 ? 350 : (idx / (values.length - 1)) * 700;
    const clamped = Math.max(0, Math.min(safeMax, Number(v) || 0));
    const y = 180 - (clamped / safeMax) * 155;
    return [Number(x.toFixed(1)), Number(y.toFixed(1))];
  });

  if (points.length === 0) return "M0 175 L700 175";
  if (points.length === 1) return `M0 ${points[0][1]} L700 ${points[0][1]}`;

  return points.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = arr[i - 1];
    const cx = Number(((px + x) / 2).toFixed(1));
    return `${acc} C${cx} ${py} ${cx} ${y} ${x} ${y}`;
  }, "");
}

function EnergyChart({ range, leituras }) {
  const labels = {
    Hoje: ["06h", "08h", "10h", "12h", "14h", "16h", "18h"],
    "7 dias": ["D-6", "D-5", "D-4", "D-3", "D-2", "Ontem", "Hoje"],
    "30 dias": ["01", "05", "10", "15", "20", "25", "30"],
  };

  const { energySeries, tempSeries, scaleMax } = useMemo(() => {
    const now = new Date();
    const days = range === "Hoje" ? 1 : range === "7 dias" ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const recent = leituras.filter((l) => new Date(l.data_hora) >= cutoff);
    const energia = recent.filter((l) => l.tipo === "energia").reverse();
    const temp = recent.filter((l) => l.tipo === "temperatura").reverse();

    const buckets = 7;
    const eVals = Array.from({ length: buckets }, (_, i) => {
      if (!energia.length) return 0;
      const start = Math.floor((i * energia.length) / buckets);
      const end = Math.max(start + 1, Math.floor(((i + 1) * energia.length) / buckets));
      const slice = energia.slice(start, end);
      return slice.length ? slice.reduce((s, item) => s + Number(item.valor || 0), 0) : 0;
    });

    const tVals = Array.from({ length: buckets }, (_, i) => {
      if (!temp.length) return 0;
      const start = Math.floor((i * temp.length) / buckets);
      const end = Math.max(start + 1, Math.floor(((i + 1) * temp.length) / buckets));
      const slice = temp.slice(start, end);
      return slice.length
        ? slice.reduce((s, item) => s + Number(item.valor || 0), 0) / slice.length
        : 0;
    });

    const maxEnergy = Math.max(...eVals, 100);
    const roundedMax = Math.ceil(maxEnergy / 100) * 100;

    return {
      energySeries: eVals,
      tempSeries: tVals,
      scaleMax: roundedMax,
    };
  }, [leituras, range]);

  const energyPath = buildSmoothPath(energySeries, scaleMax);
  const tempPath = buildSmoothPath(tempSeries, 50);

  return (
    <div className="dash-chart">
      <div className="dash-chart-y">
        <span>{scaleMax}</span>
        <span>{Math.round(scaleMax * 0.75)}</span>
        <span>{Math.round(scaleMax * 0.5)}</span>
        <span>{Math.round(scaleMax * 0.25)}</span>
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
            d={`${energyPath} L700 190 L0 190 Z`}
            fill="url(#dashArea)"
          />

          <path
            d={energyPath}
            className="dash-energy-line"
          />

          <path
            d={tempPath}
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

function DeviceHealth({ dispositivos }) {
  const counts = useMemo(() => {
    return {
      ativos: dispositivos.filter((d) => d.status_dispositivo === "ativo").length,
      instaveis: dispositivos.filter((d) => d.status_dispositivo === "instavel").length,
      manutencao: dispositivos.filter((d) => d.status_dispositivo === "manutencao").length,
      offline: dispositivos.filter((d) => d.status_dispositivo === "offline").length,
    };
  }, [dispositivos]);

  const rows = [
    { label: "Ativos", value: String(counts.ativos).padStart(2, "0"), color: "green" },
    { label: "Instáveis", value: String(counts.instaveis).padStart(2, "0"), color: "yellow" },
    { label: "Manutenção", value: String(counts.manutencao).padStart(2, "0"), color: "blue" },
    { label: "Offline", value: String(counts.offline).padStart(2, "0"), color: "red" },
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
            <strong>{dispositivos.length}</strong>
            <span>Dispositivos</span>
          </div>
        </div>

        <div className="dash-health-legend">
          {rows.map((item) => (
            <div key={item.label}>
              <span className={`dash-legend-dot ${item.color}`} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Incidents({ items, onResolve }) {
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

        <Link href="/private/ocorrencias" className="dash-link">
          Ver todas <Icon name="arrow" size={15} />
        </Link>
      </div>

      <div className="dash-table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
              <th>IDENTIFICAÇÃO</th>
              <th>OCORRÊNCIA</th>
              <th>DISPOSITIVO / LOCAL</th>
              <th>RESPONSÁVEL</th>
              <th>PRIORIDADE</th>
              <th>STATUS</th>
              <th>AÇÃO</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.rawId} className={item.status === "Resolvida" ? "is-resolved" : ""}>
                  <td>
                    <strong>{item.id}</strong>
                    <small>{item.opened}</small>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    <small>{item.category}</small>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.owner}</td>
                  <td><Status value={item.priority} /></td>
                  <td><Status value={item.status} /></td>
                  <td>
                    <button
                      className="dash-resolve"
                      disabled={item.status === "Resolvida"}
                      onClick={() => onResolve(item)}
                    >
                      {item.status === "Resolvida" ? (
                        <><Icon name="check" size={14} /> Resolvida</>
                      ) : "Resolver"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "24px", opacity: 0.7 }}>
                  Nenhuma ocorrência registrada no banco de dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState("7 dias");
  const [toast, setToast] = useState("");
  const [predios, setPredios] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [predioTarifaId, setPredioTarifaId] = useState("");
  const [tarifaAtual, setTarifaAtual] = useState(null);
  const [valorTarifa, setValorTarifa] = useState("");
  const [carregandoTarifa, setCarregandoTarifa] = useState(false);
  const [salvandoTarifa, setSalvandoTarifa] = useState(false);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__lumoraToast);
    window.__lumoraToast = window.setTimeout(() => setToast(""), 2800);
  }, []);

  const carregarDados = useCallback(async () => {
    try {
      const [resPredios, resAmbientes, resDispositivos, resOcorrencias, resEquipes, resLeituras] =
        await Promise.all([
          requisicaoAPI("/predios?limite=200"),
          requisicaoAPI("/ambientes?limite=200"),
          requisicaoAPI("/dispositivos?limite=200"),
          requisicaoAPI("/ocorrencias?limite=50"),
          requisicaoAPI("/equipes"),
          requisicaoAPI("/leituras?limite=200"),
        ]);

      setPredios(resPredios.dados || []);
      setAmbientes(resAmbientes.dados || []);
      setDispositivos(resDispositivos.dados || []);
      setOcorrencias(resOcorrencias.dados || []);
      setEquipes(resEquipes.dados || []);
      setUsuarios(resEquipes.usuarios || []);
      setLeituras(resLeituras.dados || []);
    } catch (erro) {
      showToast(erro.message || "Erro ao carregar indicadores.");
    }
  }, [showToast]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (!predioTarifaId && predios.length) {
      setPredioTarifaId(String(predios[0].id_predio));
    }
  }, [predios, predioTarifaId]);

  useEffect(() => {
    if (!predioTarifaId) {
      setTarifaAtual(null);
      setValorTarifa("");
      return;
    }

    let ativo = true;
    setCarregandoTarifa(true);
    requisicaoAPI(`/tarifa-energia/${predioTarifaId}`)
      .then((resposta) => {
        if (!ativo) return;
        setTarifaAtual(resposta.dados || null);
        setValorTarifa(resposta.dados?.valor_kwh ?? "");
      })
      .catch((erro) => {
        if (ativo) showToast(erro.message || "Não foi possível carregar a tarifa.");
      })
      .finally(() => {
        if (ativo) setCarregandoTarifa(false);
      });

    return () => { ativo = false; };
  }, [predioTarifaId, showToast]);

  async function salvarTarifa(event) {
    event.preventDefault();
    if (!predioTarifaId || valorTarifa === "") return;

    try {
      setSalvandoTarifa(true);
      const resposta = await requisicaoAPI(`/tarifa-energia/${predioTarifaId}`, {
        method: "PATCH",
        body: JSON.stringify({ valor_kwh: Number(String(valorTarifa).replace(",", ".")) }),
      });
      setTarifaAtual(resposta.dados || null);
      setValorTarifa(resposta.dados?.valor_kwh ?? valorTarifa);
      showToast("Tarifa de energia atualizada.");
    } catch (erro) {
      showToast(erro.message || "Não foi possível salvar a tarifa.");
    } finally {
      setSalvandoTarifa(false);
    }
  }

  const resumoIndicadores = useMemo(() => {
    const ativos = dispositivos.filter((d) => d.status_dispositivo === "ativo").length;
    const atencao = dispositivos.length - ativos;

    const leiturasEnergia = leituras.filter((l) => l.tipo === "energia");
    const totalEnergia = leiturasEnergia.reduce((acc, l) => acc + Number(l.valor || 0), 0);

    const leiturasTemp = leituras.filter((l) => l.tipo === "temperatura");
    const mediaTemp = leiturasTemp.length
      ? leiturasTemp.reduce((acc, l) => acc + Number(l.valor || 0), 0) / leiturasTemp.length
      : 0;

    return {
      ativos,
      atencao,
      totalEnergia: totalEnergia.toFixed(1).replace(".", ","),
      mediaTemp: mediaTemp.toFixed(1).replace(".", ","),
    };
  }, [dispositivos, leituras]);

  const ocorrenciasFormatadas = useMemo(() => {
    const statusMap = {
      aberta: "Aberta",
      em_andamento: "Em andamento",
      resolvida: "Resolvida",
      cancelada: "Cancelada",
    };
    const prioMap = {
      alta: "Alta",
      media: "Média",
      baixa: "Baixa",
    };

    return ocorrencias.slice(0, 6).map((oc) => {
      const disp = dispositivos.find((d) => d.id_dispositivo === oc.id_dispositivo);
      const amb = ambientes.find((a) => a.id_ambiente === disp?.id_ambiente);
      const eq = equipes.find((e) => e.id_equipe === oc.id_equipe_responsavel);
      const tec = usuarios.find((u) => u.id_usuario === oc.id_tecnico_responsavel);

      const data = oc.data_ocorrencia
        ? new Date(oc.data_ocorrencia).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—";

      return {
        rawId: oc.id_ocorrencia,
        id: `OC-${String(oc.id_ocorrencia).padStart(4, "0")}`,
        title: oc.titulo,
        category: disp?.nome || "Sensor IoT",
        location: amb?.nome || "Ambiente não vinculado",
        owner: tec?.nome || eq?.nome_equipe || "Não atribuído",
        priority: prioMap[oc.prioridade] || "Média",
        status: statusMap[oc.status_ocorrencia] || "Aberta",
        opened: data,
      };
    });
  }, [ocorrencias, dispositivos, ambientes, equipes, usuarios]);

  async function resolverOcorrencia(item) {
    try {
      const agoraSQL = new Date().toISOString().slice(0, 19).replace("T", " ");
      await requisicaoAPI(`/ocorrencias/${item.rawId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status_ocorrencia: "resolvida",
          resolvida_em: agoraSQL,
        }),
      });
      showToast(`${item.id} marcado como resolvido.`);
      carregarDados();
    } catch (erro) {
      showToast(erro.message || "Erro ao resolver ocorrência.");
    }
  }

  return (
    <div className="lumora-dashboard">
      <div className="dash-title">
        <div>
          <span className="dash-eyebrow">CENTRAL DE OPERAÇÕES</span>
          <h1>Dashboard</h1>
          <p>Acompanhe os indicadores e a situação operacional do edifício.</p>
        </div>

        <div className="dash-title-right">
          <span className="dash-date">
            <Icon name="clock" size={15} />
            Dados em tempo real
          </span>
        </div>
      </div>

      <section className="dash-metrics">
        <MetricCard
          icon="building"
          label="Edifícios"
          value={String(predios.length).padStart(2, "0")}
          description="Unidades cadastradas"
          color="blue"
          footer={
            <span>
              <Icon name="pin" size={13} />{" "}
              {predios[0]?.nome_predio || "Nenhum prédio cadastrado"}
            </span>
          }
        />

        <MetricCard
          icon="rooms"
          label="Ambientes"
          value={String(ambientes.length).padStart(2, "0")}
          description="Ambientes monitorados"
          color="purple"
          footer={<span>Distribuídos pelos andares</span>}
        />

        <MetricCard
          icon="cpu"
          label="Dispositivos IoT"
          value={String(dispositivos.length).padStart(2, "0")}
          description="Sensores e atuadores"
          color="cyan"
          footer={
            <span>
              {resumoIndicadores.ativos} ativos · {resumoIndicadores.atencao} em atenção
            </span>
          }
        />

        <MetricCard
          icon="bolt"
          label="Consumo de energia"
          value={resumoIndicadores.totalEnergia}
          description="kWh · acumulado registrado"
          color="orange"
          footer={<span>Temperatura média: {resumoIndicadores.mediaTemp} °C</span>}
        />
      </section>

      <section className="dash-panel dash-tarifa-panel">
        <div className="dash-panel-heading">
          <div>
            <span className="dash-section-label">CONFIGURAÇÃO DO EDIFÍCIO</span>
            <h2>Tarifa de energia</h2>
            <p>Defina o valor cobrado por kWh para os cálculos de consumo.</p>
          </div>
          <span className="dash-tarifa-atual">
            {carregandoTarifa
              ? "Carregando tarifa..."
              : tarifaAtual
                ? `Vigente: ${Number(tarifaAtual.valor_kwh).toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} R$/kWh`
                : "Nenhuma tarifa cadastrada"}
          </span>
        </div>

        {predios.length ? (
          <form className="dash-tarifa-form" onSubmit={salvarTarifa}>
            <label>
              Prédio
              <select value={predioTarifaId} onChange={(event) => setPredioTarifaId(event.target.value)} required>
                {predios.map((predio) => (
                  <option key={predio.id_predio} value={String(predio.id_predio)}>
                    {predio.nome_predio}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Valor por kWh (R$)
              <input type="number" min="0" step="0.0001" value={valorTarifa} onChange={(event) => setValorTarifa(event.target.value)} placeholder="Ex.: 0.7350" required />
            </label>
            <button type="submit" disabled={salvandoTarifa || carregandoTarifa}>
              {salvandoTarifa ? "Salvando..." : "Salvar tarifa"}
            </button>
            <small>A nova tarifa passa a valer hoje e encerra a anterior.</small>
          </form>
        ) : (
          <p className="dash-tarifa-empty">Cadastre um prédio antes de definir a tarifa.</p>
        )}
      </section>

      <section className="dash-analytics">
        <div className="dash-panel dash-chart-panel">
          <div className="dash-panel-heading">
            <div>
              <span className="dash-section-label">DESEMPENHO ENERGÉTICO</span>
              <h2>Consumo e temperatura</h2>
              <p>Histórico consolidado das leituras dos sensores do edifício.</p>
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
              <strong>{resumoIndicadores.totalEnergia} kWh</strong>
            </div>
            <div>
              <i className="temperature" />
              <span>Temperatura média</span>
              <strong>{resumoIndicadores.mediaTemp} °C</strong>
            </div>
          </div>

          <EnergyChart range={range} leituras={leituras} />
        </div>

        <DeviceHealth dispositivos={dispositivos} />
      </section>

      <Incidents items={ocorrenciasFormatadas} onResolve={resolverOcorrencia} />

      {toast && (
        <div className="dash-toast">
          <span><Icon name="check" size={16} /></span>
          {toast}
        </div>
      )}
    </div>
  );
}

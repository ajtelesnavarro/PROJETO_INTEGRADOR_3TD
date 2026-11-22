"use client";

import { useEffect, useMemo, useState } from "react";
import "./dispositivos.css";

const initialDevices = [
  {
    id: "DEV-001",
    name: "Medidor de Energia",
    code: "E-104",
    type: "Energia",
    room: "Sala de Servidores",
    floor: "2º andar",
    manufacturer: "EnerMeter",
    model: "EM-Pro 4",
    reading: 18.4,
    unit: "kWh",
    power: "12,0 kW",
    status: "Ativo",
    signal: 98,
    updated: "Agora mesmo",
    serial: "EM4-2026-00104",
    description: "Monitoramento do consumo elétrico do ambiente.",
    history: [38, 52, 43, 65, 48, 72, 58, 82, 67, 75, 61, 88],
  },
  {
    id: "DEV-002",
    name: "Sensor de Temperatura",
    code: "T-221",
    type: "Temperatura",
    room: "Sala de Reuniões A",
    floor: "8º andar",
    manufacturer: "SensTech",
    model: "ST-Climate",
    reading: 23.5,
    unit: "°C",
    power: "0,02 kW",
    status: "Ativo",
    signal: 94,
    updated: "Há 12 segundos",
    serial: "STC-2026-00221",
    description: "Leitura de temperatura para controle do conforto térmico.",
    history: [42, 48, 45, 58, 52, 62, 55, 68, 61, 72, 66, 75],
  },
  {
    id: "DEV-003",
    name: "Controlador de Iluminação",
    code: "L-033",
    type: "Iluminação",
    room: "Recepção",
    floor: "Térreo",
    manufacturer: "LumenPro",
    model: "LP-Dim 8",
    reading: 450,
    unit: "lux",
    power: "2,4 kW",
    status: "Instável",
    signal: 58,
    updated: "Há 3 minutos",
    serial: "LPD-2026-00033",
    description: "Controle e monitoramento dos níveis de iluminação.",
    history: [35, 48, 55, 42, 68, 38, 58, 46, 72, 54, 62, 48],
  },
  {
    id: "DEV-004",
    name: "Sensor de Temperatura",
    code: "T-118",
    type: "Temperatura",
    room: "Laboratório Tech",
    floor: "12º andar",
    manufacturer: "SensTech",
    model: "ST-Climate",
    reading: 25.8,
    unit: "°C",
    power: "0,02 kW",
    status: "Manutenção",
    signal: 0,
    updated: "Há 28 minutos",
    serial: "STC-2026-00118",
    description: "Sensor destinado ao acompanhamento térmico do laboratório.",
    history: [38, 44, 48, 52, 58, 62, 70, 74, 68, 78, 82, 86],
  },
  {
    id: "DEV-005",
    name: "Medidor de Energia",
    code: "E-108",
    type: "Energia",
    room: "Auditório",
    floor: "1º andar",
    manufacturer: "EnerMeter",
    model: "EM-Core 2",
    reading: 8.1,
    unit: "kWh",
    power: "8,0 kW",
    status: "Offline",
    signal: 0,
    updated: "Há 1 hora",
    serial: "EM2-2026-00108",
    description: "Acompanhamento do consumo energético do auditório.",
    history: [70, 64, 58, 52, 48, 40, 34, 28, 20, 16, 10, 5],
  },
  {
    id: "DEV-006",
    name: "Painel de Iluminação",
    code: "L-041",
    type: "Iluminação",
    room: "Corredor Leste",
    floor: "3º andar",
    manufacturer: "LumenPro",
    model: "LP-Dim 8",
    reading: 620,
    unit: "lux",
    power: "1,8 kW",
    status: "Ativo",
    signal: 91,
    updated: "Há 8 segundos",
    serial: "LPD-2026-00041",
    description: "Monitoramento da intensidade luminosa do corredor.",
    history: [52, 58, 62, 55, 68, 72, 65, 78, 70, 82, 75, 88],
  },
];

const iconByType = {
  Energia: "ϟ",
  Temperatura: "°",
  Iluminação: "☼",
};

function DeviceIcon({ type, size = "normal" }) {
  return (
    <span className={`dv-device-icon dv-${type.toLowerCase()} ${size}`}>
      {iconByType[type] || "◈"}
    </span>
  );
}

function Status({ value }) {
  const className = {
    Ativo: "active",
    Instável: "unstable",
    Manutenção: "maintenance",
    Offline: "offline",
    Inativo: "inactive",
  }[value] || "inactive";

  return (
    <span className={`dv-status ${className}`}>
      <i />
      {value}
    </span>
  );
}

function Signal({ value }) {
  return (
    <div className="dv-signal" title={`Sinal: ${value}%`}>
      {[1, 2, 3, 4].map((bar) => (
        <i
          key={bar}
          className={value >= bar * 25 ? "filled" : ""}
        />
      ))}
      <span>{value}%</span>
    </div>
  );
}

function MiniChart({ values }) {
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 300},${100 - value}`)
    .join(" ");

  return (
    <svg className="dv-mini-chart" viewBox="0 0 300 110" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dv-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B8CFF" stopOpacity=".3" />
          <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} className="dv-chart-grid" />
      ))}
      <polygon
        points={`0,110 ${points} 300,110`}
        fill="url(#dv-chart-fill)"
      />
      <polyline points={points} className="dv-chart-line" />
    </svg>
  );
}

export default function Dispositivos() {
  const [devices, setDevices] = useState(initialDevices);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [view, setView] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Energia",
    room: "",
    manufacturer: "",
    model: "",
  });

  useEffect(() => {
    apiFetch("/dispositivos?limite=200").then((res) => {
      const rows = unwrap(res);
      const mapped = rows.map((r) => ({ id: `DB-${r.id_dispositivo}`, dbId: r.id_dispositivo, name: r.nome, code: r.identificador || `DEV-${r.id_dispositivo}`, type: r.tipo_dispositivo === "temperatura" ? "Temperatura" : r.tipo_dispositivo === "energia" ? "Energia" : "Iluminação", room: r.nome_ambiente || "", floor: r.numero_andar != null ? `${r.numero_andar}º andar` : "", manufacturer: r.fabricante || "Não informado", model: r.modelo || "Não informado", reading: 0, unit: r.unidade_medida || "", power: r.potencia_nominal_kw || "Não informado", status: r.status_dispositivo === "manutencao" ? "Manutenção" : r.status_dispositivo === "instavel" ? "Instável" : r.status_dispositivo === "offline" ? "Offline" : r.status_dispositivo === "inativo" ? "Inativo" : "Ativo", signal: 100, updated: r.data_dispositivo || "", serial: r.identificador || "", description: "Dispositivo cadastrado na plataforma.", history: [] }));
      if (mapped.length) { setDevices(mapped); setSelected(mapped[0]); }
    }).catch(() => {});
  }, []);

  const filteredDevices = useMemo(() => {
    const term = search.toLowerCase().trim();

    return devices.filter((device) => {
      const matchesSearch =
        !term ||
        device.name.toLowerCase().includes(term) ||
        device.code.toLowerCase().includes(term) ||
        device.room.toLowerCase().includes(term) ||
        device.id.toLowerCase().includes(term);

      const matchesType = type === "Todos" || device.type === type;
      const matchesStatus = status === "Todos" || device.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [devices, search, type, status]);

  const counts = useMemo(() => ({
    total: devices.length,
    active: devices.filter((d) => d.status === "Ativo").length,
    unstable: devices.filter((d) => d.status === "Instável").length,
    offline: devices.filter((d) => d.status === "Offline").length,
    maintenance: devices.filter((d) => d.status === "Manutenção").length,
  }), [devices]);

  function notify(message) {
    setToast(message);
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setSelected(null);
        setShowModal(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  async function updateStatus(id, newStatus) {
    const device = devices.find((d) => d.id === id);
    const dbId = device?.dbId || String(id).replace(/^DB-/, "");
    const apiStatus = { Ativo: "ativo", Instável: "instavel", Offline: "offline", Manutenção: "manutencao", Inativo: "inativo" }[newStatus] || "ativo";
    try { await apiFetch(`/dispositivos/${dbId}`, { method: "PATCH", body: JSON.stringify({ status_dispositivo: apiStatus }) }); } catch (error) { notify(error.message); return; }
    setDevices((current) =>
      current.map((device) =>
        device.id === id ? { ...device, status: newStatus } : device
      )
    );

    setSelected((current) =>
      current?.id === id ? { ...current, status: newStatus } : current
    );

    notify("Status do dispositivo atualizado.");
  }

  function toggleDevice(device) {
    const newStatus = device.status === "Ativo" ? "Inativo" : "Ativo";
    updateStatus(device.id, newStatus);
  }

  function addDevice(e) {
    e.preventDefault();

    const tipoApi = { Energia: "energia", Temperatura: "temperatura", Iluminação: "iluminacao" }[form.type] || "energia";
    apiFetch("/dispositivos", { method: "POST", body: JSON.stringify({ id_ambiente: Number(form.room.match(/\d+/)?.[0] || 1), nome: form.name, identificador: form.code || `DEV-${Date.now()}`, tipo_dispositivo: tipoApi, fabricante: form.manufacturer || null, modelo: form.model || null, unidade_medida: form.type === "Energia" ? "kWh" : form.type === "Temperatura" ? "°C" : "lux", status_dispositivo: "ativo" }) }).then((res) => { const db = unwrap(res); const newDevice = { dbId: db.id_dispositivo, id: `DB-${db.id_dispositivo}`, name: form.name, code: form.code || `DEV-${db.id_dispositivo}`, type: form.type, room: form.room, floor: "Não definido", manufacturer: form.manufacturer || "Não informado", model: form.model || "Não informado", reading: 0, unit: form.type === "Energia" ? "kWh" : form.type === "Temperatura" ? "°C" : "lux", power: "Não informado", status: "Ativo", signal: 100, updated: "Agora mesmo", serial: form.code || "", description: "Novo dispositivo cadastrado na plataforma.", history: [] };
      setDevices((current) => [newDevice, ...current]); setForm({name:"",code:"",type:"Energia",room:"",manufacturer:"",model:""}); setShowModal(false); setSelected(newDevice); notify("Dispositivo cadastrado com sucesso.");
    }).catch((error) => notify(error.message));
    return;

  }
  return (
    <div className="dv-page">
      <div className="dv-ambient dv-ambient-one" />
      <div className="dv-ambient dv-ambient-two" />

      <header className="dv-heading">
        <div>
          <div className="dv-eyebrow">
            <span className="dv-eyebrow-line" />
            CENTRAL DE TELEMETRIA
            <span className="dv-live"><i /> SISTEMA ATIVO</span>
          </div>
          <h1>Dispositivos <span>IoT.</span></h1>
          <p>
            Controle a rede de dispositivos, acompanhe leituras e identifique
            alterações na operação do edifício.
          </p>
        </div>

        <button className="dv-add-button" onClick={() => setShowModal(true)}>
          <span>＋</span>
          Adicionar dispositivo
        </button>
      </header>

      <section className="dv-command-bar">
        <div className="dv-command-title">
          <span className="dv-command-icon">⌘</span>
          <div>
            <b>REDE DE DISPOSITIVOS</b>
            <small>Edifício Empresarial Central · Santo André, SP</small>
          </div>
        </div>
        <div className="dv-command-meta">
          <span><i className="dv-pulse" /> Conexão monitorada</span>
          <span className="dv-command-divider" />
          <span>Última sincronização: agora</span>
        </div>
      </section>

      <section className="dv-metrics">
        <article className="dv-metric dv-metric-total">
          <div className="dv-metric-top">
            <span>DISPOSITIVOS REGISTRADOS</span>
            <span className="dv-metric-symbol">◈</span>
          </div>
          <strong>{counts.total.toString().padStart(2, "0")}</strong>
          <div className="dv-metric-bottom">
            <span>Ativos na plataforma</span>
            <span className="dv-metric-tag">TOTAL</span>
          </div>
        </article>

        <article className="dv-metric">
          <div className="dv-metric-top">
            <span>EM OPERAÇÃO</span>
            <span className="dv-metric-symbol green">↗</span>
          </div>
          <strong className="dv-green-text">{counts.active.toString().padStart(2, "0")}</strong>
          <div className="dv-metric-bottom">
            <span>Funcionamento normal</span>
            <span className="dv-metric-dot green" />
          </div>
        </article>

        <article className="dv-metric">
          <div className="dv-metric-top">
            <span>INSTABILIDADE</span>
            <span className="dv-metric-symbol yellow">!</span>
          </div>
          <strong className="dv-yellow-text">{counts.unstable.toString().padStart(2, "0")}</strong>
          <div className="dv-metric-bottom">
            <span>Requer atenção</span>
            <span className="dv-metric-dot yellow" />
          </div>
        </article>

        <article className="dv-metric">
          <div className="dv-metric-top">
            <span>FORA DE OPERAÇÃO</span>
            <span className="dv-metric-symbol red">⌁</span>
          </div>
          <strong className="dv-red-text">{(counts.offline + counts.maintenance).toString().padStart(2, "0")}</strong>
          <div className="dv-metric-bottom">
            <span>{counts.offline} offline · {counts.maintenance} manutenção</span>
            <span className="dv-metric-dot red" />
          </div>
        </article>
      </section>

      <section className="dv-network-panel">
        <div className="dv-network-copy">
          <span className="dv-section-kicker">NETWORK HEALTH</span>
          <h2>Integridade da rede</h2>
          <p>Visão geral da comunicação entre os dispositivos cadastrados.</p>
        </div>
        <div className="dv-network-visual">
          <div className="dv-network-ring">
            <div className="dv-network-ring-inner">
              <strong>{devices.length ? Math.round((counts.active / devices.length) * 100) : 0}%</strong>
              <span>OPERACIONAL</span>
            </div>
          </div>
          <div className="dv-network-legend">
            <span><i className="green" /> Ativos <b>{counts.active}</b></span>
            <span><i className="yellow" /> Instáveis <b>{counts.unstable}</b></span>
            <span><i className="red" /> Offline / manutenção <b>{counts.offline + counts.maintenance}</b></span>
          </div>
        </div>
        <div className="dv-network-decoration">LUMORA<span>_IOT</span></div>
      </section>

      <section className="dv-inventory">
        <div className="dv-inventory-heading">
          <div>
            <span className="dv-section-kicker">ASSET MANAGEMENT</span>
            <h2>Inventário de dispositivos</h2>
            <p>Selecione um dispositivo para abrir sua central de inspeção.</p>
          </div>
          <div className="dv-view-switch">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
              aria-label="Visualização em cartões"
            >
              ▦
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-label="Visualização em lista"
            >
              ☷
            </button>
          </div>
        </div>

        <div className="dv-filters">
          <label className="dv-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, código ou ambiente..."
            />
          </label>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Todos">Todos os tipos</option>
            <option value="Energia">Energia</option>
            <option value="Temperatura">Temperatura</option>
            <option value="Iluminação">Iluminação</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Todos">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Instável">Instável</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Offline">Offline</option>
            <option value="Inativo">Inativo</option>
          </select>

          <span className="dv-results">{filteredDevices.length} RESULTADOS</span>
        </div>

        {filteredDevices.length === 0 ? (
          <div className="dv-empty">
            <span>⌕</span>
            <h3>Nenhum dispositivo encontrado</h3>
            <p>Tente alterar os filtros ou o termo pesquisado.</p>
            <button onClick={() => { setSearch(""); setType("Todos"); setStatus("Todos"); }}>
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className={`dv-device-grid ${view === "list" ? "list-view" : ""}`}>
            {filteredDevices.map((device) => (
              <button
                className={`dv-device-card ${selected?.id === device.id ? "selected" : ""}`}
                key={device.id}
                onClick={() => setSelected(device)}
              >
                <div className="dv-card-top">
                  <DeviceIcon type={device.type} />
                  <Status value={device.status} />
                </div>

                <div className="dv-card-identity">
                  <span>{device.code} / {device.id}</span>
                  <h3>{device.name}</h3>
                  <p>{device.room}</p>
                </div>

                <div className="dv-card-reading">
                  <span>LEITURA ATUAL</span>
                  <strong>
                    {device.reading.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                    <small>{device.unit}</small>
                  </strong>
                </div>

                <div className="dv-card-footer">
                  <Signal value={device.signal} />
                  <span>INSPECIONAR <b>↗</b></span>
                </div>
                <div className={`dv-card-glow ${device.status === "Ativo" ? "glow-active" : ""}`} />
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <>
          <button
            className="dv-drawer-backdrop"
            onClick={() => setSelected(null)}
            aria-label="Fechar painel de inspeção"
          />
          <aside className="dv-drawer">
            <div className="dv-drawer-top">
              <div>
                <span className="dv-section-kicker">DEVICE INSPECTOR / {selected.id}</span>
                <p>Central de inspeção</p>
              </div>
              <button className="dv-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="dv-drawer-device">
              <DeviceIcon type={selected.type} size="large" />
              <div>
                <h2>{selected.name}</h2>
                <span>{selected.code} · {selected.model}</span>
              </div>
              <Status value={selected.status} />
            </div>

            <div className="dv-drawer-reading">
              <span>LEITURA REGISTRADA</span>
              <div>
                {selected.reading.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                <small>{selected.unit}</small>
              </div>
              <p><i /> {selected.updated}</p>
              <MiniChart values={selected.history} />
              <div className="dv-chart-labels">
                <span>HÁ 12 HORAS</span>
                <span>AGORA</span>
              </div>
            </div>

            <div className="dv-drawer-section">
              <div className="dv-drawer-section-title">
                <h3>Informações técnicas</h3>
                <span>01 / 02</span>
              </div>
              <div className="dv-info-grid">
                <div><span>AMBIENTE</span><b>{selected.room}</b></div>
                <div><span>LOCALIZAÇÃO</span><b>{selected.floor}</b></div>
                <div><span>FABRICANTE</span><b>{selected.manufacturer}</b></div>
                <div><span>MODELO</span><b>{selected.model}</b></div>
                <div><span>POTÊNCIA NOMINAL</span><b>{selected.power}</b></div>
                <div><span>SINAL DE REDE</span><b>{selected.signal}%</b></div>
              </div>
            </div>

            <div className="dv-drawer-section">
              <div className="dv-drawer-section-title">
                <h3>Identificação</h3>
                <span>02 / 02</span>
              </div>
              <div className="dv-serial">
                <span>NÚMERO DE SÉRIE</span>
                <b>{selected.serial}</b>
              </div>
              <p className="dv-description">{selected.description}</p>
            </div>

            <div className="dv-drawer-controls">
              <span>CONTROLE OPERACIONAL</span>
              <div className="dv-control-actions">
                <button
                  className={selected.status === "Ativo" ? "dv-control-disable" : "dv-control-enable"}
                  onClick={() => toggleDevice(selected)}
                  disabled={selected.status === "Manutenção" || selected.status === "Offline"}
                >
                  {selected.status === "Ativo" ? "Desativar dispositivo" : "Ativar dispositivo"}
                </button>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  aria-label="Alterar status do dispositivo"
                >
                  <option>Ativo</option>
                  <option>Instável</option>
                  <option>Manutenção</option>
                  <option>Offline</option>
                  <option>Inativo</option>
                </select>
              </div>
              <small>Alterações demonstrativas, ainda não enviadas ao banco de dados.</small>
            </div>
          </aside>
        </>
      )}

      {showModal && (
        <div className="dv-modal-backdrop" onClick={() => setShowModal(false)}>
          <form className="dv-modal" onSubmit={addDevice} onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-heading">
              <div>
                <span className="dv-section-kicker">NOVO ATIVO / CADASTRO</span>
                <h2>Adicionar dispositivo</h2>
                <p>Inclua um novo equipamento no inventário IoT.</p>
              </div>
              <button type="button" className="dv-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <label>
              Nome do dispositivo *
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Sensor de temperatura"
              />
            </label>

            <div className="dv-form-row">
              <label>
                Código
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Ex.: T-221"
                />
              </label>
              <label>
                Tipo *
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Energia</option>
                  <option>Temperatura</option>
                  <option>Iluminação</option>
                </select>
              </label>
            </div>

            <label>
              Ambiente *
              <input
                required
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="Ex.: Sala de reuniões"
              />
            </label>

            <div className="dv-form-row">
              <label>
                Fabricante
                <input
                  value={form.manufacturer}
                  onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                  placeholder="Fabricante"
                />
              </label>
              <label>
                Modelo
                <input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Modelo"
                />
              </label>
            </div>

            <div className="dv-modal-actions">
              <button type="button" className="dv-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="submit" className="dv-add-button">
                Cadastrar dispositivo <span>↗</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="dv-toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

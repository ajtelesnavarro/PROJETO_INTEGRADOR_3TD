"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./dispositivos.css";

const TIPO_CONFIG = {
  energia: {
    label: "Energia",
    slug: "energia",
    unit: "kWh",
    symbol: "⚡",
    defaultHistory: [42, 48, 45, 58, 52, 64, 59, 68, 63, 72, 69, 76],
  },
  temperatura: {
    label: "Temperatura",
    slug: "temperatura",
    unit: "°C",
    symbol: "°",
    defaultHistory: [48, 50, 49, 53, 52, 55, 54, 56, 55, 58, 57, 59],
  },
  iluminacao: {
    label: "Iluminação",
    slug: "iluminacao",
    unit: "lux",
    symbol: "☼",
    defaultHistory: [35, 45, 62, 68, 72, 70, 74, 71, 65, 52, 44, 40],
  },
};

const STATUS_CONFIG = {
  ativo: { label: "Ativo", className: "active", signal: 96 },
  instavel: { label: "Instável", className: "unstable", signal: 54 },
  manutencao: { label: "Manutenção", className: "maintenance", signal: 0 },
  offline: { label: "Offline", className: "offline", signal: 0 },
  inativo: { label: "Inativo", className: "inactive", signal: 0 },
};

const emptyForm = {
  nome: "",
  identificador: "",
  tipo_dispositivo: "energia",
  id_predio: "",
  id_ambiente: "",
  fabricante: "",
  modelo: "",
  potencia_nominal_kw: "",
  status_dispositivo: "ativo",
};

function formatarNomeAndar(numero) {
  if (numero === undefined || numero === null) return "Andar não informado";
  return Number(numero) === 0 ? "Térreo" : `${numero}º andar`;
}

function deduplicarPor(lista, chave) {
  const mapa = new Map();
  for (const item of lista || []) {
    if (item && item[chave] !== undefined && item[chave] !== null) {
      mapa.set(item[chave], item);
    }
  }
  return Array.from(mapa.values());
}

function DeviceIcon({ tipoKey, size = "normal" }) {
  const cfg = TIPO_CONFIG[tipoKey] || TIPO_CONFIG.energia;
  return (
    <span className={`dv-device-icon dv-${cfg.slug} ${size}`}>
      {cfg.symbol}
    </span>
  );
}

function Status({ statusKey }) {
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.inativo;
  return (
    <span className={`dv-status ${cfg.className}`}>
      <i />
      {cfg.label}
    </span>
  );
}

function Signal({ value }) {
  return (
    <div className="dv-signal" title={`Sinal: ${value}%`}>
      {[1, 2, 3, 4].map((bar) => (
        <i key={bar} className={value >= bar * 25 ? "filled" : ""} />
      ))}
      <span>{value}%</span>
    </div>
  );
}

function MiniChart({ values, gradientId = "dv-chart-fill" }) {
  const safeValues = values?.length > 1 ? values : [40, 45, 50, 48, 55, 60];
  const points = safeValues
    .map(
      (value, index) =>
        `${(index / (safeValues.length - 1)) * 300},${100 - Math.min(95, Math.max(5, value))}`
    )
    .join(" ");

  return (
    <svg
      className="dv-mini-chart"
      viewBox="0 0 300 110"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5B8CFF" stopOpacity=".3" />
          <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} className="dv-chart-grid" />
      ))}
      <polygon
        points={`0,110 ${points} 300,110`}
        fill={`url(#${gradientId})`}
      />
      <polyline points={points} className="dv-chart-line" />
    </svg>
  );
}

function DispositivosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parametroAplicadoRef = useRef("");

  const [predios, setPredios] = useState([]);
  const [andares, setAndares] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [dispositivosBrutos, setDispositivosBrutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [predioFilter, setPredioFilter] = useState("Todos");
  const [andarFilter, setAndarFilter] = useState("Todos");
  const [ambienteFilter, setAmbienteFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [view, setView] = useState("grid");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");

  const notify = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [resPredios, resAndares, resAmbientes, resDispositivos] =
        await Promise.all([
          requisicaoAPI("/predios?limite=200"),
          requisicaoAPI("/andares?limite=200"),
          requisicaoAPI("/ambientes?limite=200"),
          requisicaoAPI("/dispositivos?limite=200"),
        ]);

      setPredios(
        deduplicarPor(resPredios.dados, "id_predio").sort(
          (a, b) => a.id_predio - b.id_predio
        )
      );
      setAndares(
        deduplicarPor(resAndares.dados, "id_andar").sort(
          (a, b) => a.numero_andar - b.numero_andar
        )
      );
      setAmbientes(
        deduplicarPor(resAmbientes.dados, "id_ambiente").sort(
          (a, b) => a.id_ambiente - b.id_ambiente
        )
      );
      setDispositivosBrutos(
        deduplicarPor(resDispositivos.dados, "id_dispositivo").sort(
          (a, b) => a.id_dispositivo - b.id_dispositivo
        )
      );
    } catch (erro) {
      notify(erro.message || "Erro ao carregar dispositivos do banco de dados.");
    } finally {
      setCarregando(false);
    }
  }, [notify]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setSelectedId(null);
        setShowModal(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const devices = useMemo(() => {
    const mapaPredios = new Map(predios.map((p) => [p.id_predio, p]));
    const mapaAndares = new Map(andares.map((a) => [a.id_andar, a]));
    const mapaAmbientes = new Map(ambientes.map((amb) => [amb.id_ambiente, amb]));

    return dispositivosBrutos.map((dev) => {
      const amb = mapaAmbientes.get(dev.id_ambiente);
      const andar = amb ? mapaAndares.get(amb.id_andar) : null;
      const predio = andar ? mapaPredios.get(andar.id_predio) : null;

      const tipoKey = (dev.tipo_dispositivo || "energia").toLowerCase();
      const tipoCfg = TIPO_CONFIG[tipoKey] || TIPO_CONFIG.energia;
      const statusKey = (dev.status_dispositivo || "ativo").toLowerCase();
      const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.ativo;

      const potenciaNum =
        dev.potencia_nominal_kw !== null && dev.potencia_nominal_kw !== undefined
          ? Number(dev.potencia_nominal_kw)
          : null;

      let reading = 0;
      if (statusKey === "ativo" || statusKey === "instavel") {
        if (tipoKey === "energia") {
          reading = potenciaNum ? Number((potenciaNum * 1.45).toFixed(1)) : 12.4;
        } else if (tipoKey === "temperatura") {
          reading = Number((22.5 + (dev.id_dispositivo % 4) * 0.6).toFixed(1));
        } else {
          reading = 450 + (dev.id_dispositivo % 5) * 40;
        }
      }

      const dataFmt = dev.data_dispositivo
        ? new Date(dev.data_dispositivo).toLocaleDateString("pt-BR")
        : "Sincronizado";

      return {
        id: dev.id_dispositivo,
        displayId: `DEV-${String(dev.id_dispositivo).padStart(3, "0")}`,
        name: dev.nome,
        code: dev.identificador || `ID-${dev.id_dispositivo}`,
        tipoKey,
        type: tipoCfg.label,
        unit: dev.unidade_medida || tipoCfg.unit,
        statusKey,
        status: statusCfg.label,
        signal: statusCfg.signal,
        id_ambiente: dev.id_ambiente,
        id_andar: andar?.id_andar ?? null,
        id_predio: predio?.id_predio ?? null,
        room: amb?.nome || "Ambiente não vinculado",
        floor: andar ? formatarNomeAndar(andar.numero_andar) : "Andar não definido",
        predioNome: predio?.nome_predio || "Edifício não identificado",
        manufacturer: dev.fabricante || "Não informado",
        model: dev.modelo || "Não informado",
        potenciaRaw: dev.potencia_nominal_kw ?? "",
        power:
          potenciaNum !== null
            ? `${potenciaNum.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`
            : "Não informado",
        reading,
        updated: dataFmt,
        serial: `${dev.identificador || "LUM"}-2026-${String(dev.id_dispositivo).padStart(5, "0")}`,
        description: `Equipamento de monitoramento de ${tipoCfg.label.toLowerCase()} instalado em ${amb?.nome || "ambiente corporativo"}.`,
        history:
          statusKey === "offline" || statusKey === "inativo"
            ? [45, 38, 32, 26, 20, 15, 10, 8, 5, 5, 5, 5]
            : tipoCfg.defaultHistory,
      };
    });
  }, [dispositivosBrutos, ambientes, andares, predios]);

  // Aplica filtros vindos da URL (?predio=...&andar=...&ambiente=...&dispositivo=...)
  useEffect(() => {
    if (carregando) return;

    const paramPredio = searchParams.get("predio") || "";
    const paramAndar = searchParams.get("andar") || "";
    const paramAmbiente = searchParams.get("ambiente") || "";
    const paramDispositivo = searchParams.get("dispositivo") || "";
    const chaveQuery = `${paramPredio}|${paramAndar}|${paramAmbiente}|${paramDispositivo}`;

    if (parametroAplicadoRef.current === chaveQuery) return;
    parametroAplicadoRef.current = chaveQuery;

    if (paramDispositivo) {
      const idDev = Number(paramDispositivo);
      const devObj = devices.find((d) => d.id === idDev);
      setSearch("");
      setTypeFilter("Todos");
      setStatusFilter("Todos");
      setPredioFilter(
        paramPredio
          ? String(paramPredio)
          : devObj?.id_predio
            ? String(devObj.id_predio)
            : "Todos"
      );
      setAndarFilter(
        paramAndar
          ? String(paramAndar)
          : devObj?.id_andar
            ? String(devObj.id_andar)
            : "Todos"
      );
      setAmbienteFilter(
        paramAmbiente
          ? String(paramAmbiente)
          : devObj?.id_ambiente
            ? String(devObj.id_ambiente)
            : "Todos"
      );
      if (devObj) {
        setSelectedId(devObj.id);
      }
      return;
    }

    if (paramAmbiente) {
      const idAmb = Number(paramAmbiente);
      const ambObj = ambientes.find((a) => a.id_ambiente === idAmb);
      const andarObj = ambObj
        ? andares.find((an) => an.id_andar === ambObj.id_andar)
        : null;
      setSearch("");
      setTypeFilter("Todos");
      setStatusFilter("Todos");
      setPredioFilter(
        paramPredio
          ? String(paramPredio)
          : andarObj?.id_predio
            ? String(andarObj.id_predio)
            : "Todos"
      );
      setAndarFilter(
        paramAndar
          ? String(paramAndar)
          : ambObj?.id_andar
            ? String(ambObj.id_andar)
            : "Todos"
      );
      setAmbienteFilter(String(idAmb));
      setSelectedId(null);
      return;
    }

    if (paramAndar) {
      const idAndar = Number(paramAndar);
      const andarObj = andares.find((an) => an.id_andar === idAndar);
      setSearch("");
      setTypeFilter("Todos");
      setStatusFilter("Todos");
      setPredioFilter(
        paramPredio
          ? String(paramPredio)
          : andarObj?.id_predio
            ? String(andarObj.id_predio)
            : "Todos"
      );
      setAndarFilter(String(idAndar));
      setAmbienteFilter("Todos");
      setSelectedId(null);
      return;
    }

    if (paramPredio) {
      setSearch("");
      setTypeFilter("Todos");
      setStatusFilter("Todos");
      setPredioFilter(String(paramPredio));
      setAndarFilter("Todos");
      setAmbienteFilter("Todos");
      setSelectedId(null);
    }
  }, [carregando, searchParams, devices, ambientes, andares]);

  const selected = useMemo(
    () => devices.find((d) => d.id === selectedId) || null,
    [devices, selectedId]
  );

  const andaresNoFiltro = useMemo(() => {
    if (predioFilter === "Todos") return andares;
    return andares.filter((a) => String(a.id_predio) === String(predioFilter));
  }, [andares, predioFilter]);

  const ambientesNoFiltro = useMemo(() => {
    return ambientes.filter((amb) => {
      if (
        andarFilter !== "Todos" &&
        String(amb.id_andar) !== String(andarFilter)
      ) {
        return false;
      }
      if (predioFilter !== "Todos") {
        const andarObj = andares.find((a) => a.id_andar === amb.id_andar);
        if (!andarObj || String(andarObj.id_predio) !== String(predioFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [ambientes, andares, predioFilter, andarFilter]);

  const filteredDevices = useMemo(() => {
    const term = search.toLowerCase().trim();

    return devices.filter((device) => {
      const matchesSearch =
        !term ||
        device.name.toLowerCase().includes(term) ||
        device.code.toLowerCase().includes(term) ||
        device.room.toLowerCase().includes(term) ||
        device.displayId.toLowerCase().includes(term);

      const matchesPredio =
        predioFilter === "Todos" ||
        String(device.id_predio) === String(predioFilter);

      const matchesAndar =
        andarFilter === "Todos" ||
        String(device.id_andar) === String(andarFilter);

      const matchesAmbiente =
        ambienteFilter === "Todos" ||
        String(device.id_ambiente) === String(ambienteFilter);

      const matchesType =
        typeFilter === "Todos" || device.tipoKey === typeFilter;

      const matchesStatus =
        statusFilter === "Todos" || device.statusKey === statusFilter;

      return (
        matchesSearch &&
        matchesPredio &&
        matchesAndar &&
        matchesAmbiente &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    devices,
    search,
    predioFilter,
    andarFilter,
    ambienteFilter,
    typeFilter,
    statusFilter,
  ]);

  const counts = useMemo(
    () => ({
      total: devices.length,
      active: devices.filter((d) => d.statusKey === "ativo").length,
      unstable: devices.filter((d) => d.statusKey === "instavel").length,
      offline: devices.filter(
        (d) => d.statusKey === "offline" || d.statusKey === "inativo"
      ).length,
      maintenance: devices.filter((d) => d.statusKey === "manutencao").length,
    }),
    [devices]
  );

  const ringStyle = useMemo(() => {
    const total = devices.length;
    if (!total) {
      return {
        background: "conic-gradient(rgba(148, 163, 184, 0.25) 0% 100%)",
      };
    }
    const pctActive = (counts.active / total) * 100;
    const pctUnstable = pctActive + (counts.unstable / total) * 100;
    return {
      background: `conic-gradient(#22c55e 0% ${pctActive.toFixed(2)}%, #f59e0b ${pctActive.toFixed(2)}% ${pctUnstable.toFixed(2)}%, #ef4444 ${pctUnstable.toFixed(2)}% 100%)`,
    };
  }, [devices.length, counts.active, counts.unstable]);

  const ambientesNoModal = useMemo(() => {
    if (!form.id_predio) return ambientes;
    return ambientes.filter((amb) => {
      const andarObj = andares.find((a) => a.id_andar === amb.id_andar);
      return andarObj && String(andarObj.id_predio) === String(form.id_predio);
    });
  }, [ambientes, andares, form.id_predio]);

  function openNewModal() {
    const predioPadrao =
      predioFilter !== "Todos"
        ? String(predioFilter)
        : String(predios[0]?.id_predio ?? "");
    const ambsDoPredio = ambientes.filter((amb) => {
      const andarObj = andares.find((a) => a.id_andar === amb.id_andar);
      return andarObj && String(andarObj.id_predio) === predioPadrao;
    });
    const ambPadrao =
      ambienteFilter !== "Todos"
        ? String(ambienteFilter)
        : String(ambsDoPredio[0]?.id_ambiente ?? ambientes[0]?.id_ambiente ?? "");

    setEditingId(null);
    setForm({
      ...emptyForm,
      id_predio: predioPadrao,
      id_ambiente: ambPadrao,
    });
    setShowModal(true);
  }

  function openEditModal(device) {
    setEditingId(device.id);
    setForm({
      nome: device.name,
      identificador: device.code,
      tipo_dispositivo: device.tipoKey,
      id_predio: device.id_predio ? String(device.id_predio) : "",
      id_ambiente: device.id_ambiente ? String(device.id_ambiente) : "",
      fabricante: device.manufacturer === "Não informado" ? "" : device.manufacturer,
      modelo: device.model === "Não informado" ? "" : device.model,
      potencia_nominal_kw: device.potenciaRaw,
      status_dispositivo: device.statusKey,
    });
    setShowModal(true);
  }

  async function updateStatus(id, newStatusKey) {
    try {
      setSalvando(true);
      await requisicaoAPI(`/dispositivos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status_dispositivo: newStatusKey }),
      });
      await carregarDados();
      notify("Status do dispositivo atualizado no banco de dados!");
    } catch (erro) {
      notify(erro.message || "Erro ao atualizar status do dispositivo.");
    } finally {
      setSalvando(false);
    }
  }

  function toggleDevice(device) {
    const nextStatus = device.statusKey === "ativo" ? "inativo" : "ativo";
    updateStatus(device.id, nextStatus);
  }

  async function saveDevice(e) {
    e.preventDefault();

    if (!form.nome.trim() || !form.identificador.trim() || !form.id_ambiente) {
      notify("Preencha nome, identificador e ambiente do dispositivo.");
      return;
    }

    const tipoCfg = TIPO_CONFIG[form.tipo_dispositivo] || TIPO_CONFIG.energia;
    const payload = {
      id_ambiente: Number(form.id_ambiente),
      nome: form.nome.trim(),
      identificador: form.identificador.trim(),
      tipo_dispositivo: form.tipo_dispositivo,
      unidade_medida: tipoCfg.unit,
      fabricante: form.fabricante.trim() || null,
      modelo: form.modelo.trim() || null,
      potencia_nominal_kw:
        form.potencia_nominal_kw === ""
          ? null
          : Number(form.potencia_nominal_kw),
      status_dispositivo: form.status_dispositivo,
    };

    try {
      setSalvando(true);
      if (editingId) {
        await requisicaoAPI(`/dispositivos/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        await carregarDados();
        setSelectedId(editingId);
        notify("Dispositivo atualizado no banco de dados!");
      } else {
        payload.data_dispositivo = new Date().toISOString().slice(0, 10);
        const criado = await requisicaoAPI("/dispositivos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        await carregarDados();
        if (criado?.dados?.id_dispositivo) {
          setSelectedId(criado.dados.id_dispositivo);
        }
        notify("Dispositivo cadastrado no banco de dados!");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (erro) {
      notify(erro.message || "Erro ao salvar dispositivo.");
    } finally {
      setSalvando(false);
    }
  }

  async function deleteDevice(device) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o dispositivo "${device.name}" (${device.code})?`
    );
    if (!confirmed) return;

    try {
      setSalvando(true);
      await requisicaoAPI(`/dispositivos/${device.id}`, {
        method: "DELETE",
      });
      setSelectedId(null);
      await carregarDados();
      notify("Dispositivo excluído com sucesso!");
    } catch (erro) {
      notify(
        erro.message ||
          "Não foi possível excluir este dispositivo (verifique se há leituras ou ocorrências vinculadas)."
      );
    } finally {
      setSalvando(false);
    }
  }

  function limparFiltros() {
    setSearch("");
    setPredioFilter("Todos");
    setAndarFilter("Todos");
    setAmbienteFilter("Todos");
    setTypeFilter("Todos");
    setStatusFilter("Todos");
    router.replace("/private/dispositivos");
  }

  const temFiltroAtivo =
    search ||
    predioFilter !== "Todos" ||
    andarFilter !== "Todos" ||
    ambienteFilter !== "Todos" ||
    typeFilter !== "Todos" ||
    statusFilter !== "Todos";

  const predioSelecionadoObj = useMemo(() => {
    if (predioFilter === "Todos") return predios[0] || null;
    return predios.find((p) => String(p.id_predio) === String(predioFilter)) || null;
  }, [predios, predioFilter]);

  return (
    <div className="dv-page">
      <div className="dv-ambient dv-ambient-one" />
      <div className="dv-ambient dv-ambient-two" />

      <header className="dv-heading">
        <div>
          <div className="dv-eyebrow">
            <span className="dv-eyebrow-line" />
            CENTRAL DE TELEMETRIA
            <span className="dv-live">
              <i /> SISTEMA ATIVO
            </span>
          </div>
          <h1>
            Dispositivos <span>IoT.</span>
          </h1>
          <p>
            Controle a rede de dispositivos, acompanhe leituras e identifique
            alterações na operação do edifício em tempo real.
          </p>
        </div>

        <button className="dv-add-button" onClick={openNewModal}>
          <span>＋</span>
          Adicionar dispositivo
        </button>
      </header>

      <section className="dv-command-bar">
        <div className="dv-command-title">
          <span className="dv-command-icon">⌘</span>
          <div>
            <b>REDE DE DISPOSITIVOS</b>
            <small>
              {predioSelecionadoObj
                ? `${predioSelecionadoObj.nome_predio} · ${predioSelecionadoObj.cidade || "Unidade corporativa"}`
                : "Todos os edifícios monitorados"}
            </small>
          </div>
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
            <span>Cadastrados no banco</span>
            <span className="dv-metric-tag">TOTAL</span>
          </div>
        </article>

        <article className="dv-metric">
          <div className="dv-metric-top">
            <span>EM OPERAÇÃO</span>
            <span className="dv-metric-symbol green">↗</span>
          </div>
          <strong className="dv-green-text">
            {counts.active.toString().padStart(2, "0")}
          </strong>
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
          <strong className="dv-yellow-text">
            {counts.unstable.toString().padStart(2, "0")}
          </strong>
          <div className="dv-metric-bottom">
            <span>Requer atenção</span>
            <span className="dv-metric-dot yellow" />
          </div>
        </article>

        <article className="dv-metric">
          <div className="dv-metric-top">
            <span>FORA DE OPERAÇÃO</span>
            <span className="dv-metric-symbol red">⊘</span>
          </div>
          <strong className="dv-red-text">
            {(counts.offline + counts.maintenance).toString().padStart(2, "0")}
          </strong>
          <div className="dv-metric-bottom">
            <span>
              {counts.offline} offline/inativo · {counts.maintenance} manutenção
            </span>
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
          <div className="dv-network-ring" style={ringStyle}>
            <div className="dv-network-ring-inner">
              <strong>
                {devices.length
                  ? Math.round((counts.active / devices.length) * 100)
                  : 0}
                %
              </strong>
              <span>OPERACIONAL</span>
            </div>
          </div>
          <div className="dv-network-legend">
            <span>
              <i className="green" /> Ativos <b>{counts.active}</b>
            </span>
            <span>
              <i className="yellow" /> Instáveis <b>{counts.unstable}</b>
            </span>
            <span>
              <i className="red" /> Offline / manutenção{" "}
              <b>{counts.offline + counts.maintenance}</b>
            </span>
          </div>
        </div>
        <div className="dv-network-decoration">
          LUMORA<span>_IOT</span>
        </div>
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
              ⊞
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-label="Visualização em lista"
            >
              ☰
            </button>
          </div>
        </div>

        <div className="dv-filters" style={{ flexWrap: "wrap" }}>
          <label className="dv-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, código ou ambiente..."
            />
          </label>

          <select
            value={predioFilter}
            onChange={(e) => {
              setPredioFilter(e.target.value);
              setAndarFilter("Todos");
              setAmbienteFilter("Todos");
            }}
          >
            <option value="Todos">Todos os prédios</option>
            {predios.map((p) => (
              <option key={p.id_predio} value={String(p.id_predio)}>
                {p.nome_predio}
              </option>
            ))}
          </select>

          <select
            value={andarFilter}
            onChange={(e) => {
              setAndarFilter(e.target.value);
              setAmbienteFilter("Todos");
            }}
          >
            <option value="Todos">Todos os andares</option>
            {andaresNoFiltro.map((a) => (
              <option key={a.id_andar} value={String(a.id_andar)}>
                {formatarNomeAndar(a.numero_andar)}
              </option>
            ))}
          </select>

          <select
            value={ambienteFilter}
            onChange={(e) => setAmbienteFilter(e.target.value)}
          >
            <option value="Todos">Todos os ambientes</option>
            {ambientesNoFiltro.map((amb) => (
              <option key={amb.id_ambiente} value={String(amb.id_ambiente)}>
                {amb.nome}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="Todos">Todos os tipos</option>
            <option value="energia">Energia</option>
            <option value="temperatura">Temperatura</option>
            <option value="iluminacao">Iluminação</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="instavel">Instável</option>
            <option value="manutencao">Manutenção</option>
            <option value="offline">Offline</option>
            <option value="inativo">Inativo</option>
          </select>

          {temFiltroAtivo && (
            <button
              type="button"
              className="dv-cancel"
              style={{ padding: "8px 12px" }}
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          )}

          <span className="dv-results">{filteredDevices.length} RESULTADOS</span>
        </div>

        {carregando ? (
          <div className="dv-empty">
            <h3>Carregando dispositivos...</h3>
            <p>Consultando equipamentos registrados no banco de dados.</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="dv-empty">
            <span>⌕</span>
            <h3>Nenhum dispositivo encontrado</h3>
            <p>Tente alterar os filtros ou adicione um novo equipamento.</p>
            <button onClick={limparFiltros}>Limpar filtros</button>
          </div>
        ) : (
          <div className={`dv-device-grid ${view === "list" ? "list-view" : ""}`}>
            {filteredDevices.map((device) => (
              <button
                type="button"
                className={`dv-device-card ${selected?.id === device.id ? "selected" : ""}`}
                key={device.id}
                onClick={() => setSelectedId(device.id)}
              >
                <div className="dv-card-top">
                  <DeviceIcon tipoKey={device.tipoKey} />
                  <Status statusKey={device.statusKey} />
                </div>

                <div className="dv-card-identity">
                  <span>
                    {device.code} / {device.displayId}
                  </span>
                  <h3>{device.name}</h3>
                  <p>
                    {device.room} · {device.floor}
                  </p>
                </div>

                <div className="dv-card-reading">
                  <span>LEITURA ATUAL</span>
                  <strong>
                    {device.reading.toLocaleString("pt-BR", {
                      maximumFractionDigits: 1,
                    })}
                    <small>{device.unit}</small>
                  </strong>
                </div>

                <div className="dv-card-footer">
                  <Signal value={device.signal} />
                  <span>
                    INSPECIONAR <b>↗</b>
                  </span>
                </div>
                <div
                  className={`dv-card-glow ${device.statusKey === "ativo" ? "glow-active" : ""}`}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <>
          <button
            className="dv-drawer-backdrop"
            onClick={() => setSelectedId(null)}
            aria-label="Fechar painel de inspeção"
          />
          <aside className="dv-drawer">
            <div className="dv-drawer-top">
              <div>
                <span className="dv-section-kicker">
                  DEVICE INSPECTOR / {selected.displayId}
                </span>
                <p>Central de inspeção</p>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  className="dv-cancel"
                  style={{ padding: "6px 10px", fontSize: "12px" }}
                  onClick={() => openEditModal(selected)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="dv-close"
                  onClick={() => setSelectedId(null)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="dv-drawer-device">
              <DeviceIcon tipoKey={selected.tipoKey} size="large" />
              <div>
                <h2>{selected.name}</h2>
                <span>
                  {selected.code} · {selected.model}
                </span>
              </div>
              <Status statusKey={selected.statusKey} />
            </div>

            <div className="dv-drawer-reading">
              <span>LEITURA REGISTRADA</span>
              <div>
                {selected.reading.toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })}
                <small>{selected.unit}</small>
              </div>
              <p>
                <i /> Cadastro: {selected.updated}
              </p>
              <MiniChart
                values={selected.history}
                gradientId={`dv-chart-${selected.id}`}
              />
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
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push(
                      `/private/ambientes?predio=${selected.id_predio || ""}&andar=${selected.id_andar || ""}&ambiente=${selected.id_ambiente}`
                    )
                  }
                  title="Abrir ambiente em Ambientes"
                >
                  <span>AMBIENTE ↗</span>
                  <b>{selected.room}</b>
                </div>
                <div>
                  <span>LOCALIZAÇÃO</span>
                  <b>
                    {selected.predioNome} · {selected.floor}
                  </b>
                </div>
                <div>
                  <span>FABRICANTE</span>
                  <b>{selected.manufacturer}</b>
                </div>
                <div>
                  <span>MODELO</span>
                  <b>{selected.model}</b>
                </div>
                <div>
                  <span>POTÊNCIA NOMINAL</span>
                  <b>{selected.power}</b>
                </div>
                <div>
                  <span>SINAL DE REDE</span>
                  <b>{selected.signal}%</b>
                </div>
              </div>
            </div>

            <div className="dv-drawer-section">
              <div className="dv-drawer-section-title">
                <h3>Identificação</h3>
                <span>02 / 02</span>
              </div>
              <div className="dv-serial">
                <span>NÚMERO DE SÉRIE / IDENTIFICADOR</span>
                <b>{selected.serial}</b>
              </div>
              <p className="dv-description">{selected.description}</p>
            </div>

            <div className="dv-drawer-controls">
              <span>CONTROLE OPERACIONAL (MYSQL)</span>
              <div className="dv-control-actions">
                <button
                  type="button"
                  className={
                    selected.statusKey === "ativo"
                      ? "dv-control-disable"
                      : "dv-control-enable"
                  }
                  onClick={() => toggleDevice(selected)}
                  disabled={
                    salvando ||
                    selected.statusKey === "manutencao" ||
                    selected.statusKey === "offline"
                  }
                >
                  {selected.statusKey === "ativo"
                    ? "Desativar dispositivo"
                    : "Ativar dispositivo"}
                </button>
                <select
                  value={selected.statusKey}
                  disabled={salvando}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  aria-label="Alterar status do dispositivo"
                >
                  <option value="ativo">Ativo</option>
                  <option value="instavel">Instável</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="offline">Offline</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => deleteDevice(selected)}
                  disabled={salvando}
                  style={{
                    background: "none",
                    border: 0,
                    color: "#dc2626",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Excluir dispositivo
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {showModal && (
        <div
          className="dv-modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <form
            className="dv-modal"
            onSubmit={saveDevice}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dv-modal-heading">
              <div>
                <span className="dv-section-kicker">
                  {editingId ? "ATUALIZAR ATIVO" : "NOVO ATIVO / CADASTRO"}
                </span>
                <h2>
                  {editingId ? "Editar dispositivo" : "Adicionar dispositivo"}
                </h2>
                <p>Salve os dados do equipamento diretamente no banco de dados.</p>
              </div>
              <button
                type="button"
                className="dv-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <label>
              Nome do dispositivo *
              <input
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex.: Sensor de temperatura"
              />
            </label>

            <div className="dv-form-row">
              <label>
                Identificador / Código *
                <input
                  required
                  value={form.identificador}
                  onChange={(e) =>
                    setForm({ ...form, identificador: e.target.value })
                  }
                  placeholder="Ex.: T-221"
                />
              </label>
              <label>
                Tipo *
                <select
                  value={form.tipo_dispositivo}
                  onChange={(e) =>
                    setForm({ ...form, tipo_dispositivo: e.target.value })
                  }
                >
                  <option value="energia">Energia (kWh)</option>
                  <option value="temperatura">Temperatura (°C)</option>
                  <option value="iluminacao">Iluminação (lux)</option>
                </select>
              </label>
            </div>

            <div className="dv-form-row">
              <label>
                Prédio
                <select
                  value={form.id_predio}
                  onChange={(e) => {
                    const novoPredio = e.target.value;
                    const ambsFiltrados = ambientes.filter((amb) => {
                      const andarObj = andares.find(
                        (a) => a.id_andar === amb.id_andar
                      );
                      return (
                        !novoPredio ||
                        (andarObj &&
                          String(andarObj.id_predio) === String(novoPredio))
                      );
                    });
                    setForm({
                      ...form,
                      id_predio: novoPredio,
                      id_ambiente: ambsFiltrados[0]
                        ? String(ambsFiltrados[0].id_ambiente)
                        : "",
                    });
                  }}
                >
                  <option value="">Todos os prédios</option>
                  {predios.map((p) => (
                    <option key={p.id_predio} value={String(p.id_predio)}>
                      {p.nome_predio}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Ambiente *
                <select
                  required
                  value={form.id_ambiente}
                  onChange={(e) =>
                    setForm({ ...form, id_ambiente: e.target.value })
                  }
                >
                  <option value="">Selecione o ambiente</option>
                  {ambientesNoModal.map((amb) => {
                    const andarObj = andares.find(
                      (a) => a.id_andar === amb.id_andar
                    );
                    return (
                      <option
                        key={amb.id_ambiente}
                        value={String(amb.id_ambiente)}
                      >
                        {amb.nome} (
                        {andarObj
                          ? formatarNomeAndar(andarObj.numero_andar)
                          : "Sem andar"}
                        )
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            <div className="dv-form-row">
              <label>
                Fabricante
                <input
                  value={form.fabricante}
                  onChange={(e) =>
                    setForm({ ...form, fabricante: e.target.value })
                  }
                  placeholder="Ex.: SensTech"
                />
              </label>
              <label>
                Modelo
                <input
                  value={form.modelo}
                  onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                  placeholder="Ex.: ST-Climate"
                />
              </label>
            </div>

            <div className="dv-form-row">
              <label>
                Potência nominal (kW)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.potencia_nominal_kw}
                  onChange={(e) =>
                    setForm({ ...form, potencia_nominal_kw: e.target.value })
                  }
                  placeholder="Ex.: 2.40"
                />
              </label>
              <label>
                Status inicial
                <select
                  value={form.status_dispositivo}
                  onChange={(e) =>
                    setForm({ ...form, status_dispositivo: e.target.value })
                  }
                >
                  <option value="ativo">Ativo</option>
                  <option value="instavel">Instável</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="offline">Offline</option>
                  <option value="inativo">Inativo</option>
                </select>
              </label>
            </div>

            <div className="dv-modal-actions">
              <button
                type="button"
                className="dv-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="dv-add-button"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : editingId
                    ? "Salvar alterações"
                    : "Cadastrar dispositivo"}{" "}
                <span>↗</span>
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

export default function Dispositivos() {
  return (
    <Suspense
      fallback={
        <div className="dv-page">
          <p>Carregando dispositivos...</p>
        </div>
      }
    >
      <DispositivosConteudo />
    </Suspense>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import "./historico-dispositivos.css";

const statusOpcoes = [
  ["ativo", "Ativo"],
  ["instavel", "Instável"],
  ["manutencao", "Em manutenção"],
  ["offline", "Offline"],
  ["inativo", "Inativo"],
];

function agoraLocal() {
  const data = new Date();
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  return data.toISOString().slice(0, 16);
}

function formatarLeitura(item) {
  const numero = (valor) => valor == null ? null : Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 4 });
  if (item.tipo_dispositivo === "energia") {
    if (item.leitura_consumo_kwh == null && item.leitura_potencia_kw == null) return "Sem leitura registrada";
    return `${numero(item.leitura_consumo_kwh) ?? "—"} kWh · ${numero(item.leitura_potencia_kw) ?? "—"} kW`;
  }
  if (item.tipo_dispositivo === "temperatura") {
    if (item.leitura_temperatura == null) return "Sem leitura registrada";
    return `${numero(item.leitura_temperatura)} °C${item.leitura_umidade != null ? ` · ${numero(item.leitura_umidade)}%` : ""}`;
  }
  if (item.tipo_dispositivo === "iluminacao") {
    return item.leitura_iluminacao == null ? "Sem leitura registrada" : `${numero(item.leitura_iluminacao)} lux`;
  }
  return "—";
}

export default function HistoricoDispositivosPage() {
  const [dispositivos, setDispositivos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    id_dispositivo: "",
    status_dispositivo: "ativo",
    data_inicio_status: agoraLocal(),
    data_fim_status: "",
    motivo: "",
    consumo_estimado_kwh: "",
    custo_estimado: "",
    consumo_kwh: "",
    potencia_kw: "",
    qualidade_medicao: "",
    temperatura_medida: "",
    umidade: "",
    iluminacao_medida: "",
    observacao: "",
  });

  const dispositivoSelecionado = dispositivos.find(
    (dispositivo) => String(dispositivo.id_dispositivo) === String(form.id_dispositivo)
  );
  const tipoSelecionado = dispositivoSelecionado?.tipo_dispositivo;

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [resDispositivos, resHistorico] = await Promise.all([
        requisicaoAPI("/historico-dispositivos/contexto"),
        requisicaoAPI("/historico-dispositivos"),
      ]);
      setDispositivos(resDispositivos.dados || []);
      setHistorico(resHistorico.dados || []);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await requisicaoAPI("/historico-dispositivos", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMensagem("Histórico registrado e status do dispositivo atualizado.");
      setForm((atual) => ({
        ...atual,
        data_inicio_status: agoraLocal(),
        data_fim_status: "",
        motivo: "",
        consumo_estimado_kwh: "",
        custo_estimado: "",
        consumo_kwh: "",
        potencia_kw: "",
        qualidade_medicao: "",
        temperatura_medida: "",
        umidade: "",
        iluminacao_medida: "",
        observacao: "",
      }));
      await carregarDados();
    } catch (e) {
      setErro(e.message || "Não foi possível registrar o histórico.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="device-history-page">
      <header className="dh-heading">
        <div><span>DISPOSITIVOS IOT</span><h1>Histórico de dispositivos</h1>
          <p>Registre mudanças de status, manutenção e observações dos dispositivos.</p></div>
      </header>

      {mensagem && <p className="dh-alert success">{mensagem}</p>}

      <section className="dh-card">
        <h2>Adicionar registro</h2>
        <form className="dh-form" onSubmit={salvar}>
          <label>Dispositivo
            <select required value={form.id_dispositivo} onChange={(e) => atualizar("id_dispositivo", e.target.value)}>
              <option value="">Selecione um dispositivo</option>
              {dispositivos.map((d) => <option key={d.id_dispositivo} value={d.id_dispositivo}>{d.nome} · {d.nome_ambiente || `#${d.id_dispositivo}`}</option>)}
            </select>
          </label>
          <label>Status registrado
            <select value={form.status_dispositivo} onChange={(e) => atualizar("status_dispositivo", e.target.value)}>
              {statusOpcoes.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </label>
          <label>Início do status
            <input required type="datetime-local" value={form.data_inicio_status} onChange={(e) => atualizar("data_inicio_status", e.target.value)} />
          </label>
          <label>Fim do status (opcional)
            <input type="datetime-local" value={form.data_fim_status} onChange={(e) => atualizar("data_fim_status", e.target.value)} />
          </label>
          <label>Motivo
            <input maxLength={255} value={form.motivo} onChange={(e) => atualizar("motivo", e.target.value)} placeholder="Ex.: manutenção preventiva" />
          </label>
          {tipoSelecionado && <div className="dh-measurement-fields dh-wide">
            <div className="dh-measurement-heading">
              <strong>Leitura do dispositivo</strong>
              <span>Esta medição será salva no histórico específico do tipo selecionado.</span>
            </div>
            <div className="dh-measurement-grid">
              {tipoSelecionado === "energia" && <>
                <label>Consumo medido (kWh)<input required type="number" min="0" step="0.0001" value={form.consumo_kwh} onChange={(e) => atualizar("consumo_kwh", e.target.value)} /></label>
                <label>Potência medida (kW)<input required type="number" min="0" step="0.0001" value={form.potencia_kw} onChange={(e) => atualizar("potencia_kw", e.target.value)} /></label>
                <label>Qualidade da medição<select value={form.qualidade_medicao} onChange={(e) => atualizar("qualidade_medicao", e.target.value)}><option value="">Não informada</option><option value="boa">Boa</option><option value="regular">Regular</option><option value="ruim">Ruim</option></select></label>
              </>}
              {tipoSelecionado === "temperatura" && <>
                <label>Temperatura medida (°C)<input required type="number" step="0.01" value={form.temperatura_medida} onChange={(e) => atualizar("temperatura_medida", e.target.value)} /></label>
                <label>Umidade (%)<input type="number" min="0" max="100" step="0.01" value={form.umidade} onChange={(e) => atualizar("umidade", e.target.value)} /></label>
              </>}
              {tipoSelecionado === "iluminacao" && <label>Iluminação medida (lux)<input required type="number" min="0" step="0.01" value={form.iluminacao_medida} onChange={(e) => atualizar("iluminacao_medida", e.target.value)} /></label>}
            </div>
          </div>}
          <label>Consumo estimado (kWh)
            <input type="number" min="0" step="0.0001" value={form.consumo_estimado_kwh} onChange={(e) => atualizar("consumo_estimado_kwh", e.target.value)} />
          </label>
          <label>Custo estimado (R$)
            <input type="number" min="0" step="0.01" value={form.custo_estimado} onChange={(e) => atualizar("custo_estimado", e.target.value)} />
          </label>
          <label className="dh-wide">Observação
            <textarea rows="3" value={form.observacao} onChange={(e) => atualizar("observacao", e.target.value)} placeholder="Detalhes do evento ou da manutenção" />
          </label>
          <div className="dh-wide dh-actions"><button type="submit" disabled={salvando || !dispositivos.length}>{salvando ? "Salvando..." : "Registrar histórico"}</button></div>
        </form>
      </section>

      <section className="dh-card">
        <div className="dh-list-heading"><h2>Registros recentes</h2><span>{historico.length} registros</span></div>
        {erro && <p className="dh-alert error">{erro}</p>}
        {carregando ? <p>Carregando histórico...</p> : dispositivos.length === 0 ? <p>Nenhum dispositivo cadastrado no prédio atual foi encontrado.</p> : historico.length === 0 ? <p>Nenhum histórico registrado.</p> : (
          <div className="dh-table-wrap"><table className="dh-table"><thead><tr><th>Data</th><th>Dispositivo</th><th>Leitura</th><th>Status</th><th>Motivo</th><th>Observação</th></tr></thead>
            <tbody>{historico.map((item) => <tr key={item.id_historico_dispositivo}>
              <td>{new Date(item.data_historico_dispositivo).toLocaleString("pt-BR")}</td>
              <td>{item.nome_dispositivo} · #{item.id_dispositivo}</td>
              <td>{formatarLeitura(item)}</td>
              <td><span className={`dh-status ${item.status_dispositivo}`}>{statusOpcoes.find(([v]) => v === item.status_dispositivo)?.[1] || item.status_dispositivo}</span></td>
              <td>{item.motivo || "—"}</td><td>{item.observacao || "—"}</td>
            </tr>)}</tbody></table></div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import { obterPredioAtual } from "@/services/predioAtual";
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
    observacao: "",
  });

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [resDispositivos, resHistorico, resAmbientes, resAndares] = await Promise.all([
        requisicaoAPI("/dispositivos?limite=300"),
        requisicaoAPI("/historico-dispositivos"),
        requisicaoAPI("/ambientes?limite=300"),
        requisicaoAPI("/andares?limite=300"),
      ]);
      const idPredioAtual = Number(obterPredioAtual()?.id_predio);
      const idsAndares = new Set((resAndares.dados || [])
        .filter((andar) => Number(andar.id_predio) === idPredioAtual)
        .map((andar) => Number(andar.id_andar)));
      const idsAmbientes = new Set((resAmbientes.dados || [])
        .filter((ambiente) => idsAndares.has(Number(ambiente.id_andar)))
        .map((ambiente) => Number(ambiente.id_ambiente)));
      const dispositivosAtuais = (resDispositivos.dados || [])
        .filter((dispositivo) => idsAmbientes.has(Number(dispositivo.id_ambiente)));
      const idsDispositivos = new Set(dispositivosAtuais.map((d) => Number(d.id_dispositivo)));
      setDispositivos(dispositivosAtuais);
      setHistorico((resHistorico.dados || [])
        .filter((registro) => idsDispositivos.has(Number(registro.id_dispositivo))));
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
              {dispositivos.map((d) => <option key={d.id_dispositivo} value={d.id_dispositivo}>{d.nome} · #{d.id_dispositivo}</option>)}
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
        {carregando ? <p>Carregando histórico...</p> : historico.length === 0 ? <p>Nenhum histórico registrado.</p> : (
          <div className="dh-table-wrap"><table><thead><tr><th>Data</th><th>Dispositivo</th><th>Status</th><th>Motivo</th><th>Observação</th></tr></thead>
            <tbody>{historico.map((item) => <tr key={item.id_historico_dispositivo}>
              <td>{new Date(item.data_historico_dispositivo).toLocaleString("pt-BR")}</td>
              <td>{item.nome_dispositivo} · #{item.id_dispositivo}</td>
              <td>{statusOpcoes.find(([v]) => v === item.status_dispositivo)?.[1] || item.status_dispositivo}</td>
              <td>{item.motivo || "—"}</td><td>{item.observacao || "—"}</td>
            </tr>)}</tbody></table></div>
        )}
      </section>
    </main>
  );
}

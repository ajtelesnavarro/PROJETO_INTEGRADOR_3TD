"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import "./historico.css";

const status = {
  aberto: "Aberta",
  em_andamento: "Em andamento",
  concluido: "Concluída",
  cancelado: "Cancelada",
};
const prioridade = { baixa: "Baixa", media: "Média", alta: "Alta" };

export default function HistoricoReclamacoesPage() {
  const [registros, setRegistros] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await requisicaoAPI("/reclamacoes");
      setRegistros(resposta.dados || []);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar o histórico.");
    } finally { setCarregando(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const filtrados = useMemo(() => registros.filter((item) => {
    const correspondeStatus = filtro === "todos" || item.status_chamado === filtro;
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const texto = `${item.id_reclamacao} ${item.descricao_usuario || ""} ${item.categoria_problema || ""} ${item.id_dispositivo || ""} ${item.id_ambiente || ""}`.toLocaleLowerCase("pt-BR");
    return correspondeStatus && (!termo || texto.includes(termo));
  }), [registros, filtro, busca]);

  return <main className="complaint-history">
    <header className="ch-heading">
      <div><span>ATENDIMENTO</span><h1>Histórico de reclamações</h1><p>Acompanhe as solicitações registradas e seus status atuais.</p></div>
      <button type="button" onClick={carregar}>Atualizar histórico</button>
    </header>
    <section className="ch-summary">
      <article><small>Total de reclamações</small><strong>{registros.length}</strong></article>
      <article><small>Abertas</small><strong>{registros.filter(x => x.status_chamado === "aberto").length}</strong></article>
      <article><small>Em andamento</small><strong>{registros.filter(x => x.status_chamado === "em_andamento").length}</strong></article>
      <article><small>Concluídas</small><strong>{registros.filter(x => x.status_chamado === "concluido").length}</strong></article>
    </section>
    <section className="ch-panel">
      <div className="ch-tools">
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por descrição, categoria ou número..." />
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="todos">Todos os status</option><option value="aberto">Abertas</option><option value="em_andamento">Em andamento</option><option value="concluido">Concluídas</option><option value="cancelado">Canceladas</option>
        </select>
      </div>
      {erro && <p className="ch-error">{erro}</p>}
      {carregando ? <p className="ch-empty">Carregando reclamações...</p> : filtrados.length === 0 ? <p className="ch-empty">Nenhuma reclamação encontrada.</p> : <div className="ch-list">
        {filtrados.map(item => <article className="ch-item" key={item.id_reclamacao}>
          <div className="ch-item-top"><div><span className="ch-number">RECLAMAÇÃO #{item.id_reclamacao}</span><time>{item.data_hora_recebido ? new Date(item.data_hora_recebido).toLocaleString("pt-BR") : "Data não informada"}</time></div><span className={`ch-status ${item.status_chamado}`}>{status[item.status_chamado] || item.status_chamado}</span></div>
          <p>{item.descricao_usuario}</p>
          <div className="ch-meta"><span>Categoria: {item.categoria_problema || "Não informada"}</span><span>Prioridade: {prioridade[item.prioridade] || item.prioridade || "—"}</span><span>Ambiente: {item.id_ambiente ? `#${item.id_ambiente}` : "—"}</span><span>Dispositivo: {item.id_dispositivo ? `#${item.id_dispositivo}` : "—"}</span></div>
          {item.id_usuario_responsavel && <small className="ch-responsavel">Responsável: usuário #{item.id_usuario_responsavel}</small>}
        </article>)}
      </div>}
    </section>
  </main>;
}

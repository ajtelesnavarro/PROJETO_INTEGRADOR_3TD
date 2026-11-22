"use client";
import { useEffect, useState } from "react";
import { apiFetch, unwrap } from "@/lib/api";

export default function HistoricoPage() {
  const [dados, setDados] = useState({ leituras: [], acessos: [], ocorrencias: [] });
  const [erro, setErro] = useState("");
  useEffect(() => { apiFetch("/historico?limite=100").then((r) => setDados(unwrap(r))).catch((e) => setErro(e.message)); }, []);
  return <section style={{ padding: 24 }}><h1>Histórico</h1><p>Leituras, acessos e ocorrências registradas no sistema.</p>{erro && <p>{erro}</p>}<h2>Leituras</h2><ul>{dados.leituras.map(x => <li key={`${x.tipo}-${x.id}`}>{x.tipo} — {x.dispositivo}: {x.valor} {x.unidade} — {new Date(x.data_hora).toLocaleString()}</li>)}</ul><h2>Acessos</h2><ul>{dados.acessos.map(x => <li key={`a-${x.id}`}>{x.tipo_acesso} — {x.decisao_acesso} — {x.ambiente} — {new Date(x.data_hora).toLocaleString()}</li>)}</ul><h2>Ocorrências</h2><ul>{dados.ocorrencias.map(x => <li key={`o-${x.id}`}>{x.titulo} — {x.status_ocorrencia} — {new Date(x.data_hora).toLocaleString()}</li>)}</ul></section>;
}

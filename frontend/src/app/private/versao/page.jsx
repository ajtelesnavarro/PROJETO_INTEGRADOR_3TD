"use client";
import { useEffect, useState } from "react";
import { apiFetch, unwrap } from "@/lib/api";
export default function VersaoPage() {
  const [versoes, setVersoes] = useState([]);
  useEffect(() => { apiFetch("/versao").then(r => setVersoes(unwrap(r))).catch(() => {}); }, []);
  return <section style={{ padding: 24 }}><h1>Versão do sistema</h1>{versoes.map(v => <article key={v.id_versao} style={{ marginBottom: 20 }}><h2>{v.versao}</h2><small>{new Date(v.data_publicacao).toLocaleString()}</small><p>{v.notas}</p></article>)}</section>;
}

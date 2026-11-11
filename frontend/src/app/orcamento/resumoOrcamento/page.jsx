"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

export default function ResumoOrcamentoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    const [orcamento, setOrcamento] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!id) return;

        requisicaoAPI(`/orcamentos/${id}`)
            .then(setOrcamento)
            .catch((erro) => setErro(erro.message));
    }, [id]);

    async function aprovar() {
        try {
            await requisicaoAPI(`/orcamentos/${id}/aprovar`, {
                method: "PATCH"
            });

            router.push(`/pedido/criacao?idOrcamento=${id}`);
        } catch (erro) {
            setErro(erro.message);
        }
    }

    async function recusar() {
        try {
            await requisicaoAPI(`/orcamentos/${id}/recusar`, {
                method: "PATCH"
            });

            router.push("/orcamento");
        } catch (erro) {
            setErro(erro.message);
        }
    }

    if (!orcamento) return <p>{erro || "Carregando orçamento..."}</p>;

    return (
        <div>
            <h1>Resumo do Orçamento</h1>

            <p>Empresa: {orcamento.nome_empresa}</p>
            <p>Responsável: {orcamento.nome_responsavel}</p>
            <p>Serviços: {orcamento.servicos_desejados}</p>
            <p>Subtotal: {orcamento.valor_subtotal}</p>
            <p>Desconto: {orcamento.valor_desconto}</p>
            <p>Valor total: {orcamento.valor_total}</p>
            <p>Prazo: {orcamento.prazo_estimado_dias} dias</p>
            <p>Validade: {orcamento.data_validade}</p>
            <p>Status: {orcamento.status_orcamento}</p>

            {erro && <p>{erro}</p>}

            <button onClick={aprovar}>Aprovar</button>
            <button onClick={recusar}>Recusar</button>
        </div>
    );
}
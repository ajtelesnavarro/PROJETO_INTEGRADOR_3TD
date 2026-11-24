"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./styles.css";

export default function ConfirmacaoPedidoPage() {
    const searchParams = useSearchParams();

    const idPagamento = searchParams.get("idPagamento");

    const [pagamento, setPagamento] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!idPagamento) return;

        requisicaoAPI(`/pagamentos/${idPagamento}`)
            .then(setPagamento)
            .catch((erro) => setErro(erro.message));
    }, [idPagamento]);

    if (!pagamento) {
        return (
            <main className="confirmacao-page">
                <p className={erro ? "confirmacao-erro" : "confirmacao-carregando"}>
                    {erro || "Consultando pagamento..."}
                </p>
            </main>
        );
    }

    return (
        <main className="confirmacao-page">
            <section className={`confirmacao-card ${pagamento.status_pagamento === "aprovado" ? "confirmacao-aprovado" : ""}`}>
                <span className="confirmacao-icone" aria-hidden="true">
                    {pagamento.status_pagamento === "aprovado" ? "✓" : "…"}
                </span>
                <span className="confirmacao-kicker">LUMORA SMARTBUILDING</span>
                <h1>Resultado do pagamento</h1>

                <div className="confirmacao-dados">
                    <div><span>Pedido</span><strong>#{pagamento.id_pedido}</strong></div>
                    <div><span>Valor</span><strong>{Number(pagamento.valor_pago || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
                    <div><span>Método</span><strong>{pagamento.metodo_pagamento?.replaceAll("_", " ")}</strong></div>
                </div>

            {pagamento.status_pagamento === "aprovado" ? (
                <>
                    <h2>Pedido confirmado!</h2>
                    <p>Pagamento aprovado na simulação. Nenhum valor real foi cobrado.</p>
                    <p>Código da transação: {pagamento.codigo_transacao}</p>
                </>
            ) : pagamento.status_pagamento === "recusado" ? (
                <>
                    <h2>Pagamento recusado</h2>
                    <p>N├úo foi possível confirmar seu pedido.</p>
                </>
            ) : (
                <>
                    <h2>Pagamento pendente</h2>
                    <p>Aguardando confirmação do pagamento.</p>
                </>
            )}
            </section>
        </main>
    );
}

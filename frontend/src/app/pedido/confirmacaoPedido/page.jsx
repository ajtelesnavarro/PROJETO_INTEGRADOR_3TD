"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

function ConfirmacaoPedidoConteudo() {
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
        return <p>{erro || "Consultando pagamento..."}</p>;
    }

    return (
        <div>
            <h1>Resultado do Pagamento</h1>

            <p>Pedido: {pagamento.id_pedido}</p>
            <p>Valor: {pagamento.valor_pago}</p>
            <p>Método: {pagamento.metodo_pagamento}</p>

            {pagamento.status_pagamento === "aprovado" ? (
                <>
                    <h2>Pedido confirmado!</h2>
                    <p>Pagamento aprovado.</p>
                    <p>Código da transação: {pagamento.codigo_transacao}</p>
                </>
            ) : pagamento.status_pagamento === "recusado" ? (
                <>
                    <h2>Pagamento recusado</h2>
                    <p>Não foi possível confirmar seu pedido.</p>
                </>
            ) : (
                <>
                    <h2>Pagamento pendente</h2>
                    <p>Aguardando confirmação do pagamento.</p>
                </>
            )}
        </div>
    );
}

export default function ConfirmacaoPedidoPage() {
    return (
        <Suspense fallback={<p>Consultando pagamento...</p>}>
            <ConfirmacaoPedidoConteudo />
        </Suspense>
    );
}
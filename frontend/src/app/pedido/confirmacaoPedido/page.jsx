"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

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
        return <p>{erro || "Consultando pagamento..."}</p>;
    }

    return (
        <div>
            <h1>Resultado do Pagamento</h1>

            <p>Pedido: {pagamento.id_pedido}</p>
            <p>Valor: {pagamento.valor_pago}</p>
            <p>M├®todo: {pagamento.metodo_pagamento}</p>

            {pagamento.status_pagamento === "aprovado" ? (
                <>
                    <h2>Pedido confirmado!</h2>
                    <p>Pagamento aprovado.</p>
                    <p>C├│digo da transa├º├úo: {pagamento.codigo_transacao}</p>
                </>
            ) : pagamento.status_pagamento === "recusado" ? (
                <>
                    <h2>Pagamento recusado</h2>
                    <p>N├úo foi poss├¡vel confirmar seu pedido.</p>
                </>
            ) : (
                <>
                    <h2>Pagamento pendente</h2>
                    <p>Aguardando confirma├º├úo do pagamento.</p>
                </>
            )}
        </div>
    );
}

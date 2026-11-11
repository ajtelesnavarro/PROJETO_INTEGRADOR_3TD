"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

function ResumoPedidoConteudo() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    const [pedido, setPedido] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!id) return;

        requisicaoAPI(`/pedidos/${id}`)
            .then(setPedido)
            .catch((erro) => setErro(erro.message));
    }, [id]);

    if (!pedido) return <p>{erro || "Carregando pedido..."}</p>;

    return (
        <div>
            <h1>Resumo do Pedido</h1>

            <p>Número do pedido: {pedido.id_pedido}</p>
            <p>Empresa: {pedido.nome_empresa}</p>
            <p>Serviços: {pedido.servicos_desejados}</p>
            <p>Valor contratado: {pedido.valor_contratado}</p>
            <p>Prazo estimado: {pedido.prazo_estimado_dias} dias</p>
            <p>Status: {pedido.status_pedido}</p>

            <button
                onClick={() => router.push(`/pedido/pagamentoPedido?id=${id}`)}
            >
                Realizar pagamento
            </button>
        </div>
    );
}

export default function ResumoPedidoPage() {
    return (
        <Suspense fallback={<p>Carregando pedido...</p>}>
            <ResumoPedidoConteudo />
        </Suspense>
    );
}
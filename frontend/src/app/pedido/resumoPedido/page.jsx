"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./styles.css";

export default function ResumoPedidoPage() {
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

    if (!pedido) {
        return (
            <main className="pedido-resumo-page">
                <p className={erro ? "pedido-resumo-erro" : "pedido-resumo-carregando"}>
                    {erro || "Carregando pedido..."}
                </p>
            </main>
        );
    }

    return (
        <main className="pedido-resumo-page">
            <section className="pedido-resumo-card">
                <span className="pedido-resumo-kicker">LUMORA SMARTBUILDING</span>
                <div className="pedido-resumo-cabecalho">
                    <div>
                        <h1>Resumo do pedido</h1>
                        <p>Confira os dados antes de continuar para o pagamento.</p>
                    </div>
                    <span className="pedido-resumo-status">{pedido.status_pedido?.replaceAll("_", " ")}</span>
                </div>

                <div className="pedido-resumo-dados">
                    <div><span>Número do pedido</span><strong>#{pedido.id_pedido}</strong></div>
                    <div><span>Empresa</span><strong>{pedido.nome_empresa || "Não informada"}</strong></div>
                    <div><span>Serviços</span><strong>{pedido.servicos_desejados || "Não informados"}</strong></div>
                    <div><span>Prazo estimado</span><strong>{pedido.prazo_estimado_dias != null ? `${pedido.prazo_estimado_dias} dias` : "A definir"}</strong></div>
                </div>

                <div className="pedido-resumo-total">
                    <span>Valor contratado</span>
                    <strong>{Number(pedido.valor_contratado || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                </div>

                <button
                    className="pedido-resumo-botao"
                    onClick={() => router.push(`/pedido/pagamentoPedido?id=${id}`)}
                >
                    Realizar pagamento <span aria-hidden="true">→</span>
                </button>
            </section>
        </main>
    );
}

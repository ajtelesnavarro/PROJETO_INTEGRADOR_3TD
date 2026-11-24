"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./styles.css";

export default function CriarPedidoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const idOrcamento = searchParams.get("idOrcamento");

    const [erro, setErro] = useState("");

    async function criarPedido() {
        try {
            const dados = await requisicaoAPI("/pedidos", {
                method: "POST",
                body: JSON.stringify({ idOrcamento: Number(idOrcamento) })
            });

            router.push(`/pedido/resumoPedido?id=${dados.idPedido}`);
        } catch (erro) {
            setErro(erro.message);
        }
    }

    useEffect(() => {
        if (idOrcamento) {
            criarPedido();
        }
    }, [idOrcamento]);

    return (
        <main className="route-loading pedido-criacao-page" aria-label="Preparando pedido">
            <section className="loading-card">
                <img className="loading-logo" src="/images/logotipo.png" alt="Lumora Smartbuilding" />
                {!erro && <span className="loading-progress" aria-hidden="true"><i /></span>}
                <p>{erro ? "Não foi possível preparar seu pedido." : "Criando seu pedido..."}</p>
                {erro && <p className="pedido-criacao-erro" role="alert">{erro}</p>}
            </section>
        </main>
    );
}

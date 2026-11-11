"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

function CriarPedidoConteudo() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const idOrcamento = searchParams.get("idOrcamento");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function criarPedido() {
        try {
            setCarregando(true);

            const dados = await requisicaoAPI("/pedidos", {
                method: "POST",
                body: JSON.stringify({ idOrcamento: Number(idOrcamento) })
            });

            router.push(`/pedido/resumoPedido?id=${dados.idPedido}`);
        } catch (erro) {
            setErro(erro.message);
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (idOrcamento) {
            criarPedido();
        }
    }, [idOrcamento]);

    return (
        <div>
            <h1>Criação do Pedido</h1>

            {carregando && <p>Criando pedido...</p>}
            {erro && <p>{erro}</p>}
        </div>
    );
}

export default function CriarPedidoPage() {
    return (
        <Suspense fallback={<p>Criando pedido...</p>}>
            <CriarPedidoConteudo />
        </Suspense>
    );
}
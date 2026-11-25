"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
<<<<<<< HEAD
=======
import "./styles.css";
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

export default function CriarPedidoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const idOrcamento = searchParams.get("idOrcamento");

    const [erro, setErro] = useState("");
<<<<<<< HEAD
    const [carregando, setCarregando] = useState(false);

    async function criarPedido() {
        try {
            setCarregando(true);

=======

    async function criarPedido() {
        try {
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
            const dados = await requisicaoAPI("/pedidos", {
                method: "POST",
                body: JSON.stringify({ idOrcamento: Number(idOrcamento) })
            });

            router.push(`/pedido/resumoPedido?id=${dados.idPedido}`);
        } catch (erro) {
            setErro(erro.message);
<<<<<<< HEAD
            setCarregando(false);
=======
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
        }
    }

    useEffect(() => {
        if (idOrcamento) {
            criarPedido();
        }
    }, [idOrcamento]);

    return (
<<<<<<< HEAD
        <div>
            <h1>Cria├º├úo do Pedido</h1>

            {carregando && <p>Criando pedido...</p>}
            {erro && <p>{erro}</p>}
        </div>
=======
        <main className="route-loading pedido-criacao-page" aria-label="Preparando pedido">
            <section className="loading-card">
                <img className="loading-logo" src="/images/logotipo.png" alt="Lumora Smartbuilding" />
                {!erro && <span className="loading-progress" aria-hidden="true"><i /></span>}
                <p>{erro ? "Não foi possível preparar seu pedido." : "Criando seu pedido..."}</p>
                {erro && <p className="pedido-criacao-erro" role="alert">{erro}</p>}
            </section>
        </main>
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
    );
}

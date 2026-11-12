"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

export default function PagamentoPedidoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const idPedido = searchParams.get("id");

    const [metodoPagamento, setMetodoPagamento] = useState("pix");
    const [erro, setErro] = useState("");

    async function handlePayment(event) {
        event.preventDefault();

        try {
            const dados = await requisicaoAPI("/pagamentos", {
                method: "POST",
                body: JSON.stringify({
                    idPedido: Number(idPedido),
                    metodoPagamento
                })
            });

            router.push(
                `/pedido/confirmacaoPedido?idPagamento=${dados.idPagamento}`
            );
        } catch (erro) {
            setErro(erro.message);
        }
    }

    return (
        <div>
            <h1>Pagamento do Pedido</h1>

            <form onSubmit={handlePayment}>
                <label>M├®todo de pagamento:</label>

                <select
                    value={metodoPagamento}
                    onChange={(event) => setMetodoPagamento(event.target.value)}
                >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cart├úo de cr├®dito</option>
                    <option value="cartao_debito">Cart├úo de d├®bito</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transfer├¬ncia</option>
                </select>

                {erro && <p>{erro}</p>}

                <button type="submit">Continuar pagamento</button>
            </form>
        </div>
    );
}

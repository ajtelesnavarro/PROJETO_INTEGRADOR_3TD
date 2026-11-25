"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
<<<<<<< HEAD
=======
import "./styles.css";
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

export default function PagamentoPedidoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
<<<<<<< HEAD

    const idPedido = searchParams.get("id");

    const [metodoPagamento, setMetodoPagamento] = useState("pix");
    const [erro, setErro] = useState("");

    async function handlePayment(event) {
        event.preventDefault();
=======
    const idPedido = searchParams.get("id");

    const [metodoPagamento, setMetodoPagamento] = useState("pix");
    const [dadosFicticios, setDadosFicticios] = useState({});
    const [erro, setErro] = useState("");
    const [processando, setProcessando] = useState(false);

    function atualizarCampo(event) {
        setDadosFicticios((atuais) => ({
            ...atuais,
            [event.target.name]: event.target.value,
        }));
    }

    async function handlePayment(event) {
        event.preventDefault();
        setErro("");
        setProcessando(true);
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

        try {
            const dados = await requisicaoAPI("/pagamentos", {
                method: "POST",
                body: JSON.stringify({
                    idPedido: Number(idPedido),
<<<<<<< HEAD
                    metodoPagamento
                })
=======
                    metodoPagamento,
                    dadosFicticios,
                }),
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
            });

            router.push(
                `/pedido/confirmacaoPedido?idPagamento=${dados.idPagamento}`
            );
        } catch (erro) {
            setErro(erro.message);
<<<<<<< HEAD
=======
            setProcessando(false);
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
        }
    }

    return (
<<<<<<< HEAD
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
=======
        <main className="pagamento-page">
            <section className="pagamento-card">
                <span className="pagamento-kicker">PEDIDO {idPedido ? `#${idPedido}` : ""}</span>
            <h1>Simulação de pagamento</h1>
            <p className="pagamento-aviso">Use apenas dados fictícios. Nenhum valor real será cobrado.</p>

            <form className="pagamento-form" onSubmit={handlePayment}>
                <label className="pagamento-campo" htmlFor="metodoPagamento">Método de pagamento</label>
                <select
                    id="metodoPagamento"
                    value={metodoPagamento}
                    onChange={(event) => {
                        setMetodoPagamento(event.target.value);
                        setDadosFicticios({});
                        setErro("");
                    }}
                >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de crédito</option>
                    <option value="cartao_debito">Cartão de débito</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferência</option>
                </select>

                {(metodoPagamento === "cartao_credito" || metodoPagamento === "cartao_debito") && (
                    <fieldset>
                        <legend>Dados fictícios do cartão</legend>
                        <label className="pagamento-campo">
                            Nome no cartão
                            <input
                                name="titular"
                                value={dadosFicticios.titular || ""}
                                onChange={atualizarCampo}
                                placeholder="CLIENTE DE TESTE"
                                required
                            />
                        </label>
                        <label className="pagamento-campo">
                            Número do cartão
                            <input
                                name="numeroCartao"
                                value={dadosFicticios.numeroCartao || ""}
                                onChange={atualizarCampo}
                                placeholder="1234 5678 9012 3456"
                                inputMode="numeric"
                                required
                            />
                        </label>
                        <label className="pagamento-campo">
                            Validade (MM/AA)
                            <input
                                name="validade"
                                value={dadosFicticios.validade || ""}
                                onChange={atualizarCampo}
                                placeholder="12/30"
                                required
                            />
                        </label>
                        <label className="pagamento-campo">
                            CVV fictício
                            <input
                                name="cvv"
                                value={dadosFicticios.cvv || ""}
                                onChange={atualizarCampo}
                                placeholder="123"
                                inputMode="numeric"
                                required
                            />
                        </label>
                    </fieldset>
                )}

                {metodoPagamento === "pix" && (
                    <label className="pagamento-campo">
                        Código PIX fictício
                        <input
                            name="codigoPix"
                            value={dadosFicticios.codigoPix || ""}
                            onChange={atualizarCampo}
                            placeholder="PIX-TESTE-123"
                            required
                        />
                    </label>
                )}

                {metodoPagamento === "boleto" && (
                    <label className="pagamento-campo">
                        Código de barras fictício
                        <input
                            name="codigoBarras"
                            value={dadosFicticios.codigoBarras || ""}
                            onChange={atualizarCampo}
                            placeholder="12345678901234567890"
                            inputMode="numeric"
                            required
                        />
                    </label>
                )}

                {metodoPagamento === "transferencia" && (
                    <label className="pagamento-campo">
                        Referência fictícia da transferência
                        <input
                            name="referencia"
                            value={dadosFicticios.referencia || ""}
                            onChange={atualizarCampo}
                            placeholder="TRANSF-TESTE-123"
                            required
                        />
                    </label>
                )}

                {erro && <p className="pagamento-erro" role="alert">{erro}</p>}

                <button className="pagamento-botao" type="submit" disabled={processando}>
                    {processando ? "Processando simulação..." : "Simular pagamento"}
                </button>
            </form>
            </section>
        </main>
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
    );
}

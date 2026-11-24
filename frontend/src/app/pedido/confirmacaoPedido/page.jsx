"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./styles.css";

export default function ConfirmacaoPedidoPage() {
    const searchParams = useSearchParams();

    const idPagamento = searchParams.get("idPagamento");

    const [pagamento, setPagamento] = useState(null);
    const [orcamento, setOrcamento] = useState(null);
    const [predioCriado, setPredioCriado] = useState(null);
    const [dadosPredio, setDadosPredio] = useState({
        nome_predio: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const [salvandoPredio, setSalvandoPredio] = useState(false);
    const [erroPredio, setErroPredio] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
  if (!idPagamento) return;

  async function carregarConfirmacao() {
    try {
      const dadosPagamento = await requisicaoAPI(
        `/pagamentos/${idPagamento}`
      );
      setPagamento(dadosPagamento);

      if (dadosPagamento.status_pagamento === "aprovado") {
        const dadosOrcamento = await requisicaoAPI(
          `/pagamentos/${idPagamento}/orcamento`
        );
        setOrcamento(dadosOrcamento);
        const respostaPredio = await requisicaoAPI(`/pagamentos/${idPagamento}/predio`);
        if (respostaPredio.dados) {
          setPredioCriado(respostaPredio.dados);
          setDadosPredio((atual) => ({ ...atual, nome_predio: respostaPredio.dados.nome_predio }));
        }
      }
    } catch (erro) {
      setErro(erro.message);
    }
  }

  carregarConfirmacao();
}, [idPagamento]);

    function atualizarCampoPredio(event) {
        const { name, value } = event.target;
        setDadosPredio((atual) => ({
            ...atual,
            [name]: name === "estado" ? value.toUpperCase().slice(0, 2) : value,
        }));
    }

    async function cadastrarPredio(event) {
        event.preventDefault();
        setErroPredio("");
        setSalvandoPredio(true);
        try {
            const resposta = await requisicaoAPI(`/pagamentos/${idPagamento}/predio`, {
                method: "POST",
                body: JSON.stringify(dadosPredio),
            });
            setPredioCriado(resposta.dados);
        } catch (erro) {
            setErroPredio(erro.message);
        } finally {
            setSalvandoPredio(false);
        }
    }

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

                {erro && <p className="confirmacao-erro">{erro}</p>}

            {pagamento.status_pagamento === "aprovado" ? (
                <>
                    <h2>Pedido confirmado!</h2>
                    <p>Pagamento aprovado na simulação. Nenhum valor real foi cobrado.</p>
                    <p>Código da transação: {pagamento.codigo_transacao}</p>
                    {orcamento && <p>Orçamento: {orcamento.nome_empresa}</p>}
                    {predioCriado ? (
                        <div className="confirmacao-predio-sucesso">
                            <h3>Prédio cadastrado!</h3>
                            <p><strong>{predioCriado.nome_predio || dadosPredio.nome_predio}</strong> foi vinculado ao pedido #{pagamento.id_pedido}.</p>
                            <p>{predioCriado.quantidade_andares ?? orcamento?.quantidade_andares ?? 0} andares foram criados.</p>
                        </div>
                    ) : (
                        <form className="confirmacao-predio-form" onSubmit={cadastrarPredio}>
                            <h3>Cadastre o prédio do pedido</h3>
                            <p>Informe o endereço para criar o prédio e os {orcamento?.quantidade_andares ?? ""} andares contratados.</p>
                            {erroPredio && <p className="confirmacao-erro">{erroPredio}</p>}
                            <label>Nome do prédio<input name="nome_predio" value={dadosPredio.nome_predio} onChange={atualizarCampoPredio} required maxLength={100} /></label>
                            <label>CEP<input name="cep" value={dadosPredio.cep} onChange={atualizarCampoPredio} required maxLength={9} placeholder="00000-000" /></label>
                            <label>Rua<input name="rua" value={dadosPredio.rua} onChange={atualizarCampoPredio} required maxLength={100} /></label>
                            <label>Número<input name="numero" value={dadosPredio.numero} onChange={atualizarCampoPredio} required maxLength={10} /></label>
                            <label>Complemento (opcional)<input name="complemento" value={dadosPredio.complemento} onChange={atualizarCampoPredio} maxLength={100} /></label>
                            <label>Bairro<input name="bairro" value={dadosPredio.bairro} onChange={atualizarCampoPredio} required maxLength={100} /></label>
                            <label>Cidade<input name="cidade" value={dadosPredio.cidade} onChange={atualizarCampoPredio} required maxLength={100} /></label>
                            <label>Estado (UF)
                                <select
                                    name="estado"
                                    value={dadosPredio.estado}
                                    onChange={atualizarCampoPredio}
                                    required
                                >
                                    <option value="">Selecione o estado</option>
                                    {[
                                        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",
                                        "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
                                        "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
                                        "SP", "SE", "TO"
                                    ].map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                    </select>
                            </label>
                            <button type="submit" disabled={salvandoPredio}>{salvandoPredio ? "Cadastrando..." : "Criar prédio"}</button>
                        </form>
                    )}
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
            </section>
        </main>
    );
}

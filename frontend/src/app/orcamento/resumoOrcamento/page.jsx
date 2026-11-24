"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import "./resumoOrcamento.css";

export default function ResumoOrcamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [orcamento, setOrcamento] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (!id) {
      setErro("Identificador do orçamento não informado.");
      setCarregando(false);
      return;
    }

    requisicaoAPI(`/orcamentos/${id}`)
      .then((resposta) => {
        const dados =
          resposta.dados?.dados ??
          resposta.dados ??
          resposta.orcamento ??
          resposta;

        setOrcamento(dados);
      })
      .catch((erro) => setErro(erro.message))
      .finally(() => setCarregando(false));
  }, [id]);

  async function aprovar() {
    try {
      setProcessando(true);
      setErro("");

      await requisicaoAPI(`/orcamentos/${id}/aprovar`, {
        method: "PATCH",
      });

      router.push(`/pedido/criacao?idOrcamento=${id}`);
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setProcessando(false);
    }
  }

  async function recusar() {
    try {
      setProcessando(true);
      setErro("");

      await requisicaoAPI(`/orcamentos/${id}/recusar`, {
        method: "PATCH",
      });

      router.push("/orcamento");
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setProcessando(false);
    }
  }

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const quantidadeAndares = Number(orcamento?.quantidade_andares || 0);
  const quantidadeAmbientes = Number(orcamento?.quantidade_ambientes || 0);
  const quantidadeDispositivos = Number(
    orcamento?.quantidade_dispositivos || 0
  );

  const valorAndares = quantidadeAndares * 95;
  const valorAmbientes = quantidadeAmbientes * 32;
  const valorDispositivos = quantidadeDispositivos * 18;

  const valorEstrutura = valorAndares + valorAmbientes + valorDispositivos;

  const valorSubtotal = Number(orcamento?.valor_subtotal || 0);

  const servicos = Array.isArray(orcamento?.servicos)
  ? orcamento.servicos
  : [];

  const valorServicos = servicos.reduce(
    (total, servico) => total + Number(servico.valor_servico || 0),
    0
  );

  const valorDesconto = Number(orcamento?.valor_desconto || 0);
  const valorTotal = Number(orcamento?.valor_total || 0);

  const percentualDesconto =
    valorSubtotal > 0 ? (valorDesconto / valorSubtotal) * 100 : 0;

  if (carregando) {
    return (
      <main className="resumo-page">
        <div className="resumo-mensagem">Carregando orçamento...</div>
      </main>
    );
  }

  if (erro && !orcamento) {
    return (
      <main className="resumo-page">
        <div className="resumo-mensagem erro">
          <h2>Não foi possível carregar o orçamento</h2>
          <p>{erro}</p>
          <button onClick={() => router.push("/orcamento")}>Voltar</button>
        </div>
      </main>
    );
  }

  if (!orcamento) return null;

  return (
    <main className="resumo-page">
      <div className="resumo-container">
        <header className="resumo-header">
          <span className="resumo-kicker">LUMORA SMARTBUILDING</span>

          <h1>Resumo do orçamento</h1>

          <p>
            Confira os detalhes da solicitação e os valores apresentados para o
            seu projeto.
          </p>

          <span className="resumo-id">ORÇAMENTO Nº {id}</span>
        </header>

        {erro && <div className="resumo-alerta">{erro}</div>}

        <section className="resumo-card">
          <div className="resumo-card-header">
            <div>
              <span className="resumo-label">SOLICITAÇÃO</span>
              <h2>Dados do projeto</h2>
            </div>
            <span className="resumo-status">{orcamento.status_orcamento || "Solicitado"}</span>
          </div>

          <div className="resumo-dados">
            <div>
              <span>Empresa</span>
              <strong>{orcamento.nome_empresa || "Não informado"}</strong>
            </div>

            <div>
              <span>Responsável</span>
              <strong>{orcamento.nome_responsavel || "Não informado"}</strong>
            </div>

            <div>
              <span>E-mail</span>
              <strong>{orcamento.email || "Não informado"}</strong>
            </div>

            <div>
              <span>Telefone</span>
              <strong>{orcamento.telefone || "Não informado"}</strong>
            </div>

            <div>
              <span>Quantidade de andares</span>
              <strong>{orcamento.quantidade_andares ?? 0}</strong>
            </div>

            <div>
              <span>Quantidade de ambientes</span>
              <strong>{orcamento.quantidade_ambientes ?? 0}</strong>
            </div>

            <div>
              <span>Quantidade de dispositivos</span>
              <strong>{orcamento.quantidade_dispositivos ?? 0}</strong>
            </div>

            <div>
              <span>Serviços desejados</span>
              <strong>{servicos.length ? servicos.map((servico) => servico.nome_servico.replaceAll("_", " ")).join(", ") : "Nenhum serviço selecionado"}</strong>
            </div>
          </div>

          {orcamento.descricao && (
            <div className="resumo-descricao">
              <span>Descrição do projeto</span>
              <p>{orcamento.descricao}</p>
            </div>
          )}
        </section>

        <section className="resumo-card">
          <div className="resumo-card-header">
            <div>
              <span className="resumo-label">INVESTIMENTO</span>
              <h2>Detalhamento do orçamento</h2>
              <p className="investimento-descricao">
                Confira a composição dos custos do seu projeto.
              </p>
            </div>
          </div>

          <div className="investimento-grupo">
            <h3>1. Estrutura do edifício</h3>

            <div className="investimento-linha">
              <div>
                <strong>Instalação por andar</strong>
                <small>{quantidadeAndares} × R$ 95,00</small>
              </div>
              <span>{moeda(valorAndares)}</span>
            </div>

            <div className="investimento-linha">
              <div>
                <strong>Configuração por ambiente</strong>
                <small>{quantidadeAmbientes} × R$ 32,00</small>
              </div>
              <span>{moeda(valorAmbientes)}</span>
            </div>

            <div className="investimento-linha">
              <div>
                <strong>Integração por dispositivo</strong>
                <small>{quantidadeDispositivos} × R$ 18,00</small>
              </div>
              <span>{moeda(valorDispositivos)}</span>
            </div>

            <div className="investimento-subtotal">
              <span>Subtotal da estrutura</span>
              <strong>{moeda(valorEstrutura)}</strong>
            </div>
          </div>

          <div className="investimento-grupo">
            <h3>2. Serviços e funcionalidades</h3>

            <div className="investimento-linha">
              <div>
                <strong>Serviços do projeto</strong>
                <small>{servicos.length ? servicos.map((servico) => servico.nome_servico.replaceAll("_", " ")).join(", ") : "Nenhum serviço selecionado"}</small>
              </div>

              <span>{moeda(valorServicos)}</span>
            </div>

            <div className="investimento-subtotal">
              <span>Subtotal dos serviços</span>
              <strong>{moeda(valorServicos)}</strong>
            </div>
          </div>

          <div className="investimento-resumo">
            <div>
              <span>Subtotal geral</span>
              <strong>{moeda(valorSubtotal)}</strong>
            </div>

            <div className="investimento-desconto">
              <span>
                Desconto ({percentualDesconto.toFixed(2).replace(".", ",")}%)
              </span>
              <strong>- {moeda(valorDesconto)}</strong>
            </div>

            <div className="investimento-total">
              <span>Investimento total</span>
              <strong>{moeda(valorTotal)}</strong>
            </div>

          </div>
        </section>

        <section className="resumo-card resumo-prazo">
          <div>
            <span>Prazo estimado</span>
            <strong>
              {orcamento.prazo_estimado_dias != null
                ? `${orcamento.prazo_estimado_dias} dias`
                : "A definir"}
            </strong>
          </div>

          <div>
            <span>Validade da proposta</span>
            <strong>
              {orcamento.data_validade
                ? new Date(
                    `${String(orcamento.data_validade).slice(0, 10)}T12:00:00`
                  ).toLocaleDateString("pt-BR")
                : "Não informada"}
            </strong>
          </div>
        </section>

        <section className="resumo-acoes">
          <p>Confira todas as informações antes de decidir sobre a proposta.</p>

          <div className="resumo-botoes">
            <button
              className="btn-recusar"
              onClick={recusar}
              disabled={processando}
            >
              Recusar orçamento
            </button>

            <button
              className="btn-aprovar"
              onClick={aprovar}
              disabled={processando}
            >
              {processando ? "Processando..." : "Aprovar orçamento"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

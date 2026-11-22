"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, unwrap } from "../../lib/api";
import "./orcamento-locador.css";

const catalogo = [
  { id: "monitoramento_temperatura", nome: "Monitoramento de temperatura", descricao: "Acompanhamento das condições térmicas", preco: 480, icone: "◉" },
  { id: "controle_iluminacao", nome: "Controle de iluminação", descricao: "Gestão e eficiência da iluminação", preco: 620, icone: "✳" },
  { id: "monitoramento_energia", nome: "Monitoramento de energia", descricao: "Acompanhamento do consumo energético", preco: 750, icone: "ϟ" },
  { id: "controle_acesso", nome: "Controle de acesso", descricao: "Registro e gestão de entradas", preco: 890, icone: "⌑" },
  { id: "monitoramento_dispositivos", nome: "Monitoramento de dispositivos", descricao: "Acompanhamento dos dispositivos cadastrados", preco: 540, icone: "⌘" },
];

const etapas = ["Orçamento", "Resumo", "Pedido", "Resumo do pedido", "Pagamento", "Confirmação"];
const moeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor || 0));
const dataBR = (data) => new Intl.DateTimeFormat("pt-BR").format(data);

const inicial = {
  empresa: "", responsavel: "", email: "", senha: "", telefone: "", tipoEdificio: "Comercial",
  andares: 1, ambientes: 1, dispositivos: 1, servicos: [], desconto: 0,
  prazo: 20, validade: 15, observacoes: "",
};

function Icone({ children }) { return <span className="loc-icon" aria-hidden="true">{children}</span>; }

export default function OrcamentoLocador() {
  const [etapa, setEtapa] = useState(0);
  const [form, setForm] = useState(inicial);
  const [metodo, setMetodo] = useState("pix");
  const [resultado, setResultado] = useState("");
  const [aviso, setAviso] = useState("");
  const [numeroOrcamento, setNumeroOrcamento] = useState("");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(null);
  const [dataValidade, setDataValidade] = useState(null);
  const [codigoTransacao, setCodigoTransacao] = useState("");
  const [idOrcamento, setIdOrcamento] = useState(null);
  const [idPedido, setIdPedido] = useState(null);
  const [erroApi, setErroApi] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const router = useRouter();

  const valores = useMemo(() => {
    const servicos = form.servicos.reduce((soma, id) => soma + (catalogo.find((item) => item.id === id)?.preco || 0), 0);
    const equipamentos = Number(form.dispositivos || 0) * 185;
    const instalacao = Number(form.dispositivos || 0) * 95 + Number(form.andares || 0) * 120;
    const subtotal = servicos + equipamentos + instalacao;
    const desconto = Math.min(subtotal, subtotal * (Number(form.desconto || 0) / 100));
    return { servicos, equipamentos, instalacao, subtotal, desconto, total: subtotal - desconto };
  }, [form]);

  function alterar(campo, valor) { setForm((atual) => ({ ...atual, [campo]: valor })); }
  function alternarServico(id) {
    setForm((atual) => ({ ...atual, servicos: atual.servicos.includes(id) ? atual.servicos.filter((item) => item !== id) : [...atual.servicos, id] }));
  }
  function iniciarResumo(evento) {
    evento.preventDefault();
    if (!form.empresa.trim() || !form.responsavel.trim() || !form.email.trim() || !form.telefone.trim()) {
      setAviso("Preencha os dados da empresa, responsável, e-mail e telefone."); return;
    }
    if (!form.andares || !form.ambientes || form.servicos.length === 0) {
      setAviso("Informe pelo menos um andar, um ambiente e selecione um serviço."); return;
    }
    if (!form.senha || form.senha.length < 6) {
      setAviso("Crie uma senha com pelo menos 6 caracteres para continuar.");
      return;
    }
    setAviso("");
    setMostrarConfirmacao(true);
  }

  async function confirmarDados() {
    setErroApi("");
    try {
      const resposta = await apiFetch("/orcamentos", {
        method: "POST",
        body: JSON.stringify({
          nomeResponsavel: form.responsavel, nomeEmpresa: form.empresa, email: form.email, senha: form.senha,
          telefone: form.telefone, tipoEdificio: form.tipoEdificio, quantidadeAndares: Number(form.andares),
          quantidadeAmbientes: Number(form.ambientes), quantidadeDispositivos: Number(form.dispositivos),
          servicosDesejados: form.servicos, descricao: form.observacoes, valorSubtotal: valores.subtotal,
          valorDesconto: valores.desconto, valorTotal: valores.total, descontoPercentual: Number(form.desconto),
          prazoEstimadoDias: Number(form.prazo), dataValidade: new Date(Date.now() + Number(form.validade) * 86400000).toISOString().slice(0,10)
        })
      });
      const dados = unwrap(resposta);
      const id = resposta.idOrcamento ?? dados?.id_orcamento ?? dados?.idOrcamento;
      const agora = dados?.data_solicitacao ? new Date(dados.data_solicitacao) : new Date();
      const validade = dados?.data_validade ? new Date(dados.data_validade) : new Date(agora.getTime() + Number(form.validade) * 86400000);
      setIdOrcamento(id);
      setNumeroOrcamento(id ? `LUM-ORC-${id}` : `LUM-ORC-${agora.getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`);
      setDataSolicitacao(agora); setDataValidade(validade); setMostrarConfirmacao(false);
      sessionStorage.setItem("lumora_orcamento_dados", JSON.stringify({
        empresa: form.empresa, responsavel: form.responsavel, email: form.email, telefone: form.telefone,
        tipoEdificio: form.tipoEdificio, andares: form.andares, ambientes: form.ambientes, dispositivos: form.dispositivos,
        servicos: form.servicos, observacoes: form.observacoes, numeroOrcamento: id ? `LUM-ORC-${id}` : ""
      }));
      setEtapa(1);
    } catch (error) {
      setErroApi(error.message);
    }
  }

  async function aprovarOrcamento() {
    try {
      if (!idOrcamento) throw new Error("Orçamento ainda não foi salvo na API.");
      await apiFetch(`/orcamentos/${idOrcamento}/aprovar`, { method: "PATCH" });
      const resposta = await apiFetch("/pedidos", { method: "POST", body: JSON.stringify({ idOrcamento }) });
      const pedido = unwrap(resposta);
      const id = resposta.idPedido ?? pedido?.id_pedido ?? pedido?.idPedido;
      setIdPedido(id);
      setNumeroPedido(id ? `LUM-PED-${id}` : `LUM-PED-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`);
      setResultado("aguardando_pagamento");
      setEtapa(2);
    } catch (error) { setErroApi(error.message); }
  }

  async function recusarOrcamento() {
    try {
      if (idOrcamento) await apiFetch(`/orcamentos/${idOrcamento}/recusar`, { method: "PATCH" });
      setResultado("orcamento_recusado"); setEtapa(5);
    } catch (error) { setErroApi(error.message); }
  }

  async function pagar() {
    try {
      if (!idPedido) throw new Error("Pedido ainda não foi criado na API.");
      const resposta = await apiFetch("/pagamentos", { method: "POST", body: JSON.stringify({ idPedido, metodoPagamento: metodo }) });
      const pagamento = unwrap(resposta);
      const idPagamento = resposta.idPagamento ?? pagamento?.id_pagamento ?? pagamento?.idPagamento;
      const codigo = `DEMO-${String(idPagamento || Date.now()).slice(-8)}`;
      if (idPagamento) await apiFetch(`/pagamentos/${idPagamento}/resultado`, { method: "PATCH", body: JSON.stringify({ status: "aprovado", codigoTransacao: codigo }) });
      setCodigoTransacao(codigo);
      setResultado("pagamento_aprovado_demo");
      setEtapa(5);
    } catch (error) { setErroApi(error.message); }
  }

  return (
    <main className="loc-quote-page">
      <div className="loc-quote-wrap">
        <header className="loc-page-heading">
          <div>
            <span className="loc-eyebrow">FALE COM A LUMORA · PROPOSTA COMERCIAL</span>
            <h1>Solicite um orçamento para seu edifício</h1>
            <p>Conte sobre seu edifício, escolha os serviços e acompanhe todas as etapas da proposta comercial.</p>
          </div>
          <Link href="/" className="loc-back-link">← Voltar ao início</Link>
        </header>

        {erroApi && <div className="loc-alert" role="alert">{erroApi}</div>}

        <nav className="loc-stepper" aria-label="Etapas do orçamento">
          {etapas.map((nome, indice) => (
            <div key={nome} className={`loc-step ${etapa === indice ? "current" : ""} ${etapa > indice ? "done" : ""}`}>
              <span>{etapa > indice ? "✓" : String(indice + 1).padStart(2, "0")}</span>
              <small>{nome}</small>
            </div>
          ))}
        </nav>

        {etapa === 0 && (
          <div className="loc-content-grid">
            <section className="loc-intro-card">
              <div className="loc-secure-mark"><span>✓</span> PROCESSO SEGURO</div>
              <h2>Uma proposta clara para cuidar melhor do seu edifício.</h2>
              <p>Conte um pouco sobre a estrutura e selecione os serviços de interesse. A estimativa será apresentada antes de qualquer decisão.</p>
              <div className="loc-trust-list">
                <div><b>01</b><span><strong>Transparência</strong><small>Valores separados por categoria.</small></span></div>
                <div><b>02</b><span><strong>Sem compromisso</strong><small>Você pode revisar ou recusar a proposta.</small></span></div>
                <div><b>03</b><span><strong>Controle em cada etapa</strong><small>O pedido só é criado após sua aprovação.</small></span></div>
              </div>
              <div className="loc-help-note"><span>i</span><p>Os valores exibidos nesta demonstração são estimativas ilustrativas e não representam uma cobrança real.</p></div>
            </section>

            <form className="loc-form-card" onSubmit={iniciarResumo}>
              <div className="loc-card-heading"><div><span className="loc-eyebrow">ETAPA 01 · SOLICITAÇÃO</span><h2>Monte seu orçamento</h2></div><span className="loc-card-lock">⌑ Seguro</span></div>
              <section className="loc-form-section">
                <h3><i>1</i> Dados do solicitante</h3>
                <div className="loc-fields">
                  <label className="wide">Nome da empresa<input value={form.empresa} onChange={(e) => alterar("empresa", e.target.value)} placeholder="Ex.: Edifício Central Ltda." required /></label>
                  <label>Nome do responsável<input value={form.responsavel} onChange={(e) => alterar("responsavel", e.target.value)} placeholder="Nome completo" required /></label>
                  <label>E-mail<input type="email" value={form.email} onChange={(e) => alterar("email", e.target.value)} placeholder="nome@empresa.com" required /></label>
                  <label>Senha de acesso<input type="password" value={form.senha} onChange={(e) => alterar("senha", e.target.value)} placeholder="Mínimo de 6 caracteres" minLength={6} required /></label>
                  <label>Telefone<input value={form.telefone} onChange={(e) => alterar("telefone", e.target.value)} placeholder="(11) 99999-9999" required /></label>
                  <label>Tipo de edifício<select value={form.tipoEdificio} onChange={(e) => alterar("tipoEdificio", e.target.value)}><option disabled>Comercial</option><option>Corporativo</option><option  disabled>Residencial</option><option  disabled>Outro</option></select></label>
                </div>
              </section>
              <section className="loc-form-section">
                <h3><i>2</i> Dimensão do edifício</h3>
                <div className="loc-count-grid">
                  {[ ["andares", "Andares"], ["ambientes", "Ambientes"], ["dispositivos", "Dispositivos"] ].map(([campo, nome]) => (
                    <label key={campo}><span>{nome}</span><div><button type="button" onClick={() => alterar(campo, Math.max(campo === "dispositivos" ? 0 : 1, Number(form[campo]) - 1))}>−</button><strong>{form[campo]}</strong><button type="button" onClick={() => alterar(campo, Number(form[campo]) + 1)}>+</button></div></label>
                  ))}
                </div>
              </section>
              <section className="loc-form-section">
                <h3><i>3</i> Serviços desejados</h3>
                <div className="loc-service-grid">
                  {catalogo.map((servico) => {
                    const marcado = form.servicos.includes(servico.id);
                    return <button type="button" key={servico.id} onClick={() => alternarServico(servico.id)} className={`loc-service-choice ${marcado ? "selected" : ""}`} aria-pressed={marcado}>
                      <span className="loc-service-symbol">{servico.icone}</span><span><strong>{servico.nome}</strong><small>{servico.descricao}</small></span><b>{marcado ? "✓" : "+"}</b>
                    </button>;
                  })}
                </div>
              </section>
              <section className="loc-form-section">
                <h3><i>4</i> Informações adicionais</h3>
                <div className="loc-fields">
                  <label>Prazo estimado desejado (dias)<input type="number" min="1" max="365" value={form.prazo} onChange={(e) => alterar("prazo", Math.max(1, Number(e.target.value)))} /></label>
                  <label>Validade da proposta (dias)<input type="number" min="1" max="90" value={form.validade} onChange={(e) => alterar("validade", Math.min(90, Math.max(1, Number(e.target.value))))} /></label>
                  <label className="wide">Observações<textarea rows="3" value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Descreva necessidades específicas do edifício..." /></label>
                </div>
              </section>
              <div className="loc-estimate-strip"><span>Estimativa parcial</span><strong>{moeda(valores.total)}</strong><small>O valor final será exibido no resumo.</small></div>
              {aviso && <p className="loc-alert" role="alert">{aviso}</p>}
              <button className="loc-primary" type="submit">Calcular orçamento <span>→</span></button>
            </form>
          </div>
        )}

        {etapa === 1 && (
          <section className="loc-document-card">
            <div className="loc-document-top"><div><span className="loc-eyebrow">ETAPA 02 · PROPOSTA COMERCIAL</span><h2>Resumo do orçamento</h2><p>Confira os dados e os valores antes de aprovar ou recusar.</p></div><div className="loc-document-brand"><b>LUMORA</b><small>EDIFÍCIOS INTELIGENTES</small></div></div>
            <div className="loc-reference-row"><span>Nº do orçamento<strong>{numeroOrcamento}</strong></span><span>Solicitado em<strong>{dataSolicitacao ? dataBR(dataSolicitacao) : "—"}</strong></span><span>Válido até<strong>{dataValidade ? dataBR(dataValidade) : "—"}</strong></span></div>
            <div className="loc-document-columns"><div><h3>Empresa solicitante</h3><strong>{form.empresa}</strong><p>{form.responsavel}</p><p>{form.email}</p><p>{form.telefone}</p><span className="loc-muted">Edifício {form.tipoEdificio.toLowerCase()}</span></div><div><h3>Escopo solicitado</h3><p>{form.andares} andar(es) · {form.ambientes} ambiente(s)</p><p>{form.dispositivos} dispositivo(s)</p><p>Prazo estimado: {form.prazo} dias</p><p>{form.observacoes || "Sem observações adicionais."}</p></div></div>
            <div className="loc-table-wrap"><h3>Composição do orçamento</h3><div className="loc-price-row"><span>Serviços selecionados ({form.servicos.length})</span><strong>{moeda(valores.servicos)}</strong></div><div className="loc-price-row"><span>Equipamentos estimados ({form.dispositivos} unidades)</span><strong>{moeda(valores.equipamentos)}</strong></div><div className="loc-price-row"><span>Instalação e configuração</span><strong>{moeda(valores.instalacao)}</strong></div><div className="loc-price-row"><span>Subtotal</span><strong>{moeda(valores.subtotal)}</strong></div><div className="loc-price-row"><span>Desconto ({form.desconto}%)</span><strong className="loc-discount">− {moeda(valores.desconto)}</strong></div><div className="loc-price-total"><span>Valor total da proposta</span><strong>{moeda(valores.total)}</strong></div><p className="loc-price-disclaimer">Estimativa demonstrativa. A composição e os valores finais dependem da validação comercial da Lumora.</p></div>
            <div className="loc-document-actions"><button className="loc-secondary" onClick={() => setEtapa(0)}>← Editar solicitação</button><div><button className="loc-decline" onClick={recusarOrcamento}>Recusar proposta</button><button className="loc-primary compact" onClick={aprovarOrcamento}>Aprovar orçamento <span>→</span></button></div></div>
          </section>
        )}

        {etapa === 2 && (
          <section className="loc-state-card"><div className="loc-state-icon blue">✓</div><span className="loc-eyebrow">ETAPA 03 · CRIAÇÃO DO PEDIDO</span><h2>Orçamento aprovado!</h2><p>Seu aceite foi registrado nesta demonstração. O pedido foi criado e está aguardando a etapa de pagamento.</p><div className="loc-order-number"><span>Número do pedido</span><strong>{numeroPedido}</strong><small>Orçamento relacionado: {numeroOrcamento}</small></div><button className="loc-primary" onClick={() => setEtapa(3)}>Ver resumo do pedido <span>→</span></button></section>
        )}

        {etapa === 3 && (
          <section className="loc-document-card loc-order-document"><div className="loc-document-top"><div><span className="loc-eyebrow">ETAPA 04 · CONTRATAÇÃO</span><h2>Resumo do pedido</h2><p>Revise os serviços contratados e as condições antes de seguir para o pagamento.</p></div><span className="loc-order-status">Aguardando pagamento</span></div><div className="loc-reference-row"><span>Nº do pedido<strong>{numeroPedido}</strong></span><span>Orçamento<strong>{numeroOrcamento}</strong></span><span>Data da contratação<strong>{dataBR(new Date())}</strong></span></div><div className="loc-order-details"><div><span>Contratante</span><strong>{form.empresa}</strong><small>{form.responsavel} · {form.email}</small></div><div><span>Serviços contratados</span>{form.servicos.map((id) => <small key={id}>✓ {catalogo.find((s) => s.id === id)?.nome}</small>)}</div><div><span>Condições de pagamento</span><strong>Pagamento único</strong><small>Método selecionado na próxima etapa.</small></div></div><div className="loc-order-total"><span>Valor contratado</span><strong>{moeda(valores.total)}</strong></div><div className="loc-document-actions"><button className="loc-secondary" onClick={() => setEtapa(1)}>Voltar ao orçamento</button><button className="loc-primary compact" onClick={() => setEtapa(4)}>Continuar para pagamento <span>→</span></button></div></section>
        )}

        {etapa === 4 && (
          <section className="loc-payment-card"><div className="loc-payment-heading"><span className="loc-eyebrow">ETAPA 05 · PAGAMENTO</span><h2>Pagamento do pedido</h2><p>Escolha uma forma de pagamento para concluir a demonstração do fluxo.</p></div><div className="loc-payment-total"><span>Valor a pagar</span><strong>{moeda(valores.total)}</strong><small>Pedido {numeroPedido}</small></div><h3>Selecione o método de pagamento</h3><div className="loc-payment-methods">{[["pix", "◇", "PIX", "Confirmação demonstrativa imediata"], ["cartao_credito", "▤", "Cartão de crédito", "Opção de cartão (sem inserir dados)"], ["boleto", "▥", "Boleto bancário", "Representação visual de boleto"]].map(([id, icon, nome, desc]) => <button type="button" key={id} className={`loc-payment-method ${metodo === id ? "active" : ""}`} onClick={() => setMetodo(id)}><span>{icon}</span><div><strong>{nome}</strong><small>{desc}</small></div><i>{metodo === id ? "●" : "○"}</i></button>)}</div><div className="loc-payment-security"><span>⌑</span><p><strong>Ambiente demonstrativo</strong> Nenhum dado bancário ou de cartão será solicitado. Nenhuma cobrança real será realizada.</p></div><div className="loc-document-actions"><button className="loc-secondary" onClick={() => setEtapa(3)}>← Voltar ao pedido</button><button className="loc-primary compact" onClick={pagar}>Simular pagamento <span>→</span></button></div></section>
        )}

        {etapa === 5 && (
          <section className="loc-state-card final"><div className={`loc-state-icon ${resultado === "orcamento_recusado" ? "muted" : "success"}`}>{resultado === "orcamento_recusado" ? "×" : "✓"}</div><span className="loc-eyebrow">ETAPA 06 · RESULTADO</span><h2>{resultado === "orcamento_recusado" ? "Proposta recusada" : "Pedido confirmado na demonstração!"}</h2><p>{resultado === "orcamento_recusado" ? "A proposta foi marcada como recusada. Nenhum pedido ou pagamento foi criado." : "A simulação foi concluída. Em uma integração real, a confirmação dependeria do retorno do provedor de pagamento."}</p><div className="loc-final-summary"><div><span>Orçamento</span><strong>{numeroOrcamento}</strong></div>{numeroPedido && <div><span>Pedido</span><strong>{numeroPedido}</strong></div>}<div><span>Valor da proposta</span><strong>{moeda(valores.total)}</strong></div>{codigoTransacao && <div><span>Código demonstrativo</span><strong>{codigoTransacao}</strong></div>}<div><span>Status final</span><strong className={resultado === "orcamento_recusado" ? "loc-discount" : "loc-confirmed"}>{resultado === "orcamento_recusado" ? "Recusado" : "Pagamento aprovado (simulado)"}</strong></div></div><div className="loc-final-actions"><button className="loc-secondary" onClick={() => { setEtapa(0); setForm(inicial); setResultado(""); setNumeroPedido(""); setCodigoTransacao(""); }}>Criar nova solicitação</button><button className="loc-primary compact" onClick={() => router.push(`/public/login?email=${encodeURIComponent(form.email)}`)}>Ir para o login <span>→</span></button><Link className="loc-secondary" href="/">Voltar ao início</Link></div></section>
        )}

        {mostrarConfirmacao && (
          <div className="loc-modal-backdrop" role="presentation">
            <div className="loc-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirmar-dados-titulo">
              <button type="button" className="loc-modal-close" onClick={() => setMostrarConfirmacao(false)} aria-label="Fechar">×</button>
              <span className="loc-eyebrow">CONFIRME SEUS DADOS</span>
              <h2 id="confirmar-dados-titulo">Tudo certo antes de continuar?</h2>
              <p>Revise as informações abaixo. Depois da confirmação, você continuará o fluxo da proposta. O login será a última etapa, após a conclusão do orçamento.</p>

              <div className="loc-confirm-data">
                <div><span>Empresa</span><strong>{form.empresa}</strong></div>
                <div><span>Responsável</span><strong>{form.responsavel}</strong></div>
                <div><span>E-mail</span><strong>{form.email}</strong></div>
                <div><span>Telefone</span><strong>{form.telefone}</strong></div>
                <div><span>Senha</span><strong>••••••••</strong></div>
                <div><span>Edifício</span><strong>{form.tipoEdificio}</strong></div>
              </div>

              <div className="loc-modal-security">
                <span>✓</span>
                <p>Sua senha será usada apenas no acesso. Ela não será exibida nem colocada na URL.</p>
              </div>

              <div className="loc-modal-actions">
                <button type="button" className="loc-secondary" onClick={() => setMostrarConfirmacao(false)}>Voltar e editar</button>
                <button type="button" className="loc-primary compact" onClick={confirmarDados}>Confirmar dados e continuar <span>→</span></button>
              </div>
            </div>
          </div>
        )}

        <footer className="loc-page-footer"><span>⌑ Seus dados são utilizados para preparar e acompanhar esta solicitação.</span><span>LUMORA · SMART BUILDING</span></footer>
      </div>
    </main>
  );
}
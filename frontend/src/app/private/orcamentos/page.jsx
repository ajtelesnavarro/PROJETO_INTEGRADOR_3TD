"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import "./orcamentos.css";

const services = [
  { id: "monitoramento_temperatura", name: "Monitoramento de temperatura", description: "Sensores e acompanhamento térmico", price: 480, icon: "◉" },
  { id: "controle_iluminacao", name: "Controle de iluminação", description: "Automação e eficiência luminosa", price: 620, icon: "✳" },
  { id: "monitoramento_energia", name: "Monitoramento de energia", description: "Medição e análise de consumo", price: 750, icon: "ϟ" },
  { id: "controle_acesso", name: "Controle de acesso", description: "Credenciais e registros de entrada", price: 890, icon: "⌑" },
  { id: "monitoramento_dispositivos", name: "Monitoramento de dispositivos", description: "Acompanhamento da rede IoT", price: 540, icon: "⌘" },
];

const STATUS_DB_TO_UI = {
  solicitado: "Solicitado",
  em_analise: "Em análise",
  enviado: "Enviado",
  aprovado: "Aprovado",
  recusado: "Recusado",
  expirado: "Expirado",
};

const STATUS_UI_TO_DB = {
  "Solicitado": "solicitado",
  "Em análise": "em_analise",
  "Enviado": "enviado",
  "Aprovado": "aprovado",
  "Recusado": "recusado",
  "Expirado": "expirado",
};

const money = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

const emptyForm = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  floors: 1,
  rooms: 1,
  devices: 1,
  services: [],
  discount: 0,
  deadline: 15,
  description: "",
};

function Icon({ children }) {
  return <span className="orc-icon" aria-hidden="true">{children}</span>;
}

function Status({ value }) {
  const classes = {
    "Solicitado": "requested",
    "Em análise": "analysis",
    "Enviado": "sent",
    "Aprovado": "approved",
    "Recusado": "rejected",
    "Expirado": "expired",
  };

  return (
    <span className={`orc-status ${classes[value] || ""}`}>
      <i />
      {value}
    </span>
  );
}

export default function Orcamentos() {
  const [quotes, setQuotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const carregarOrcamentos = useCallback(async () => {
    try {
      const res = await requisicaoAPI("/orcamentos");
      const lista = (res.dados || []).map((orc) => {
        const descBruta = String(orc.descricao || "");
        const matchTag = descBruta.match(/\[servicos:([^\]]+)\]/);
        const servicosTag = matchTag ? matchTag[1].split(",").filter(Boolean) : [];
        const descLimpa = descBruta.replace(/\[servicos:[^\]]+\]/g, "").trim();

        const servicosDb = Array.isArray(orc.servicos) && orc.servicos.length > 0
          ? orc.servicos.map((s) => s.nome_servico).filter(Boolean)
          : servicosTag;

        const sub = Number(orc.valor_subtotal || 0);
        const desc = Number(orc.valor_desconto || 0);
        const tot = Number(orc.valor_total ?? sub - desc);
        const discountPct = sub > 0 ? Math.round((desc / sub) * 100) : 0;

        return {
          id: orc.id_orcamento,
          code: `LUM-ORC-${new Date(orc.data_solicitacao || Date.now()).getFullYear()}-${String(orc.id_orcamento).padStart(3, "0")}`,
          company: orc.nome_empresa,
          contact: orc.nome_responsavel,
          email: orc.email,
          phone: orc.telefone,
          date: orc.data_solicitacao
            ? new Date(orc.data_solicitacao).toLocaleDateString("pt-BR")
            : "—",
          validity: orc.data_validade
            ? new Date(orc.data_validade).toLocaleDateString("pt-BR")
            : "—",
          status: STATUS_DB_TO_UI[orc.status_orcamento] || "Solicitado",
          floors: Number(orc.quantidade_andares || 0),
          rooms: Number(orc.quantidade_ambientes || 0),
          devices: Number(orc.quantidade_dispositivos || 0),
          services: servicosDb,
          description: descLimpa,
          subtotal: sub,
          discountValue: desc,
          total: tot,
          discount: discountPct,
        };
      });

      setQuotes(lista);
      if (lista.length > 0) {
        setSelectedId((prev) => (prev && lista.some((q) => q.id === prev) ? prev : lista[0].id));
      }
    } catch (erro) {
      setToast(erro.message || "Erro ao carregar orçamentos.");
    }
  }, []);

  useEffect(() => {
    carregarOrcamentos();
  }, [carregarOrcamentos]);

  const selected = quotes.find((quote) => quote.id === selectedId) || quotes[0] || null;

  const calculateForm = (quote) => {
    const serviceTotal = quote.services.reduce((total, id) => {
      const service = services.find((item) => item.id === id);
      return total + (service?.price || 0);
    }, 0);

    const structureTotal =
      Number(quote.floors) * 95 +
      Number(quote.rooms) * 32 +
      Number(quote.devices) * 18;

    const subtotal = serviceTotal + structureTotal;
    const discount = subtotal * (Number(quote.discount || 0) / 100);

    return {
      subtotal,
      discount,
      total: subtotal - discount,
    };
  };

  const formValues = useMemo(() => calculateForm(form), [form]);

  const visibleQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.company.toLowerCase().includes(search.toLowerCase()) ||
      quote.code.toLowerCase().includes(search.toLowerCase()) ||
      quote.contact.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "Todos" || quote.status === filter;

    return matchesSearch && matchesFilter;
  });

  const approvedTotal = quotes
    .filter((quote) => quote.status === "Aprovado")
    .reduce((total, quote) => total + quote.total, 0);

  const pendingCount = quotes.filter((quote) =>
    ["Solicitado", "Em análise"].includes(quote.status)
  ).length;

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleService = (id) => {
    setForm((current) => ({
      ...current,
      services: current.services.includes(id)
        ? current.services.filter((item) => item !== id)
        : [...current.services, id],
    }));
  };

  const createQuote = async (event) => {
    event.preventDefault();

    if (!form.company.trim() || !form.contact.trim() || !form.email.trim()) {
      setToast("Preencha os dados principais do solicitante.");
      return;
    }

    if (form.services.length === 0) {
      setToast("Selecione pelo menos um serviço.");
      return;
    }

    try {
      const res = await requisicaoAPI("/orcamentos", {
        method: "POST",
        body: JSON.stringify({
          nomeEmpresa: form.company.trim(),
          nomeResponsavel: form.contact.trim(),
          email: form.email.trim(),
          telefone: form.phone.trim() || "(00) 00000-0000",
          quantidadeAndares: Number(form.floors),
          quantidadeAmbientes: Number(form.rooms),
          quantidadeDispositivos: Number(form.devices),
          servicosDesejados: form.services,
          descontoPercentual: Number(form.discount || 0),
          prazoEstimadoDias: Number(form.deadline || 15),
          descricao: form.description.trim(),
        }),
      });

      if (res.idOrcamento) setSelectedId(res.idOrcamento);
      setForm(emptyForm);
      setShowForm(false);
      setToast("Orçamento salvo no banco com sucesso.");
      carregarOrcamentos();
    } catch (erro) {
      setToast(erro.message || "Erro ao criar orçamento.");
    }
  };

  const changeStatus = async (id, statusUi) => {
    try {
      const statusDb = STATUS_UI_TO_DB[statusUi] || "solicitado";
      await requisicaoAPI(`/orcamentos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status_orcamento: statusDb }),
      });
      setToast("Status do orçamento atualizado.");
      carregarOrcamentos();
    } catch (erro) {
      setToast(erro.message || "Erro ao atualizar status.");
    }
  };

  return (
    <div className="orc-page">
      <div className="orc-heading">
        <div>
          <span className="orc-eyebrow">GESTÃO COMERCIAL</span>
          <h1>Orçamentos</h1>
          <p>Crie propostas, acompanhe solicitações e gerencie negociações.</p>
        </div>

        <button className="orc-primary-button" onClick={() => setShowForm(true)}>
          <span>＋</span>
          Novo orçamento
        </button>
      </div>

      {toast && (
        <div
          style={{
            background: "#16213e",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {toast}
        </div>
      )}

      <section className="orc-metrics">
        <div className="orc-metric">
          <div className="orc-metric-top">
            <span className="orc-metric-icon blue">▤</span>
            <span className="orc-metric-caption">TOTAL DE PROPOSTAS</span>
          </div>
          <strong>{String(quotes.length).padStart(2, "0")}</strong>
          <small>Orçamentos cadastrados</small>
        </div>

        <div className="orc-metric">
          <div className="orc-metric-top">
            <span className="orc-metric-icon purple">◷</span>
            <span className="orc-metric-caption">EM NEGOCIAÇÃO</span>
          </div>
          <strong>{String(pendingCount).padStart(2, "0")}</strong>
          <small>Solicitados ou em análise</small>
        </div>

        <div className="orc-metric">
          <div className="orc-metric-top">
            <span className="orc-metric-icon green">✓</span>
            <span className="orc-metric-caption">VALOR APROVADO</span>
          </div>
          <strong className="orc-metric-money">{money(approvedTotal)}</strong>
          <small>Somente propostas aprovadas</small>
        </div>

        <div className="orc-metric">
          <div className="orc-metric-top">
            <span className="orc-metric-icon orange">↗</span>
            <span className="orc-metric-caption">VALOR EM PROPOSTAS</span>
          </div>
          <strong className="orc-metric-money">
            {money(quotes.reduce((sum, q) => sum + q.total, 0))}
          </strong>
          <small>Valor total dos orçamentos</small>
        </div>
      </section>

      <div className="orc-main-grid">
        <section className="orc-list-panel">
          <div className="orc-section-heading">
            <div>
              <span className="orc-section-kicker">ACOMPANHAMENTO</span>
              <h2>Propostas recentes</h2>
            </div>
            <span className="orc-counter">{visibleQuotes.length} registros</span>
          </div>

          <div className="orc-toolbar">
            <label className="orc-search">
              <Icon>⌕</Icon>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar empresa, contato ou código..."
              />
            </label>

            <select
              className="orc-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filtrar por status"
            >
              <option>Todos</option>
              <option>Solicitado</option>
              <option>Em análise</option>
              <option>Enviado</option>
              <option>Aprovado</option>
              <option>Recusado</option>
              <option>Expirado</option>
            </select>
          </div>

          <div className="orc-quote-list">
            {visibleQuotes.length ? (
              visibleQuotes.map((quote) => {
                const active = selected?.id === quote.id;

                return (
                  <button
                    type="button"
                    key={quote.id}
                    className={`orc-quote-row ${active ? "selected" : ""}`}
                    onClick={() => setSelectedId(quote.id)}
                  >
                    <span className="orc-quote-symbol">L</span>

                    <span className="orc-quote-info">
                      <strong>{quote.company}</strong>
                      <small>{quote.code}</small>
                      <small>{quote.contact} · {quote.date}</small>
                    </span>

                    <span className="orc-quote-value">
                      <strong>{money(quote.total)}</strong>
                      <Status value={quote.status} />
                    </span>

                    <span className="orc-row-arrow">›</span>
                  </button>
                );
              })
            ) : (
              <div className="orc-no-results">
                <span>⌕</span>
                <strong>Nenhum orçamento encontrado</strong>
                <p>Cadastre uma nova proposta ou ajuste os filtros.</p>
              </div>
            )}
          </div>

          <div className="orc-list-footer">
            <span>Sincronizado com o banco de dados.</span>
            <button onClick={() => { setSearch(""); setFilter("Todos"); }}>
              Limpar filtros
            </button>
          </div>
        </section>

        <aside className="orc-detail-panel">
          {selected ? (
            <>
              <div className="orc-detail-top">
                <div>
                  <span className="orc-section-kicker">DETALHES DA PROPOSTA</span>
                  <h2>Resumo</h2>
                </div>
                <span className="orc-detail-mark">L</span>
              </div>

              <div className="orc-detail-company">
                <strong>{selected.company}</strong>
                <span>{selected.code}</span>
                <Status value={selected.status} />
              </div>

              <div className="orc-detail-data">
                <div>
                  <span>Responsável</span>
                  <strong>{selected.contact}</strong>
                </div>
                <div>
                  <span>E-mail</span>
                  <strong>{selected.email}</strong>
                </div>
                <div>
                  <span>Data de solicitação</span>
                  <strong>{selected.date}</strong>
                </div>
                <div>
                  <span>Validade</span>
                  <strong>{selected.validity}</strong>
                </div>
              </div>

              <div className="orc-detail-divider" />

              <div className="orc-detail-subtitle">ESCOPO DO PROJETO</div>

              <div className="orc-scope">
                <div><strong>{selected.floors}</strong><span>Andares</span></div>
                <div><strong>{selected.rooms}</strong><span>Ambientes</span></div>
                <div><strong>{selected.devices}</strong><span>Dispositivos</span></div>
              </div>

              <div className="orc-detail-divider" />

              <div className="orc-detail-subtitle">SERVIÇOS CONTRATADOS</div>
              <div className="orc-service-tags">
                {selected.services.length > 0 ? (
                  selected.services.map((id) => {
                    const service = services.find((item) => item.id === id);
                    return <span key={id}>{service ? service.name : id}</span>;
                  })
                ) : (
                  <span>Pacote personalizado</span>
                )}
              </div>

              <div className="orc-price-summary">
                <div><span>Subtotal</span><strong>{money(selected.subtotal)}</strong></div>
                <div><span>Desconto ({selected.discount}%)</span><strong className="orc-discount">− {money(selected.discountValue)}</strong></div>
                <div className="orc-total-line"><span>Valor total</span><strong>{money(selected.total)}</strong></div>
              </div>

              <label className="orc-status-control">
                <span>Atualizar situação</span>
                <select
                  value={selected.status}
                  onChange={(event) => changeStatus(selected.id, event.target.value)}
                >
                  <option>Solicitado</option>
                  <option>Em análise</option>
                  <option>Enviado</option>
                  <option>Aprovado</option>
                  <option>Recusado</option>
                  <option>Expirado</option>
                </select>
              </label>
            </>
          ) : (
            <div className="orc-detail-empty">Selecione um orçamento para visualizar os detalhes.</div>
          )}
        </aside>
      </div>

      <section className="orc-create-banner">
        <div className="orc-banner-decoration">L</div>
        <div>
          <span>PROPOSTAS SOB MEDIDA</span>
          <h2>Uma solução inteligente começa com um bom planejamento.</h2>
          <p>Monte uma proposta selecionando os serviços e dimensionando a estrutura do edifício.</p>
        </div>
        <button onClick={() => setShowForm(true)}>Montar orçamento <span>→</span></button>
      </section>

      {showForm && (
        <div className="orc-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <form className="orc-modal" onSubmit={createQuote}>
            <div className="orc-modal-header">
              <div>
                <span className="orc-section-kicker">NOVA PROPOSTA</span>
                <h2>Montar orçamento</h2>
                <p>Informe os dados do cliente e configure os serviços.</p>
              </div>
              <button type="button" className="orc-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="orc-form-content">
              <section className="orc-form-section">
                <div className="orc-form-title"><span>01</span><div><strong>Dados do solicitante</strong><small>Informações para identificação da proposta</small></div></div>
                <div className="orc-form-grid">
                  <label className="orc-field wide">
                    Nome da empresa
                    <input required value={form.company} onChange={(e) => updateForm("company", e.target.value)} placeholder="Ex.: Empresa Exemplo Ltda." />
                  </label>
                  <label className="orc-field">
                    Responsável
                    <input required value={form.contact} onChange={(e) => updateForm("contact", e.target.value)} placeholder="Nome completo" />
                  </label>
                  <label className="orc-field">
                    E-mail
                    <input required type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="nome@empresa.com" />
                  </label>
                  <label className="orc-field">
                    Telefone
                    <input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="(00) 00000-0000" />
                  </label>
                </div>
              </section>

              <section className="orc-form-section">
                <div className="orc-form-title"><span>02</span><div><strong>Dimensão da estrutura</strong><small>Quantidade estimada para implantação</small></div></div>
                <div className="orc-quantity-grid">
                  {[
                    ["floors", "Andares", "Estrutura vertical"],
                    ["rooms", "Ambientes", "Salas e espaços"],
                    ["devices", "Dispositivos", "Pontos monitorados"],
                  ].map(([key, label, description]) => (
                    <label className="orc-quantity" key={key}>
                      <span>{label}</span>
                      <small>{description}</small>
                      <div>
                        <button type="button" onClick={() => updateForm(key, Math.max(1, Number(form[key]) - 1))}>−</button>
                        <strong>{form[key]}</strong>
                        <button type="button" onClick={() => updateForm(key, Number(form[key]) + 1)}>＋</button>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="orc-form-section">
                <div className="orc-form-title"><span>03</span><div><strong>Serviços desejados</strong><small>Selecione as soluções da proposta</small></div></div>
                <div className="orc-services-grid">
                  {services.map((service) => {
                    const active = form.services.includes(service.id);
                    return (
                      <button
                        type="button"
                        key={service.id}
                        className={`orc-service-option ${active ? "selected" : ""}`}
                        onClick={() => toggleService(service.id)}
                      >
                        <span className="orc-service-symbol">{service.icon}</span>
                        <div>
                          <strong>{service.name}</strong>
                          <small>{service.description}</small>
                        </div>
                        <b>{money(service.price)}</b>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="orc-form-section">
                <div className="orc-form-title"><span>04</span><div><strong>Condições comerciais</strong><small>Desconto, prazo e observações</small></div></div>
                <div className="orc-form-grid">
                  <label className="orc-field">
                    Desconto (%)
                    <input type="number" min="0" max="100" value={form.discount} onChange={(e) => updateForm("discount", e.target.value)} />
                  </label>
                  <label className="orc-field">
                    Validade (dias)
                    <input type="number" min="1" value={form.deadline} onChange={(e) => updateForm("deadline", e.target.value)} />
                  </label>
                  <label className="orc-field wide">
                    Observações
                    <textarea rows="3" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Detalhes adicionais do projeto..." />
                  </label>
                </div>

                <div className="orc-price-summary" style={{ marginTop: "12px" }}>
                  <div><span>Subtotal estimado</span><strong>{money(formValues.subtotal)}</strong></div>
                  <div><span>Desconto ({form.discount}%)</span><strong className="orc-discount">− {money(formValues.discount)}</strong></div>
                  <div className="orc-total-line"><span>Total estimado</span><strong>{money(formValues.total)}</strong></div>
                </div>
              </section>
            </div>

            <div className="orc-modal-footer">
              <button type="button" className="orc-cancel-button" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="orc-primary-button">Salvar orçamento</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
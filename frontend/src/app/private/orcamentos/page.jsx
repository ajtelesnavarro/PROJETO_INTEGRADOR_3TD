"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, unwrap } from "../../../lib/api";
import "./orcamentos.css";

const services = [
  { id: "monitoramento_temperatura", name: "Monitoramento de temperatura", description: "Sensores e acompanhamento térmico", price: 480, icon: "◉" },
  { id: "controle_iluminacao", name: "Controle de iluminação", description: "Automação e eficiência luminosa", price: 620, icon: "✳" },
  { id: "monitoramento_energia", name: "Monitoramento de energia", description: "Medição e análise de consumo", price: 750, icon: "ϟ" },
  { id: "controle_acesso", name: "Controle de acesso", description: "Credenciais e registros de entrada", price: 890, icon: "⌑" },
  { id: "monitoramento_dispositivos", name: "Monitoramento de dispositivos", description: "Acompanhamento da rede IoT", price: 540, icon: "⌘" },
];

const initialQuotes = [
  {
    id: 1,
    code: "LUM-ORC-2026-001",
    company: "Grupo Horizonte",
    contact: "Mariana Costa",
    email: "mariana@horizonte.com",
    date: "12/11/2026",
    validity: "27/11/2026",
    status: "Enviado",
    floors: 8,
    rooms: 24,
    devices: 42,
    services: ["monitoramento_energia", "controle_iluminacao", "monitoramento_dispositivos"],
    description: "Implantação de monitoramento e automação predial.",
    discount: 5,
  },
  {
    id: 2,
    code: "LUM-ORC-2026-002",
    company: "Nova Estação Ltda.",
    contact: "Ricardo Alves",
    email: "ricardo@novaestacao.com",
    date: "10/11/2026",
    validity: "25/11/2026",
    status: "Em análise",
    floors: 5,
    rooms: 16,
    devices: 28,
    services: ["monitoramento_temperatura", "controle_acesso"],
    description: "Monitoramento térmico e controle de acesso.",
    discount: 0,
  },
  {
    id: 3,
    code: "LUM-ORC-2026-003",
    company: "Plena Office",
    contact: "Camila Rocha",
    email: "camila@plenaoffice.com",
    date: "05/11/2026",
    validity: "20/11/2026",
    status: "Aprovado",
    floors: 12,
    rooms: 38,
    devices: 65,
    services: ["monitoramento_energia", "monitoramento_temperatura"],
    description: "Solução integrada para edifício corporativo.",
    discount: 8,
  },
  {
    id: 4,
    code: "LUM-ORC-2026-004",
    company: "Atlas Empresarial",
    contact: "Felipe Martins",
    email: "felipe@atlas.com",
    date: "02/11/2026",
    validity: "17/11/2026",
    status: "Solicitado",
    floors: 4,
    rooms: 12,
    devices: 20,
    services: ["controle_iluminacao"],
    description: "Automação de iluminação dos ambientes.",
    discount: 0,
  },
];

const money = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

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
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedId, setSelectedId] = useState(initialQuotes[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");

  const statusMap = { solicitado: "Solicitado", em_analise: "Em análise", enviado: "Enviado", aprovado: "Aprovado", recusado: "Recusado", expirado: "Expirado" };
  useEffect(() => {
    apiFetch("/orcamentos").then((res) => {
      const rows = unwrap(res);
      const mapped = rows.map((r) => ({ id: r.id_orcamento, code: `LUM-ORC-${r.id_orcamento}`, company: r.nome_empresa, contact: r.nome_responsavel, email: r.email, phone: r.telefone, date: r.data_solicitacao ? new Date(r.data_solicitacao).toLocaleDateString("pt-BR") : "—", validity: r.data_validade ? new Date(r.data_validade).toLocaleDateString("pt-BR") : "—", status: statusMap[r.status_orcamento] || r.status_orcamento, floors: r.quantidade_andares, rooms: r.quantidade_ambientes, devices: r.quantidade_dispositivos || 0, services: (r.servicos || []).map((x) => x.nome_servico || x.id_servico), description: r.descricao || "", discount: r.valor_subtotal ? Number(r.valor_desconto || 0) / Number(r.valor_subtotal) * 100 : 0, totalApi: Number(r.valor_total || 0) }));
      if (mapped.length) { setQuotes(mapped); setSelectedId(mapped[0].id); }
    }).catch(() => {});
  }, []);

  const selected = quotes.find((quote) => quote.id === selectedId) || quotes[0];

  const calculate = (quote) => {
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

  const formValues = useMemo(() => calculate(form), [form]);

  const visibleQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.company.toLowerCase().includes(search.toLowerCase()) ||
      quote.code.toLowerCase().includes(search.toLowerCase()) ||
      quote.contact.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "Todos" || quote.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totals = quotes.map((quote) => calculate(quote).total);
  const approvedTotal = quotes
    .filter((quote) => quote.status === "Aprovado")
    .reduce((total, quote) => total + calculate(quote).total, 0);

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
    if (!form.company.trim() || !form.contact.trim() || !form.email.trim()) return setToast("Preencha os dados principais do solicitante.");
    if (form.services.length === 0) return setToast("Selecione pelo menos um serviço.");
    try {
      const res = await apiFetch("/orcamentos", { method: "POST", body: JSON.stringify({ nomeResponsavel: form.contact, nomeEmpresa: form.company, email: form.email, telefone: form.phone, quantidadeAndares: Number(form.floors), quantidadeAmbientes: Number(form.rooms), quantidadeDispositivos: Number(form.devices), servicosDesejados: form.services, descontoPercentual: Number(form.discount), prazoEstimadoDias: Number(form.deadline), descricao: form.description }) });
      const r = unwrap(res); const id = res.idOrcamento ?? r?.id_orcamento;
      const newQuote = { ...form, id, code: `LUM-ORC-${id}`, date: new Date().toLocaleDateString("pt-BR"), validity: new Date(Date.now()+Number(form.deadline)*86400000).toLocaleDateString("pt-BR"), status: "Solicitado" };
      setQuotes((current) => [newQuote, ...current]); setSelectedId(id); setForm(emptyForm); setShowForm(false); setToast("Orçamento criado com sucesso.");
    } catch (error) { setToast(error.message); }
  };

  const changeStatus = async (id, status) => {
    const reverse = Object.fromEntries(Object.entries(statusMap).map(([k,v]) => [v,k]));
    try { await apiFetch(`/orcamentos/${id}`, { method: "PATCH", body: JSON.stringify({ status: reverse[status] || status }) }); setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote)); setToast("Status do orçamento atualizado."); } catch (error) { setToast(error.message); }
  };

  const selectedValues = selected ? calculate(selected) : null;

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
            {money(totals.reduce((sum, value) => sum + value, 0))}
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
                const value = calculate(quote).total;
                const active = selectedId === quote.id;

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
                      <strong>{money(value)}</strong>
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
                <p>Tente alterar sua busca ou o filtro selecionado.</p>
              </div>
            )}
          </div>

          <div className="orc-list-footer">
            <span>Os valores apresentados são estimativas demonstrativas.</span>
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
                {selected.services.map((id) => {
                  const service = services.find((item) => item.id === id);
                  return service ? <span key={id}>{service.name}</span> : null;
                })}
              </div>

              <div className="orc-price-summary">
                <div><span>Subtotal</span><strong>{money(selectedValues.subtotal)}</strong></div>
                <div><span>Desconto ({selected.discount}%)</span><strong className="orc-discount">− {money(selectedValues.discount)}</strong></div>
                <div className="orc-total-line"><span>Valor total</span><strong>{money(selectedValues.total)}</strong></div>
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
                        <button type="button" onClick={() => updateForm(key, Math.max(0, Number(form[key]) - 1))}>−</button>
                        <strong>{form[key]}</strong>
                        <button type="button" onClick={() => updateForm(key, Number(form[key]) + 1)}>＋</button>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="orc-form-section">
                <div className="orc-form-title"><span>03</span><div><strong>Serviços Lumora</strong><small>Selecione os módulos que farão parte da proposta</small></div></div>
                <div className="orc-service-options">
                  {services.map((service) => {
                    const checked = form.services.includes(service.id);
                    return (
                      <button
                        type="button"
                        key={service.id}
                        className={`orc-service-option ${checked ? "checked" : ""}`}
                        onClick={() => toggleService(service.id)}
                      >
                        <span className="orc-service-icon">{service.icon}</span>
                        <span className="orc-service-copy"><strong>{service.name}</strong><small>{service.description}</small></span>
                        <span className="orc-service-price">{money(service.price)}</span>
                        <i>{checked ? "✓" : "+"}</i>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="orc-form-section">
                <div className="orc-form-title"><span>04</span><div><strong>Condições comerciais</strong><small>Defina o desconto e o prazo da proposta</small></div></div>
                <div className="orc-form-grid">
                  <label className="orc-field">
                    Desconto (%)
                    <input type="number" min="0" max="50" value={form.discount} onChange={(e) => updateForm("discount", Math.min(50, Math.max(0, Number(e.target.value))))} />
                  </label>
                  <label className="orc-field">
                    Validade (dias)
                    <input type="number" min="1" max="90" value={form.deadline} onChange={(e) => updateForm("deadline", Math.max(1, Number(e.target.value)))} />
                  </label>
                  <label className="orc-field wide">
                    Descrição da proposta
                    <textarea rows="3" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Descreva brevemente o objetivo do projeto..." />
                  </label>
                </div>
              </section>
            </div>

            <div className="orc-modal-footer">
              <div className="orc-modal-total">
                <span>Valor estimado</span>
                <strong>{money(formValues.total)}</strong>
                <small>Subtotal: {money(formValues.subtotal)}</small>
              </div>
              <div>
                <button type="button" className="orc-cancel-button" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="orc-primary-button">Criar orçamento <span>→</span></button>
              </div>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="orc-toast">
          <span>✓</span>
          {toast}
          <button onClick={() => setToast("")}>×</button>
        </div>
      )}
    </div>
  );
}

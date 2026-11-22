"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, unwrap } from "../../../lib/api";
import "./acessos.css";

const eventsSeed = [
  {
    id: 1,
    time: "10:42:18",
    person: "Ana Souza",
    initials: "AS",
    action: "Entrada",
    method: "RFID",
    result: "Permitido",
    place: "Recepção",
    device: "Catraca 01",
    date: "Hoje",
    detail: "Credencial reconhecida e permissão válida.",
    category: "Funcionário",
  },
  {
    id: 2,
    time: "10:40:03",
    person: "Visitante #1092",
    initials: "V",
    action: "Entrada",
    method: "QR Code",
    result: "Negado",
    place: "Recepção",
    device: "Catraca 01",
    date: "Hoje",
    detail: "A credencial utilizada estava expirada.",
    category: "Visitante",
  },
  {
    id: 3,
    time: "10:37:51",
    person: "Bruno Lima",
    initials: "BL",
    action: "Saída",
    method: "NFC",
    result: "Permitido",
    place: "Garagem",
    device: "Portão B",
    date: "Hoje",
    detail: "Saída registrada normalmente.",
    category: "Funcionário",
  },
  {
    id: 4,
    time: "10:31:22",
    person: "Token desconhecido",
    initials: "?",
    action: "Entrada",
    method: "RFID",
    result: "Negado",
    place: "Recepção",
    device: "Catraca 02",
    date: "Hoje",
    detail: "A credencial não está cadastrada no sistema.",
    category: "Não identificado",
  },
  {
    id: 5,
    time: "10:28:10",
    person: "Elisa Costa",
    initials: "EC",
    action: "Entrada",
    method: "RFID",
    result: "Permitido",
    place: "Recepção",
    device: "Catraca 02",
    date: "Hoje",
    detail: "Credencial reconhecida e acesso autorizado.",
    category: "Visitante",
  },
  {
    id: 6,
    time: "09:54:42",
    person: "Carlos Mendes",
    initials: "CM",
    action: "Entrada",
    method: "QR Code",
    result: "Permitido",
    place: "Laboratório",
    device: "Leitor L-03",
    date: "Hoje",
    detail: "Acesso autorizado para atividade de manutenção.",
    category: "Manutenção",
  },
  {
    id: 7,
    time: "09:21:15",
    person: "Bruno Lima",
    initials: "BL",
    action: "Entrada",
    method: "NFC",
    result: "Permitido",
    place: "Garagem",
    device: "Portão B",
    date: "Hoje",
    detail: "Entrada registrada normalmente.",
    category: "Funcionário",
  },
];

const tokensSeed = [
  {
    id: 1,
    name: "Ana Souza",
    role: "Administradora",
    hash: "RFID •••• 8A42",
    expires: "28/08/2027",
    active: true,
  },
  {
    id: 2,
    name: "Bruno Lima",
    role: "Funcionário",
    hash: "NFC •••• D109",
    expires: "14/03/2027",
    active: true,
  },
  {
    id: 3,
    name: "Elisa Costa",
    role: "Visitante",
    hash: "RFID •••• 4C77",
    expires: "05/11/2025",
    active: false,
  },
  {
    id: 4,
    name: "Carlos Mendes",
    role: "Manutenção",
    hash: "QR •••• B291",
    expires: "20/12/2026",
    active: true,
  },
];

function AccessIcon({ name, size = 18 }) {
  const icons = {
    shield: (
      <>
        <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    unlock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 7-2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export default function Acessos({ toast = () => {} }) {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(1);
  const [showCredentials, setShowCredentials] = useState(true);
  const [tokens, setTokens] = useState(tokensSeed);
  const [events, setEvents] = useState(eventsSeed);

  useEffect(() => {
    Promise.all([apiFetch("/acessos-detalhados"), apiFetch("/credenciais")]).then(([er, cr]) => {
      const rows = unwrap(er); const creds = unwrap(cr);
      if (rows.length) setEvents(rows.map((e) => ({ id:e.id_evento, time:e.data_utilizacao ? new Date(e.data_utilizacao).toLocaleTimeString("pt-BR") : "—", person:e.nome_usuario || "Token desconhecido", initials:(e.nome_usuario||"?").slice(0,2).toUpperCase(), action:e.tipo_acesso === "entrada" ? "Entrada" : "Saída", method:e.tipo_credencial === "cartao_rfid" ? "RFID" : e.tipo_credencial === "tag_nfc" ? "NFC" : "QR Code", result:e.decisao_acesso === "permitido" ? "Permitido" : "Negado", place:e.nome_ambiente || "—", device:"—", date:e.data_utilizacao ? new Date(e.data_utilizacao).toLocaleDateString("pt-BR") : "—", detail:e.motivo || "Evento registrado.", category:e.perfil_usuario || "Usuário" })));
      if (creds.length) setTokens(creds.map(c=>({id:c.id_credencial,name:c.nome_usuario||"Usuário",role:c.perfil||"Usuário",hash:`${c.tipo_credencial} ••••`,expires:c.bloqueado_ate?new Date(c.bloqueado_ate).toLocaleDateString("pt-BR"):"—",active:c.status === "ativa"})));
    }).catch(()=>{});
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter =
        filter === "Todos" ||
        (filter === "Permitidos" && event.result === "Permitido") ||
        (filter === "Negados" && event.result === "Negado") ||
        (filter === "Entradas" && event.action === "Entrada") ||
        (filter === "Saídas" && event.action === "Saída");

      const term = search.toLowerCase().trim();

      const matchesSearch =
        event.person.toLowerCase().includes(term) ||
        event.place.toLowerCase().includes(term) ||
        event.device.toLowerCase().includes(term) ||
        event.method.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

  const selectedEvent = events.find((event) => event.id === selected);

  const allowed = events.filter((event) => event.result === "Permitido").length;
  const denied = events.filter((event) => event.result === "Negado").length;
  const activeTokens = tokens.filter((token) => token.active).length;

  const toggleToken = (id) => {
    const token = tokens.find((item) => item.id === id);
    if (!token) return;

    apiFetch(`/credenciais/${id}`, { method: "PATCH", body: JSON.stringify({ status: token.active ? "bloqueada" : "ativa" }) }).then(() => {
      setTokens((current) => current.map((item) => item.id === id ? { ...item, active: !item.active } : item));
    }).catch((error) => toast(error.message));

    toast(
      `Credencial de ${token.name} ${
        token.active ? "bloqueada" : "desbloqueada"
      }`
    );
  };

  return (
    <div className="ac-page">
      <div className="ac-page-heading">
        <div>
          <span className="ac-eyebrow">SEGURANÇA PREDIAL</span>
          <h1>Eventos de acesso</h1>
          <p>
            Acompanhe entradas, saídas e tentativas de acesso ao edifício.
          </p>
        </div>

        <div className="ac-live">
          <i />
          <span>Monitoramento ativo</span>
        </div>
      </div>

      <section className="ac-overview">
        <div className="ac-welcome">
          <div className="ac-welcome-icon">
            <AccessIcon name="shield" size={25} />
          </div>

          <div>
            <span>RESUMO DE HOJE</span>
            <h2>Segurança sob controle.</h2>
            <p>
              Confira a movimentação e identifique rapidamente qualquer
              tentativa suspeita.
            </p>
          </div>
        </div>

        <div className="ac-summary">
          <div className="ac-summary-item">
            <span className="ac-summary-icon blue">
              <AccessIcon name="users" size={18} />
            </span>
            <div>
              <b>{events.length}</b>
              <small>Eventos registrados</small>
            </div>
          </div>

          <div className="ac-summary-item">
            <span className="ac-summary-icon green">
              <AccessIcon name="check" size={18} />
            </span>
            <div>
              <b>{allowed}</b>
              <small>Acessos permitidos</small>
            </div>
          </div>

          <div className="ac-summary-item">
            <span className="ac-summary-icon red">
              <AccessIcon name="lock" size={18} />
            </span>
            <div>
              <b>{denied}</b>
              <small>Acessos negados</small>
            </div>
          </div>
        </div>
      </section>

      <div className="ac-main-grid">
        <section className="panel ac-events-panel">
          <div className="ac-section-heading">
            <div>
              <span>ACOMPANHAMENTO</span>
              <h2>Movimentações recentes</h2>
              <p>Histórico de entradas e saídas do edifício.</p>
            </div>

            <span className="ac-event-counter">
              {filteredEvents.length} registros
            </span>
          </div>

          <div className="ac-toolbar">
            <div className="ac-search">
              <AccessIcon name="search" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pessoa, local ou dispositivo..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Limpar busca"
                >
                  <AccessIcon name="close" size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="ac-filter-list">
            {["Todos", "Permitidos", "Negados", "Entradas", "Saídas"].map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {item === "Negados" && <span>{denied}</span>}
                </button>
              )
            )}
          </div>

          <div className="ac-event-list">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <button
                  key={event.id}
                  className={`ac-event-row ${
                    selected === event.id ? "selected" : ""
                  }`}
                  onClick={() => setSelected(event.id)}
                >
                  <span
                    className={`ac-event-symbol ${
                      event.result === "Permitido" ? "success" : "blocked"
                    }`}
                  >
                    <AccessIcon
                      name={event.result === "Permitido" ? "unlock" : "lock"}
                      size={17}
                    />
                  </span>

                  <span className="ac-event-person">
                    <b>{event.person}</b>
                    <small>
                      {event.place} · {event.device}
                    </small>
                  </span>

                  <span className="ac-event-action">
                    <b>{event.action}</b>
                    <small>{event.method}</small>
                  </span>

                  <span className="ac-event-time">
                    <b>{event.time}</b>
                    <small>{event.date}</small>
                  </span>

                  <span
                    className={`ac-result ${
                      event.result === "Permitido" ? "success" : "blocked"
                    }`}
                  >
                    <i />
                    {event.result}
                  </span>

                  <AccessIcon name="arrow" size={15} />
                </button>
              ))
            ) : (
              <div className="ac-no-results">
                <AccessIcon name="search" size={25} />
                <b>Nenhum evento encontrado</b>
                <span>
                  Tente alterar os filtros ou o termo pesquisado.
                </span>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("Todos");
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          <div className="ac-list-footer">
            <span>
              Exibindo {filteredEvents.length} de {events.length} eventos
            </span>
            <span>Dados demonstrativos</span>
          </div>
        </section>

        <aside className="ac-side-column">
          <section className="panel ac-detail-panel">
            <div className="ac-side-heading">
              <div>
                <span>DETALHES</span>
                <h2>Evento selecionado</h2>
              </div>

              <span className="ac-detail-icon">
                <AccessIcon name="calendar" size={17} />
              </span>
            </div>

            {selectedEvent ? (
              <>
                <div
                  className={`ac-detail-status ${
                    selectedEvent.result === "Permitido"
                      ? "success"
                      : "blocked"
                  }`}
                >
                  <AccessIcon
                    name={
                      selectedEvent.result === "Permitido" ? "check" : "lock"
                    }
                    size={17}
                  />

                  <div>
                    <b>Acesso {selectedEvent.result.toLowerCase()}</b>
                    <small>
                      {selectedEvent.date} às {selectedEvent.time}
                    </small>
                  </div>
                </div>

                <div className="ac-detail-person">
                  <span>{selectedEvent.initials}</span>
                  <div>
                    <b>{selectedEvent.person}</b>
                    <small>{selectedEvent.category}</small>
                  </div>
                </div>

                <div className="ac-detail-info">
                  <div>
                    <span>Movimentação</span>
                    <b>{selectedEvent.action}</b>
                  </div>
                  <div>
                    <span>Credencial</span>
                    <b>{selectedEvent.method}</b>
                  </div>
                  <div>
                    <span>Local</span>
                    <b>{selectedEvent.place}</b>
                  </div>
                  <div>
                    <span>Dispositivo</span>
                    <b>{selectedEvent.device}</b>
                  </div>
                </div>

                <div className="ac-detail-message">
                  <span>INFORMAÇÃO DO EVENTO</span>
                  <p>{selectedEvent.detail}</p>
                </div>
              </>
            ) : (
              <div className="ac-detail-empty">
                <AccessIcon name="pin" size={22} />
                <p>
                  Selecione um evento para visualizar os detalhes.
                </p>
              </div>
            )}
          </section>

          <section className="ac-security-tip">
            <span>
              <AccessIcon name="shield" size={19} />
            </span>
            <div>
              <b>Dica de segurança</b>
              <p>
                Verifique tentativas negadas recorrentes para identificar
                possíveis problemas com credenciais.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <section className="panel ac-credentials-panel">
        <button
          className="ac-credentials-heading"
          onClick={() => setShowCredentials(!showCredentials)}
          aria-expanded={showCredentials}
        >
          <div className="ac-credentials-title">
            <span className="ac-credentials-icon">
              <AccessIcon name="shield" size={19} />
            </span>

            <div>
              <span>GERENCIAMENTO</span>
              <h2>Credenciais de acesso</h2>
              <p>
                {activeTokens} de {tokens.length} credenciais habilitadas
              </p>
            </div>
          </div>

          <div className="ac-credentials-action">
            <span>{showCredentials ? "Ocultar" : "Mostrar"}</span>
            <AccessIcon name="chevron" size={17} />
          </div>
        </button>

        {showCredentials && (
          <div className="ac-token-list">
            {tokens.map((token) => (
              <div className="ac-token" key={token.id}>
                <span className="ac-token-avatar">
                  {token.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>

                <div className="ac-token-person">
                  <b>{token.name}</b>
                  <small>{token.role}</small>
                </div>

                <div className="ac-token-code">
                  <span>CREDENCIAL</span>
                  <b>{token.hash}</b>
                </div>

                <div className="ac-token-expiry">
                  <span>VALIDADE</span>
                  <b>{token.expires}</b>
                </div>

                <span
                  className={`ac-token-status ${
                    token.active ? "active" : "inactive"
                  }`}
                >
                  <i />
                  {token.active ? "Ativa" : "Bloqueada"}
                </span>

                <button
                  className={`ac-token-button ${
                    token.active ? "block" : "unblock"
                  }`}
                  onClick={() => toggleToken(token.id)}
                >
                  <AccessIcon
                    name={token.active ? "lock" : "unlock"}
                    size={14}
                  />
                  {token.active ? "Bloquear" : "Liberar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* <div className="">
        <form action="">
          <label htmlFor="tipo_acesso">Tipo de acesso</label>
          <select name="tipo_acesso" id="tipo_acesso">
            <option selected="" disabled="" />
            <option value="entrada">Entrada</option>
            <option value="saida">Saida</option>
          </select>
          <label htmlFor="decisao_acesso">Decisão de acesso</label>
          <select name="decisao_acesso" id="decisao_acesso">
            <option selected="" disabled="" />
            <option value="permitido">Permitido</option>
            <option value="negado">Negado</option>
          </select>
          <label htmlFor="token_tentado">Token</label>
          <input type="text" name="token_tentado" id="token_tentado" />
          <label htmlFor="status_evento">Status</label>
          <select name="status_evento" id="status_evento">
            <option selected="" disabled="" />
            <option value="processando">Processando</option>
            <option value="concluido">Concluído</option>
            <option value="pendente">Pendente</option>
            <option value="falha">Falha</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
          <label htmlFor="data_expiracao">data de expiração</label>
          <input type="date" name="data_expiracao" id="data_expiracao" />
          <label htmlFor="data_utilizacao">Data de ultilização</label>
          <input type="date" name="data_utilizacao" id="data_utilizacao" />
          <label htmlFor="motivo">Motivo</label>
          <select name="motivo" id="motivo">
            <option selected="" disabled="" />
            <option value="acesso_autorizado">Acesso autorizado</option>
            <option value="acesso_de_manutencao">Acesso de manutenção</option>
            <option value="saida_registrada">Saída registrada</option>
            <option value="credencial_bloqueada">Credencial bloqueada</option>
            <option value="credencial_expirada">Credencial expirada</option>
            <option value="token_nao_reconhecido">Token não reconhecido</option>
            <option value="sem_permissao">Sem permição</option>
            <option value="fora_do_horario_permitido">
              Fora do horário permitido
            </option>
            <option value="ambiente_restrito">Ambiente restrito</option>
            <option value="falha_na_validacao">Falha na validação</option>
            <option value="falha_de_comunicacao">falha de conunicação</option>
          </select>
          <button type="submit">Cadastrar</button>
        </form>
      </div> */}
    </div>
  );
}

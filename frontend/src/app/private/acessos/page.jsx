"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { requisicaoAPI } from "@/services/api";
import { obterPredioAtual } from "@/services/predioAtual";
import "./acessos.css";

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

const METODO_LABEL = {
  cartao_rfid: "RFID",
  tag_nfc: "NFC",
  qr_code: "QR Code",
};

const PERFIL_LABEL = {
  administrador: "Administrador",
  manutencao: "Manutenção",
  porteiro: "Portaria",
  funcionario: "Funcionário",
};

const MOTIVO_LABEL = {
  acesso_autorizado: "Credencial reconhecida e permissão válida.",
  acesso_de_manutencao: "Acesso autorizado para atividade de manutenção.",
  saida_registrada: "Saída registrada normalmente.",
  credencial_bloqueada: "A credencial está bloqueada no sistema.",
  credencial_expirada: "A credencial utilizada estava expirada.",
  token_nao_reconhecido: "A credencial não está cadastrada no sistema.",
  sem_permissao: "Usuário sem permissão para este ambiente.",
  fora_do_horario_permitido: "Tentativa fora do horário permitido.",
  ambiente_restrito: "Acesso restrito a perfis autorizados.",
  falha_na_validacao: "Falha na validação da credencial.",
  falha_de_comunicacao: "Falha de comunicação com o leitor.",
};

const STATUS_EVENTO_LABEL = {
  processando: "Processando",
  concluido: "Concluído",
  pendente: "Pendente",
  falha_comunicacao: "Falha de comunicação",
  bloqueado: "Bloqueado",
  falha: "Falha",
};

const STATUS_PERMISSAO_LABEL = {
  ativa: "Ativa",
  inativa: "Inativa",
  suspensa: "Suspensa",
  expirada: "Expirada",
};

function iniciais(nome) {
  return String(nome || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatarData(valor) {
  if (!valor) return "—";
  const texto = String(valor);
  const data = /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? new Date(`${texto.slice(0, 10)}T00:00:00`)
    : new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}

export default function Acessos() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCredentials, setShowCredentials] = useState(true);
  const [rawEvents, setRawEvents] = useState([]);
  const [rawTokens, setRawTokens] = useState([]);
  const [rawPermissions, setRawPermissions] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const carregarDados = useCallback(async () => {
    try {
      const [resEventos, resCredenciais, resPermissoes, resAmbientes, resAndares, resUsuarios] = await Promise.all([
        requisicaoAPI("/acessos-detalhados"),
        requisicaoAPI("/credenciais"),
        requisicaoAPI("/permissoes-acesso"),
        requisicaoAPI("/ambientes?limite=200"),
        requisicaoAPI("/andares?limite=200"),
        requisicaoAPI("/usuarios?limite=200"),
      ]);

      const idPredioAtual = Number(obterPredioAtual()?.id_predio);
      const idsAndares = new Set((resAndares.dados || [])
        .filter((andar) => Number(andar.id_predio) === idPredioAtual)
        .map((andar) => Number(andar.id_andar)));
      const idsAmbientes = new Set((resAmbientes.dados || [])
        .filter((ambiente) => idsAndares.has(Number(ambiente.id_andar)))
        .map((ambiente) => Number(ambiente.id_ambiente)));
      const idsUsuarios = new Set((resUsuarios.dados || [])
        .filter((usuario) => Number(usuario.id_predio) === idPredioAtual)
        .map((usuario) => Number(usuario.id_usuario)));
      const listaEv = (resEventos.dados || [])
        .filter((evento) => idsAmbientes.has(Number(evento.id_ambiente)));
      setRawEvents(listaEv);
      setRawTokens((resCredenciais.dados || [])
        .filter((credencial) => idsUsuarios.has(Number(credencial.id_usuario))));
      setRawPermissions((resPermissoes.dados || [])
        .filter((permissao) => idsUsuarios.has(Number(permissao.id_usuario)) && idsAmbientes.has(Number(permissao.id_ambiente))));

      if (listaEv.length > 0) {
        setSelected((prev) => prev ?? listaEv[0].id_evento);
      }
    } catch (erro) {
      setToast(erro.message || "Erro ao carregar dados de acesso.");
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const events = useMemo(() => {
    return rawEvents.map((ev) => {
      const dt = ev.data_utilizacao ? new Date(ev.data_utilizacao) : null;
      const time = dt
        ? dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : "--:--:--";
      const date = dt ? dt.toLocaleDateString("pt-BR") : "—";

      const person = ev.nome_usuario || (ev.token_tentado_sufixo ? `Token …${ev.token_tentado_sufixo}` : "Token desconhecido");

      return {
        id: ev.id_evento,
        time,
        person,
        initials: ev.nome_usuario ? iniciais(ev.nome_usuario) : "?",
        action: ev.tipo_acesso === "saida" ? "Saída" : "Entrada",
        method: METODO_LABEL[ev.tipo_credencial] || "RFID",
        result: ev.decisao_acesso === "permitido" ? "Permitido" : "Negado",
        place: ev.nome_ambiente || `Ambiente #${ev.id_ambiente}`,
        device: ev.id_credencial ? "Leitor de acesso" : "Tentativa sem credencial",
        eventId: ev.id_evento,
        credentialId: ev.id_credencial,
        tokenSuffix: ev.token_tentado_sufixo || "",
        eventStatus: STATUS_EVENTO_LABEL[ev.status_evento] || ev.status_evento || "—",
        expiresAt: ev.data_expiracao ? new Date(ev.data_expiracao).toLocaleString("pt-BR") : "—",
        permissionStatus: ev.status_permissao_evento ? STATUS_PERMISSAO_LABEL[ev.status_permissao_evento] || ev.status_permissao_evento : "Sem permissão cadastrada para a data",
        permissionHours: ev.horario_permissao_evento || "Sem restrição de horário",
        permissionDays: ev.dias_permissao_evento || "Dias não especificados",
        permissionId: ev.id_permissao_evento,
        location: ev.localizacao_ambiente || "Localização não cadastrada",
        date,
        detail: MOTIVO_LABEL[ev.motivo] || "Evento registrado pelo controlador de acesso.",
        category: PERFIL_LABEL[ev.perfil_usuario] || "Não identificado",
      };
    });
  }, [rawEvents]);

  const tokens = useMemo(() => {
    return rawTokens.map((t) => {
      const tipo = METODO_LABEL[t.tipo_credencial] || "RFID";
      const sufixo = String(t.token_hash_sufixo || "").toUpperCase();
      return {
        id: t.id_credencial,
        name: t.nome_usuario || `Usuário #${t.id_usuario}`,
        role: PERFIL_LABEL[t.perfil] || "Funcionário",
        hash: `${tipo} •••• ${sufixo || "0000"}`,
        validityLabel: t.bloqueado_ate ? "Bloqueio até" : "Cadastrada em",
        expires: t.bloqueado_ate
          ? new Date(t.bloqueado_ate).toLocaleDateString("pt-BR")
          : t.data_cadastro
            ? new Date(t.data_cadastro).toLocaleDateString("pt-BR")
            : "—",
        active: t.status === "ativa",
      };
    });
  }, [rawTokens]);

  const permissions = useMemo(() => rawPermissions.map((permission) => ({
    id: permission.id_permissao,
    person: permission.nome_usuario,
    role: PERFIL_LABEL[permission.perfil] || permission.perfil,
    environment: permission.nome_ambiente,
    location: permission.localizacao,
    floor: permission.numero_andar,
    status: STATUS_PERMISSAO_LABEL[permission.status_permissao] || permission.status_permissao,
    period: `${formatarData(permission.data_inicio)} · ${permission.data_fim ? formatarData(permission.data_fim) : "sem validade final"}`,
    hours: permission.horario_inicio && permission.horario_fim ? `${String(permission.horario_inicio).slice(0, 5)}–${String(permission.horario_fim).slice(0, 5)}` : "Sem restrição de horário",
    days: permission.dias_semana || "Dias não especificados",
  })), [rawPermissions]);

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

  const toggleToken = async (id) => {
    const token = tokens.find((item) => item.id === id);
    if (!token) return;

    const novoStatus = token.active ? "bloqueada" : "ativa";

    try {
      await requisicaoAPI(`/credenciais/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: novoStatus }),
      });

      setToast(
        `Credencial de ${token.name} ${
          token.active ? "bloqueada" : "desbloqueada"
        }.`
      );
      carregarDados();
    } catch (erro) {
      setToast(erro.message || "Erro ao alterar credencial.");
    }
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

      {toast && (
        <div className="ac-toast" role="status">{toast}</div>
      )}

      <section className="ac-overview">
        <div className="ac-welcome">
          <div className="ac-welcome-icon">
            <AccessIcon name="shield" size={25} />
          </div>

          <div>
            <span>RESUMO DE ACESSOS</span>
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
                  Nenhum registro de acesso corresponde ao filtro atual.
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
            <span>Banco de dados conectado</span>
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
                    <span>Evento</span>
                    <b>#{selectedEvent.eventId}</b>
                  </div>
                  <div>
                    <span>Movimentação</span>
                    <b>{selectedEvent.action}</b>
                  </div>
                  <div>
                    <span>Local</span>
                    <b>{selectedEvent.place}</b>
                  </div>
                  <div>
                    <span>Credencial</span>
                    <b>{selectedEvent.credentialId ? `#${selectedEvent.credentialId} · ${selectedEvent.method}` : "Não identificada"}</b>
                  </div>
                  <div>
                    <span>Status do evento</span>
                    <b>{selectedEvent.eventStatus}</b>
                  </div>
                  <div>
                    <span>Validade do evento</span>
                    <b>{selectedEvent.expiresAt}</b>
                  </div>
                  <div>
                    <span>Código tentado</span>
                    <b>{selectedEvent.tokenSuffix ? `•••• ${selectedEvent.tokenSuffix}` : "—"}</b>
                  </div>
                  <div>
                    <span>Localização</span>
                    <b>{selectedEvent.location}</b>
                  </div>
                </div>

                <div className="ac-event-permission">
                  <span>PERMISSÃO DE ACESSO NA DATA DO EVENTO</span>
                  <b>{selectedEvent.permissionStatus}</b>
                  <small>{selectedEvent.permissionId ? `Permissão #${selectedEvent.permissionId} · ` : ""}{selectedEvent.permissionHours} · {selectedEvent.permissionDays}</small>
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
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <div className="ac-token" key={token.id}>
                  <span className="ac-token-avatar">
                    {iniciais(token.name)}
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
                    <span>{token.validityLabel}</span>
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
              ))
            ) : (
              <p style={{ padding: "16px", opacity: 0.7 }}>
                Nenhuma credencial cadastrada no banco de dados.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="panel ac-permissions-panel">
        <div className="ac-section-heading">
          <div>
            <span>CONTROLE POR AMBIENTE</span>
            <h2>Permissões de acesso</h2>
            <p>Ambientes, horários e validade liberados para cada usuário.</p>
          </div>
          <span className="ac-event-counter">{permissions.length} permissões</span>
        </div>
        <div className="ac-permission-list">
          {permissions.length ? permissions.map((permission) => (
            <article className="ac-permission-row" key={permission.id}>
              <div className="ac-permission-person">
                <b>{permission.person}</b>
                <small>{permission.role}</small>
              </div>
              <div className="ac-permission-place">
                <b>{permission.environment}</b>
                <small>{permission.floor}º andar · {permission.location}</small>
              </div>
              <div className="ac-permission-schedule">
                <b>{permission.hours}</b>
                <small>{permission.days} · {permission.period}</small>
              </div>
              <span className={`ac-permission-status ${permission.status === "Ativa" ? "active" : "inactive"}`}>{permission.status}</span>
            </article>
          )) : <p className="ac-permission-empty">Nenhuma permissão de acesso cadastrada.</p>}
        </div>
      </section>
    </div>
  );
}

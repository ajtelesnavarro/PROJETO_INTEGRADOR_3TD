
"use client";

import { useMemo, useState } from "react";
import "./predios.css";

// ==================================================
// DADOS DA API
// Substituir este bloco pelas respostas reais do backend.
//
// EDIFÍCIO:
// nome, codigo, tipo, endereco, andaresPrevistos,
// andaresCadastrados, area, status e descricao.
//
// INDICADORES GERAIS:
// setores, ambientes e dispositivos.
//
// ANDARES:
// id, numero, nome, descricao, status e indicadores.
//
// SETORES:
// id, nome, ambientes, dispositivos e responsavel.
//
// Todos esses dados são utilizados nos cards, indicadores,
// pesquisas, listagens e painéis de detalhes.
// ==================================================

const DADOS_API = {
  edificio: {
    nome: "Edifício Empresarial Central",
    codigo: "LUM-001",
    tipo: "Comercial",
    endereco: "Santo André, São Paulo",
    andaresPrevistos: 12,
    andaresCadastrados: 4,
    area: "8.450 m²",
    status: "Operacional",
    descricao:
      "Edifício corporativo monitorado pela plataforma Lumora, com controle centralizado de ambientes, dispositivos e infraestrutura.",
  },

  indicadores: {
    setores: 9,
    ambientes: 27,
    dispositivos: 72,
  },

  andares: [
    {
      id: 1,
      numero: 0,
      nome: "Térreo",
      descricao: "Área de recepção e circulação principal.",
      status: "Ativo",

      indicadores: {
        setores: 3,
        ambientes: 9,
        dispositivos: 22,
      },

      setores: [
        {
          id: 1,
          nome: "Recepção",
          ambientes: 3,
          dispositivos: 8,
          responsavel: "Ana Souza",
        },
        {
          id: 2,
          nome: "Segurança",
          ambientes: 2,
          dispositivos: 5,
          responsavel: "Bruno Lima",
        },
        {
          id: 3,
          nome: "Administrativo",
          ambientes: 4,
          dispositivos: 9,
          responsavel: "Marina Costa",
        },
      ],
    },

    {
      id: 2,
      numero: 1,
      nome: "1º Andar",
      descricao: "Área administrativa e salas de atendimento.",
      status: "Ativo",

      indicadores: {
        setores: 2,
        ambientes: 5,
        dispositivos: 12,
      },

      setores: [
        {
          id: 4,
          nome: "Financeiro",
          ambientes: 3,
          dispositivos: 7,
          responsavel: "Carlos Mendes",
        },
        {
          id: 5,
          nome: "Recursos Humanos",
          ambientes: 2,
          dispositivos: 5,
          responsavel: "Ana Souza",
        },
      ],
    },

    {
      id: 3,
      numero: 2,
      nome: "2º Andar",
      descricao: "Ambientes corporativos e salas de reunião.",
      status: "Ativo",

      indicadores: {
        setores: 2,
        ambientes: 7,
        dispositivos: 18,
      },

      setores: [
        {
          id: 6,
          nome: "Comercial",
          ambientes: 4,
          dispositivos: 10,
          responsavel: "Elisa Costa",
        },
        {
          id: 7,
          nome: "Reuniões",
          ambientes: 3,
          dispositivos: 8,
          responsavel: "Bruno Lima",
        },
      ],
    },

    {
      id: 4,
      numero: 3,
      nome: "3º Andar",
      descricao: "Área de tecnologia e infraestrutura.",
      status: "Manutenção",

      indicadores: {
        setores: 2,
        ambientes: 6,
        dispositivos: 20,
      },

      setores: [
        {
          id: 8,
          nome: "Tecnologia",
          ambientes: 4,
          dispositivos: 12,
          responsavel: "Rafael Nunes",
        },
        {
          id: 9,
          nome: "Servidores",
          ambientes: 2,
          dispositivos: 8,
          responsavel: "Carlos Mendes",
        },
      ],
    },
  ],
};

// ==================================================
// CONFIGURAÇÕES DA INTERFACE
// Não precisam ser retornadas pela API.
// ==================================================

const CONFIGURACOES = {
  filtrosAndares: ["Todos", "Ativo", "Manutenção"],

  andarVazio: {
    nome: "",
    descricao: "",
  },

  statusPadraoAndar: "Ativo",
  descricaoPadraoAndar: "Andar cadastrado na plataforma.",
};

// ==================================================
// COMPONENTES AUXILIARES
// ==================================================

function Icon({ children }) {
  return (
    <span className="pa-icon" aria-hidden="true">
      {children}
    </span>
  );
}

function Status({ value }) {
  const classeStatus =
    value === "Ativo" || value === "Operacional"
      ? "success"
      : value === "Manutenção"
        ? "warning"
        : "neutral";

  return (
    <span className={`pa-status ${classeStatus}`}>
      <i />
      {value}
    </span>
  );
}

// ==================================================
// PÁGINA: PRÉDIOS E ANDARES
// ==================================================

export default function PrediosAndares() {
  // Dados recebidos da API.
  const [edificio] = useState(DADOS_API.edificio);
  const [andares, setAndares] = useState(DADOS_API.andares);
  const [indicadores] = useState(DADOS_API.indicadores);

  // Estados utilizados somente pela interface.
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [selecionado, setSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [novoAndar, setNovoAndar] = useState(CONFIGURACOES.andarVazio);

  // Pesquisa por nome, descrição ou setor.
  const andaresFiltrados = useMemo(() => {
    return andares.filter((andar) => {
      const correspondePesquisa =
        andar.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        andar.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
        andar.setores.some((setor) =>
          setor.nome.toLowerCase().includes(pesquisa.toLowerCase()),
        );

      const correspondeFiltro =
        filtro === "Todos" || andar.status === filtro;

      return correspondePesquisa && correspondeFiltro;
    });
  }, [andares, pesquisa, filtro]);

  // Indicadores gerais recebidos da API.
  const totalSetores = indicadores.setores;
  const totalAmbientes = indicadores.ambientes;
  const totalDispositivos = indicadores.dispositivos;

  // Indicadores individuais de cada andar.
  function obterIndicadoresAndar(andar) {
    return andar.indicadores;
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);
    window.clearTimeout(mostrarMensagem.timeout);
    mostrarMensagem.timeout = window.setTimeout(
      () => setMensagem(""),
      2800,
    );
  }

  function abrirDetalhesEdificio() {
    setSelecionado({
      tipo: "edificio",
      dados: edificio,
    });
  }

  function abrirDetalhesAndar(andar) {
    setSelecionado({
      tipo: "andar",
      dados: andar,
    });
  }

  function abrirDetalhesSetor(setor, andar) {
    setSelecionado({
      tipo: "setor",
      dados: {
        ...setor,
        nomeAndar: andar.nome,
      },
    });
  }

  // Cadastro demonstrativo de andar.
  // Na integração, enviar os campos para a API e utilizar
  // o registro retornado pelo backend para atualizar a lista.
  function adicionarAndar(event) {
    event.preventDefault();

    if (!novoAndar.nome.trim()) {
      mostrarMensagem("Informe o nome do andar.");
      return;
    }

    const proximoAndar = {
      id: Date.now(),
      numero: andares.length,
      nome: novoAndar.nome,
      descricao:
        novoAndar.descricao ||
        CONFIGURACOES.descricaoPadraoAndar,
      status: CONFIGURACOES.statusPadraoAndar,

      indicadores: {
        setores: 0,
        ambientes: 0,
        dispositivos: 0,
      },

      setores: [],
    };

    setAndares((atuais) => [...atuais, proximoAndar]);
    setNovoAndar(CONFIGURACOES.andarVazio);
    setModalAberto(false);
    mostrarMensagem("Andar cadastrado com sucesso!");

    setSelecionado({
      tipo: "andar",
      dados: proximoAndar,
    });
  }

  function fecharDetalhes() {
    setSelecionado(null);
  }

  return (
    <div className="pa-page">
      <div className="pa-background-glow pa-glow-one" />
      <div className="pa-background-glow pa-glow-two" />

      <header className="pa-heading">
        <div>
          <span className="pa-eyebrow">ESTRUTURA PREDIAL</span>
          <h1>Prédios & Andares</h1>
          <p>
            Gerencie a estrutura do edifício, seus andares e setores em um
            único lugar.
          </p>
        </div>

        <button
          className="pa-primary-button"
          onClick={() => setModalAberto(true)}
        >
          <span>＋</span>
          Adicionar andar
        </button>
      </header>

      <section className="pa-building-card">
        <div className="pa-building-art">
          <div className="pa-building-orbit orbit-one" />
          <div className="pa-building-orbit orbit-two" />

          <div className="pa-building-illustration">
            <div className="pa-building-roof" />

            <div className="pa-building-body">
              {Array.from({ length: 4 }).map((_, indice) => (
                <div className="pa-building-row" key={indice}>
                  {Array.from({ length: 4 }).map((__, indiceJanela) => (
                    <i key={indiceJanela} />
                  ))}
                </div>
              ))}
            </div>

            <div className="pa-building-base" />
          </div>

          <span className="pa-art-label">SMART BUILDING</span>
        </div>

        <div className="pa-building-info">
          <div className="pa-building-topline">
            <span className="pa-code">{edificio.codigo}</span>
            <Status value={edificio.status} />
          </div>

          <h2>{edificio.nome}</h2>
          <p>{edificio.descricao}</p>

          <div className="pa-building-meta">
            <span>
              <Icon>⌖</Icon>
              {edificio.endereco}
            </span>

            <span>
              <Icon>▦</Icon>
              {edificio.tipo}
            </span>

            <span>
              <Icon>⌂</Icon>
              {edificio.area}
            </span>
          </div>

          <button
            className="pa-text-button"
            onClick={abrirDetalhesEdificio}
          >
            Visualizar detalhes do edifício
            <span>↗</span>
          </button>
        </div>

        <div className="pa-building-number">
          <span>ESTRUTURA</span>
          <strong>
            {String(edificio.andarCadastrados).padStart(2, "0")}
          </strong>
          <small>andares cadastrados</small>
        </div>
      </section>

      <section className="pa-metrics">
        <div className="pa-metric">
          <span className="pa-metric-icon blue">▦</span>

          <div>
            <small>Andares cadastrados</small>
            <strong>{edificio.andarCadastrados}</strong>
            <span>Na estrutura do edifício</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon purple">⌘</span>

          <div>
            <small>Setores cadastrados</small>
            <strong>{totalSetores}</strong>
            <span>Distribuídos por andar</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon cyan">⌂</span>

          <div>
            <small>Ambientes vinculados</small>
            <strong>{totalAmbientes}</strong>
            <span>Salas e espaços internos</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon violet">◈</span>

          <div>
            <small>Dispositivos vinculados</small>
            <strong>{totalDispositivos}</strong>
            <span>Equipamentos monitorados</span>
          </div>
        </div>
      </section>

      <section className="pa-floors-section">
        <div className="pa-section-heading">
          <div>
            <span className="pa-eyebrow">ORGANIZAÇÃO INTERNA</span>
            <h2>Andares do edifício</h2>
            <p>
              Selecione um andar para consultar seus setores e informações.
            </p>
          </div>

          <div className="pa-floor-count">
            {andaresFiltrados.length} de {andares.length} andares
          </div>
        </div>

        <div className="pa-toolbar">
          <div className="pa-search">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Buscar andar ou setor..."
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
            />

            {pesquisa && (
              <button
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
              >
                ×
              </button>
            )}
          </div>

          <div className="pa-filters">
            {CONFIGURACOES.filtrosAndares.map((item) => (
              <button
                key={item}
                className={filtro === item ? "active" : ""}
                onClick={() => setFiltro(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="pa-floor-grid">
          {andaresFiltrados.map((andar) => (
            <article className="pa-floor-card" key={andar.id}>
              <div className="pa-floor-card-top">
                <div className="pa-floor-symbol">
                  <span>⌂</span>
                </div>

                <Status value={andar.status} />
              </div>

              <div className="pa-floor-title">
                <span>
                  ANDAR {String(andar.numero).padStart(2, "0")}
                </span>

                <h3>{andar.nome}</h3>
                <p>{andar.descricao}</p>
              </div>

              <div className="pa-floor-data">
                <div>
                  <strong>
                    {obterIndicadoresAndar(andar).setores}
                  </strong>
                  <span>Setores</span>
                </div>

                <div>
                  <strong>
                    {obterIndicadoresAndar(andar).ambientes}
                  </strong>
                  <span>Ambientes</span>
                </div>

                <div>
                  <strong>
                    {obterIndicadoresAndar(andar).dispositivos}
                  </strong>
                  <span>Dispositivos</span>
                </div>
              </div>

              <div className="pa-sector-preview">
                <span>SETORES</span>

                <div>
                  {andar.setores.length > 0 ? (
                    andar.setores.slice(0, 3).map((setor) => (
                      <button
                        key={setor.id}
                        onClick={() => abrirDetalhesSetor(setor, andar)}
                        title={`Ver detalhes de ${setor.nome}`}
                      >
                        {setor.nome}
                        <span>↗</span>
                      </button>
                    ))
                  ) : (
                    <p>Nenhum setor cadastrado.</p>
                  )}
                </div>
              </div>

              <button
                className="pa-floor-details"
                onClick={() => abrirDetalhesAndar(andar)}
              >
                Ver detalhes do andar
                <span>→</span>
              </button>
            </article>
          ))}
        </div>

        {andaresFiltrados.length === 0 && (
          <div className="pa-empty">
            <span>⌕</span>
            <h3>Nenhum andar encontrado</h3>
            <p>
              Tente alterar sua pesquisa ou os filtros selecionados.
            </p>

            <button
              onClick={() => {
                setPesquisa("");
                setFiltro("Todos");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {/* Painel lateral de detalhes */}
      {selecionado && (
        <div
          className="pa-detail-layer"
          onMouseDown={fecharDetalhes}
        >
          <div className="pa-detail-backdrop" />

          <aside
            className="pa-detail-panel"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pa-detail-decoration">
              <i />
              <i />
              <i />
            </div>

            <div className="pa-detail-header">
              <div>
                <span className="pa-eyebrow">
                  {selecionado.tipo === "edificio"
                    ? "INFORMAÇÕES DO EDIFÍCIO"
                    : selecionado.tipo === "andar"
                      ? "INFORMAÇÕES DO ANDAR"
                      : "INFORMAÇÕES DO SETOR"}
                </span>

                <h2>
                  {selecionado.tipo === "edificio"
                    ? "Detalhes do edifício"
                    : selecionado.tipo === "andar"
                      ? "Detalhes do andar"
                      : "Detalhes do setor"}
                </h2>
              </div>

              <button
                className="pa-close-button"
                onClick={fecharDetalhes}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="pa-detail-content">
              <div className="pa-detail-hero">
                <div className="pa-detail-icon">
                  {selecionado.tipo === "edificio"
                    ? "⌂"
                    : selecionado.tipo === "andar"
                      ? "▤"
                      : "▦"}
                </div>

                <div>
                  <span>
                    {selecionado.tipo === "edificio"
                      ? selecionado.dados.codigo
                      : selecionado.tipo === "andar"
                        ? `ANDAR ${selecionado.dados.numero}`
                        : `SETOR · ${selecionado.dados.id}`}
                  </span>

                  <h3>{selecionado.dados.nome}</h3>

                  {(selecionado.tipo === "andar" ||
                    selecionado.tipo === "edificio") && (
                    <Status value={selecionado.dados.status} />
                  )}
                </div>
              </div>

              {selecionado.tipo === "edificio" && (
                <>
                  <div className="pa-detail-description">
                    <span>DESCRIÇÃO</span>
                    <p>{selecionado.dados.descricao}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Tipo de edifício</span>
                      <strong>{selecionado.dados.tipo}</strong>
                    </div>

                    <div>
                      <span>Área total</span>
                      <strong>{selecionado.dados.area}</strong>
                    </div>

                    <div>
                      <span>Andares previstos</span>
                      <strong>{selecionado.dados.andaresPrevistos}</strong>
                    </div>

                    <div>
                      <span>Andares cadastrados</span>
                      <strong>{selecionado.dados.andaresCadastrados}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-description">
                    <span>LOCALIZAÇÃO</span>
                    <p>{selecionado.dados.endereco}</p>
                  </div>
                </>
              )}

              {selecionado.tipo === "andar" && (
                <>
                  <div className="pa-detail-description">
                    <span>DESCRIÇÃO</span>
                    <p>{selecionado.dados.descricao}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Setores</span>
                      <strong>
                        {selecionado.dados.indicadores.setores}
                      </strong>
                    </div>

                    <div>
                      <span>Ambientes</span>
                      <strong>
                        {selecionado.dados.indicadores.ambientes}
                      </strong>
                    </div>

                    <div>
                      <span>Dispositivos</span>
                      <strong>
                        {selecionado.dados.indicadores.dispositivos}
                      </strong>
                    </div>

                    <div>
                      <span>Identificação</span>
                      <strong>{selecionado.dados.nome}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-list">
                    <div className="pa-detail-list-heading">
                      <span>SETORES VINCULADOS</span>
                      <b>{selecionado.dados.indicadores.setores}</b>
                    </div>

                    {selecionado.dados.setores.length > 0 ? (
                      selecionado.dados.setores.map((setor) => (
                        <button
                          className="pa-detail-sector"
                          key={setor.id}
                          onClick={() =>
                            abrirDetalhesSetor(setor, selecionado.dados)
                          }
                        >
                          <span className="pa-sector-icon">▦</span>

                          <span>
                            <strong>{setor.nome}</strong>
                            <small>
                              {setor.ambientes} ambientes ·{" "}
                              {setor.dispositivos} dispositivos
                            </small>
                          </span>

                          <b>↗</b>
                        </button>
                      ))
                    ) : (
                      <p className="pa-no-sectors">
                        Este andar ainda não possui setores cadastrados.
                      </p>
                    )}
                  </div>
                </>
              )}

              {selecionado.tipo === "setor" && (
                <>
                  <div className="pa-detail-description">
                    <span>LOCALIZAÇÃO</span>
                    <p>{selecionado.dados.nomeAndar}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Ambientes</span>
                      <strong>{selecionado.dados.ambientes}</strong>
                    </div>

                    <div>
                      <span>Dispositivos</span>
                      <strong>{selecionado.dados.dispositivos}</strong>
                    </div>

                    <div className="wide">
                      <span>Responsável</span>
                      <strong>{selecionado.dados.responsavel}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-description">
                    <span>ESTRUTURA DO SETOR</span>

                    <p>
                      Este setor está vinculado ao{" "}
                      {selecionado.dados.nomeAndar} e possui{" "}
                      {selecionado.dados.ambientes} ambientes cadastrados.
                    </p>
                  </div>
                </>
              )}

              <div className="pa-detail-note">
                <span>✦</span>
                <p>
                  As informações exibidas são uma demonstração local da
                  interface. A integração com o banco de dados poderá ser
                  realizada posteriormente.
                </p>
              </div>
            </div>

            <div className="pa-detail-footer">
              <button
                className="pa-detail-secondary"
                onClick={fecharDetalhes}
              >
                Fechar
              </button>

              <button
                className="pa-detail-primary"
                onClick={() =>
                  mostrarMensagem(
                    "A edição poderá ser integrada ao banco de dados.",
                  )
                }
              >
                Editar informações
                <span>↗</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Modal para cadastrar um novo andar */}
      {modalAberto && (
        <div
          className="pa-modal-layer"
          onMouseDown={() => setModalAberto(false)}
        >
          <form
            className="pa-modal"
            onSubmit={adicionarAndar}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pa-modal-header">
              <div>
                <span className="pa-eyebrow">ESTRUTURA PREDIAL</span>
                <h2>Novo andar</h2>
                <p>Adicione um andar à estrutura do edifício.</p>
              </div>

              <button
                type="button"
                className="pa-close-button"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>
            </div>

            <label>
              Nome do andar

              <input
                autoFocus
                value={novoAndar.nome}
                onChange={(event) =>
                  setNovoAndar((atual) => ({
                    ...atual,
                    nome: event.target.value,
                  }))
                }
                placeholder="Ex.: 4º Andar"
                required
              />
            </label>

            <label>
              Descrição

              <textarea
                value={novoAndar.descricao}
                onChange={(event) =>
                  setNovoAndar((atual) => ({
                    ...atual,
                    descricao: event.target.value,
                  }))
                }
                placeholder="Descreva a finalidade deste andar..."
                rows={3}
              />
            </label>

            <div className="pa-modal-actions">
              <button
                type="button"
                className="pa-detail-secondary"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="pa-detail-primary"
              >
                Cadastrar andar
                <span>＋</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {mensagem && (
        <div className="pa-toast">
          <span>✓</span>
          {mensagem}
        </div>
      )}
    </div>
  );
}

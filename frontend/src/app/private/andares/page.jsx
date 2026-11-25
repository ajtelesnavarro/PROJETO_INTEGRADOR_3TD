"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import { obterPredioAtual } from "@/services/predioAtual";
import "./predios.css";

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

function formatarNomeAndar(numero) {
  return Number(numero) === 0 ? "Térreo" : `${numero}º Andar`;
}

function formatarData(valor) {
  if (!valor) return "Não informada";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "Não informada";
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function deduplicarPor(lista, chave) {
  const mapa = new Map();
  for (const item of lista || []) {
    if (item && item[chave] !== undefined && item[chave] !== null) {
      mapa.set(item[chave], item);
    }
  }
  return Array.from(mapa.values());
}

export default function PrediosAndares() {
  const router = useRouter();

  const [predios, setPredios] = useState([]);
  const [predioSelecionadoId, setPredioSelecionadoId] = useState(null);
  const [andaresBrutos, setAndaresBrutos] = useState([]);
  const [ambientesBrutos, setAmbientesBrutos] = useState([]);
  const [setoresBrutos, setSetoresBrutos] = useState([]);
  const [dispositivosBrutos, setDispositivosBrutos] = useState([]);
  const [usuariosPredio, setUsuariosPredio] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [modalNovoAndar, setModalNovoAndar] = useState(false);
  const [modalNovoSetor, setModalNovoSetor] = useState(false);
  const [novoSetor, setNovoSetor] = useState({ id_andar: "", nome_setor: "", descricao: "", id_usuario_responsavel: "" });
  const [modalEditarAndar, setModalEditarAndar] = useState(null);
  const [modalPredio, setModalPredio] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const [novoAndar, setNovoAndar] = useState({
    numero_andar: "",
    descricao: "",
  });

  const mostrarMensagem = useCallback((texto) => {
    setMensagem(texto);
    window.clearTimeout(window.__lumoraPaToast);
    window.__lumoraPaToast = window.setTimeout(() => setMensagem(""), 3200);
  }, []);

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [resPredios, resAndares, resAmbientes, resDispositivos, resSetores, resUsuarios] =
        await Promise.all([
          requisicaoAPI("/predios?limite=200"),
          requisicaoAPI("/andares?limite=200"),
          requisicaoAPI("/ambientes?limite=200"),
          requisicaoAPI("/dispositivos?limite=200"),
          requisicaoAPI("/setores?limite=200"),
          requisicaoAPI("/usuarios?limite=200"),
        ]);

      const predioDoUsuario = obterPredioAtual();
      const idPredioAtual = Number(predioDoUsuario?.id_predio);
      const listaPredios = deduplicarPor(resPredios.dados, "id_predio")
        .filter((predio) => predio.id_predio === idPredioAtual);
      const listaAndares = deduplicarPor(resAndares.dados, "id_andar")
        .filter((andar) => andar.id_predio === idPredioAtual);
      const idsAndares = new Set(listaAndares.map((andar) => andar.id_andar));
      const listaSetores = deduplicarPor(resSetores.dados, "id_setor")
        .filter((setor) => idsAndares.has(setor.id_andar));
      const listaAmbientes = deduplicarPor(resAmbientes.dados, "id_ambiente")
        .filter((ambiente) => idsAndares.has(ambiente.id_andar));
      const idsAmbientes = new Set(listaAmbientes.map((ambiente) => ambiente.id_ambiente));
      setPredios(listaPredios);
      setAndaresBrutos(listaAndares);
      setSetoresBrutos(listaSetores);
      setAmbientesBrutos(listaAmbientes);
      setUsuariosPredio(resUsuarios.dados || []);
      setDispositivosBrutos(
        deduplicarPor(resDispositivos.dados, "id_dispositivo")
          .filter((dispositivo) => idsAmbientes.has(dispositivo.id_ambiente))
      );

      setPredioSelecionadoId(listaPredios[0]?.id_predio ?? null);
    } catch (erro) {
      mostrarMensagem(
        erro.message || "Erro ao carregar dados do edifício."
      );
    } finally {
      setCarregando(false);
    }
  }, [mostrarMensagem]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const predioAtual = useMemo(() => {
    return (
      predios.find((p) => p.id_predio === predioSelecionadoId) ||
      predios[0] ||
      null
    );
  }, [predios, predioSelecionadoId]);

  const andaresDoPredio = useMemo(() => {
    if (!predioAtual) return [];

    return andaresBrutos
      .filter((a) => a.id_predio === predioAtual.id_predio)
      .sort((a, b) => a.numero_andar - b.numero_andar)
      .map((andar) => {
        const setoresDoAndar = setoresBrutos.filter((setor) => setor.id_andar === andar.id_andar);
        const ambientesDoAndar = ambientesBrutos.filter(
          (amb) => amb.id_andar === andar.id_andar
        );
        const idsAmbientes = new Set(
          ambientesDoAndar.map((amb) => amb.id_ambiente)
        );
        const dispositivosDoAndar = dispositivosBrutos.filter((disp) =>
          idsAmbientes.has(disp.id_ambiente)
        );
        const setoresDistintos = new Set(
          ambientesDoAndar
            .map((amb) => amb.id_setor)
            .filter((id) => id !== null && id !== undefined)
        );
        const capacidadeAndar = ambientesDoAndar.reduce(
          (soma, amb) => soma + (Number(amb.capacidade_maxima) || 0),
          0
        );

        return {
          id: andar.id_andar,
          id_andar: andar.id_andar,
          id_predio: andar.id_predio,
          numero: andar.numero_andar,
          numero_andar: andar.numero_andar,
          nome: formatarNomeAndar(andar.numero_andar),
          descricao: andar.descricao || "Sem descrição cadastrada.",
          descricaoBruta: andar.descricao || "",
          data_cadastro: andar.data_cadastro,
          status: "Ativo",
          indicadores: {
            setores: setoresDistintos.size,
            ambientes: ambientesDoAndar.length,
            dispositivos: dispositivosDoAndar.length,
            capacidade: capacidadeAndar,
          },
          ambientesLista: ambientesDoAndar,
          setoresLista: setoresDoAndar,
        };
      });
  }, [predioAtual, andaresBrutos, setoresBrutos, ambientesBrutos, dispositivosBrutos]);

  const indicadoresGerais = useMemo(() => {
    return andaresDoPredio.reduce(
      (acc, andar) => ({
        setores: acc.setores + andar.indicadores.setores,
        ambientes: acc.ambientes + andar.indicadores.ambientes,
        dispositivos: acc.dispositivos + andar.indicadores.dispositivos,
        capacidade: acc.capacidade + andar.indicadores.capacidade,
      }),
      { setores: 0, ambientes: 0, dispositivos: 0, capacidade: 0 }
    );
  }, [andaresDoPredio]);

  const andaresFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return andaresDoPredio;

    return andaresDoPredio.filter(
      (andar) =>
        andar.nome.toLowerCase().includes(termo) ||
        andar.descricao.toLowerCase().includes(termo) ||
        String(andar.numero_andar).includes(termo) ||
        andar.ambientesLista.some((amb) =>
          (amb.nome || "").toLowerCase().includes(termo)
        )
    );
  }, [andaresDoPredio, pesquisa]);

  const edificioFormatado = useMemo(() => {
    if (!predioAtual) return null;

    const logradouroDetalhado = [
      predioAtual.rua,
      predioAtual.numero,
      predioAtual.complemento,
      predioAtual.bairro,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      ...predioAtual,
      codigo: `LUM-${String(predioAtual.id_predio).padStart(3, "0")}`,
      nome: predioAtual.nome_predio,
      logradouroDetalhado,
      cidadeUf: `${predioAtual.cidade}, ${predioAtual.estado}`,
      andaresCadastrados: andaresDoPredio.length,
      status: "Operacional",
      descricao:
        "Unidade monitorada pela plataforma Lumora com gestão integrada de pavimentos, ambientes e dispositivos.",
    };
  }, [predioAtual, andaresDoPredio.length]);

  function abrirModalNovoAndar() {
    const proximoNumero =
      andaresDoPredio.length > 0
        ? Math.max(...andaresDoPredio.map((a) => a.numero_andar)) + 1
        : 1;
    setNovoAndar({ numero_andar: String(proximoNumero), descricao: "" });
    setModalNovoAndar(true);
  }

  function abrirModalNovoPredio() {
    setModalPredio({
      modo: "criar",
      id_predio: null,
      nome_predio: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "Santo André",
      estado: "SP",
    });
  }

  function abrirModalEditarPredio(predio) {
    if (!predio) return;
    setModalPredio({
      modo: "editar",
      id_predio: predio.id_predio,
      nome_predio: predio.nome_predio || "",
      cep: predio.cep || "",
      rua: predio.rua || "",
      numero: predio.numero || "",
      complemento: predio.complemento || "",
      bairro: predio.bairro || "",
      cidade: predio.cidade || "",
      estado: predio.estado || "",
    });
  }

  async function adicionarAndar(event) {
    event.preventDefault();
    if (!predioAtual) return;

    const numero = Number(novoAndar.numero_andar);
    if (!Number.isInteger(numero)) {
      mostrarMensagem("Informe um número inteiro válido para o andar.");
      return;
    }

    if (andaresDoPredio.some((a) => a.numero_andar === numero)) {
      mostrarMensagem(
        `O ${formatarNomeAndar(numero)} já está cadastrado neste edifício.`
      );
      return;
    }

    try {
      setSalvando(true);
      await requisicaoAPI("/andares", {
        method: "POST",
        body: JSON.stringify({
          id_predio: predioAtual.id_predio,
          numero_andar: numero,
          descricao: novoAndar.descricao.trim() || null,
          data_cadastro: new Date().toISOString().slice(0, 10),
        }),
      });

      setModalNovoAndar(false);
      setNovoAndar({ numero_andar: "", descricao: "" });
      await carregarDados();
      mostrarMensagem("Andar cadastrado com sucesso!");
    } catch (erro) {
      mostrarMensagem(erro.message || "Erro ao cadastrar andar.");
    } finally {
      setSalvando(false);
    }
  }

  function abrirModalNovoSetor(andar) {
    setNovoSetor({ id_andar: String(andar.id_andar), nome_setor: "", descricao: "", id_usuario_responsavel: "" });
    setModalNovoSetor(true);
  }

  async function salvarSetor(event) {
    event.preventDefault();
    try {
      setSalvando(true);
      await requisicaoAPI("/setores", {
        method: "POST",
        body: JSON.stringify({
          id_andar: Number(novoSetor.id_andar),
          nome_setor: novoSetor.nome_setor.trim(),
          descricao: novoSetor.descricao.trim() || null,
          id_usuario_responsavel: novoSetor.id_usuario_responsavel ? Number(novoSetor.id_usuario_responsavel) : null,
        }),
      });
      setModalNovoSetor(false);
      await carregarDados();
      mostrarMensagem("Setor cadastrado com sucesso!");
    } catch (erro) {
      mostrarMensagem(erro.message || "Erro ao cadastrar setor.");
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(itemSelecionado) {
    if (itemSelecionado.tipo === "andar") {
      setModalEditarAndar({
        id_andar: itemSelecionado.dados.id_andar,
        numero_andar: String(itemSelecionado.dados.numero_andar),
        descricao: itemSelecionado.dados.descricaoBruta || "",
      });
    } else if (itemSelecionado.tipo === "edificio" && predioAtual) {
      abrirModalEditarPredio(predioAtual);
    }
  }

  async function salvarEdicaoAndar(event) {
    event.preventDefault();
    if (!modalEditarAndar) return;

    const numero = Number(modalEditarAndar.numero_andar);
    if (!Number.isInteger(numero)) {
      mostrarMensagem("Informe um número inteiro válido para o andar.");
      return;
    }

    const conflito = andaresDoPredio.some(
      (a) =>
        a.numero_andar === numero && a.id_andar !== modalEditarAndar.id_andar
    );
    if (conflito) {
      mostrarMensagem(
        `Já existe outro registro para o ${formatarNomeAndar(numero)} neste edifício.`
      );
      return;
    }

    try {
      setSalvando(true);
      const res = await requisicaoAPI(
        `/andares/${modalEditarAndar.id_andar}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            numero_andar: numero,
            descricao: modalEditarAndar.descricao.trim() || null,
          }),
        }
      );

      const atualizado = res.dados;
      setModalEditarAndar(null);
      await carregarDados();

      if (selecionado?.tipo === "andar" && atualizado) {
        setSelecionado((atual) =>
          atual
            ? {
                ...atual,
                dados: {
                  ...atual.dados,
                  numero: atualizado.numero_andar,
                  numero_andar: atualizado.numero_andar,
                  nome: formatarNomeAndar(atualizado.numero_andar),
                  descricao:
                    atualizado.descricao || "Sem descrição cadastrada.",
                  descricaoBruta: atualizado.descricao || "",
                },
              }
            : null
        );
      }

      mostrarMensagem("Informações do andar atualizadas!");
    } catch (erro) {
      mostrarMensagem(erro.message || "Erro ao atualizar andar.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAndar(andar) {
    if (!window.confirm(`Deseja realmente excluir o ${andar.nome}?`)) return;

    try {
      setSalvando(true);
      await requisicaoAPI(`/andares/${andar.id_andar}`, {
        method: "DELETE",
      });
      setSelecionado(null);
      await carregarDados();
      mostrarMensagem("Andar removido com sucesso!");
    } catch (erro) {
      mostrarMensagem(
        erro.message ||
          "Não foi possível excluir este andar (verifique se há )."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function salvarPredio(event) {
    event.preventDefault();
    if (!modalPredio) return;

    const payload = {
      nome_predio: modalPredio.nome_predio.trim(),
      cep: modalPredio.cep.trim(),
      rua: modalPredio.rua.trim(),
      numero: modalPredio.numero.trim(),
      complemento: modalPredio.complemento.trim() || null,
      bairro: modalPredio.bairro.trim(),
      cidade: modalPredio.cidade.trim(),
      estado: modalPredio.estado.trim().toUpperCase(),
    };

    try {
      setSalvando(true);
      if (modalPredio.modo === "criar") {
        const criado = await requisicaoAPI("/predios", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (criado?.dados?.id_predio) {
          setPredioSelecionadoId(criado.dados.id_predio);
          const predio = {
            id_predio: criado.dados.id_predio,
            nome_predio: criado.dados.nome_predio,
          };
          sessionStorage.setItem("lumora_predio_atual", JSON.stringify(predio));
        }
        mostrarMensagem("Novo edifício cadastrado!");
      } else {
        await requisicaoAPI(`/predios/${modalPredio.id_predio}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        mostrarMensagem("Informações do edifício atualizadas!");
      }

      setModalPredio(null);
      setSelecionado(null);
      await carregarDados();
    } catch (erro) {
      mostrarMensagem(erro.message || "Erro ao salvar dados do edifício.");
    } finally {
      setSalvando(false);
    }
  }

  function irParaPagina(caminho) {
    setSelecionado(null);
    router.push(caminho);
  }

  return (
    <div className="pa-page">
      <div className="pa-background-glow pa-glow-one" />
      <div className="pa-background-glow pa-glow-two" />

      <header className="pa-heading">
        <div>
          <span className="pa-eyebrow">ESTRUTURA PREDIAL</span>
          <h1>Setores & Andares</h1>
          <p>
            Gerencie edifícios, pavimentos e navegue diretamente para os
            ambientes, dispositivos e ocorrências vinculados.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {predioAtual && <strong className="pa-current-building">{predioAtual.nome_predio}</strong>}

          {!predioAtual && !carregando && (
          <button
            type="button"
            className="pa-detail-secondary"
            onClick={abrirModalNovoPredio}
          >
            <span>＋</span>
            Novo prédio
          </button>
          )}

          <button
            type="button"
            className="pa-primary-button"
            onClick={abrirModalNovoAndar}
            disabled={!predioAtual}
          >
            <span>＋</span>
            Adicionar andar
          </button>
        </div>
      </header>

      {carregando && !edificioFormatado ? (
        <div className="pa-empty">
          <h3>Carregando estrutura predial...</h3>
          <p>Consultando prédios e andares cadastrados na API.</p>
        </div>
      ) : edificioFormatado ? (
        <>
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

            </div>

            <div className="pa-building-info">
              <div className="pa-building-topline">
                <span className="pa-code">{edificioFormatado.codigo}</span>
                <Status value={edificioFormatado.status} />
              </div>

              <h2>{edificioFormatado.nome}</h2>
              <p>{edificioFormatado.descricao}</p>

              <div className="pa-building-meta">
                <span>
                  <Icon>⌂</Icon>
                  {edificioFormatado.rua}, {edificioFormatado.numero}
                </span>

                <span>
                  <Icon>⌖</Icon>
                  {edificioFormatado.cidadeUf}
                </span>

                <span>
                  <Icon>▦</Icon>
                  {edificioFormatado.tipo}
                </span>
                
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "22px",
                }}
              >
                <button
                  type="button"
                  className="pa-text-button"
                  style={{ marginTop: 0 }}
                  onClick={() =>
                    setSelecionado({
                      tipo: "edificio",
                      dados: edificioFormatado,
                    })
                  }
                >
                  Detalhes do edifício
                  <span>↗</span>
                </button>

                <button
                  type="button"
                  className="pa-text-button"
                  style={{ marginTop: 0 }}
                  onClick={() => abrirModalEditarPredio(predioAtual)}
                >
                  Editar edifício
                  <span>✎</span>
                </button>
              </div>
            </div>

            <div className="pa-building-number">
              <span>ESTRUTURA</span>
              <strong>
                {String(edificioFormatado.andaresCadastrados).padStart(2, "0")}
              </strong>
              <small>andares cadastrados</small>
            </div>
          </section>

          <section className="pa-metrics">
            <div className="pa-metric">
              <span className="pa-metric-icon blue">☺</span>
              <div>
                <small>Capacidade total</small>
                <strong>{indicadoresGerais.capacidade}</strong>
                <span>Pessoas nos ambientes</span>
              </div>
            </div>

            <div className="pa-metric">
              <span className="pa-metric-icon purple">⌘</span>
              <div>
                <small>Setores ativos</small>
                <strong>{indicadoresGerais.setores}</strong>
                <span>Mapeados nos andares</span>
              </div>
            </div>

            <div
              className="pa-metric"
              style={{ cursor: "pointer" }}
              onClick={() =>
                irParaPagina(`/private/ambientes?predio=${predioAtual.id_predio}`)
              }
              title="Abrir página de Ambientes"
            >
              <span className="pa-metric-icon cyan">⌂</span>
              <div>
                <small></small>
                <strong>{indicadoresGerais.ambientes}</strong>
                <span>Ver todos em Ambientes ↗</span>
              </div>
            </div>

            <div
              className="pa-metric"
              style={{ cursor: "pointer" }}
              onClick={() =>
                irParaPagina(
                  `/private/dispositivos?predio=${predioAtual.id_predio}`
                )
              }
              title="Abrir página de Dispositivos"
            >
              <span className="pa-metric-icon violet">◈</span>
              <div>
                <small>Dispositivos vinculados</small>
                <strong>{indicadoresGerais.dispositivos}</strong>
                <span>Ver todos em Dispositivos ↗</span>
              </div>
            </div>
          </section>

          <section className="pa-floors-section">
            <div className="pa-section-heading">
              <div>
                <span className="pa-eyebrow">ORGANIZAÇÃO INTERNA</span>
                <h2>Andares do edifício</h2>
                <p>
                  Clique em um ambiente para ir direto à página de Ambientes ou
                  abra o andar para editar suas informações.
                </p>
              </div>

              <div className="pa-floor-count">
                {andaresFiltrados.length} de {andaresDoPredio.length} andares
              </div>
            </div>

            <div className="pa-toolbar">
              <div className="pa-search">
                <span>⌕</span>

                <input
                  type="search"
                  placeholder="Buscar andar, número ou ambiente..."
                  value={pesquisa}
                  onChange={(event) => setPesquisa(event.target.value)}
                />

                {pesquisa && (
                  <button
                    type="button"
                    onClick={() => setPesquisa("")}
                    aria-label="Limpar pesquisa"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="pa-floor-grid">
              {andaresFiltrados.map((andar) => (
                <article className="pa-floor-card" key={andar.id_andar}>
                  <div className="pa-floor-card-top">
                    <div className="pa-floor-symbol">
                      <span>⌂</span>
                    </div>

                    <Status value={andar.status} />
                  </div>

                  <div className="pa-floor-title">

                    <h3>{andar.nome}</h3>
                    <p>{andar.descricao}</p>
                  </div>

                  <div className="pa-floor-data">
                    <div>
                      <strong>{andar.indicadores.setores}</strong>
                      <span>Setores</span>
                    </div>

                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        irParaPagina(
                          `/private/ambientes?predio=${predioAtual.id_predio}&andar=${andar.id_andar}`
                        )
                      }
                      title="Abrir ambientes deste andar"
                    >
                      <strong>{andar.indicadores.ambientes}</strong>
                      <span>Ambientes ↗</span>
                    </div>

                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        irParaPagina(
                          `/private/dispositivos?predio=${predioAtual.id_predio}&andar=${andar.id_andar}`
                        )
                      }
                      title="Abrir dispositivos deste andar"
                    >
                      <strong>{andar.indicadores.dispositivos}</strong>
                      <span>Dispositivos ↗</span>
                    </div>
                  </div>

                  <div className="pa-sector-preview">
  <span>SETORES CADASTRADOS</span>

  <div>
    {andar.setoresLista.length > 0 ? (
      andar.setoresLista.map((setor) => (
        <span
          key={setor.id_setor}
          className="pa-sector-chip"
        >
          {setor.nome_setor}
        </span>
      ))
    ) : (
      <p>Nenhum setor cadastrado neste andar.</p>
    )}
  </div>

  <button
    type="button"
    className="pa-add-sector-button"
    onClick={() => abrirModalNovoSetor(andar)}
  >
    + Cadastrar setor
  </button>
</div>

<div className="pa-sector-preview">
  <span>AMBIENTES VINCULADOS</span>

                    <div>
                      {andar.ambientesLista.length > 0 ? (
                        andar.ambientesLista.slice(0, 3).map((amb) => (
                          <button
                            type="button"
                            key={amb.id_ambiente}
                            onClick={() =>
                              irParaPagina(
                                `/private/ambientes?predio=${predioAtual.id_predio}&andar=${andar.id_andar}&ambiente=${amb.id_ambiente}`
                              )
                            }
                            title={`Abrir ${amb.nome} em Ambientes`}
                          >
                            {amb.nome}
                            <span>↗</span>
                          </button>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            irParaPagina(
                              `/private/ambientes?predio=${predioAtual.id_predio}&andar=${andar.id_andar}`
                            )
                          }
                        >
                          Cadastrar ambiente
                          <span>＋</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pa-floor-details"
                    onClick={() =>
                      setSelecionado({ tipo: "andar", dados: andar })
                    }
                  >
                    Ver ou editar andar
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
                  {andaresDoPredio.length === 0
                    ? "Este edifício ainda não possui andares cadastrados."
                    : "Tente alterar o termo pesquisado."}
                </p>

                {pesquisa && (
                  <button type="button" onClick={() => setPesquisa("")}>
                    Limpar pesquisa
                  </button>
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="pa-empty">
          <h3>Nenhum edifício encontrado</h3>
          <p>Não há prédios cadastrados no banco de dados.</p>
        </div>
      )}

      {/* Painel lateral de detalhes */}
      {selecionado && (
        <div
          className="pa-detail-layer"
          onMouseDown={() => setSelecionado(null)}
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
                    : "INFORMAÇÕES DO ANDAR"}
                </span>

                <h2>
                  {selecionado.tipo === "edificio"
                    ? "Detalhes do edifício"
                    : "Detalhes do andar"}
                </h2>
              </div>

              <button
                type="button"
                className="pa-close-button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="pa-detail-content">
              <div className="pa-detail-hero">
                <div className="pa-detail-icon">
                  {selecionado.tipo === "edificio" ? "⌂" : "▤"}
                </div>

                <div>
                  <span>
                    {selecionado.tipo === "edificio"
                      ? selecionado.dados.codigo
                      : `PAVIMENTO ${String(selecionado.dados.numero_andar).padStart(2, "0")}`}
                  </span>

                  <h3>{selecionado.dados.nome}</h3>
                  <Status value={selecionado.dados.status} />
                </div>
              </div>

              {selecionado.tipo === "edificio" && (
                <>
                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Andares cadastrados</span>
                      <strong>{selecionado.dados.andaresCadastrados}</strong>
                    </div>

                    <div>
                      <span>CEP</span>
                      <strong>{selecionado.dados.cep}</strong>
                    </div>

                    <div>
                      <span>Cidade / UF</span>
                      <strong>{selecionado.dados.cidadeUf}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-description">
                    <span>LOGRADOURO E BAIRRO</span>
                    <p>{selecionado.dados.logradouroDetalhado}</p>
                  </div>

                  <div className="pa-detail-list">
                    <div className="pa-detail-list-heading">
                      <span>ACESSAR MÓDULOS DO EDIFÍCIO</span>
                    </div>

                    <button
                      type="button"
                      className="pa-detail-sector"
                      onClick={() =>
                        irParaPagina(
                          `/private/ambientes?predio=${selecionado.dados.id_predio}`
                        )
                      }
                    >
                      <span className="pa-sector-icon">⌂</span>
                      <span>
                        <strong>Ambientes</strong>
                        <small>Gerenciar salas, setores e lotação</small>
                      </span>
                      <b>↗</b>
                    </button>

                    <button
                      type="button"
                      className="pa-detail-sector"
                      onClick={() =>
                        irParaPagina(
                          `/private/dispositivos?predio=${selecionado.dados.id_predio}`
                        )
                      }
                    >
                      <span className="pa-sector-icon">◈</span>
                      <span>
                        <strong>Dispositivos</strong>
                        <small>Sensores, medidores e equipamentos</small>
                      </span>
                      <b>↗</b>
                    </button>

                    <button
                      type="button"
                      className="pa-detail-sector"
                      onClick={() =>
                        irParaPagina(
                          `/private/ocorrencias?predio=${selecionado.dados.id_predio}`
                        )
                      }
                    >
                      <span className="pa-sector-icon">⚠</span>
                      <span>
                        <strong>Ocorrências</strong>
                        <small>Chamados e manutenções prediais</small>
                      </span>
                      <b>↗</b>
                    </button>

                    <button
                      type="button"
                      className="pa-detail-sector"
                      onClick={() =>
                        irParaPagina(
                          `/private/acessos?predio=${selecionado.dados.id_predio}`
                        )
                      }
                    >
                      <span className="pa-sector-icon">⚿</span>
                      <span>
                        <strong>Controle de Acessos</strong>
                        <small>Credenciais e registros de entrada</small>
                      </span>
                      <b>↗</b>
                    </button>
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
                      <span>Data de cadastro</span>
                      <strong>
                        {formatarData(selecionado.dados.data_cadastro)}
                      </strong>
                    </div>

                    <div>
                      <span>Setores</span>
                      <strong>{selecionado.dados.indicadores.setores}</strong>
                    </div>

                    <div>
                      <span>Ambientes</span>
                      <strong>{selecionado.dados.indicadores.ambientes}</strong>
                    </div>

                    <div>
                      <span>Dispositivos</span>
                      <strong>
                        {selecionado.dados.indicadores.dispositivos}
                      </strong>
                    </div>
                  </div>

                  <div className="pa-detail-list">
                    <div className="pa-detail-list-heading">
                      <span>SETORES DESTE ANDAR</span>
                      <b>{selecionado.dados.setoresLista.length}</b>
                    </div>
                    {selecionado.dados.setoresLista.length ? (
                      selecionado.dados.setoresLista.map((setor) => (
                        <div className="pa-detail-sector" key={setor.id_setor}>
                          <span className="pa-sector-icon">▦</span>
                          <span><strong>{setor.nome_setor}</strong><small>{setor.descricao || "Sem descrição"}</small></span>
                        </div>
                      ))
                    ) : <p className="pa-no-sectors">Nenhum setor cadastrado neste andar.</p>}
                    <button type="button" className="pa-detail-secondary" style={{ width: "100%", marginTop: "10px" }} onClick={() => abrirModalNovoSetor(selecionado.dados)}>
                      Adicionar setor
                    </button>
                  </div>

                  <div className="pa-detail-list">
                    <div className="pa-detail-list-heading">
                      <span>AMBIENTES NESTE ANDAR</span>
                      <b>{selecionado.dados.ambientesLista.length}</b>
                    </div>

                    {selecionado.dados.ambientesLista.length > 0 ? (
                      selecionado.dados.ambientesLista.map((amb) => (
                        <button
                          type="button"
                          className="pa-detail-sector"
                          key={amb.id_ambiente}
                          onClick={() =>
                            irParaPagina(
                              `/private/ambientes?predio=${predioAtual.id_predio}&andar=${selecionado.dados.id_andar}&ambiente=${amb.id_ambiente}`
                            )
                          }
                        >
                          <span className="pa-sector-icon">▦</span>
                          <span>
                            <strong>{amb.nome}</strong>
                            <small>
                              {amb.localizacao ||
                                "Localização não informada"}
                              {amb.capacidade_maxima
                                ? ` · Cap. ${amb.capacidade_maxima} pessoas`
                                : ""}
                            </small>
                          </span>
                          <b>↗</b>
                        </button>
                      ))
                    ) : (
                      <p className="pa-no-sectors">
                        Este andar ainda não possui ambientes vinculados.
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        type="button"
                        className="pa-detail-secondary"
                        style={{ flex: 1 }}
                        onClick={() =>
                          irParaPagina(
                            `/private/ambientes?predio=${predioAtual.id_predio}&andar=${selecionado.dados.id_andar}`
                          )
                        }
                      >
                        Abrir em Ambientes ↗
                      </button>

                      <button
                        type="button"
                        className="pa-detail-secondary"
                        style={{ flex: 1 }}
                        onClick={() =>
                          irParaPagina(
                            `/private/dispositivos?predio=${predioAtual.id_predio}&andar=${selecionado.dados.id_andar}`
                          )
                        }
                      >
                        Ver Dispositivos ↗
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pa-detail-footer">
              <button
                type="button"
                className="pa-detail-secondary"
                onClick={() => setSelecionado(null)}
              >
                Fechar
              </button>

              {selecionado.tipo === "andar" && (
                <button
                  type="button"
                  className="pa-detail-secondary"
                  style={{ color: "#dc2626", borderColor: "#fecaca" }}
                  disabled={salvando}
                  onClick={() => excluirAndar(selecionado.dados)}
                >
                  Excluir
                </button>
              )}

              <button
                type="button"
                className="pa-detail-primary"
                onClick={() => iniciarEdicao(selecionado)}
              >
                Editar informações
                <span>↗</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Modal para cadastrar um novo andar */}
      {modalNovoAndar && (
        <div
          className="pa-modal-layer"
          onMouseDown={() => setModalNovoAndar(false)}
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
                <p>Adicione um andar a {predioAtual?.nome_predio}.</p>
              </div>

              <button
                type="button"
                className="pa-close-button"
                onClick={() => setModalNovoAndar(false)}
              >
                ×
              </button>
            </div>

            <label>
              Número do andar (0 = Térreo)
              <input
                type="number"
                autoFocus
                value={novoAndar.numero_andar}
                onChange={(event) =>
                  setNovoAndar((atual) => ({
                    ...atual,
                    numero_andar: event.target.value,
                  }))
                }
                placeholder="Ex.: 6"
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
                onClick={() => setModalNovoAndar(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="pa-detail-primary"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Cadastrar andar"}
                <span>＋</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {modalNovoSetor && (
        <div className="pa-modal-layer" onMouseDown={() => setModalNovoSetor(false)}>
          <form className="pa-modal" onSubmit={salvarSetor} onMouseDown={(event) => event.stopPropagation()}>
            <div className="pa-modal-header">
              <div><span className="pa-eyebrow">ESTRUTURA PREDIAL</span><h2>Novo setor</h2><p>Cadastre o setor no andar selecionado.</p></div>
              <button type="button" className="pa-close-button" onClick={() => setModalNovoSetor(false)}>×</button>
            </div>
            <label>Nome do setor<input required maxLength={100} value={novoSetor.nome_setor} onChange={(event) => setNovoSetor((atual) => ({ ...atual, nome_setor: event.target.value }))} /></label>
            <label>Descrição<textarea maxLength={255} rows={3} value={novoSetor.descricao} onChange={(event) => setNovoSetor((atual) => ({ ...atual, descricao: event.target.value }))} /></label>
            <label>Responsável (opcional)
              <select value={novoSetor.id_usuario_responsavel} onChange={(event) => setNovoSetor((atual) => ({ ...atual, id_usuario_responsavel: event.target.value }))}>
                <option value="">Sem responsável</option>
                {usuariosPredio.map((usuario) => <option key={usuario.id_usuario} value={String(usuario.id_usuario)}>{usuario.nome}</option>)}
              </select>
            </label>
            <div className="pa-modal-actions">
              <button type="button" className="pa-detail-secondary" onClick={() => setModalNovoSetor(false)}>Cancelar</button>
              <button type="submit" className="pa-detail-primary" disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar setor"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para editar andar */}
      {modalEditarAndar && (
        <div
          className="pa-modal-layer"
          onMouseDown={() => setModalEditarAndar(null)}
        >
          <form
            className="pa-modal"
            onSubmit={salvarEdicaoAndar}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pa-modal-header">
              <div>
                <span className="pa-eyebrow">EDIÇÃO DE ANDAR</span>
                <h2>Editar informações</h2>
                <p>Atualize o número ou a descrição deste andar.</p>
              </div>

              <button
                type="button"
                className="pa-close-button"
                onClick={() => setModalEditarAndar(null)}
              >
                ×
              </button>
            </div>

            <label>
              Número do andar (0 = Térreo)
              <input
                type="number"
                autoFocus
                value={modalEditarAndar.numero_andar}
                onChange={(event) =>
                  setModalEditarAndar((atual) => ({
                    ...atual,
                    numero_andar: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Descrição
              <textarea
                value={modalEditarAndar.descricao}
                onChange={(event) =>
                  setModalEditarAndar((atual) => ({
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
                onClick={() => setModalEditarAndar(null)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="pa-detail-primary"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
                <span>✓</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para criar ou editar edifício */}
      {modalPredio && (
        <div
          className="pa-modal-layer"
          onMouseDown={() => setModalPredio(null)}
        >
          <form
            className="pa-modal"
            style={{
              width: "min(100%, 540px)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onSubmit={salvarPredio}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pa-modal-header">
              <div>
                <span className="pa-eyebrow">
                  {modalPredio.modo === "criar"
                    ? "CADASTRO DE EDIFÍCIO"
                    : "EDIÇÃO DE EDIFÍCIO"}
                </span>
                <h2>
                  {modalPredio.modo === "criar"
                    ? "Novo edifício"
                    : "Editar edifício"}
                </h2>
                <p>
                  {modalPredio.modo === "criar"
                    ? "Cadastre uma nova unidade predial na plataforma."
                    : "Atualize os dados cadastrais do prédio."}
                </p>
              </div>

              <button
                type="button"
                className="pa-close-button"
                onClick={() => setModalPredio(null)}
              >
                ×
              </button>
            </div>

            <label>
              Nome do edifício
              <input
                autoFocus
                value={modalPredio.nome_predio}
                onChange={(e) =>
                  setModalPredio((a) => ({ ...a, nome_predio: e.target.value }))
                }
                placeholder="Ex.: Torre Norte Lumora"
                required
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "10px",
              }}
            >
              <label>
                CEP
                <input
                  value={modalPredio.cep}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, cep: e.target.value }))
                  }
                  placeholder="09000-000"
                  required
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "10px",
              }}
            >
              <label>
                Rua / Avenida
                <input
                  value={modalPredio.rua}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, rua: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Número
                <input
                  value={modalPredio.numero}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, numero: e.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <label>
                Bairro
                <input
                  value={modalPredio.bairro}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, bairro: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Complemento
                <input
                  value={modalPredio.complemento}
                  onChange={(e) =>
                    setModalPredio((a) => ({
                      ...a,
                      complemento: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "10px",
              }}
            >
              <label>
                Cidade
                <input
                  value={modalPredio.cidade}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, cidade: e.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Estado (UF)
                <input
                  maxLength={2}
                  value={modalPredio.estado}
                  onChange={(e) =>
                    setModalPredio((a) => ({ ...a, estado: e.target.value }))
                  }
                  required
                />
              </label>
            </div>

            <div className="pa-modal-actions">
              <button
                type="button"
                className="pa-detail-secondary"
                onClick={() => setModalPredio(null)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="pa-detail-primary"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : modalPredio.modo === "criar"
                    ? "Cadastrar edifício"
                    : "Salvar alterações"}
                <span>✓</span>
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

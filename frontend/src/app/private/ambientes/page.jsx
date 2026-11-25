"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requisicaoAPI } from "@/services/api";
import { obterPredioAtual } from "@/services/predioAtual";
import "./ambientes.css";

const emptyForm = {
  id_predio: "",
  id_andar: "",
  id_setor: "",
  name: "",
  localizacao: "",
  capacity: "",
  opening: "08:00",
  closing: "18:00",
  reservation: false,
  temperaturaMinima: "",
  temperaturaMaxima: "",
  iluminacaoMinima: "",
  iluminacaoMaxima: "",
  consumoMinimo: "",
  consumoMaximo: "",
  potenciaMaxima: "",
};

function Icon({ name, size = 18 }) {
  const icons = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    room: (
      <>
        <path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" />
      </>
    ),
    building: (
      <>
        <path d="M4 21h16M6 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M9 8h2m2 0h2M9 12h2m2 0h2M9 16h2m2 0h2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8m13 18v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    device: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    edit: (
      <>
        <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
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

function formatCapacity(value) {
  return value ? `${value} pessoas` : "Não informado";
}

function formatarNomeAndar(numero) {
  return Number(numero) === 0 ? "Térreo" : `${numero}º Andar`;
}

function normalizarHora(valor, padrao = "08:00:00") {
  if (!valor) return padrao;
  return valor.length === 5 ? `${valor}:00` : valor;
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

function AmbientesConteudo({ toast }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parametroAplicadoRef = useRef("");

  const [predios, setPredios] = useState([]);
  const [andares, setAndares] = useState([]);
  const [ambientesBrutos, setAmbientesBrutos] = useState([]);
  const [dispositivosBrutos, setDispositivosBrutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [predioFilter, setPredioFilter] = useState("Todos");
  const [floorFilter, setFloorFilter] = useState("Todos");
  const [reservationFilter, setReservationFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [perfilAtual, setPerfilAtual] = useState("");

  const notify = useCallback(
    (text) => {
      if (toast) {
        toast(text);
      } else {
        setMessage(text);
        window.clearTimeout(window.__lumoraAmbToast);
        window.__lumoraAmbToast = window.setTimeout(() => setMessage(""), 3000);
      }
    },
    [toast]
  );

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [resPredios, resAndares, resAmbientes, resDispositivos] =
        await Promise.all([
          requisicaoAPI("/predios?limite=200"),
          requisicaoAPI("/andares?limite=200"),
          requisicaoAPI("/ambientes?limite=200"),
          requisicaoAPI("/dispositivos?limite=200"),
        ]);

      const predioAtual = obterPredioAtual();
      const idPredioAtual = Number(predioAtual?.id_predio);
      const prediosAtuais = deduplicarPor(resPredios.dados, "id_predio")
        .filter((predio) => predio.id_predio === idPredioAtual);
      const andaresAtuais = deduplicarPor(resAndares.dados, "id_andar")
        .filter((andar) => andar.id_predio === idPredioAtual);
      const idsAndares = new Set(andaresAtuais.map((andar) => andar.id_andar));
      const ambientesAtuais = deduplicarPor(resAmbientes.dados, "id_ambiente")
        .filter((ambiente) => idsAndares.has(ambiente.id_andar));
      const idsAmbientes = new Set(ambientesAtuais.map((ambiente) => ambiente.id_ambiente));

      setPredios(prediosAtuais);
      setAndares(andaresAtuais);
      setPredioFilter(idPredioAtual ? String(idPredioAtual) : "Todos");
      setAmbientesBrutos(ambientesAtuais);
      setDispositivosBrutos(
        deduplicarPor(resDispositivos.dados, "id_dispositivo")
          .filter((dispositivo) => idsAmbientes.has(dispositivo.id_ambiente))
      );
    } catch (erro) {
      notify(erro.message || "Erro ao carregar ambientes do banco de dados.");
    } finally {
      setCarregando(false);
    }
  }, [notify]);

  useEffect(() => {
    carregarDados();
    requisicaoAPI("/auth/me").then((res) => setPerfilAtual(res?.dados?.perfil || "")).catch(() => {});
  }, [carregarDados]);

  const suportaReserva = useMemo(() => {
    return ambientesBrutos.some((item) =>
      Object.prototype.hasOwnProperty.call(item, "requer_reserva")
    );
  }, [ambientesBrutos]);

  const environments = useMemo(() => {
    const mapaPredios = new Map(predios.map((p) => [p.id_predio, p]));
    const mapaAndares = new Map(andares.map((a) => [a.id_andar, a]));

    return ambientesBrutos
      .map((amb) => {
        const andar = mapaAndares.get(amb.id_andar);
        const predio = andar ? mapaPredios.get(andar.id_predio) : null;
        const floorLabel = andar
          ? formatarNomeAndar(andar.numero_andar)
          : "Andar não informado";
        const devices = dispositivosBrutos.filter(
          (d) => d.id_ambiente === amb.id_ambiente
        );

        return {
          id: amb.id_ambiente,
          id_ambiente: amb.id_ambiente,
          id_andar: amb.id_andar,
          id_predio: andar?.id_predio ?? null,
          id_setor: amb.id_setor ?? null,
          predioNome: predio?.nome_predio || "Edifício não identificado",
          floorNumber: andar?.numero_andar ?? 999,
          floor: floorLabel,
          sector: amb.id_setor ? `Setor #${amb.id_setor}` : "Sem setor vinculado",
          name: amb.nome,
          location: amb.localizacao || "",
          fullLocation: [
            predio?.nome_predio,
            floorLabel,
            amb.localizacao,
          ]
            .filter(Boolean)
            .join(" · "),
          capacity: amb.capacidade_maxima,
          opening: (amb.horario_abertura || "").slice(0, 5),
          closing: (amb.horario_fechamento || "").slice(0, 5),
          reservation: Boolean(amb.requer_reserva),
          devices,
        };
      })
      .sort((a, b) => a.id - b.id);
  }, [ambientesBrutos, andares, predios, dispositivosBrutos]);

  // Aplica redirecionamento vindo de Predios & Andares (?predio=...&andar=...&ambiente=...)
  useEffect(() => {
    if (carregando) return;

    const paramPredio = searchParams.get("predio") || "";
    const paramAndar = searchParams.get("andar") || "";
    const paramAmbiente = searchParams.get("ambiente") || "";
    const chaveQuery = `${paramPredio}|${paramAndar}|${paramAmbiente}`;

    if (parametroAplicadoRef.current === chaveQuery) return;
    parametroAplicadoRef.current = chaveQuery;

    if (paramAmbiente) {
      const idAlvo = Number(paramAmbiente);
      const encontrado = environments.find((e) => e.id === idAlvo);

      setSearch("");
      setReservationFilter("Todos");
      setPredioFilter(
        paramPredio
          ? String(paramPredio)
          : encontrado?.id_predio
            ? String(encontrado.id_predio)
            : "Todos"
      );
      setFloorFilter(
        paramAndar
          ? String(paramAndar)
          : encontrado?.id_andar
            ? String(encontrado.id_andar)
            : "Todos"
      );

      if (encontrado) {
        setSelectedId(encontrado.id);
        window.setTimeout(() => {
          document
            .querySelector(`[data-ambiente-id="${encontrado.id}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      }
      return;
    }

    if (paramAndar) {
      const idAndarAlvo = Number(paramAndar);
      const andarObj = andares.find((a) => a.id_andar === idAndarAlvo);
      setSearch("");
      setReservationFilter("Todos");
      setPredioFilter(
        paramPredio
          ? String(paramPredio)
          : andarObj?.id_predio
            ? String(andarObj.id_predio)
            : "Todos"
      );
      setFloorFilter(String(idAndarAlvo));

      const primeiroDoAndar = environments.find(
        (e) => e.id_andar === idAndarAlvo
      );
      setSelectedId(primeiroDoAndar?.id ?? null);
      return;
    }

    if (paramPredio) {
      const idPredioAlvo = Number(paramPredio);
      setSearch("");
      setReservationFilter("Todos");
      setPredioFilter(String(idPredioAlvo));
      setFloorFilter("Todos");

      const primeiroDoPredio = environments.find(
        (e) => e.id_predio === idPredioAlvo
      );
      setSelectedId(primeiroDoPredio?.id ?? null);
      return;
    }

    if (environments.length > 0 && !selectedId) {
      setSelectedId(environments[0].id);
    }
  }, [carregando, searchParams, environments, andares, selectedId]);

  const andaresDisponiveisNoFiltro = useMemo(() => {
    if (predioFilter === "Todos") return andares;
    return andares.filter((a) => String(a.id_predio) === String(predioFilter));
  }, [andares, predioFilter]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return environments.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.floor.toLowerCase().includes(term) ||
        item.predioNome.toLowerCase().includes(term);

      const matchesPredio =
        predioFilter === "Todos" ||
        String(item.id_predio) === String(predioFilter);

      const matchesFloor =
        floorFilter === "Todos" ||
        String(item.id_andar) === String(floorFilter);

      const matchesReservation =
        reservationFilter === "Todos" ||
        (reservationFilter === "Permite reserva" && item.reservation) ||
        (reservationFilter === "Sem reserva" && !item.reservation);

      return (
        matchesSearch && matchesPredio && matchesFloor && matchesReservation
      );
    });
  }, [environments, search, predioFilter, floorFilter, reservationFilter]);

  const selected = useMemo(() => {
    return (
      environments.find((item) => item.id === selectedId) ||
      filtered[0] ||
      null
    );
  }, [environments, selectedId, filtered]);

  const andaresComAmbientes = useMemo(() => {
    return new Set(environments.map((item) => item.id_andar)).size;
  }, [environments]);

  const andaresDoFormulario = useMemo(() => {
    if (!form.id_predio) return andares;
    return andares.filter((a) => String(a.id_predio) === String(form.id_predio));
  }, [andares, form.id_predio]);

  const predioAtualDoFiltro = useMemo(() => {
    if (predioFilter === "Todos") return null;
    return predios.find((p) => String(p.id_predio) === String(predioFilter)) || null;
  }, [predios, predioFilter]);

  const openNew = () => {
    if (perfilAtual === "manutencao") {
      notify("O perfil Manutenção não pode cadastrar novos ambientes.");
      return;
    }
    const predioPadrao =
      predioFilter !== "Todos"
        ? String(predioFilter)
        : String(predios[0]?.id_predio ?? "");
    const andaresDoPredio = andares.filter(
      (a) => String(a.id_predio) === predioPadrao
    );
    const andarPadrao =
      floorFilter !== "Todos" &&
      andaresDoPredio.some((a) => String(a.id_andar) === String(floorFilter))
        ? String(floorFilter)
        : String(andaresDoPredio[0]?.id_andar ?? "");

    setEditingId(null);
    setForm({
      ...emptyForm,
      id_predio: predioPadrao,
      id_andar: andarPadrao,
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...emptyForm,
      id_predio: item.id_predio ? String(item.id_predio) : "",
      id_andar: item.id_andar ? String(item.id_andar) : "",
      id_setor: item.id_setor ? String(item.id_setor) : "",
      name: item.name,
      localizacao: item.location,
      capacity: item.capacity ?? "",
      opening: item.opening || "08:00",
      closing: item.closing || "18:00",
      reservation: item.reservation,
    });
    setModalOpen(true);
  };

  const updateForm = (field, value) => {
    setForm((current) => {
      if (field === "id_predio") {
        const primeirosAndares = andares.filter(
          (a) => String(a.id_predio) === String(value)
        );
        return {
          ...current,
          id_predio: value,
          id_andar: primeirosAndares[0]
            ? String(primeirosAndares[0].id_andar)
            : "",
        };
      }
      return { ...current, [field]: value };
    });
  };

  const saveEnvironment = async (event) => {
    event.preventDefault();

    if (!editingId && perfilAtual === "manutencao") {
      notify("O perfil Manutenção não pode cadastrar novos ambientes.");
      return;
    }

    if (!form.name.trim() || !form.localizacao.trim() || !form.id_andar) {
      notify("Preencha o nome, o andar e a localização do ambiente.");
      return;
    }

    const abertura = normalizarHora(form.opening, "08:00:00");
    const fechamento = normalizarHora(form.closing, "18:00:00");
    if (fechamento <= abertura) {
      notify("O horário de fechamento deve ser posterior ao de abertura.");
      return;
    }

    const payload = {
      id_andar: Number(form.id_andar),
      id_setor: form.id_setor ? Number(form.id_setor) : null,
      nome: form.name.trim(),
      localizacao: form.localizacao.trim(),
      capacidade_maxima:
        form.capacity === "" ? null : Number(form.capacity),
      horario_abertura: abertura,
      horario_fechamento: fechamento,
    };

    if (!editingId) {
      const limitesAmbiente = {};
      if (form.temperaturaMinima !== "" || form.temperaturaMaxima !== "") {
        limitesAmbiente.temperatura = {
          minimo: form.temperaturaMinima,
          maximo: form.temperaturaMaxima,
        };
      }
      if (form.iluminacaoMinima !== "" || form.iluminacaoMaxima !== "") {
        limitesAmbiente.iluminacao = {
          minimo: form.iluminacaoMinima,
          maximo: form.iluminacaoMaxima,
        };
      }
      if (form.consumoMinimo !== "" || form.consumoMaximo !== "" || form.potenciaMaxima !== "") {
        limitesAmbiente.energia = {
          minimo: form.consumoMinimo,
          maximo: form.consumoMaximo,
          potencia_maxima: form.potenciaMaxima,
        };
      }
      if (Object.keys(limitesAmbiente).length) {
        payload.limites_ambiente = limitesAmbiente;
      }
    }

    if (suportaReserva) {
      payload.requer_reserva = form.reservation ? 1 : 0;
    }

    try {
      setSalvando(true);
      if (editingId) {
        await requisicaoAPI(`/ambientes/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        await carregarDados();
        setSelectedId(editingId);
        notify("Ambiente atualizado no banco de dados!");
      } else {
        const criado = await requisicaoAPI("/ambientes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        await carregarDados();
        if (criado?.dados?.id_ambiente) {
          setSelectedId(criado.dados.id_ambiente);
        }
        notify("Ambiente cadastrado no banco de dados!");
      }

      setModalOpen(false);
      setForm(emptyForm);
    } catch (erro) {
      notify(erro.message || "Erro ao salvar ambiente.");
    } finally {
      setSalvando(false);
    }
  };

  const deleteEnvironment = async () => {
    if (!selected) return;

    const confirmed = window.confirm(
      `Deseja realmente excluir o ambiente "${selected.name}"?`
    );
    if (!confirmed) return;

    try {
      setSalvando(true);
      await requisicaoAPI(`/ambientes/${selected.id}`, {
        method: "DELETE",
      });
      setSelectedId(null);
      await carregarDados();
      notify("Ambiente excluído com sucesso!");
    } catch (erro) {
      notify(
        erro.message ||
          "Não foi possível excluir este ambiente (verifique se há dispositivos ou acessos vinculados)."
      );
    } finally {
      setSalvando(false);
    }
  };

  const limparFiltros = () => {
    setSearch("");
    setPredioFilter(String(predios[0]?.id_predio ?? "Todos"));
    setFloorFilter("Todos");
    setReservationFilter("Todos");
    router.replace("/private/ambientes");
  };

  return (
    <div className="amb-page">
      <header className="amb-heading">
        <div>
          <span className="amb-eyebrow">ESTRUTURA DO EDIFÍCIO</span>
          <h1>Ambientes</h1>
          <p>
            Gerencie os espaços, sua localização e as condições de utilização
            diretamente no banco de dados.
          </p>
        </div>

        {perfilAtual !== "manutencao" && (
          <button className="amb-primary" onClick={openNew}>
            <Icon name="plus" size={17} />
            Novo ambiente
          </button>
        )}
      </header>

      <section className="amb-summary">
        <div className="amb-summary-item">
          <span className="amb-summary-icon blue">
            <Icon name="room" />
          </span>
          <div>
            <strong>{environments.length}</strong>
            <span>Ambientes cadastrados</span>
          </div>
        </div>

        <div className="amb-summary-item">
          <span className="amb-summary-icon purple">
            <Icon name="users" />
          </span>
          <div>
            <strong>
              {environments.reduce(
                (total, item) => total + (Number(item.capacity) || 0),
                0
              )}
            </strong>
            <span>Capacidade total (pessoas)</span>
          </div>
        </div>

        <div className="amb-summary-item">
          <span className="amb-summary-icon cyan">
            <Icon name="device" />
          </span>
          <div>
            <strong>
              {environments.reduce(
                (total, item) => total + item.devices.length,
                0
              )}
            </strong>
            <span>Dispositivos vinculados</span>
          </div>
        </div>

        <div className="amb-summary-item">
          <span className="amb-summary-icon slate">
            <Icon name="building" />
          </span>
          <div>
            <strong>{andaresComAmbientes}</strong>
            <span>Andares com ambientes</span>
          </div>
        </div>
      </section>

      <div className="amb-workspace">
        <section className="amb-list-panel">
          <div className="amb-list-heading">
            <div>
              <span className="amb-section-label">MAPA DE ESPAÇOS</span>
              <h2>Ambientes cadastrados</h2>
            </div>
            <span className="amb-count">{filtered.length} registros</span>
          </div>

          <div className="amb-search">
            <Icon name="search" size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, andar ou localização..."
            />
          </div>

          <div className="amb-filters" style={{ flexWrap: "wrap" }}>
            <span className="amb-current-building">{predios[0]?.nome_predio || "Nenhum prédio vinculado"}</span>

            <label>
              <Icon name="filter" size={14} />
              <select
                value={floorFilter}
                onChange={(event) => setFloorFilter(event.target.value)}
              >
                <option value="Todos">Todos os andares</option>
                {andaresDisponiveisNoFiltro.map((a) => (
                  <option key={a.id_andar} value={String(a.id_andar)}>
                    {formatarNomeAndar(a.numero_andar)}
                  </option>
                ))}
              </select>
            </label>

            {suportaReserva && (
              <select
                value={reservationFilter}
                onChange={(event) => setReservationFilter(event.target.value)}
              >
                <option value="Todos">Todas reservas</option>
                <option value="Permite reserva">Permite reserva</option>
                <option value="Sem reserva">Sem reserva</option>
              </select>
            )}

            {(floorFilter !== "Todos" ||
              reservationFilter !== "Todos" ||
              search) && (
              <button
                type="button"
                className="amb-cancel"
                style={{ minHeight: "34px", padding: "0 10px", fontSize: "11px" }}
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="amb-list">
            {carregando ? (
              <div className="amb-empty-list">
                <b>Carregando ambientes...</b>
                <span>Consultando registros na API.</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="amb-empty-list">
                <Icon name="search" size={25} />
                <b>Nenhum ambiente encontrado</b>
                <span>
                  Tente alterar os filtros ou clique em &ldquo;Novo ambiente&rdquo;.
                </span>
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  type="button"
                  data-ambiente-id={item.id}
                  className={`amb-list-item ${selected?.id === item.id ? "selected" : ""}`}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="amb-list-symbol">
                    <Icon name="room" size={19} />
                  </span>
                  <span className="amb-list-copy">
                    <strong>{item.name}</strong>
                    <small>
                      {item.floor} · {item.location}
                    </small>
                    <span className="amb-list-meta">
                      {item.devices.length}{" "}
                      {item.devices.length === 1
                        ? "dispositivo"
                        : "dispositivos"}
                    </span>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              ))
            )}
          </div>

          <div className="amb-list-footer">
            <span>
              {predioAtualDoFiltro
                ? predioAtualDoFiltro.nome_predio
                : "Todos os edifícios"}
            </span>
            <button
              type="button"
              onClick={() => router.push("/private/predios")}
              style={{
                background: "none",
                border: 0,
                color: "#3b5bdb",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "inherit",
              }}
            >
              Ver Prédios & Andares ↗
            </button>
          </div>
        </section>

        <section className="amb-detail-panel">
          {selected ? (
            <>
              <div className="amb-detail-top">
                <div className="amb-detail-symbol">
                  <Icon name="room" size={25} />
                </div>
                <div className="amb-detail-actions">
                  <button
                    type="button"
                    className="amb-icon-button"
                    onClick={() => openEdit(selected)}
                    title="Editar ambiente"
                  >
                    <Icon name="edit" size={17} />
                  </button>
                  <button
                    type="button"
                    className="amb-icon-button danger"
                    onClick={deleteEnvironment}
                    disabled={salvando}
                    title="Excluir ambiente"
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              </div>

              <span className="amb-section-label">
                DETALHES DO AMBIENTE · AMB-{String(selected.id).padStart(3, "0")}
              </span>
              <h2 className="amb-detail-title">{selected.name}</h2>
              <p className="amb-detail-description">{selected.fullLocation}</p>

              <div className="amb-location-box">
                <span>
                  <Icon name="pin" size={17} />
                </span>
                <div>
                  <small>LOCALIZAÇÃO NO EDIFÍCIO</small>
                  <strong>{selected.location}</strong>
                  <p>
                    {selected.predioNome} · {selected.floor}
                  </p>
                </div>
              </div>

              <div className="amb-detail-grid">
                <div className="amb-info-box">
                  <span>
                    <Icon name="users" size={17} />
                  </span>
                  <small>CAPACIDADE MÁXIMA</small>
                  <strong>{formatCapacity(selected.capacity)}</strong>
                </div>
                <div className="amb-info-box">
                  <span>
                    <Icon name="building" size={17} />
                  </span>
                  <small>PAVIMENTO</small>
                  <strong>{selected.floor}</strong>
                </div>
                <div className="amb-info-box">
                  <span>
                    <Icon name="clock" size={17} />
                  </span>
                  <small>ABERTURA</small>
                  <strong>{selected.opening || "Não informado"}</strong>
                </div>
                <div className="amb-info-box">
                  <span>
                    <Icon name="clock" size={17} />
                  </span>
                  <small>FECHAMENTO</small>
                  <strong>{selected.closing || "Não informado"}</strong>
                </div>
              </div>

              <div className="amb-device-section">
                <div className="amb-device-heading">
                  <div>
                    <span className="amb-section-label">INTEGRAÇÃO IOT</span>
                    <h3>Dispositivos vinculados</h3>
                  </div>
                  <span className="amb-device-count">
                    {selected.devices.length}
                  </span>
                </div>

                {selected.devices.length > 0 ? (
                  <div className="amb-device-list">
                    {selected.devices.map((device) => (
                      <div
                        className="amb-device-row"
                        key={device.id_dispositivo}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(
                            `/private/dispositivos?ambiente=${selected.id}&dispositivo=${device.id_dispositivo}`
                          )
                        }
                        title="Abrir dispositivo em Dispositivos"
                      >
                        <span>
                          <Icon name="device" size={17} />
                        </span>
                        <div>
                          <strong>{device.nome}</strong>
                          <small>
                            {device.tipo_dispositivo} · {device.identificador}
                          </small>
                        </div>
                        <i />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="amb-no-devices">
                    <Icon name="info" size={17} />
                    Nenhum dispositivo vinculado a este ambiente.
                  </div>
                )}
              </div>

              <div className="amb-note">
                <Icon name="info" size={17} />
                <p>
                  As leituras de temperatura, iluminação e energia são
                  consultadas no histórico dos dispositivos vinculados.
                </p>
              </div>
            </>
          ) : (
            <div className="amb-no-selection">
              <span>
                <Icon name="room" size={30} />
              </span>
              <h2>Selecione um ambiente</h2>
              <p>Escolha um registro na lista para visualizar seus detalhes.</p>
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div
          className="amb-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <form className="amb-modal" onSubmit={saveEnvironment}>
            <div className="amb-modal-header">
              <div>
                <span className="amb-section-label">CADASTRO DO EDIFÍCIO</span>
                <h2>{editingId ? "Editar ambiente" : "Novo ambiente"}</h2>
                <p>Informe os dados físicos e operacionais do espaço.</p>
              </div>
              <button
                type="button"
                className="amb-icon-button"
                onClick={() => setModalOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="amb-form-grid">
              <label className="full">
                Nome do ambiente *
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Ex.: Sala de reuniões B"
                  required
                />
              </label>

              <label>
                Andar *
                <select
                  value={form.id_andar}
                  onChange={(event) =>
                    updateForm("id_andar", event.target.value)
                  }
                  required
                >
                  <option value="">Selecione o andar</option>
                  {andaresDoFormulario.map((a) => (
                    <option key={a.id_andar} value={String(a.id_andar)}>
                      {formatarNomeAndar(a.numero_andar)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full">
                Localização *
                <input
                  value={form.localizacao}
                  onChange={(event) =>
                    updateForm("localizacao", event.target.value)
                  }
                  placeholder="Ex.: Ala Norte - Sala 102"
                  required
                />
              </label>

              <label>
                Capacidade máxima
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) =>
                    updateForm("capacity", event.target.value)
                  }
                  placeholder="Quantidade de pessoas"
                />
              </label>

              {!editingId && (
                <div className="amb-limits-section full">
                  <div className="amb-limits-heading">
                    <strong>Limites de monitoramento</strong>
                    <small>Opcional. Ao informar um tipo, preencha todos os limites dele; energia também exige potência máxima.</small>
                  </div>
                  <div className="amb-limits-grid">
                    <fieldset className="amb-limit-card">
                      <legend>Temperatura (°C)</legend>
                      <label>Mínima
                        <input type="number" step="0.1" value={form.temperaturaMinima} onChange={(event) => updateForm("temperaturaMinima", event.target.value)} placeholder="Ex.: 18" />
                      </label>
                      <label>Máxima
                        <input type="number" step="0.1" value={form.temperaturaMaxima} onChange={(event) => updateForm("temperaturaMaxima", event.target.value)} placeholder="Ex.: 27" />
                      </label>
                    </fieldset>

                    <fieldset className="amb-limit-card">
                      <legend>Iluminação (lux)</legend>
                      <label>Mínima
                        <input type="number" min="0" step="0.01" value={form.iluminacaoMinima} onChange={(event) => updateForm("iluminacaoMinima", event.target.value)} placeholder="Ex.: 150" />
                      </label>
                      <label>Máxima
                        <input type="number" min="0" step="0.01" value={form.iluminacaoMaxima} onChange={(event) => updateForm("iluminacaoMaxima", event.target.value)} placeholder="Ex.: 700" />
                      </label>
                    </fieldset>

                    <fieldset className="amb-limit-card">
                      <legend>Energia</legend>
                      <label>Consumo mínimo (kWh)
                        <input type="number" min="0" step="0.0001" value={form.consumoMinimo} onChange={(event) => updateForm("consumoMinimo", event.target.value)} placeholder="Ex.: 0.1" />
                      </label>
                      <label>Consumo máximo (kWh)
                        <input type="number" min="0" step="0.0001" value={form.consumoMaximo} onChange={(event) => updateForm("consumoMaximo", event.target.value)} placeholder="Ex.: 12" />
                      </label>
                      <label className="full">Potência máxima (kW)
                        <input type="number" min="0" step="0.0001" value={form.potenciaMaxima} onChange={(event) => updateForm("potenciaMaxima", event.target.value)} placeholder="Ex.: 3.5" />
                      </label>
                    </fieldset>
                  </div>
                </div>
              )}

              {suportaReserva ? (
                <label className="amb-checkbox-field">
                  <input
                    type="checkbox"
                    checked={form.reservation}
                    onChange={(event) =>
                      updateForm("reservation", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Permitir reservas</strong>
                    <small>Este ambiente poderá ser reservado.</small>
                  </span>
                </label>
              ) : (
                <div />
              )}

              <label>
                Horário de abertura *
                <input
                  type="time"
                  value={form.opening}
                  onChange={(event) =>
                    updateForm("opening", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Horário de fechamento *
                <input
                  type="time"
                  value={form.closing}
                  onChange={(event) =>
                    updateForm("closing", event.target.value)
                  }
                  required
                />
              </label>
            </div>

            <div className="amb-form-footer">
              <span>* Campos obrigatórios</span>
              <div>
                <button
                  type="button"
                  className="amb-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="amb-primary"
                  disabled={salvando}
                >
                  <Icon name="check" size={16} />
                  {salvando
                    ? "Salvando..."
                    : editingId
                      ? "Salvar alterações"
                      : "Cadastrar ambiente"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {message && (
        <div className="amb-toast">
          <Icon name="check" size={16} />
          {message}
        </div>
      )}
    </div>
  );
}

export default function Ambientes({ toast }) {
  return (
    <Suspense
      fallback={
        <div className="amb-page">
          <p>Carregando ambientes...</p>
        </div>
      }
    >
      <AmbientesConteudo toast={toast} />
    </Suspense>
  );
}

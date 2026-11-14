"use client";

import { useMemo, useState } from "react";
import "./predios.css";

const initialFloors = [
  {
    id: 1,
    number: 0,
    name: "Térreo",
    description: "Área de recepção e circulação principal.",
    status: "Ativo",
    sectors: [
      { id: 1, name: "Recepção", rooms: 3, devices: 8, responsible: "Ana Souza" },
      { id: 2, name: "Segurança", rooms: 2, devices: 5, responsible: "Bruno Lima" },
      { id: 3, name: "Administrativo", rooms: 4, devices: 9, responsible: "Marina Costa" },
    ],
  },
  {
    id: 2,
    number: 1,
    name: "1º Andar",
    description: "Área administrativa e salas de atendimento.",
    status: "Ativo",
    sectors: [
      { id: 4, name: "Financeiro", rooms: 3, devices: 7, responsible: "Carlos Mendes" },
      { id: 5, name: "Recursos Humanos", rooms: 2, devices: 5, responsible: "Ana Souza" },
    ],
  },
  {
    id: 3,
    number: 2,
    name: "2º Andar",
    description: "Ambientes corporativos e salas de reunião.",
    status: "Ativo",
    sectors: [
      { id: 6, name: "Comercial", rooms: 4, devices: 10, responsible: "Elisa Costa" },
      { id: 7, name: "Reuniões", rooms: 3, devices: 8, responsible: "Bruno Lima" },
    ],
  },
  {
    id: 4,
    number: 3,
    name: "3º Andar",
    description: "Área de tecnologia e infraestrutura.",
    status: "Manutenção",
    sectors: [
      { id: 8, name: "Tecnologia", rooms: 4, devices: 12, responsible: "Rafael Nunes" },
      { id: 9, name: "Servidores", rooms: 2, devices: 8, responsible: "Carlos Mendes" },
    ],
  },
];

const building = {
  name: "Edifício Empresarial Central",
  code: "LUM-001",
  type: "Comercial",
  address: "Santo André, São Paulo",
  floors: 12,
  area: "8.450 m²",
  status: "Operacional",
  description:
    "Edifício corporativo monitorado pela plataforma Lumora, com controle centralizado de ambientes, dispositivos e infraestrutura.",
};

function Icon({ children }) {
  return <span className="pa-icon" aria-hidden="true">{children}</span>;
}

function Status({ value }) {
  const statusClass =
    value === "Ativo" || value === "Operacional"
      ? "success"
      : value === "Manutenção"
        ? "warning"
        : "neutral";

  return (
    <span className={`pa-status ${statusClass}`}>
      <i />
      {value}
    </span>
  );
}

export default function PrediosAndares() {
  const [floors, setFloors] = useState(initialFloors);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [newFloor, setNewFloor] = useState({
    name: "",
    description: "",
  });

  const filteredFloors = useMemo(() => {
    return floors.filter((floor) => {
      const matchesSearch =
        floor.name.toLowerCase().includes(search.toLowerCase()) ||
        floor.description.toLowerCase().includes(search.toLowerCase()) ||
        floor.sectors.some((sector) =>
          sector.name.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesFilter =
        filter === "Todos" || floor.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [floors, search, filter]);

  const totalSectors = floors.reduce(
    (total, floor) => total + floor.sectors.length,
    0,
  );

  const totalRooms = floors.reduce(
    (total, floor) =>
      total + floor.sectors.reduce((sum, sector) => sum + sector.rooms, 0),
    0,
  );

  const totalDevices = floors.reduce(
    (total, floor) =>
      total + floor.sectors.reduce((sum, sector) => sum + sector.devices, 0),
    0,
  );

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => setToast(""), 2800);
  }

  function openBuildingDetails() {
    setSelected({
      type: "building",
      data: building,
    });
  }

  function openFloorDetails(floor) {
    setSelected({
      type: "floor",
      data: floor,
    });
  }

  function openSectorDetails(sector, floor) {
    setSelected({
      type: "sector",
      data: {
        ...sector,
        floorName: floor.name,
      },
    });
  }

  function addFloor(event) {
    event.preventDefault();

    if (!newFloor.name.trim()) {
      showToast("Informe o nome do andar.");
      return;
    }

    const nextFloor = {
      id: Date.now(),
      number: floors.length,
      name: newFloor.name,
      description: newFloor.description || "Andar cadastrado na plataforma.",
      status: "Ativo",
      sectors: [],
    };

    setFloors((current) => [...current, nextFloor]);
    setNewFloor({ name: "", description: "" });
    setModalOpen(false);
    showToast("Andar cadastrado com sucesso!");

    setSelected({
      type: "floor",
      data: nextFloor,
    });
  }

  function closeDetails() {
    setSelected(null);
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

        <button className="pa-primary-button" onClick={() => setModalOpen(true)}>
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
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="pa-building-row" key={index}>
                  {Array.from({ length: 4 }).map((__, windowIndex) => (
                    <i key={windowIndex} />
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
            <span className="pa-code">{building.code}</span>
            <Status value={building.status} />
          </div>

          <h2>{building.name}</h2>
          <p>{building.description}</p>

          <div className="pa-building-meta">
            <span><Icon>⌖</Icon>{building.address}</span>
            <span><Icon>▦</Icon>{building.type}</span>
            <span><Icon>⌂</Icon>{building.area}</span>
          </div>

          <button
            className="pa-text-button"
            onClick={openBuildingDetails}
          >
            Visualizar detalhes do edifício
            <span>↗</span>
          </button>
        </div>

        <div className="pa-building-number">
          <span>ESTRUTURA</span>
          <strong>{String(floors.length).padStart(2, "0")}</strong>
          <small>andares cadastrados</small>
        </div>
      </section>

      <section className="pa-metrics">
        <div className="pa-metric">
          <span className="pa-metric-icon blue">▦</span>
          <div>
            <small>Andares cadastrados</small>
            <strong>{floors.length}</strong>
            <span>Na estrutura do edifício</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon purple">⌘</span>
          <div>
            <small>Setores cadastrados</small>
            <strong>{totalSectors}</strong>
            <span>Distribuídos por andar</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon cyan">⌂</span>
          <div>
            <small>Ambientes vinculados</small>
            <strong>{totalRooms}</strong>
            <span>Salas e espaços internos</span>
          </div>
        </div>

        <div className="pa-metric">
          <span className="pa-metric-icon violet">◈</span>
          <div>
            <small>Dispositivos vinculados</small>
            <strong>{totalDevices}</strong>
            <span>Equipamentos monitorados</span>
          </div>
        </div>
      </section>

      <section className="pa-floors-section">
        <div className="pa-section-heading">
          <div>
            <span className="pa-eyebrow">ORGANIZAÇÃO INTERNA</span>
            <h2>Andares do edifício</h2>
            <p>Selecione um andar para consultar seus setores e informações.</p>
          </div>

          <div className="pa-floor-count">
            {filteredFloors.length} de {floors.length} andares
          </div>
        </div>

        <div className="pa-toolbar">
          <div className="pa-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Buscar andar ou setor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Limpar pesquisa">
                ×
              </button>
            )}
          </div>

          <div className="pa-filters">
            {["Todos", "Ativo", "Manutenção"].map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="pa-floor-grid">
          {filteredFloors.map((floor, index) => (
            <article className="pa-floor-card" key={floor.id}>
              <div className="pa-floor-card-top">
                <div className="pa-floor-symbol">
                  <span>⌂</span>
                </div>
                <Status value={floor.status} />
              </div>

              <div className="pa-floor-title">
                <span>ANDAR {String(index + 1).padStart(2, "0")}</span>
                <h3>{floor.name}</h3>
                <p>{floor.description}</p>
              </div>

              <div className="pa-floor-data">
                <div>
                  <strong>{floor.sectors.length}</strong>
                  <span>Setores</span>
                </div>
                <div>
                  <strong>
                    {floor.sectors.reduce((sum, sector) => sum + sector.rooms, 0)}
                  </strong>
                  <span>Ambientes</span>
                </div>
                <div>
                  <strong>
                    {floor.sectors.reduce((sum, sector) => sum + sector.devices, 0)}
                  </strong>
                  <span>Dispositivos</span>
                </div>
              </div>

              <div className="pa-sector-preview">
                <span>SETORES</span>
                <div>
                  {floor.sectors.length > 0 ? (
                    floor.sectors.slice(0, 3).map((sector) => (
                      <button
                        key={sector.id}
                        onClick={() => openSectorDetails(sector, floor)}
                        title={`Ver detalhes de ${sector.name}`}
                      >
                        {sector.name}
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
                onClick={() => openFloorDetails(floor)}
              >
                Ver detalhes do andar
                <span>→</span>
              </button>
            </article>
          ))}
        </div>

        {filteredFloors.length === 0 && (
          <div className="pa-empty">
            <span>⌕</span>
            <h3>Nenhum andar encontrado</h3>
            <p>Tente alterar sua pesquisa ou os filtros selecionados.</p>
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
      </section>

      {/* Painel de detalhes lateral */}
      {selected && (
        <div className="pa-detail-layer" onMouseDown={closeDetails}>
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
                  {selected.type === "building"
                    ? "INFORMAÇÕES DO EDIFÍCIO"
                    : selected.type === "floor"
                      ? "INFORMAÇÕES DO ANDAR"
                      : "INFORMAÇÕES DO SETOR"}
                </span>
                <h2>
                  {selected.type === "building"
                    ? "Detalhes do edifício"
                    : selected.type === "floor"
                      ? "Detalhes do andar"
                      : "Detalhes do setor"}
                </h2>
              </div>

              <button
                className="pa-close-button"
                onClick={closeDetails}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="pa-detail-content">
              <div className="pa-detail-hero">
                <div className="pa-detail-icon">
                  {selected.type === "building"
                    ? "⌂"
                    : selected.type === "floor"
                      ? "▤"
                      : "▦"}
                </div>
                <div>
                  <span>
                    {selected.type === "building"
                      ? selected.data.code
                      : selected.type === "floor"
                        ? `ANDAR ${selected.data.number}`
                        : `SETOR · ${selected.data.id}`}
                  </span>
                  <h3>
                    {selected.type === "building"
                      ? selected.data.name
                      : selected.data.name}
                  </h3>
                  {selected.type === "floor" && (
                    <Status value={selected.data.status} />
                  )}
                  {selected.type === "building" && (
                    <Status value={selected.data.status} />
                  )}
                </div>
              </div>

              {selected.type === "building" && (
                <>
                  <div className="pa-detail-description">
                    <span>DESCRIÇÃO</span>
                    <p>{selected.data.description}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Tipo de edifício</span>
                      <strong>{selected.data.type}</strong>
                    </div>
                    <div>
                      <span>Área total</span>
                      <strong>{selected.data.area}</strong>
                    </div>
                    <div>
                      <span>Andares previstos</span>
                      <strong>{selected.data.floors}</strong>
                    </div>
                    <div>
                      <span>Andares cadastrados</span>
                      <strong>{floors.length}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-description">
                    <span>LOCALIZAÇÃO</span>
                    <p>{selected.data.address}</p>
                  </div>
                </>
              )}

              {selected.type === "floor" && (
                <>
                  <div className="pa-detail-description">
                    <span>DESCRIÇÃO</span>
                    <p>{selected.data.description}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Setores</span>
                      <strong>{selected.data.sectors.length}</strong>
                    </div>
                    <div>
                      <span>Ambientes</span>
                      <strong>
                        {selected.data.sectors.reduce(
                          (sum, sector) => sum + sector.rooms,
                          0,
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Dispositivos</span>
                      <strong>
                        {selected.data.sectors.reduce(
                          (sum, sector) => sum + sector.devices,
                          0,
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Identificação</span>
                      <strong>{selected.data.name}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-list">
                    <div className="pa-detail-list-heading">
                      <span>SETORES VINCULADOS</span>
                      <b>{selected.data.sectors.length}</b>
                    </div>

                    {selected.data.sectors.length > 0 ? (
                      selected.data.sectors.map((sector) => (
                        <button
                          className="pa-detail-sector"
                          key={sector.id}
                          onClick={() => openSectorDetails(sector, selected.data)}
                        >
                          <span className="pa-sector-icon">▦</span>
                          <span>
                            <strong>{sector.name}</strong>
                            <small>
                              {sector.rooms} ambientes · {sector.devices} dispositivos
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

              {selected.type === "sector" && (
                <>
                  <div className="pa-detail-description">
                    <span>LOCALIZAÇÃO</span>
                    <p>{selected.data.floorName}</p>
                  </div>

                  <div className="pa-detail-info-grid">
                    <div>
                      <span>Ambientes</span>
                      <strong>{selected.data.rooms}</strong>
                    </div>
                    <div>
                      <span>Dispositivos</span>
                      <strong>{selected.data.devices}</strong>
                    </div>
                    <div className="wide">
                      <span>Responsável</span>
                      <strong>{selected.data.responsible}</strong>
                    </div>
                  </div>

                  <div className="pa-detail-description">
                    <span>ESTRUTURA DO SETOR</span>
                    <p>
                      Este setor está vinculado ao {selected.data.floorName} e
                      possui {selected.data.rooms} ambientes cadastrados.
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
              <button className="pa-detail-secondary" onClick={closeDetails}>
                Fechar
              </button>
              <button
                className="pa-detail-primary"
                onClick={() => showToast("A edição poderá ser integrada ao banco de dados.")}
              >
                Editar informações
                <span>↗</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Modal para novo andar */}
      {modalOpen && (
        <div
          className="pa-modal-layer"
          onMouseDown={() => setModalOpen(false)}
        >
          <form
            className="pa-modal"
            onSubmit={addFloor}
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
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            <label>
              Nome do andar
              <input
                autoFocus
                value={newFloor.name}
                onChange={(event) =>
                  setNewFloor((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex.: 4º Andar"
                required
              />
            </label>

            <label>
              Descrição
              <textarea
                value={newFloor.description}
                onChange={(event) =>
                  setNewFloor((current) => ({
                    ...current,
                    description: event.target.value,
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
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="pa-detail-primary">
                Cadastrar andar
                <span>＋</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="pa-toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import "./ambientes.css";

const initialEnvironments = [
  {
    id: 1,
    name: "Recepção",
    location: "Térreo · Setor Norte",
    floor: "Térreo",
    sector: "Setor Norte",
    capacity: null,
    opening: "",
    closing: "",
    reservation: false,
    description: "Área de entrada e atendimento do edifício.",
    devices: ["Painel Luz L-033"],
  },
  {
    id: 2,
    name: "Sala de Reuniões A",
    location: "8º andar · Setor Leste",
    floor: "8º andar",
    sector: "Setor Leste",
    capacity: null,
    opening: "",
    closing: "",
    reservation: true,
    description: "Ambiente destinado a reuniões e encontros profissionais.",
    devices: ["Sensor Temp T-221"],
  },
  {
    id: 3,
    name: "Laboratório de Tecnologia",
    location: "12º andar · Setor Sul",
    floor: "12º andar",
    sector: "Setor Sul",
    capacity: null,
    opening: "",
    closing: "",
    reservation: false,
    description: "Espaço destinado a atividades técnicas e desenvolvimento.",
    devices: ["Sensor Temp T-118"],
  },
  {
    id: 4,
    name: "Sala de Servidores",
    location: "1º andar · Setor Técnico",
    floor: "1º andar",
    sector: "Setor Técnico",
    capacity: null,
    opening: "",
    closing: "",
    reservation: false,
    description: "Ambiente técnico para infraestrutura de servidores.",
    devices: ["Medidor Energia E-104"],
  },
  {
    id: 5,
    name: "Auditório",
    location: "2º andar · Setor Social",
    floor: "2º andar",
    sector: "Setor Social",
    capacity: null,
    opening: "",
    closing: "",
    reservation: true,
    description: "Espaço destinado a apresentações, palestras e eventos.",
    devices: ["Medidor Energia E-108"],
  },
];

const emptyForm = {
  name: "",
  floor: "",
  sector: "",
  localizacao: "",
  capacity: "",
  opening: "",
  closing: "",
  reservation: false,
  description: "",
};

function Icon({ name, size = 18 }) {
  const icons = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    room: <><path d="M3 21h18M5 21V7h14v14M8 10h3v3H8zm5 0h3v3h-3zM8 16h3m2 0h3" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8m13 18v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    device: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m12 0h4M2 15h4m12 0h4" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
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

export default function Ambientes({ toast }) {
  const [environments, setEnvironments] = useState(initialEnvironments);
  const [selectedId, setSelectedId] = useState(initialEnvironments[0]?.id);
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("Todos");
  const [reservationFilter, setReservationFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const selected = environments.find((item) => item.id === selectedId);

  const floors = useMemo(
    () => [...new Set(environments.map((item) => item.floor).filter(Boolean))],
    [environments]
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return environments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        item.sector.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term);

      const matchesFloor =
        floorFilter === "Todos" || item.floor === floorFilter;

      const matchesReservation =
        reservationFilter === "Todos" ||
        (reservationFilter === "Permite reserva" && item.reservation) ||
        (reservationFilter === "Sem reserva" && !item.reservation);

      return matchesSearch && matchesFloor && matchesReservation;
    });
  }, [environments, search, floorFilter, reservationFilter]);

  const notify = (text) => {
    if (toast) {
      toast(text);
    } else {
      setMessage(text);
      window.setTimeout(() => setMessage(""), 2600);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      floor: item.floor,
      sector: item.sector,
      localizacao: item.location,
      capacity: item.capacity ?? "",
      opening: item.opening,
      closing: item.closing,
      reservation: item.reservation,
      description: item.description,
    });
    setModalOpen(true);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveEnvironment = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.localizacao.trim() || !form.sector.trim()) {
      notify("Preencha o nome, a localização e o setor.");
      return;
    }

    const environmentData = {
      name: form.name.trim(),
      floor: form.floor.trim(),
      sector: form.sector.trim(),
      location: form.localizacao.trim(),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      opening: form.opening,
      closing: form.closing,
      reservation: form.reservation,
      description: form.description.trim(),
    };

    if (editingId) {
      setEnvironments((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...environmentData } : item
        )
      );
      setSelectedId(editingId);
      notify("Ambiente atualizado.");
    } else {
      const newId = Math.max(0, ...environments.map((item) => item.id)) + 1;

      setEnvironments((current) => [
        ...current,
        { id: newId, ...environmentData, devices: [] },
      ]);

      setSelectedId(newId);
      notify("Ambiente cadastrado.");
    }

    setModalOpen(false);
    setForm(emptyForm);
  };

  const deleteEnvironment = () => {
    if (!selected) return;

    const confirmed = window.confirm(
      `Deseja realmente excluir o ambiente "${selected.name}"?`
    );

    if (!confirmed) return;

    const remaining = environments.filter((item) => item.id !== selected.id);
    setEnvironments(remaining);
    setSelectedId(remaining[0]?.id);
    notify("Ambiente removido da visualização.");
  };

  return (
    <div className="amb-page">
      <header className="amb-heading">
        <div>
          <span className="amb-eyebrow">ESTRUTURA DO EDIFÍCIO</span>
          <h1>Ambientes</h1>
          <p>
            Gerencie os espaços, sua localização e as condições de utilização
            do edifício.
          </p>
        </div>

        <button className="amb-primary" onClick={openNew}>
          <Icon name="plus" size={17} />
          Novo ambiente
        </button>
      </header>

      <section className="amb-summary">
        <div className="amb-summary-item">
          <span className="amb-summary-icon blue"><Icon name="room" /></span>
          <div>
            <strong>{environments.length}</strong>
            <span>Ambientes cadastrados</span>
          </div>
        </div>

        <div className="amb-summary-item">
          <span className="amb-summary-icon cyan"><Icon name="device" /></span>
          <div>
            <strong>
              {environments.reduce((total, item) => total + item.devices.length, 0)}
            </strong>
            <span>Dispositivos vinculados</span>
          </div>
        </div>

        <div className="amb-summary-item">
          <span className="amb-summary-icon slate"><Icon name="building" /></span>
          <div>
            <strong>{floors.length}</strong>
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
              placeholder="Buscar por nome, setor ou local..."
            />
          </div>

          <div className="amb-filters">
            <label>
              <Icon name="filter" size={14} />
              <select value={floorFilter} onChange={(event) => setFloorFilter(event.target.value)}>
                <option value="Todos">Todos os andares</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </label>

            <select
              value={reservationFilter}
              onChange={(event) => setReservationFilter(event.target.value)}
            >
              <option>Todos</option>
              <option>Permite reserva</option>
              <option>Sem reserva</option>
            </select>
          </div>

          <div className="amb-list">
            {filtered.length === 0 ? (
              <div className="amb-empty-list">
                <Icon name="search" size={25} />
                <b>Nenhum ambiente encontrado</b>
                <span>Tente alterar os filtros ou a busca.</span>
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  className={`amb-list-item ${selectedId === item.id ? "selected" : ""}`}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="amb-list-symbol"><Icon name="room" size={19} /></span>
                  <span className="amb-list-copy">
                    <strong>{item.name}</strong>
                    <small>{item.location}</small>
                    <span className="amb-list-meta">
                      {item.reservation ? "Reserva permitida" : "Sem reserva"}
                    </span>
                  </span>
                  <Icon name="arrow" size={16} />
                </button>
              ))
            )}
          </div>

          <div className="amb-list-footer">
            <span>Edifício Empresarial Central</span>
            <span>Cadastro de espaços</span>
          </div>
        </section>

        <section className="amb-detail-panel">
          {selected ? (
            <>
              <div className="amb-detail-top">
                <div className="amb-detail-symbol"><Icon name="room" size={25} /></div>
                <div className="amb-detail-actions">
                  <button className="amb-icon-button" onClick={() => openEdit(selected)} title="Editar ambiente">
                    <Icon name="edit" size={17} />
                  </button>
                  <button className="amb-icon-button danger" onClick={deleteEnvironment} title="Excluir ambiente">
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              </div>

              <span className="amb-section-label">DETALHES DO AMBIENTE</span>
              <h2 className="amb-detail-title">{selected.name}</h2>
              <p className="amb-detail-description">
                {selected.description || "Nenhuma descrição cadastrada para este ambiente."}
              </p>

              <div className="amb-location-box">
                <span><Icon name="pin" size={17} /></span>
                <div>
                  <small>LOCALIZAÇÃO</small>
                  <strong>{selected.location}</strong>
                  <p>{selected.sector}</p>
                </div>
              </div>

              <div className="amb-detail-grid">
                <div className="amb-info-box">
                  <span><Icon name="users" size={17} /></span>
                  <small>CAPACIDADE MÁXIMA</small>
                  <strong>{formatCapacity(selected.capacity)}</strong>
                </div>
                <div className="amb-info-box">
                  <span><Icon name="calendar" size={17} /></span>
                  <small>RESERVAS</small>
                  <strong>{selected.reservation ? "Permitidas" : "Não permitidas"}</strong>
                </div>
                <div className="amb-info-box">
                  <span><Icon name="clock" size={17} /></span>
                  <small>ABERTURA</small>
                  <strong>{selected.opening || "Não informado"}</strong>
                </div>
                <div className="amb-info-box">
                  <span><Icon name="clock" size={17} /></span>
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
                  <span className="amb-device-count">{selected.devices.length}</span>
                </div>

                {selected.devices.length > 0 ? (
                  <div className="amb-device-list">
                    {selected.devices.map((device) => (
                      <div className="amb-device-row" key={device}>
                        <span><Icon name="device" size={17} /></span>
                        <div>
                          <strong>{device}</strong>
                          <small>Associado a este ambiente</small>
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
                  Elas não são valores cadastrais do ambiente.
                </p>
              </div>
            </>
          ) : (
            <div className="amb-no-selection">
              <span><Icon name="room" size={30} /></span>
              <h2>Selecione um ambiente</h2>
              <p>Escolha um registro na lista para visualizar seus detalhes.</p>
            </div>
          )}
        </section>
      </div>

      {modalOpen && (
        <div className="amb-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="amb-modal" onSubmit={saveEnvironment}>
            <div className="amb-modal-header">
              <div>
                <span className="amb-section-label">CADASTRO DO EDIFÍCIO</span>
                <h2>{editingId ? "Editar ambiente" : "Novo ambiente"}</h2>
                <p>Informe os dados físicos e operacionais do espaço.</p>
              </div>
              <button type="button" className="amb-icon-button" onClick={() => setModalOpen(false)}>
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
                Andar
                <input
                  value={form.floor}
                  onChange={(event) => updateForm("floor", event.target.value)}
                  placeholder="Ex.: 3º andar"
                />
              </label>

              <label>
                Setor *
                <input
                  value={form.sector}
                  onChange={(event) => updateForm("sector", event.target.value)}
                  placeholder="Ex.: Setor Leste"
                  required
                />
              </label>

              <label className="full">
                Localização *
                <input
                  value={form.localizacao}
                  onChange={(event) => updateForm("localizacao", event.target.value)}
                  placeholder="Descreva a localização do ambiente"
                  required
                />
              </label>

              <label>
                Capacidade máxima
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) => updateForm("capacity", event.target.value)}
                  placeholder="Quantidade de pessoas"
                />
              </label>

              <label className="amb-checkbox-field">
                <input
                  type="checkbox"
                  checked={form.reservation}
                  onChange={(event) => updateForm("reservation", event.target.checked)}
                />
                <span>
                  <strong>Permitir reservas</strong>
                  <small>Este ambiente poderá ser reservado.</small>
                </span>
              </label>

              <label>
                Horário de abertura
                <input
                  type="time"
                  value={form.opening}
                  onChange={(event) => updateForm("opening", event.target.value)}
                />
              </label>

              <label>
                Horário de fechamento
                <input
                  type="time"
                  value={form.closing}
                  onChange={(event) => updateForm("closing", event.target.value)}
                />
              </label>

              <label className="full">
                Descrição
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Descreva a finalidade ou as características do ambiente..."
                  rows="3"
                />
              </label>
            </div>

            <div className="amb-form-footer">
              <span>* Campos obrigatórios</span>
              <div>
                <button type="button" className="amb-cancel" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="amb-primary">
                  <Icon name="check" size={16} />
                  {editingId ? "Salvar alterações" : "Cadastrar ambiente"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {message && <div className="amb-toast"><Icon name="check" size={16} />{message}</div>}
    </div>
  );
}

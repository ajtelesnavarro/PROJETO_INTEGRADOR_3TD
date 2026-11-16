
"use client";

import "./modalEquipes.css";

export default function NovoPredioModal({
  aberto,
  fechar,
  cadastrar,
  form,
  atualizar,
}) {
  if (!aberto) return null;

  function handleSubmit(e) {
    e.preventDefault();
    cadastrar(e);
  }

  return (
    <div
      className="dash-modal-backdrop"
      onMouseDown={fechar}
    >
      <form
        className="dash-modal"
        onSubmit={handleSubmit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div className="dash-modal-heading">
          <div>
            <span className="dash-modal-eyebrow">
              ESTRUTURA PREDIAL
            </span>

            <h2>Novo prédio</h2>

            <p>
              Preencha os dados para cadastrar um edifício.
            </p>
          </div>

          <button
            type="button"
            className="dash-modal-close"
            onClick={fechar}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        {/* CAMPOS */}
        <div className="dash-modal-fields">

          <label htmlFor="nome_predio">
            Nome do prédio *
            <input
              id="nome_predio"
              required
              autoFocus
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              placeholder="Ex.: Edifício Empresarial Central"
            />
          </label>

          <div className="dash-form-row">
            <label htmlFor="estado">
              Estado *
              <input
                id="estado"
                required
                value={form.estado}
                onChange={(e) => atualizar("estado", e.target.value)}
                placeholder="SP"
              />
            </label>

            <label htmlFor="cidade">
              Cidade *
              <input
                id="cidade"
                required
                value={form.cidade}
                onChange={(e) => atualizar("cidade", e.target.value)}
                placeholder="Santo André"
              />
            </label>
          </div>

          <div className="dash-form-row">
            <label htmlFor="bairro">
              Bairro
              <input
                id="bairro"
                value={form.bairro}
                onChange={(e) => atualizar("bairro", e.target.value)}
                placeholder="Ex.: Centro"
              />
            </label>

            <label htmlFor="cep">
              CEP *
              <input
                id="cep"
                required
                inputMode="numeric"
                maxLength={9}
                value={form.cep}
                onChange={(e) => atualizar("cep", e.target.value)}
                placeholder="00000-000"
              />
            </label>
          </div>

          <div className="dash-form-row dash-form-row-street">
            <label htmlFor="rua">
              Rua *
              <input
                id="rua"
                required
                value={form.rua}
                onChange={(e) => atualizar("rua", e.target.value)}
                placeholder="Nome da rua"
              />
            </label>

            <label htmlFor="numero">
              Número
              <input
                id="numero"
                type="number"
                min={0}
                value={form.numero}
                onChange={(e) => atualizar("numero", e.target.value)}
                placeholder="Nº"
              />
            </label>
          </div>

          <label htmlFor="complemento">
            Complemento
            <input
              id="complemento"
              value={form.complemento}
              onChange={(e) => atualizar("complemento", e.target.value)}
              placeholder="Bloco, torre, sala..."
            />
          </label>

        </div>

        {/* BOTÕES */}
        <div className="dash-modal-actions">
          <button
            type="button"
            className="dash-modal-cancel"
            onClick={fechar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="dash-primary-button"
          >
            Cadastrar prédio
            <span>＋</span>
          </button>
        </div>

      </form>
    </div>
  );
}

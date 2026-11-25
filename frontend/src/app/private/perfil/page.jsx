"use client";

import { useEffect, useState } from "react";
import "./pefil.css?v=1";

const perfilVazio = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  data_nascimento: "",
  senha: "",
  foto: "",
};

const camposPerfil = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", obrigatorio: true, minimo: 3 },
  { nome: "data_nascimento", rotulo: "Data de nascimento", tipo: "date" },
  { nome: "cpf", rotulo: "CPF", tipo: "text", placeholder: "Somente números", obrigatorio: true, inputMode: "numeric", maxLength: 14 },
  { nome: "telefone", rotulo: "Telefone", tipo: "tel", placeholder: "(00) 00000-0000" },
  { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true, largura: "campo-email" },
  { nome: "senha", rotulo: "Nova senha (opcional)", tipo: "password", placeholder: "Deixe em branco para manter a senha atual", minimo: 8, largura: "campo-email" },
];

function obterUrlApi() {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;
  return `${base}/api/v1`;
}

function obterUrlFoto(foto) {
  if (!foto) return "/images/logo.png";
  if (/^(https?:|data:|blob:)/i.test(foto)) return foto;
  const origem = obterUrlApi().replace(/\/api\/v1$/, "");
  return `${origem}${foto.startsWith("/") ? "" : "/"}${foto}`;
}

function lerImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.readAsDataURL(arquivo);
  });
}

function normalizarPerfil(dados = {}) {
  return {
    ...perfilVazio,
    nome: dados.nome || "",
    email: dados.email || "",
    cpf: dados.cpf || "",
    telefone: dados.telefone || "",
    data_nascimento: dados.data_nascimento ? String(dados.data_nascimento).slice(0, 10) : "",
    foto: dados.foto || "",
  };
}

export default function PerfilUsuario() {
  const [formulario, setFormulario] = useState(perfilVazio);
  const [imagem, setImagem] = useState("/images/logo.png");
  const [arquivo, setArquivo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (imagem.startsWith("blob:")) return () => URL.revokeObjectURL(imagem);
  }, [imagem]);

  useEffect(() => {
    let ativo = true;
    async function carregarPerfil() {
      try {
        const token = localStorage.getItem("lumora_token");
        if (!token) throw new Error("Entre novamente para carregar seu perfil.");
        const resposta = await fetch(`${obterUrlApi()}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resultado = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível carregar o perfil.");
        if (!ativo) return;
        const dados = resultado.dados || {};
        setFormulario(normalizarPerfil(dados));
        setImagem(obterUrlFoto(dados.foto));
      } catch (e) {
        if (ativo) setErro(e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarPerfil();
    return () => { ativo = false; };
  }, []);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function selecionarFoto(evento) {
    const selecionada = evento.target.files?.[0];
    if (!selecionada) return;
    if (!/^image\/(png|jpeg|webp)$/.test(selecionada.type) || selecionada.size > 2 * 1024 * 1024) {
      setErro("Selecione PNG, JPG ou WebP de até 2 MB.");
      evento.target.value = "";
      return;
    }
    setErro("");
    setArquivo(selecionada);
    setImagem(URL.createObjectURL(selecionada));
  }

  async function salvarPerfil(evento) {
    evento.preventDefault();
    setErro("");
    setAviso("");
    setSalvando(true);
    try {
      const token = localStorage.getItem("lumora_token");
      if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
      const resposta = await fetch(`${obterUrlApi()}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formulario,
          data_nascimento: formulario.data_nascimento || null,
          foto_upload: arquivo ? await lerImagem(arquivo) : null,
        }),
      });
      const resultado = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível salvar o perfil.");
      const dados = resultado.dados || {};
      setFormulario(normalizarPerfil({ ...formulario, ...dados }));
      if (dados.foto) setImagem(obterUrlFoto(dados.foto));
      setArquivo(null);
      setAviso("Perfil atualizado com sucesso.");
    } catch (e) {
      setErro(e.message === "Failed to fetch" ? "Não foi possível conectar à API." : e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="perfil-container">
      <section className="perfil-card">
        <header className="perfil-header">
          <h1>Meu Perfil</h1>
          <p>Consulte e atualize suas informações pessoais.</p>
        </header>
        {erro && <div className="perfil-aviso perfil-erro" role="alert">{erro}</div>}
        {aviso && <div className="perfil-aviso perfil-sucesso" role="status">{aviso}</div>}
        {carregando ? <p className="perfil-carregando">Carregando perfil...</p> : (
          <form className="perfil-form" onSubmit={salvarPerfil}>
            <div className="perfil-foto-area">
              <div className="perfil-foto">
                <img src={imagem} alt="Foto de perfil" />
                <label htmlFor="foto" title="Alterar foto" aria-label="Alterar foto"><i className="bi bi-camera-fill" /></label>
                <input hidden id="foto" name="foto" type="file" accept="image/png,image/jpeg,image/webp" onChange={selecionarFoto} />
              </div>
              <div><h3>Foto de perfil</h3></div>
            </div>
            <div className="perfil-divider" />
            <div className="perfil-campos">
              {camposPerfil.map((campo) => (
                <div className={`campo ${campo.largura || ""}`} key={campo.nome}>
                  <label htmlFor={campo.nome}>{campo.rotulo}</label>
                  {campo.nome === "senha" ? (
                    <div className="perfil-senha-controle">
                      <input
                        id={campo.nome}
                        name={campo.nome}
                        type={mostrarSenha ? "text" : "password"}
                        placeholder={campo.placeholder}
                        value={formulario[campo.nome]}
                        onChange={alterarCampo}
                        minLength={campo.minimo}
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setMostrarSenha((visivel) => !visivel)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} aria-pressed={mostrarSenha}>
                        <i className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
                        {mostrarSenha ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  ) : (
                    <input
                      id={campo.nome}
                      name={campo.nome}
                      type={campo.tipo}
                      placeholder={campo.placeholder}
                      value={formulario[campo.nome]}
                      onChange={alterarCampo}
                      required={campo.obrigatorio}
                      minLength={campo.minimo}
                      maxLength={campo.maxLength}
                      inputMode={campo.inputMode}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="perfil-footer">
              <button type="submit" disabled={salvando}>
                <i className="bi bi-check-lg" />
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

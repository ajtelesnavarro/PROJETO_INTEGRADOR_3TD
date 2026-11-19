"use client";

import { useEffect, useState } from "react";
import "./pefil.css";

const emptyProfile = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    senha: "",
    foto: "",
};

function configurarApi() {
    const configured = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
    const apiUrl = configured.endsWith("/api") ? configured : `${configured}/api`;
    return { apiUrl, apiOrigin: apiUrl.slice(0, -4) };
}

function obterUrlFoto(foto) {
    if (!foto) return "/images/logo.png";
    if (/^(https?:|data:|blob:)/i.test(foto)) return foto;
    return `${configurarApi().apiOrigin}${foto.startsWith("/") ? "" : "/"}${foto}`;
}

function prepararPerfil(dados = {}) {
    return {
        nome: dados.nome || "",
        email: dados.email || "",
        cpf: dados.cpf || "",
        telefone: dados.telefone || "",
        data_nascimento: dados.data_nascimento
            ? String(dados.data_nascimento).slice(0, 10)
            : "",
        senha: "",
        foto: dados.foto || "",
    };
}

function lerImagemComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
        leitor.readAsDataURL(arquivo);
    });
}

export default function PerfilUsuario() {
    const [profile, setProfile] = useState(emptyProfile);
    const [imagem, setImagem] = useState("/images/logo.png");
    const [arquivoFoto, setArquivoFoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (imagem.startsWith("blob:")) return () => URL.revokeObjectURL(imagem);
        return undefined;
    }, [imagem]);

    useEffect(() => {
        let ativo = true;
        async function carregarPerfil() {
            const token = window.localStorage.getItem("lumora_token");
            if (!token) {
                setErro("Sua sessão não foi encontrada. Entre novamente para carregar o perfil.");
                setLoading(false);
                return;
            }
            try {
                const { apiUrl } = configurarApi();
                const response = await fetch(`${apiUrl}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.erro || "Não foi possível carregar seu perfil.");
                if (!ativo) return;
                const dados = result.dados || {};
                setProfile(prepararPerfil(dados));
                setImagem(obterUrlFoto(dados.foto));
            } catch (error) {
                if (ativo) setErro(error.message === "Failed to fetch"
                    ? "Não foi possível conectar à API. Confira se o servidor está ativo."
                    : error.message);
            } finally {
                if (ativo) setLoading(false);
            }
        }
        carregarPerfil();
        return () => { ativo = false; };
    }, []);

    function alterarCampo(event) {
        const { name, value } = event.target;
        setProfile((atual) => ({ ...atual, [name]: value }));
    }

    function selecionarImagem(event) {
        const arquivo = event.target.files?.[0];
        if (!arquivo) return;
        if (!/^image\/(png|jpeg|webp)$/.test(arquivo.type) || arquivo.size > 2 * 1024 * 1024) {
            setErro("Selecione uma imagem PNG, JPG ou WebP de até 2 MB.");
            event.target.value = "";
            return;
        }
        setErro("");
        setMensagem("");
        setArquivoFoto(arquivo);
        setImagem(URL.createObjectURL(arquivo));
    }

    async function salvarPerfil(event) {
        event.preventDefault();
        setErro("");
        setMensagem("");
        setSaving(true);
        try {
            const token = window.localStorage.getItem("lumora_token");
            if (!token) throw new Error("Sua sessão expirou. Entre novamente para salvar o perfil.");
            const foto_upload = arquivoFoto
                ? await lerImagemComoDataUrl(arquivoFoto)
                : null;
            const { apiUrl } = configurarApi();
            const response = await fetch(`${apiUrl}/auth/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...profile,
                    data_nascimento: profile.data_nascimento || null,
                    foto_upload,
                }),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.erro || "Não foi possível salvar as alterações.");
            const dados = result.dados || {};
            setProfile(prepararPerfil({ ...profile, ...dados }));
            if (dados.foto) setImagem(obterUrlFoto(dados.foto));
            setArquivoFoto(null);
            setMensagem("Perfil atualizado com sucesso.");
        } catch (error) {
            setErro(error.message === "Failed to fetch"
                ? "Não foi possível conectar à API. Confira se o servidor está ativo e tente novamente."
                : error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="perfil-container">
            <section className="perfil-card">
                <div className="perfil-header">
                    <h1>Meu Perfil</h1>
                    <p>Consulte e atualize suas informações pessoais.</p>
                </div>

                {erro && <div className="perfil-aviso perfil-erro" role="alert">{erro}</div>}
                {mensagem && <div className="perfil-aviso perfil-sucesso" role="status">{mensagem}</div>}

                {loading ? <p className="perfil-carregando">Carregando perfil...</p> : <form className="perfil-form" onSubmit={salvarPerfil}>
                    <div className="perfil-foto-area">
                        <div className="perfil-foto">
                            <img src={imagem} alt="Foto de perfil" />
                            <label htmlFor="foto" title="Alterar foto" aria-label="Alterar foto">
                                <i className="bi bi-camera-fill"></i>
                            </label>
                            <input type="file" name="foto" id="foto" accept="image/png,image/jpeg,image/webp" onChange={selecionarImagem} hidden />
                        </div>
                        <div>
                            <h3>Foto de perfil</h3>
                        </div>
                    </div>

                    <div className="perfil-divider"></div>
                    <div className="perfil-campos">
                        <div className="campo">
                            <label htmlFor="nome">Nome completo</label>
                            <input type="text" name="nome" id="nome" value={profile.nome} onChange={alterarCampo} minLength={3} required />
                        </div>
                        <div className="campo">
                            <label htmlFor="data_nascimento">Data de nascimento</label>
                            <input type="date" name="data_nascimento" id="data_nascimento" value={profile.data_nascimento} onChange={alterarCampo} />
                        </div>
                        <div className="campo">
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" id="cpf" placeholder="Somente números" value={profile.cpf} onChange={alterarCampo} inputMode="numeric" maxLength={14} required />
                        </div>
                        <div className="campo">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" name="telefone" id="telefone" placeholder="(00) 00000-0000" value={profile.telefone} onChange={alterarCampo} />
                        </div>
                        <div className="campo campo-email">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" value={profile.email} onChange={alterarCampo} required />
                        </div>
                        <div className="campo campo-email">
                            <label htmlFor="senha">Nova senha (opcional)</label>
                            <input type="password" name="senha" id="senha" placeholder="Deixe em branco para manter a senha atual" value={profile.senha} onChange={alterarCampo} minLength={8} autoComplete="new-password" />
                        </div>
                    </div>
                    <div className="perfil-footer">
                        <button type="submit" disabled={saving}>
                            <i className="bi bi-check-lg"></i>
                            {saving ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>}
            </section>
        </main>
    );
}

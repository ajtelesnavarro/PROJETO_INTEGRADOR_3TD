'use client';

import { useState } from "react";
import Link from "next/link";
import "./login.css";
import Image from "next/image";

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("Autenticando...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const r = await fetch(`${apiUrl}/api/v1/auth/gerarToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "Credenciais inválidas ou serviço indisponível.");
      if (!data.token) throw new Error("A API respondeu, mas não retornou um token de acesso.");
      localStorage.setItem("lumora_token", data.token);
      setMessage("Login realizado com sucesso. A autenticação foi concluída.");
    } catch (error) {
      setMessage(error.message || "Não foi possível conectar à API. Confira se o back-end está ativo.");
    }
  }

  return (
    <main className="auth">
      <div className="auth-left">

        <div className="auth-visual">
          <div className="auth-ring r1"></div>
          <div className="auth-ring r2"></div>

          <div className="auth-core">
            <span className="auth-letter">L</span>
          </div>

        </div>

        <div className="auth-message">
          <div className="pill dark-pill">PLATAFORMA LUMORA</div>
          <h1>Uma visão.<br /><em>Todo o edifício.</em></h1>
          <p>Entre para acompanhar ambientes, dispositivos, energia e ocorrências.</p>
        </div>
      </div>
      <div className="auth-right">
        <form className="login-form" onSubmit={submit}>
          <span className="section-kicker">ACESSO RESTRITO</span><h2>Bem-vindo de volta.</h2><p>Use seu e-mail e senha para acessar a plataforma.</p>
          <label>E-mail<input required autoComplete="username" type="email" placeholder="voce@empresa.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
          <label>Senha<input required autoComplete="current-password" type="password" placeholder="••••••••" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})}/></label>
          <button className="button primary full" type="submit">Entrar na plataforma →</button>
          {message && <div className="auth-message-box">{message}</div>}
          <Link href="/" className="back">← Voltar para o site</Link>
        </form>
      </div>
    </main>
  );
}
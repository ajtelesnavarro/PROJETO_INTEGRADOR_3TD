'use client';

import { useState } from "react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import "./login.css";


export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("Autenticando...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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

const canvasRef = useRef(null);

// ANIMAÇÃO DA REDE INTELIGENTE LUMORA
useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        width = rect.width;
        height = rect.height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 55 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: i % 8 === 0 ? 3 : Math.random() * 1.5 + 1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: Math.random() * 0.35 + 0.12,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.02 + 0.005,
    }));

    const drawParticles = () => {
        ctx.clearRect(0, 0, width, height);

        // CONEXÕES ENTRE SENSORES E DISPOSITIVOS
        particles.forEach((p, i) => {
            particles.slice(i + 1).forEach((other) => {
                const dx = p.x - other.x;
                const dy = p.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 125) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle = `rgba(120, 145, 255, ${
                        (1 - distance / 125) * 0.2
                    })`;

                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            });
        });

        // PARTÍCULAS DE MONITORAMENTO
        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            const opacity = Math.max(
                0.1,
                Math.min(0.8, p.opacity + Math.sin(Date.now() * p.pulse) * 0.15)
            );

            if (p.y > height + 10) {
                p.y = -10;
                p.x = Math.random() * width;
            }

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            ctx.fillStyle = i % 3 === 0
                ? `rgba(167, 139, 250, ${opacity})`
                : `rgba(96, 165, 250, ${opacity})`;

            ctx.shadowBlur = p.size > 2 ? 16 : 9;
            ctx.shadowColor = i % 3 === 0 ? "#A78BFA" : "#60A5FA";
            ctx.fill();
        });

        ctx.shadowBlur = 0;

        animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
    };
}, []);

  return (
    <main className="auth">
      <div className="auth-left">
        <canvas
            ref={canvasRef}
            className="auth-particles"
            aria-hidden="true"
        />

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
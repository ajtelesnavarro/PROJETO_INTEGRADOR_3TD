'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", senha: "" });
  const canvasRef = useRef(null);

  // ===== BACK-END (lógica original da main, sem alterações) =====
  async function submit(e) {
    e.preventDefault();
    setMessage("Autenticando...");
    setFieldErrors({ email: "", senha: "" });
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
      const r = await fetch(`${apiUrl}/auth/gerarToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.erro || data.message || "Credenciais inválidas ou serviço indisponível.");
      if (!data.token) throw new Error("A API respondeu, mas não retornou um token de acesso.");
      localStorage.setItem("lumora_token", data.token);
      if (data.usuario) localStorage.setItem("lumora_usuario", JSON.stringify(data.usuario));
      setMessage("Login realizado com sucesso. A autenticação foi concluída.");
      setTimeout(() => router.push("/private/dashboard"), 800);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message.trim() : "";
      const errorName = error instanceof Error ? error.name : "";
      const novosErros = { email: "", senha: "" };

      if (errorName === "TypeError" || /failed to fetch|networkerror/i.test(errorMessage)) {
        setMessage("Não foi possível conectar à API. Confira se o back-end está ativo.");
      } else if (errorMessage) {
        const msg = errorMessage.toLowerCase();

        if (msg.includes("email") || msg.includes("e-mail") || msg.includes("usuário") || msg.includes("usuario")) {
          novosErros.email = errorMessage;
        } else if (msg.includes("senha") || msg.includes("password")) {
          novosErros.senha = errorMessage;
        }

        if (novosErros.email || novosErros.senha) {
          setFieldErrors(novosErros);
          setMessage("");
        } else {
          setMessage(errorMessage);
        }
      } else {
        setMessage("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  }

  // ===== ANIMAÇÃO DA REDE INTELIGENTE LUMORA =====
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

      // Conexões entre sensores e dispositivos
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((other) => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(120, 145, 255, ${(1 - distance / 125) * 0.2})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        });
      });

      // Partículas de monitoramento
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
        <canvas ref={canvasRef} className="auth-particles" aria-hidden="true" />

        <div className="auth-visual">
          <div className="auth-ring r1"></div>
          <div className="auth-ring r2"></div>

          <div className="auth-core">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Lumora" className="auth-logo" />
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
          <span className="section-kicker">ACESSO RESTRITO</span>
          <h2>Bem-vindo de volta.</h2>
          <p>Use seu e-mail e senha para acessar a plataforma.</p>

          <label>
            E-mail
            <input
              required
              autoComplete="username"
              type="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              placeholder="voce@empresa.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setFieldErrors({ ...fieldErrors, email: "" });
                setMessage("");
              }}
            />
            {fieldErrors.email && (
              <span id="login-email-error" className="login-field-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label>
            Senha
            <input
              required
              autoComplete="current-password"
              type="password"
              aria-invalid={Boolean(fieldErrors.senha)}
              aria-describedby={fieldErrors.senha ? "login-senha-error" : undefined}
              placeholder="••••••••"
              value={form.senha}
              onChange={(e) => {
                setForm({ ...form, senha: e.target.value });
                setFieldErrors({ ...fieldErrors, senha: "" });
                setMessage("");
              }}
            />
            {fieldErrors.senha && (
              <span id="login-senha-error" className="login-field-error" role="alert">
                {fieldErrors.senha}
              </span>
            )}
          </label>

          <button className="button primary full" type="submit">Entrar na plataforma →</button>

          {message && (
            <div
              className="auth-message-box"
              role={message === "Autenticando..." || message.startsWith("Login realizado") ? "status" : "alert"}
            >
              {message}
            </div>
          )}

          <Link href="/" className="back">← Voltar para o site</Link>
        </form>
      </div>
    </main>
  );
}

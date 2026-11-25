"use client";

import { useEffect, useState } from "react";
import "./user-avatar.css";

function montarUrlFoto(foto) {
  if (!foto || /^(https?:|data:|blob:)/i.test(foto)) return foto || "";
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
  const origem = base.replace(/\/api(?:\/v1)?$/, "");
  return `${origem}${foto.startsWith("/") ? "" : "/"}${foto}`;
}

function iniciais(nome) {
  return String(nome || "U")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

export default function UserAvatar({ name, photo, size = 38, online = false, className = "" }) {
  const [falhaFoto, setFalhaFoto] = useState(false);
  const urlFoto = montarUrlFoto(photo);

  useEffect(() => setFalhaFoto(false), [urlFoto]);

  return (
    <span
      className={`user-avatar ${className}`.trim()}
      style={{ "--user-avatar-size": `${size}px` }}
      aria-label={photo && !falhaFoto ? `Foto de ${name || "usuário"}` : `Iniciais de ${name || "usuário"}`}
    >
      {urlFoto && !falhaFoto
        ? <img src={urlFoto} alt="" onError={() => setFalhaFoto(true)} />
        : <span className="user-avatar-initials">{iniciais(name)}</span>}
      {online && <i className="user-avatar-online" aria-label="Online" />}
    </span>
  );
}

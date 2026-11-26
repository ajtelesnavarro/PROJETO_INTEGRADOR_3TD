"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, unwrap } from "@/components/lib/api";

export const PERMISSOES_POR_PERFIL = {
  administrador: [
    "dashboard", "predios", "ambientes", "dispositivos", "acessos",
    "ocorrencias", "equipes", "reclamacoes", "orcamentos",
    "historico", "perfil"
  ],

  manutencao: [
    "dashboard", "ambientes", "dispositivos",
    "ocorrencias", "historico", "perfil"
  ],

  porteiro: [
    "dashboard", "acessos", "perfil"
  ],

  funcionario: [
    "dashboard", "historico", "perfil", "reclamacoes"
  ],

  locador: [
    "dashboard", "historico", "perfil", "reclamacoes"
  ],
};

export const ITEM_PERMISSAO = {
  "/private/dashboard": "dashboard",
  "/private/predios": "predios",
  "/private/andares": "predios",
  "/private/ambientes": "ambientes",
  "/private/dispositivos": "dispositivos",
  "/private/historico-dispositivos": "dispositivos",
  "/private/acessos": "acessos",
  "/private/ocorrencias": "ocorrencias",
  "/private/equipes": "equipes",
  "/private/reclamacoes": "reclamacoes",
  "/private/orcamentos": "orcamentos",
  "/private/historico": "historico",
  "/private/versao": "versao",
  "/private/perfil": "perfil"
};

export function podeAcessar(perfil, pathname) {
  const item = Object.entries(ITEM_PERMISSAO).find(([rota]) => pathname === rota || pathname.startsWith(`${rota}/`))?.[1];
  return !item || (PERMISSOES_POR_PERFIL[perfil] || []).includes(item);
}

export default function RoleGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("carregando");

  useEffect(() => {
    let ativo = true;
    const token = localStorage.getItem("lumora_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    apiFetch("/auth/me")
      .then((data) => {
        const usuario = unwrap(data);
        if (!ativo) return;
        if (!podeAcessar(usuario.perfil, pathname)) {
          router.replace("/private/dashboard");
          return;
        }
        setStatus("ok");
      })
      .catch(() => {
        localStorage.removeItem("lumora_token");
        router.replace("/login");
      });
    return () => { ativo = false; };
  }, [pathname, router]);

  if (status !== "ok") return <div style={{ minHeight: "40vh", display: "grid", placeItems: "center" }}>Verificando permissões...</div>;
  return children;
}

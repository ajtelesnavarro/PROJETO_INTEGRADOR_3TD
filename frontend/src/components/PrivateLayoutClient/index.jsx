"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/PrivateHeader/index";
import Sidebar from "@/components/PrivateSidebar/index";
import { requisicaoAPI } from "@/services/api";

const PERFIS_LABEL = {
  administrador: "Administrador",
  manutencao: "Manutenção",
  porteiro: "Porteiro",
  funcionario: "Funcionário",
  locador: "Locador",
};

export default function PrivateLayoutClient({ children }) {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [usuario, setUsuario] = useState({ nome: "Usuário", perfil: "Administrador" });
  const [perfil, setPerfil] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState("");
  const [predioAtual, setPredioAtual] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("lumora_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const salvo = JSON.parse(localStorage.getItem("lumora_usuario") || "{}");
      if (salvo.nome) {
        setFotoUsuario(salvo.foto || "");
        setUsuario({
          nome: salvo.nome,
          perfil: PERFIS_LABEL[salvo.perfil] || salvo.perfil || "Administrador",
        });
        setPerfil(salvo.perfil || "");
      }
    } catch {}

    setAutorizado(false);
  }, [router]);

  useEffect(() => {
    let ativo = true;
    if (!localStorage.getItem("lumora_token")) return () => { ativo = false; };

    async function carregarUsuarioAtual() {
      try {
        const resposta = await requisicaoAPI("/auth/me");
        if (!ativo) return;
        const dados = resposta.dados || {};
        setFotoUsuario(dados.foto || "");
        setUsuario({
          nome: dados.nome || "Usuário",
          perfil: PERFIS_LABEL[dados.perfil] || dados.perfil || "Usuário",
        });
        setPerfil(dados.perfil || "");
        const predio = dados.id_predio
          ? { id_predio: dados.id_predio, nome_predio: dados.nome_predio || "" }
          : null;
        setPredioAtual(predio);
        if (predio) sessionStorage.setItem("lumora_predio_atual", JSON.stringify(predio));
        else sessionStorage.removeItem("lumora_predio_atual");
      } catch {
        if (ativo) {
          setPredioAtual(null);
          sessionStorage.removeItem("lumora_predio_atual");
        }
      } finally {
        if (ativo) setAutorizado(true);
      }
    }

    carregarUsuarioAtual();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    const atualizarFoto = (evento) => setFotoUsuario(evento.detail || "");
    window.addEventListener("lumora:profile-photo-updated", atualizarFoto);
    return () => window.removeEventListener("lumora:profile-photo-updated", atualizarFoto);
  }, []);

  function handleLogout() {
    localStorage.removeItem("lumora_token");
    localStorage.removeItem("lumora_usuario");
    sessionStorage.removeItem("lumora_predio_atual");
    router.push("/login");
  }

  if (!autorizado) return null;

  return (
    <div className={`private-layout ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
      {sidebar && <Sidebar setSidebar={setSidebar} perfil={perfil} />}

      <div className="private-main">
        <Header
          setSidebar={setSidebar}
          sidebar={sidebar}
          userName={usuario.nome}
          userRole={usuario.perfil}
          userPhoto={fotoUsuario}
          buildingName={predioAtual?.nome_predio || (predioAtual ? "Prédio cadastrado" : "Nenhum prédio vinculado")}
          onLogout={handleLogout}
        />

        <main className="private-content">
          {children}
        </main>
      </div>
    </div>
  );
}

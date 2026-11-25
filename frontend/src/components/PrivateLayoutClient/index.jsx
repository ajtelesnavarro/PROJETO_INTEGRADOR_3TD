"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/PrivateHeader/index";
import Sidebar from "@/components/PrivateSidebar/index";
<<<<<<< HEAD

const PERFIS_LABEL = {
  administrador: "Administrador",
  manutencao: "Manuten??o",
  porteiro: "Porteiro",
  funcionario: "Funcion?rio",
=======
import { requisicaoAPI } from "@/services/api";

const PERFIS_LABEL = {
  administrador: "Administrador",
  manutencao: "Manutenção",
  porteiro: "Porteiro",
  funcionario: "Funcionário",
  locador: "Locador",
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
};

export default function PrivateLayoutClient({ children }) {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
<<<<<<< HEAD
  const [usuario, setUsuario] = useState({ nome: "Usu?rio", perfil: "Administrador" });

  useEffect(() => {
    const token = localStorage.getItem("lumora_token");
    if (!token) {
      router.replace("/login");
      return;
    }
=======
  const [usuario, setUsuario] = useState({ nome: "Usuário", perfil: "Administrador" });
  const [perfil, setPerfil] = useState("");
  const [predioAtual, setPredioAtual] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("lumora_token");
    // if (!token) {
    //   router.replace("/login");
    //   return;
    // }
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

    try {
      const salvo = JSON.parse(localStorage.getItem("lumora_usuario") || "{}");
      if (salvo.nome) {
        setUsuario({
          nome: salvo.nome,
          perfil: PERFIS_LABEL[salvo.perfil] || salvo.perfil || "Administrador",
        });
<<<<<<< HEAD
      }
    } catch {}

    setAutorizado(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("lumora_token");
    localStorage.removeItem("lumora_usuario");
=======
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

  function handleLogout() {
    localStorage.removeItem("lumora_token");
    localStorage.removeItem("lumora_usuario");
    sessionStorage.removeItem("lumora_predio_atual");
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
    router.push("/login");
  }

  if (!autorizado) return null;

  return (
    <div className={`private-layout ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
<<<<<<< HEAD
      {sidebar && <Sidebar setSidebar={setSidebar} />}
=======
      {sidebar && <Sidebar setSidebar={setSidebar} perfil={perfil} />}
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

      <div className="private-main">
        <Header
          setSidebar={setSidebar}
          sidebar={sidebar}
          userName={usuario.nome}
          userRole={usuario.perfil}
<<<<<<< HEAD
=======
          buildingName={predioAtual?.nome_predio || (predioAtual ? "Prédio cadastrado" : "Nenhum prédio vinculado")}
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
          onLogout={handleLogout}
        />

        <main className="private-content">
          {children}
        </main>
      </div>
    </div>
  );
}

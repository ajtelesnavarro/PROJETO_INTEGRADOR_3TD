"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/PrivateHeader/index";
import Sidebar from "@/components/PrivateSidebar/index";

const PERFIS_LABEL = {
  administrador: "Administrador",
  manutencao: "Manutenção",
  porteiro: "Porteiro",
  funcionario: "Funcionário",
};

export default function PrivateLayoutClient({ children }) {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [usuario, setUsuario] = useState({ nome: "Usuário", perfil: "Administrador" });

  useEffect(() => {
    const token = localStorage.getItem("lumora_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const salvo = JSON.parse(localStorage.getItem("lumora_usuario") || "{}");
      if (salvo.nome) {
        setUsuario({
          nome: salvo.nome,
          perfil: PERFIS_LABEL[salvo.perfil] || salvo.perfil || "Administrador",
        });
      }
    } catch {}

    setAutorizado(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("lumora_token");
    localStorage.removeItem("lumora_usuario");
    router.push("/login");
  }

  if (!autorizado) return null;

  return (
    <div className={`private-layout ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
      {sidebar && <Sidebar setSidebar={setSidebar} />}

      <div className="private-main">
        <Header
          setSidebar={setSidebar}
          sidebar={sidebar}
          userName={usuario.nome}
          userRole={usuario.perfil}
          onLogout={handleLogout}
        />

        <main className="private-content">
          {children}
        </main>
      </div>
    </div>
  );
}
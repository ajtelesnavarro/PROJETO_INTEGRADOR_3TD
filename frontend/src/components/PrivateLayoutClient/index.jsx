"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import Header from "@/components/PrivateHeader";
import Sidebar from "@/components/PrivateSidebar_Adm/index";

export const PredioContexto = createContext({ idPredioSelecionado: null });

export default function PrivateLayoutClient({ children }) {
  const [sidebar, setSidebar] = useState(true);
  const [idPredioSelecionado, setIdPredioSelecionado] = useState(null);

  const selecionarPredio = useCallback((predio) => {
    const id = predio?.id_predio ?? predio?.id ?? null;
    setIdPredioSelecionado(id ? Number(id) : null);
  }, []);
  const valorPredioContexto = useMemo(
    () => ({ idPredioSelecionado }),
    [idPredioSelecionado]
  );

  return (
    <div className={`private-layout ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
      {sidebar && (
        <Sidebar setSidebar={setSidebar} />
      )}

      <div className="private-main">
        <PredioContexto.Provider value={valorPredioContexto}>
          <Header
            setSidebar={setSidebar}
            sidebar={sidebar}
            onBuildingChange={selecionarPredio}
          />

          <main className="private-content">
            {children}
          </main>
        </PredioContexto.Provider>
      </div>
    </div>
  );
}

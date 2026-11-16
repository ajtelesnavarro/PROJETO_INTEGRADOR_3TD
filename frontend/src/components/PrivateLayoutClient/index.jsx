"use client";

import { useState } from "react";
import Header from "@/components/PrivateHeader/index";
import Sidebar from "@/components/PrivateSidebar/index";

export default function PrivateLayoutClient({ children }) {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div className={`private-layout ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
      {sidebar && (
        <Sidebar setSidebar={setSidebar} />
      )}

      <div className="private-main">
        <Header
          setSidebar={setSidebar}
          sidebar={sidebar}
        />

        <main className="private-content">
          {children}
        </main>
      </div>
    </div>
  );
}
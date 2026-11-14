"use client";

import { useState } from "react";
import Header from "@/components/PrivateHeader/index";
import Sidebar from "@/components/PrivateSidebar/index";

export default function PrivateLayoutClient({ children }) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="private-layout">
      <Sidebar
        sidebar={sidebar}
        setSidebar={setSidebar}
      />

      <div className="private-main">
        <Header setSidebar={setSidebar} />

        <main className="private-content">
          {children}
        </main>
      </div>
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/header/Navbar";

import Footer from "@/components/footer/footer.jsx";

export default function PublicShell({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/private")) {
    return <>{children}</>;
  }

  return (
    <>

        <Navbar />
        {children}
        <Footer />
    </>
  );
}

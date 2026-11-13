'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    ["Início", "/"],
    ["Sobre nós", "/sobre"],
    ["Soluções", "/solucoes"],
    ["Nossa tecnologia", "/tecnologia"],
  ];
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="logo-mark">L</span><span>lumora</span>
        </Link>
        <nav className={open ? "nav-menu is-open" : "nav-menu"} aria-label="Navegação principal">
          {links.map(([label, href]) => <Link key={href} className={pathname === href ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="mobile-login" href="/login" onClick={() => setOpen(false)}>Entrar na plataforma</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/login" className="login-link">Entrar</Link>
          <Link href="/orcamento" className="nav-cta">Fale com a Lumora <span>↗</span></Link>
        </div>
        <button className="menu-toggle" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen(!open)}><span></span><span></span></button>
      </div>
    </header>
  );
}

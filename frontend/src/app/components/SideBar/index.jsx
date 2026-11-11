"use client";

import Link from "next/link";
import "@/app/dashboard_global.css";
import "@/app/globals.css";

export default function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i data-lucide="building-2" className="logo-icon"></i>
          <div>
            <h2>LUMORA</h2>
            <span>EDIFÍCIOS INTELIGENTES</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="section-title">MENU PRINCIPAL</span>
          <ul>
            <li className="active">
              <Link href="/visitante/dashboard">
                <i data-lucide="layout-dashboard"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/orcamento/calculadora">
                <i data-lucide="calculator"></i> Calculadora Orçamento
              </Link>
            </li>
            <li>
              <Link href="/pedido/resumoPedido">
                <i data-lucide="file-text"></i> Pedidos
              </Link>
            </li>
            <li>
              <Link href="#">
                <i data-lucide="building"></i> Prédios
              </Link>
            </li>
            <li>
              <Link href="#">
                <i data-lucide="cpu"></i> Dispositivos e Sensores
              </Link>
            </li>
            <li>
              <Link href="#">
                <i data-lucide="alert-triangle"></i> Ocorrências <span className="badge">5</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <span className="section-title">ADMINISTRAÇÃO</span>
          <ul>
            <li>
              <Link href="#">
                <i data-lucide="users"></i> Usuários
              </Link>
            </li>
            <li>
              <Link href="#">
                <i data-lucide="settings"></i> Configurações
              </Link>
            </li>
            <li>
              <Link href="#">
                <i data-lucide="help-circle"></i> Sobre o Sistema
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="status-item">
          <span className="status-dot green"></span>
          <span>Sistema operacional</span>
          <span className="status-ms">API - 32 ms</span>
        </div>
        <div className="eco-mode">
          <i data-lucide="leaf"></i>
          <span>Modo sustentável</span>
        </div>
        <button className="cookie-btn">Gerenciar cookies ou desativar</button>
      </div>
    </aside>
  );
}
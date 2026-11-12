import "./globals.css";
import Navbar from "@/components/header/Navbar";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
        <footer className="footer">
          <div className="container footer-main">
            <div className="footer-brand"><a href="/" className="brand"><span className="logo-mark">L</span><span>lumora</span></a><p>Inteligência que transforma edifícios.<br/>Tecnologia, pessoas e infraestrutura em sintonia.</p></div>
            <div className="footer-column"><b>Explorar</b><a href="/">Início</a><a href="/sobre">Sobre nós</a><a href="/solucoes">Soluções</a><a href="/tecnologia">Nossa tecnologia</a></div>
            <div className="footer-column"><b>Comece por aqui</b><a href="/orcamento">Solicitar orçamento</a><a href="/login">Acessar plataforma</a></div>
            <div className="footer-note"><span className="footer-status"><i/> TECNOLOGIA PARA EDIFÍCIOS</span><p>Uma operação mais conectada começa com uma boa conversa.</p><a href="/orcamento">Fale com a Lumora ↗</a></div>
          </div>
          <div className="container footer-bottom"><span>© {new Date().getFullYear()} Lumora. Todos os direitos reservados para um projeto exclusivo de cunho educativo do ©SENAI .</span><span>Tema: SmartBuildings.</span></div>
        </footer>
      </body>
    </html>
  );
}
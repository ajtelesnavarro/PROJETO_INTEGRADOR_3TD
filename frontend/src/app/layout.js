import "./globals.css";
<<<<<<< HEAD
import Navbar from "@/components/header/Navbar";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados."
=======

export const metadata = {
  title: "Projeto Base",
  description: "Template base com Next.js, Express e MySQL",
>>>>>>> b4c3445aa3cab8a9026e887a4387af9de6392fc5
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
<<<<<<< HEAD
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
          <div className="container footer-bottom"><span>© {new Date().getFullYear()} Lumora. Todos os direitos reservados.</span><span>Smart buildings. Better decisions.</span></div>
        </footer>
      </body>
    </html>
  );
}
=======
      <body>{children}</body>
    </html>
  );
}
>>>>>>> b4c3445aa3cab8a9026e887a4387af9de6392fc5

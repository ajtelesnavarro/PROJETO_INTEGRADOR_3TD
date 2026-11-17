'use client';
import Link from "next/link";
import "./footer.css"
import Image from "next/image";

export default function Footer() {

  return (
    <footer className="footer">
          <div className="container footer-main">
            <div className="footer-brand">
              <div className="footer-images">
                  <Image
                    src="/images/logo.png"
                    alt="Símbolo Lumora"
                    width={70}
                    height={60}
                    className="logo-simbolo"
                    priority
                  />
                  <Image
                    src="/images/logotipo.png"
                    alt="Lumora"
                    width={140}
                    height={60}
                    className="logo-nome"
                    priority
                  />
              </div>
              <p>Inteligência que transforma edifícios.<br/>Tecnologia, pessoas e infraestrutura em sintonia.</p></div>
            <div className="footer-column"><b>Explorar</b><Link href="/">Início</Link><Link href="/public/sobre">Sobre nós</Link><Link href="/public/solucoes">Soluções</Link><Link href="/public/tecnologia">Nossa tecnologia</Link></div>
            <div className="footer-column"><b>Comece por aqui</b><Link href="/public/orcamento">Solicitar orçamento</Link><Link href="/login">Acessar plataforma</Link></div>
            <div className="footer-note"><span className="footer-status"><i/> TECNOLOGIA PARA EDIFÍCIOS</span><p>Uma operação mais conectada começa com uma boa conversa.</p><Link href="/public/orcamento">Fale com a Lumora ↗</Link></div>
          </div>
          <div className="container footer-bottom"><span>© {new Date().getFullYear()} Lumora. Todos os direitos reservados.</span><span>Smart buildings. Better decisions.</span></div>
        </footer>
  );
}
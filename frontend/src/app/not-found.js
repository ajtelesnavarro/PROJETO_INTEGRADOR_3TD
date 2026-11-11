import Link from "next/link";
export default function NotFound() {
  return <main className="not-found"><div className="container"><span className="section-kicker">ERRO 404</span><h1>Este caminho não está no mapa.</h1><p>A página que você procura pode ter mudado de endereço ou não estar disponível.</p><Link href="/" className="button primary">Voltar para o início →</Link></div></main>;
}

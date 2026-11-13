import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer"

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
        <Footer />
      </body>
    </html>
  );
}
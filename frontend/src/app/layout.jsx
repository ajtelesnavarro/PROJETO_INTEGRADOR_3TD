import "./globals.css";
import Sidebar from "@/componets/Sidebar";

export const metadata = {
  title: "Projeto Base",
  description: "Template base com Next.js, Express e MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="app-container">
          <Sidebar/>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

import "./globals.css";
import SideBar from "./components/SideBar";

export const metadata = {
  title: "Projeto Base",
  description: "Template base com Next.js, Express e MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="./globals.css" />
      </head>
      <body>
        
        {children}</body>
    </html>
  );
}

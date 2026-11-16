import "./globals.css";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
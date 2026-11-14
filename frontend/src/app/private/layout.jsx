import { redirect } from "next/navigation";
import Header from "@/components/PrivateHeader";
import Sidebar from "@/components/PrivateSidebar";
import "./layout.css";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados.",
};

export default async function PrivateLayout({ children }) {
  // const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <html lang="pt-BR">
      <body>
        <div className="private-layout">
          <Sidebar />

          <div className="private-main">
            <Header user={user} />

            <main className="private-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
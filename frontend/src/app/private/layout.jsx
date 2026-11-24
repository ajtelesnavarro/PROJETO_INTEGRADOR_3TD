import PrivateLayoutClient from "@/components/PrivateLayoutClient/index";
import RoleGuard from "@/components/RoleGuard";
import "./layout.css";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados.",
};

export default function PrivateLayout({ children }) {
  return (
    <PrivateLayoutClient>
      <RoleGuard>{children}</RoleGuard>
    </PrivateLayoutClient>
  );
}

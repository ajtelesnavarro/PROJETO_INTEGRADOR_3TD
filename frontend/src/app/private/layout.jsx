import PrivateLayoutClient from "@/components/PrivateLayoutClient/index";
import "./layout.css";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados.",
};

export default function PrivateLayout({ children }) {
  return (
    <PrivateLayoutClient>
      {children}
    </PrivateLayoutClient>
  );
}
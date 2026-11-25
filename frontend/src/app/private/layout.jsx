import PrivateLayoutClient from "@/components/PrivateLayoutClient/index";
<<<<<<< HEAD
=======
import RoleGuard from "@/components/RoleGuard";
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
import "./layout.css";

export const metadata = {
  title: "Lumora — Smart Buildings",
  description: "Inteligência para edifícios mais eficientes, seguros e conectados.",
};

export default function PrivateLayout({ children }) {
  return (
    <PrivateLayoutClient>
<<<<<<< HEAD
      {children}
    </PrivateLayoutClient>
  );
}
=======
      <RoleGuard>{children}</RoleGuard>
    </PrivateLayoutClient>
  );
}
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

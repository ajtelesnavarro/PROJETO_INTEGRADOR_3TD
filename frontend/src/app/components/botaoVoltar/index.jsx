"use client";

import { useRouter } from "next/navigation";

export default function BotaoVoltar() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      Voltar
    </button>
  );
}
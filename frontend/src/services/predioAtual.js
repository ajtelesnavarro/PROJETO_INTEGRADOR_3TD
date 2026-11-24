export function obterPredioAtual() {
  if (typeof window === "undefined") return null;

  try {
    const predio = JSON.parse(sessionStorage.getItem("lumora_predio_atual") || "null");
    return predio?.id_predio ? predio : null;
  } catch {
    return null;
  }
}

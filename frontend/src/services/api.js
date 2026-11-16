const API_URL =
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");

export async function requisicaoAPI(endpoint, opcoes = {}) {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("lumora_token")
            : null;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opcoes.headers
    };

    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        headers
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(
            dados.erro || dados.mensagem || dados.message || "Erro na requisi??o."
        );
    }

    return dados;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function requisicaoAPI(endpoint, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...opcoes.headers
        }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || dados.erro || "Erro na requisição."
        );
    }

    return dados;
}

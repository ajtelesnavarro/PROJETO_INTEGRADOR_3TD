const API_URL = "http://localhost:3000/api/v1";

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
        throw new Error(dados.mensagem || "Erro na requisição.");
    }

    return dados;
}
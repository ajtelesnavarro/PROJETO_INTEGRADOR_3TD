import "dotenv/config";

import app from "./app.js";
import {
    carregarAmbiente,
    exibirDiagnostico
} from "./config/ambiente.js";

// Carrega e valida as configurações
const configuracao = carregarAmbiente();

// Exibe informações do ambiente
exibirDiagnostico(configuracao);

// Inicia a API
app.listen(configuracao.porta, () => {
    console.log(`API running on port ${configuracao.porta}`);
});
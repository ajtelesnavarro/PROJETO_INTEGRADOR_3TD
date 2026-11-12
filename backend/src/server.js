import app from "./app.js";
import {
    carregarAmbiente,
    exibirDiagnostico
} from "./config/ambiente.js";
import { checkDatabaseConnection } from "./config/database.js";

// Carrega e valida as configurações
const configuracao = carregarAmbiente(".env");

// Exibe informações do ambiente
exibirDiagnostico(configuracao);

// Verifica a conexão com o banco e dispara erro real se falhar
const bancoConectado = await checkDatabaseConnection();

if (!bancoConectado) {
    throw new Error("Falha crítica: Não foi possível conectar ao banco de dados MySQL. Verifique o serviço e as variáveis do .env.");
}

console.log("Database connected successfully.");

// Inicia a API
app.listen(configuracao.porta, () => {
    console.log(`API running on port ${configuracao.porta}`);
});
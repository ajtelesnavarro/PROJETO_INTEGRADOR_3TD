import "dotenv/config";

import app from "./app.js";

// Carrega e valida as configurações
const porta = Number(process.env.PORT || 8080);


// Inicia a API
app.listen(porta, () => {
    console.log(`API running on port ${porta}`);
});
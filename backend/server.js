
import { carregarAmbiente } from './config/ambiente.js';
import { criarPool } from './config/database.js';

async function iniciarServidor() {
    try {
        // Carrega as variáveis de ambiente
        const config = carregarAmbiente('.env');

        // Importa a aplicação após carregar o ambiente
        const { app } = await import('./app.js');

        // Inicializa e testa a conexão com o banco
        const pool = criarPool();

        await pool.query('SELECT 1');

        console.log('Conexão com o banco de dados estabelecida.');

        // Define a porta
        const porta = config.porta || 3001;

        // Inicia o servidor
        const servidor = app.listen(porta, '0.0.0.0', () => {
            console.log(
                `Lumora SmartBuilding API rodando na porta ${porta}`
            );
        });

        return servidor;

    } catch (erro) {
    console.error('Erro ao iniciar o Lumora SmartBuilding:');
    console.error(erro);
    process.exitCode = 1;
}
}

iniciarServidor();

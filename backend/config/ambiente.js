const nomesObrigatorios = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET'
];

export function carregarAmbiente(arquivoDeConfiguracao = '.env') {
    try {
        process.loadEnvFile(arquivoDeConfiguracao);
    } catch (erro) {
        if (erro.code !== 'ENOENT') {
            throw new Error(
                `Erro ao carregar arquivo de configuração: ${arquivoDeConfiguracao}`
            );
        }
    }

    const ausentes = nomesObrigatorios.filter((nome) => {
        const valor = process.env[nome];

        return typeof valor !== 'string' || valor.trim() === '';
    });

    if (ausentes.length > 0) {
        throw new Error(
            `Configure as seguintes variáveis: ${ausentes.join(', ')}`
        );
    }

    if (process.env.JWT_SECRET.trim().length < 32) {
        throw new Error(
            'JWT_SECRET deve possuir pelo menos 32 caracteres.'
        );
    }

    const portaBanco = Number(process.env.DB_PORT);

    if (
        !Number.isInteger(portaBanco) ||
        portaBanco < 1 ||
        portaBanco > 65535
    ) {
        throw new Error('A porta do banco de dados é inválida.');
    }

    const porta = Number(process.env.PORT || 3001);

    if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
        throw new Error('A porta configurada é inválida.');
    }

    const ambiente = process.env.NODE_ENV || 'development';

    if (!['development', 'production', 'test'].includes(ambiente)) {
        throw new Error('NODE_ENV possui um valor inválido.');
    }

    return {
        porta,
        ambiente
    };
}

export function exibirDiagnostico(configuracao) {
    console.table({
        projeto: 'Lumora SmartBuilding',
        node: process.version,
        sistema: `${process.platform} ${process.arch}`,
        diretorio: process.cwd(),
        portaConfigurada: configuracao.porta,
        ambiente: configuracao.ambiente
    });
}


import { recursos } from './RecursoConfig.js';

// Valida identificadores
export function validarId(valor, campo = 'ID') {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError(
            `${campo} deve ser um número inteiro positivo.`
        );
    }

    return id;
}

// Valida valores numéricos
export function validarNumero(valor, campo) {
    const numero = Number(valor);

    if (
        valor === null ||
        valor === undefined ||
        valor === '' ||
        !Number.isFinite(numero)
    ) {
        throw new TypeError(
            `${campo} deve ser um número válido.`
        );
    }

    return numero;
}

// Valida datas
export function validarData(valor, campo) {
    if (
        valor === undefined ||
        valor === null ||
        valor === ''
    ) {
        return null;
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        throw new TypeError(
            `${campo} deve ser uma data válida.`
        );
    }

    return valor;
}

// Ajusta data final para incluir o dia inteiro
export function ajustarDataFim(valor) {
    if (
        typeof valor === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ) {
        return `${valor} 23:59:59`;
    }

    return valor;
}

// Valida intervalo de datas
export function validarPeriodo(query = {}) {
    const dataInicio = validarData(
        query.dataInicio,
        'dataInicio'
    );

    const dataFim = validarData(
        query.dataFim,
        'dataFim'
    );

    if (
        dataInicio &&
        dataFim &&
        new Date(dataInicio) > new Date(dataFim)
    ) {
        throw new TypeError(
            'A data inicial não pode ser posterior à data final.'
        );
    }

    return {
        dataInicio,
        dataFim: ajustarDataFim(dataFim)
    };
}

// Valida paginação
export function validarPaginacao(query = {}) {
    const pagina = Number(query.pagina || 1);
    const limite = Number(query.limite || 50);

    if (!Number.isInteger(pagina) || pagina < 1) {
        throw new TypeError(
            'Página deve ser um número inteiro positivo.'
        );
    }

    if (
        !Number.isInteger(limite) ||
        limite < 1 ||
        limite > 200
    ) {
        throw new TypeError(
            'O limite deve estar entre 1 e 200.'
        );
    }

    return {
        pagina,
        limite,
        offset: (pagina - 1) * limite
    };
}

// Prepara e valida dados recebidos
export function preparar(
    config,
    dados,
    parcial = false
) {
    if (
        !dados ||
        typeof dados !== 'object' ||
        Array.isArray(dados)
    ) {
        throw new TypeError(
            'O corpo deve ser um objeto JSON.'
        );
    }

    const resultado = {};

    for (const [campo, valor] of Object.entries(dados)) {
        if (!config.campos.includes(campo)) {
            throw new TypeError(
                `Campo não permitido: ${campo}.`
            );
        }

        resultado[campo] = valor;
    }

    // Verifica campos obrigatórios
    if (!parcial) {
        for (const campo of config.obrigatorios) {
            if (
                resultado[campo] === undefined ||
                resultado[campo] === null ||
                resultado[campo] === ''
            ) {
                throw new TypeError(
                    `Campo obrigatório: ${campo}.`
                );
            }
        }
    }

    // Valida identificadores estrangeiros
    const camposId = [
        'id_predio',
        'id_andar',
        'id_ambiente',
        'id_dispositivo',
        'id_credencial',
        'id_usuario_responsavel'
    ];

    for (const campo of camposId) {
        if (
            resultado[campo] !== undefined &&
            resultado[campo] !== null &&
            resultado[campo] !== ''
        ) {
            resultado[campo] = validarId(
                resultado[campo],
                campo
            );
        }
    }

    // Valida capacidade
    if (
        resultado.capacidade_maxima !== undefined &&
        resultado.capacidade_maxima !== null
    ) {
        resultado.capacidade_maxima = validarNumero(
            resultado.capacidade_maxima,
            'capacidade_maxima'
        );

        if (resultado.capacidade_maxima < 0) {
            throw new TypeError(
                'A capacidade máxima não pode ser negativa.'
            );
        }
    }

    // Valida potência nominal
    if (
        resultado.potencia_nominal_kw !== undefined &&
        resultado.potencia_nominal_kw !== null
    ) {
        resultado.potencia_nominal_kw = validarNumero(
            resultado.potencia_nominal_kw,
            'potencia_nominal_kw'
        );

        if (resultado.potencia_nominal_kw < 0) {
            throw new TypeError(
                'A potência nominal não pode ser negativa.'
            );
        }
    }

    // Valida status de ocorrência
    if (
        resultado.status !== undefined &&
        !['Aberta', 'Em Atendimento', 'Resolvida']
            .includes(resultado.status)
    ) {
        throw new TypeError(
            'Status de ocorrência inválido.'
        );
    }

    return resultado;
}

// Obtém configuração de um recurso
export function obterConfig(nome) {
    const config = recursos[nome];

    if (!config) {
        throw new TypeError(
            'Recurso não encontrado.'
        );
    }

    return config;
}

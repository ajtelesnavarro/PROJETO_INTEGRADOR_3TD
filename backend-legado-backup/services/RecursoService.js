
import * as Model from '../models/RecursoModel.js';

export const recursos = {
    predios: {
        tabela: 'predios',
        id: 'id',
        campos: [
            'nome', 'descricao', 'logradouro', 'numero', 'complemento',
            'bairro', 'cidade', 'estado', 'cep', 'responsavel_id', 'ativo'
        ],
        obrigatorios: ['nome', 'logradouro', 'cidade', 'estado'],
        adminEscrita: true
    },

    ambientes: {
        tabela: 'ambientes',
        id: 'id',
        campos: [
            'predio_id', 'nome', 'tipo', 'andar',
            'descricao', 'responsavel_id', 'status'
        ],
        obrigatorios: ['predio_id', 'nome', 'tipo'],
        adminEscrita: true
    },

    dispositivos: {
        tabela: 'dispositivos',
        id: 'id',
        campos: [
            'ambiente_id', 'nome', 'tipo', 'identificador',
            'unidade', 'status', 'limite_minimo',
            'limite_maximo', 'responsavel_id'
        ],
        obrigatorios: ['ambiente_id', 'nome', 'tipo', 'status'],
        adminEscrita: true
    },

    leituras: {
        tabela: 'leituras',
        id: 'id',
        campos: [
            'dispositivo_id', 'ambiente_id', 'tipo',
            'valor', 'unidade', 'data_hora', 'origem'
        ],
        obrigatorios: ['ambiente_id', 'tipo', 'valor'],
        adminEscrita: false
    },

    acessos: {
        tabela: 'acessos',
        id: 'id',
        campos: [
            'ambiente_id', 'usuario_id', 'nome_visitante',
            'documento', 'tipo_evento', 'decisao',
            'observacao', 'data_hora'
        ],
        obrigatorios: ['ambiente_id', 'tipo_evento', 'decisao'],
        adminEscrita: false
    },

    ocorrencias: {
        tabela: 'ocorrencias',
        id: 'id',
        campos: [
            'ambiente_id', 'dispositivo_id', 'titulo',
            'descricao', 'estado', 'prioridade',
            'responsavel_id', 'criado_por', 'resolvida_em'
        ],
        obrigatorios: ['titulo', 'descricao'],
        adminEscrita: false
    }
};

// Valida identificadores
function validarId(idRecebido) {
    const id = Number(idRecebido);

    if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError(
            'Identificador deve ser um número inteiro positivo.'
        );
    }

    return id;
}

// Valida datas
function validarData(valor, campo) {
    if (valor === undefined || valor === null || valor === '') {
        return null;
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        throw new TypeError(`${campo} deve ser uma data válida.`);
    }

    return valor;
}

// Ajusta data final para incluir o dia inteiro
function ajustarDataFim(valor) {
    return typeof valor === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(valor)
        ? `${valor} 23:59:59`
        : valor;
}

// Obtém configuração do recurso
function obterConfig(nome) {
    const config = recursos[nome];

    if (!config) {
        throw new TypeError('Recurso não encontrado.');
    }

    return config;
}

// Prepara e valida dados recebidos
function preparar(config, dados, parcial = false) {
    if (
        !dados ||
        typeof dados !== 'object' ||
        Array.isArray(dados)
    ) {
        throw new TypeError('O corpo deve ser um objeto JSON.');
    }

    const resultado = {};

    for (const [campo, valor] of Object.entries(dados)) {
        if (!config.campos.includes(campo)) {
            throw new TypeError(`Campo não permitido: ${campo}.`);
        }

        resultado[campo] = valor;
    }

    if (!parcial) {
        for (const campo of config.obrigatorios) {
            if (
                resultado[campo] === undefined ||
                resultado[campo] === null ||
                resultado[campo] === ''
            ) {
                throw new TypeError(`Campo obrigatório: ${campo}.`);
            }
        }
    }

    if (
        resultado.estado &&
        !['Aberta', 'Em Atendimento', 'Resolvida'].includes(resultado.estado)
    ) {
        throw new TypeError('Estado de ocorrência inválido.');
    }

    for (const campo of [
        'predio_id',
        'ambiente_id',
        'dispositivo_id',
        'responsavel_id',
        'usuario_id'
    ]) {
        if (
            resultado[campo] !== undefined &&
            resultado[campo] !== null &&
            (!Number.isInteger(Number(resultado[campo])) ||
                Number(resultado[campo]) <= 0)
        ) {
            throw new TypeError(
                `O campo ${campo} deve ser um identificador inteiro positivo.`
            );
        }
    }

    if (
        resultado.valor !== undefined &&
        !Number.isFinite(Number(resultado.valor))
    ) {
        throw new TypeError('O valor da leitura deve ser numérico.');
    }

    for (const campo of ['limite_minimo', 'limite_maximo']) {
        if (
            resultado[campo] !== undefined &&
            resultado[campo] !== null &&
            resultado[campo] !== '' &&
            !Number.isFinite(Number(resultado[campo]))
        ) {
            throw new TypeError(`${campo} deve ser um número válido.`);
        }
    }

    if (
        resultado.limite_minimo != null &&
        resultado.limite_minimo !== '' &&
        resultado.limite_maximo != null &&
        resultado.limite_maximo !== '' &&
        Number(resultado.limite_minimo) > Number(resultado.limite_maximo)
    ) {
        throw new TypeError(
            'O limite mínimo não pode ser maior que o limite máximo.'
        );
    }

    return resultado;
}

// 1. Listagem com filtros e paginação
export async function listar(nome, query = {}) {
    const config = obterConfig(nome);

    const pagina = Number(query.pagina || 1);
    const limite = Number(query.limite || 50);

    if (!Number.isInteger(pagina) || pagina < 1) {
        throw new TypeError(
            'Página deve ser um número inteiro positivo.'
        );
    }

    if (!Number.isInteger(limite) || limite < 1 || limite > 200) {
        throw new TypeError(
            'Limite deve ser um inteiro entre 1 e 200.'
        );
    }

    const filtros = {};

    if (query.ambienteId && config.campos.includes('ambiente_id')) {
        filtros.ambiente_id = validarId(query.ambienteId);
    }

    if (query.predioId && config.campos.includes('predio_id')) {
        filtros.predio_id = validarId(query.predioId);
    }

    if (query.tipo && config.campos.includes('tipo')) {
        filtros.tipo = query.tipo;
    }

    if (query.estado && config.campos.includes('estado')) {
        filtros.estado = query.estado;
    }

    if (query.status && config.campos.includes('status')) {
        filtros.status = query.status;
    }

    if (query.dataInicio || query.dataFim) {
        validarData(query.dataInicio, 'dataInicio');
        validarData(query.dataFim, 'dataFim');

        if (
            query.dataInicio &&
            query.dataFim &&
            new Date(query.dataInicio) > new Date(query.dataFim)
        ) {
            throw new TypeError(
                'dataInicio não pode ser posterior a dataFim.'
            );
        }

        const campoData =
            nome === 'leituras' || nome === 'acessos'
                ? 'data_hora'
                : 'criado_em';

        const condicoes = [];

        if (query.dataInicio) {
            condicoes.push({
                campo: `${campoData}_inicio`,
                valor: query.dataInicio
            });
        }

        if (query.dataFim) {
            condicoes.push({
                campo: `${campoData}_fim`,
                valor: ajustarDataFim(query.dataFim)
            });
        }

        filtros.__periodo = condicoes;
    }

    const offset = (pagina - 1) * limite;

    const resultado = await Model.listar(
        config,
        filtros,
        { limite, offset }
    );

    return {
        dados: resultado.dados,
        paginacao: {
            pagina,
            limite,
            total: resultado.total,
            totalPaginas: Math.ceil(resultado.total / limite)
        }
    };
}

// 2. Busca por ID
export async function buscar(nome, idRecebido) {
    const config = obterConfig(nome);
    const id = validarId(idRecebido);

    const registro = await Model.buscar(config, id);

    if (!registro) {
        const erro = new Error(`Registro ${id} não encontrado.`);
        erro.status = 404;
        throw erro;
    }

    return registro;
}

// 3. Criação de registros
export async function criar(nome, dados, usuario) {
    const config = obterConfig(nome);
    const dadosValidados = preparar(config, dados);

    // Leituras inseridas manualmente
    if (nome === 'leituras') {
        dadosValidados.data_hora =
            dadosValidados.data_hora || new Date();

        dadosValidados.origem = 'manual';

        let dispositivo = null;

        if (dadosValidados.dispositivo_id) {
            dispositivo = await Model.buscar(
                recursos.dispositivos,
                validarId(dadosValidados.dispositivo_id)
            );

            if (!dispositivo) {
                const erro = new Error('Dispositivo não encontrado.');
                erro.status = 404;
                throw erro;
            }

            if (
                Number(dispositivo.ambiente_id) !==
                Number(dadosValidados.ambiente_id)
            ) {
                throw new TypeError(
                    'O dispositivo não pertence ao ambiente informado.'
                );
            }
        }

        const leitura = await Model.criar(config, dadosValidados);

        // Verificação automática dos limites
        if (dispositivo) {
            const valor = Number(dadosValidados.valor);

            const abaixoMinimo =
                dispositivo.limite_minimo != null &&
                valor < Number(dispositivo.limite_minimo);

            const acimaMaximo =
                dispositivo.limite_maximo != null &&
                valor > Number(dispositivo.limite_maximo);

            if (abaixoMinimo || acimaMaximo) {
                const motivo = abaixoMinimo
                    ? 'abaixo do limite mínimo'
                    : 'acima do limite máximo';

                await Model.criar(recursos.ocorrencias, {
                    ambiente_id: dadosValidados.ambiente_id,
                    dispositivo_id: dispositivo.id,
                    titulo: `Alerta automático: ${dispositivo.nome}`,
                    descricao:
                        `Leitura de ${dadosValidados.tipo} com valor ${valor} ` +
                        `${dadosValidados.unidade || ''}, ${motivo}. ` +
                        `Limite mínimo: ${dispositivo.limite_minimo ?? 'Não definido'}. ` +
                        `Limite máximo: ${dispositivo.limite_maximo ?? 'Não definido'}.`,
                    estado: 'Aberta'
                });
            }
        }

        return leitura;
    }

    // Registro de acessos
    if (nome === 'acessos') {
        dadosValidados.data_hora =
            dadosValidados.data_hora || new Date();
    }

    // Registro de ocorrências
    if (nome === 'ocorrencias') {
        if (!usuario?.id) {
            throw new TypeError(
                'Usuário autenticado não identificado.'
            );
        }

        if (!dadosValidados.estado) {
            dadosValidados.estado = 'Aberta';
        }

        dadosValidados.criado_por = usuario.id;
    }

    return await Model.criar(config, dadosValidados);
}

// 4. Atualização
export async function atualizar(nome, idRecebido, dados) {
    const config = obterConfig(nome);
    const id = validarId(idRecebido);

    if (
        nome === 'ocorrencias' &&
        Object.keys(dados || {}).some(
            campo => !['estado', 'responsavel_id'].includes(campo)
        )
    ) {
        throw new TypeError(
            'Ocorrências permitem atualizar somente estado e responsável.'
        );
    }

    const dadosValidados = preparar(config, dados, true);

    if (Object.keys(dadosValidados).length === 0) {
        throw new TypeError(
            'Informe pelo menos um campo para atualizar.'
        );
    }

    // Validação dos limites usando também os valores já cadastrados
    if (
        nome === 'dispositivos' &&
        (
            dadosValidados.limite_minimo !== undefined ||
            dadosValidados.limite_maximo !== undefined
        )
    ) {
        const dispositivoAtual = await Model.buscar(config, id);

        if (!dispositivoAtual) {
            const erro = new Error(`Registro ${id} não encontrado.`);
            erro.status = 404;
            throw erro;
        }

        const minimo =
            dadosValidados.limite_minimo !== undefined
                ? dadosValidados.limite_minimo
                : dispositivoAtual.limite_minimo;

        const maximo =
            dadosValidados.limite_maximo !== undefined
                ? dadosValidados.limite_maximo
                : dispositivoAtual.limite_maximo;

        if (
            minimo != null &&
            minimo !== '' &&
            maximo != null &&
            maximo !== '' &&
            Number(minimo) > Number(maximo)
        ) {
            throw new TypeError(
                'O limite mínimo não pode ser maior que o limite máximo.'
            );
        }
    }

    if (
        nome === 'ocorrencias' &&
        dadosValidados.estado === 'Resolvida'
    ) {
        dadosValidados.resolvida_em = new Date();
    }

    const atualizou = await Model.atualizar(
        config,
        id,
        dadosValidados
    );

    if (!atualizou) {
        const erro = new Error(`Registro ${id} não encontrado.`);
        erro.status = 404;
        throw erro;
    }

    return await buscar(nome, id);
}

// 5. Remoção
export async function excluir(nome, idRecebido) {
    const config = obterConfig(nome);
    const id = validarId(idRecebido);

    const removeu = await Model.excluir(config, id);

    if (!removeu) {
        const erro = new Error(`Registro ${id} não encontrado.`);
        erro.status = 404;
        throw erro;
    }
}

// 6. Relatórios
export async function relatorios(query = {}) {
    validarData(query.dataInicio, 'dataInicio');
    validarData(query.dataFim, 'dataFim');

    if (
        query.dataInicio &&
        query.dataFim &&
        new Date(query.dataInicio) > new Date(query.dataFim)
    ) {
        throw new TypeError(
            'dataInicio não pode ser posterior a dataFim.'
        );
    }

    return await Model.relatorios({
        ambienteId: query.ambienteId
            ? validarId(query.ambienteId)
            : null,
        dataInicio: query.dataInicio || null,
        dataFim: query.dataFim
            ? ajustarDataFim(query.dataFim)
            : null
    });
}

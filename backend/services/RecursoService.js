import * as Model from '../models/RecursoModel.js';


export const recursos = {
    predios: {
        tabela: 'predio',
        id: 'id_predio',
        campos: [
            'nome_predio',
            'cep',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado'
        ],
        obrigatorios: [
            'nome_predio',
            'cep',
            'logradouro',
            'numero',
            'bairro',
            'cidade',
            'estado'
        ],
        adminEscrita: true
    },

    andares: {
        tabela: 'andar',
        id: 'id_andar',
        campos: [
            'id_predio',
            'numero_andar',
            'descricao',
            'data_cadastro'
        ],
        obrigatorios: [
            'id_predio',
            'numero_andar'
        ],
        adminEscrita: true
    },

    ambientes: {
        tabela: 'ambiente',
        id: 'id_ambiente',
        campos: [
            'id_andar',
            'id_setor',
            'nome',
            'localizacao',
            'capacidade_maxima',
            'horario_abertura',
            'horario_fechamento',
            'requer_reserva'
        ],
        obrigatorios: [
            'id_andar',
            'nome'
        ],
        adminEscrita: true
    },

    dispositivos: {
        tabela: 'dispositivo',
        id: 'id_dispositivo',
        campos: [
            'id_ambiente',
            'id_usuario',
            'nome',
            'tipo_dispositivo',
            'fabricante',
            'modelo',
            'unidade_medida',
            'potencia_nominal_kw',
            'data_dispositivo',
            'identificador',
            'status_dispositivo'
        ],
        obrigatorios: [
            'id_ambiente',
            'nome',
            'tipo_dispositivo',
            'identificador'
        ],
        adminEscrita: true
    },

    acessos: {
        tabela: 'eventos_acessos',
        id: 'id_evento',
        campos: [
            'id_credencial',
            'id_ambiente',
            'tipo_acesso',
            'decisao_acesso',
            'token_tentado',
            'status_evento',
            'data_expiracao',
            'data_utilizacao',
            'motivo'
        ],
        obrigatorios: [
            'id_ambiente',
            'tipo_acesso',
            'decisao_acesso',
            'status_evento'
        ],
        adminEscrita: false
    },

    ocorrencias: {
        tabela: 'ocorrencia',
        id: 'id_ocorrencia',
        campos: [
            'id_dispositivo',
            'id_equipe_responsavel',
            'id_tecnico_responsavel',
            'titulo',
            'descricao',
            'status_ocorrencia',
            'prioridade',
            'data_ocorrencia',
            'resolvida_em'
        ],
        obrigatorios: [
            'id_dispositivo',
            'titulo',
            'descricao'
        ],
        adminEscrita: false
    },

    leituras: {
        tabela: null,
        id: null,
        campos: [],
        obrigatorios: [],
        adminEscrita: false
    }
};


const statusOcorrencias = [
    'aberta',
    'em_andamento',
    'resolvida',
    'cancelada'
];

const camposId = [
    'id_predio',
    'id_andar',
    'id_setor',
    'id_ambiente',
    'id_dispositivo',
    'id_usuario',
    'id_credencial',
    'id_tarifa',
    'id_equipe_responsavel',
    'id_tecnico_responsavel'
];

const camposNumericos = [
    'numero_andar',
    'capacidade_maxima',
    'potencia_nominal_kw',
    'temperatura_minima',
    'temperatura_maxima',
    'iluminacao_minima',
    'iluminacao_maxima',
    'consumo_minimo',
    'consumo_maximo',
    'potencia_maxima',
    'valor_kwh',
    'consumo_kwh',
    'potencia_kw',
    'temperatura_medida',
    'umidade',
    'iluminacao_medida',
    'custo_estimado'
];

// Valida identificadores.
function validarId(valor, campo = 'ID') {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError(`${campo} deve ser um inteiro positivo.`);
    }

    return id;
}

// Valida datas.
function validarData(valor, campo) {
    if (valor === undefined || valor === null || valor === '') {
        return null;
    }

    if (Number.isNaN(new Date(valor).getTime())) {
        throw new TypeError(`${campo} deve ser uma data válida.`);
    }

    return valor;
}

// Inclui o dia inteiro no filtro final.
function ajustarDataFim(valor) {
    if (
        typeof valor === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ) {
        return `${valor} 23:59:59`;
    }

    return valor;
}

// Valida intervalo de datas.
function validarPeriodo(dataInicio, dataFim) {
    validarData(dataInicio, 'dataInicio');
    validarData(dataFim, 'dataFim');

    if (
        dataInicio &&
        dataFim &&
        new Date(dataInicio) > new Date(dataFim)
    ) {
        throw new TypeError(
            'dataInicio não pode ser posterior a dataFim.'
        );
    }
}

// Valida os dados de um recurso.
function preparar(config, dados, parcial = false) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new TypeError('Envie um objeto JSON válido.');
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

    for (const campo of camposId) {
        if (resultado[campo] !== undefined && resultado[campo] !== null) {
            resultado[campo] = validarId(resultado[campo], campo);
        }
    }

    for (const campo of camposNumericos) {
        if (
            resultado[campo] !== undefined &&
            resultado[campo] !== null &&
            resultado[campo] !== ''
        ) {
            const numero = Number(resultado[campo]);

            if (!Number.isFinite(numero)) {
                throw new TypeError(`${campo} deve ser numérico.`);
            }

            resultado[campo] = numero;
        }
    }

    if (
        resultado.capacidade_maxima != null &&
        resultado.capacidade_maxima <= 0
    ) {
        throw new TypeError('A capacidade máxima deve ser maior que zero.');
    }

    if (
    config.tabela === 'ocorrencia' &&
    resultado.prioridade !== undefined &&
    !prioridadesOcorrencias.includes(resultado.prioridade)
    ) {
    throw new TypeError('Prioridade de ocorrência inválida.');
    }

    if (
        resultado.potencia_nominal_kw != null &&
        resultado.potencia_nominal_kw < 0
    ) {
        throw new TypeError('A potência nominal não pode ser negativa.');
    }

    if (
        config.tabela === 'ocorrencia' &&
        resultado.status_ocorrencia !== undefined &&
        !statusOcorrencias.includes(resultado.status_ocorrencia)
    ) {
        throw new TypeError('Status de ocorrência inválido.');
    }

    for (const campo of [
        'data_andar',
        'data_dispositivo',
        'data_expiracao',
        'data_utilizacao',
        'data_ocorrencia',
        'resolvida_em'
    ]) {
        if (resultado[campo] !== undefined) {
            validarData(resultado[campo], campo);
        }
    }

    return resultado;
}

// Valida uma leitura manual.
function prepararLeitura(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new TypeError('Envie um objeto JSON válido.');
    }

    const tipo = String(dados.tipo || '').toLowerCase();

    const camposPorTipo = {
        temperatura: [
            'tipo', 'id_dispositivo', 'valor', 'umidade', 'data_hora'
        ],
        iluminacao: [
            'tipo', 'id_dispositivo', 'valor', 'data_hora'
        ],
        energia: [
            'tipo', 'id_dispositivo', 'valor', 'potencia_kw',
            'id_tarifa', 'qualidade_medicao', 'data_hora'
        ]
    };

    if (!camposPorTipo[tipo]) {
        throw new TypeError(
            'Tipo inválido. Use temperatura, iluminacao ou energia.'
        );
    }

    for (const campo of Object.keys(dados)) {
        if (!camposPorTipo[tipo].includes(campo)) {
            throw new TypeError(`Campo não permitido para leitura: ${campo}.`);
        }
    }

    if (
        dados.id_dispositivo === undefined ||
        dados.valor === undefined ||
        dados.valor === null ||
        dados.valor === ''
    ) {
        throw new TypeError('Informe o dispositivo e o valor da leitura.');
    }

    const resultado = { ...dados, tipo };

    resultado.id_dispositivo = validarId(
        resultado.id_dispositivo,
        'id_dispositivo'
    );

    resultado.valor = Number(resultado.valor);

    if (!Number.isFinite(resultado.valor)) {
        throw new TypeError('O valor da leitura deve ser numérico.');
    }

    if (tipo !== 'temperatura' && resultado.valor < 0) {
        throw new TypeError('O valor da leitura não pode ser negativo.');
    }

    if (tipo === 'temperatura' && resultado.umidade != null) {
        resultado.umidade = Number(resultado.umidade);

        if (
            !Number.isFinite(resultado.umidade) ||
            resultado.umidade < 0 ||
            resultado.umidade > 100
        ) {
            throw new TypeError('A umidade deve estar entre 0 e 100.');
        }
    }

    if (tipo === 'energia') {
        resultado.potencia_kw = Number(resultado.potencia_kw);

        if (
            !Number.isFinite(resultado.potencia_kw) ||
            resultado.potencia_kw < 0
        ) {
            throw new TypeError('Informe uma potência válida.');
        }

        if (resultado.id_tarifa != null) {
            resultado.id_tarifa = validarId(
                resultado.id_tarifa,
                'id_tarifa'
            );
        }
    }

    if (resultado.data_hora) {
        validarData(resultado.data_hora, 'data_hora');
    } else {
        resultado.data_hora = new Date();
    }

    return resultado;
}

// 1. Listar recursos.
export async function listar(nome, query = {}) {
    const config = recursos[nome];

    if (!config) {
        throw new TypeError('Recurso não encontrado.');
    }

    const pagina = Number(query.pagina || 1);
    const limite = Number(query.limite || 50);

    if (!Number.isInteger(pagina) || pagina < 1) {
        throw new TypeError('Página inválida.');
    }

    if (!Number.isInteger(limite) || limite < 1 || limite > 200) {
        throw new TypeError('Limite deve estar entre 1 e 200.');
    }

    validarPeriodo(query.dataInicio, query.dataFim);

    const offset = (pagina - 1) * limite;

    if (nome === 'leituras') {
        const resultado = await Model.listarLeituras({
            ambienteId: query.ambienteId
                ? validarId(query.ambienteId, 'ambienteId')
                : null,
            tipo: query.tipo || null,
            dataInicio: query.dataInicio || null,
            dataFim: query.dataFim
                ? ajustarDataFim(query.dataFim)
                : null,
            limite,
            offset
        });

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

    const filtros = {};

    const filtrosId = {
        predioId: 'id_predio',
        andarId: 'id_andar',
        ambienteId: 'id_ambiente',
        dispositivoId: 'id_dispositivo',
        usuarioId: 'id_usuario',
        credencialId: 'id_credencial'
    };

    for (const [parametro, campo] of Object.entries(filtrosId)) {
        if (query[parametro] && config.campos.includes(campo)) {
            filtros[campo] = validarId(query[parametro], parametro);
        }
    }

    if (query.tipo && config.campos.includes('tipo_dispositivo')) {
        filtros.tipo_dispositivo = query.tipo;
    }

    if (
        query.status &&
        config.campos.includes('status_ocorrencia')
    ) {
        filtros.status_ocorrencia = query.status;
    }

    const camposData = {
        andares: 'data_andar',
        dispositivos: 'data_dispositivo',
        acessos: 'data_utilizacao',
        ocorrencias: 'data_ocorrencia'
    };

    const campoData = camposData[nome];

    if (campoData && (query.dataInicio || query.dataFim)) {
        filtros.__periodo = [];

        if (query.dataInicio) {
            filtros.__periodo.push({
                campo: campoData,
                operador: '>=',
                valor: query.dataInicio
            });
        }

        if (query.dataFim) {
            filtros.__periodo.push({
                campo: campoData,
                operador: '<=',
                valor: ajustarDataFim(query.dataFim)
            });
        }
    }

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

// 2. Buscar registro.
export async function buscar(nome, id) {
    const config = recursos[nome];

    if (!config || nome === 'leituras') {
        throw new TypeError('Recurso inválido para busca.');
    }

    const registro = await Model.buscar(config, validarId(id));

    if (!registro) {
        const erro = new Error('Registro não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return registro;
}

// 3. Criar registro.
export async function criar(nome, dados, usuario) {
    if (nome === 'leituras') {
        const leitura = prepararLeitura(dados);

        const dispositivo = await Model.buscarDispositivo(
            leitura.id_dispositivo
        );

        if (!dispositivo) {
            const erro = new Error('Dispositivo não encontrado.');
            erro.status = 404;
            throw erro;
        }

        const registro = await Model.criarLeitura(
            leitura.tipo,
            leitura
        );

        // Verifica se a leitura ultrapassou os limites cadastrados.
        const limites = await Model.buscarLimites(
            leitura.id_dispositivo,
            leitura.tipo
        );

        if (limites) {
            const abaixoMinimo =
                limites.limite_minimo != null &&
                leitura.valor < Number(limites.limite_minimo);

            const acimaMaximo =
                limites.limite_maximo != null &&
                leitura.valor > Number(limites.limite_maximo);

            if (abaixoMinimo || acimaMaximo) {
                const aberta = await Model.buscarOcorrenciaAberta(
                    leitura.id_dispositivo
                );

                if (!aberta) {
                    await Model.criar(recursos.ocorrencias, {
                        id_dispositivo: leitura.id_dispositivo,
                        id_usuario: usuario?.id_usuario ?? usuario?.id ?? null,
                        titulo: `Alerta de ${leitura.tipo}`,
                        descricao: `Leitura ${leitura.valor} fora dos limites cadastrados.`,
                        origem: 'Automatica',
                        status_ocorrencia: 'Aberta',
                        prioridade: 'Media'
                    });
                }
            }
        }

        return registro;
    }

    const config = recursos[nome];

    if (!config) {
        throw new TypeError('Recurso não encontrado.');
    }

    const dadosValidados = preparar(config, dados);

    if (nome === 'acessos') {
        dadosValidados.data_utilizacao ||= new Date();
    }

    if (nome === 'ocorrencias') {
        const idUsuario = usuario?.id_usuario ?? usuario?.id;

        if (idUsuario) {
            dadosValidados.id_usuario = validarId(idUsuario, 'id_usuario');
        }

        dadosValidados.status_ocorrencia ||= 'Aberta';
        dadosValidados.prioridade ||= 'Media';
        dadosValidados.data_ocorrencia ||= new Date();

        const dispositivo = await Model.buscarDispositivo(
            dadosValidados.id_dispositivo
        );

        if (!dispositivo) {
            const erro = new Error('Dispositivo não encontrado.');
            erro.status = 404;
            throw erro;
        }
    }

    return await Model.criar(config, dadosValidados);
}

// 4. Atualizar registro.
export async function atualizar(nome, id, dados) {
    const config = recursos[nome];

    if (!config || nome === 'leituras') {
        throw new TypeError('Recurso inválido para atualização.');
    }

    if (nome === 'ocorrencias') {
        const permitidos = ['status_ocorrencia', 'prioridade'];

        for (const campo of Object.keys(dados || {})) {
            if (!permitidos.includes(campo)) {
                throw new TypeError(`Campo não permitido: ${campo}.`);
            }
        }
    }

    const dadosValidados = preparar(config, dados, true);

    if (Object.keys(dadosValidados).length === 0) {
        throw new TypeError('Informe pelo menos um campo para atualizar.');
    }

    if (nome === 'ocorrencias' && dadosValidados.status_ocorrencia) {
        dadosValidados.resolvida_em =
            dadosValidados.status_ocorrencia === 'Resolvida'
                ? new Date()
                : null;
    }

    const atualizou = await Model.atualizar(
        config,
        validarId(id),
        dadosValidados
    );

    if (!atualizou) {
        const erro = new Error('Registro não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return await buscar(nome, id);
}

// 5. Excluir registro.
export async function excluir(nome, id) {
    const config = recursos[nome];

    if (!config || nome === 'leituras') {
        throw new TypeError('Recurso inválido para exclusão.');
    }

    const removeu = await Model.excluir(config, validarId(id));

    if (!removeu) {
        const erro = new Error('Registro não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return true;
}

// 6. Gerar relatórios.
export async function relatorios(query = {}) {
    validarPeriodo(query.dataInicio, query.dataFim);

    return await Model.relatorios({
        ambienteId: query.ambienteId
            ? validarId(query.ambienteId, 'ambienteId')
            : null,
        dataInicio: query.dataInicio || null,
        dataFim: query.dataFim
            ? ajustarDataFim(query.dataFim)
            : null
    });
}
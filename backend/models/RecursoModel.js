
import { criarPool } from '../config/database.js';

const obterPool = () => criarPool();

// Tipos de leitura e respectivas tabelas
const tiposLeitura = {
    temperatura: {
        tabela: 'historico_temperatura',
        id: 'id_historico_temperatura',
        colunaValor: 'temperatura_medida',
        colunaData: 'data_temperatura',
        unidadePadrao: '°C'
    },
    iluminacao: {
        tabela: 'historico_iluminacao',
        id: 'id_historico_iluminacao',
        colunaValor: 'iluminacao_medida',
        colunaData: 'data_iluminacao',
        unidadePadrao: 'lux'
    },
    energia: {
        tabela: 'historico_energia',
        id: 'id_historico_energia',
        colunaValor: 'consumo_kwh',
        colunaData: 'data_historico_energia',
        unidadePadrao: 'kWh'
    }
};

function obterTipoLeitura(tipo) {
    const tipoNormalizado = String(tipo || '').toLowerCase();

    const config = tiposLeitura[tipoNormalizado];

    if (!config) {
        throw new TypeError(
            'Tipo de leitura inválido. Utilize temperatura, iluminacao ou energia.'
        );
    }

    return { tipo: tipoNormalizado, ...config };
}


// ========================================
// 1. LISTAGEM DE RECURSOS CADASTRAIS
// ========================================

export async function listar(
    config,
    filtros = {},
    { limite = 50, offset = 0 } = {}
) {
    const where = [];
    const valores = [];

    // Os campos utilizados devem vir de configurações
    // internas do sistema, nunca diretamente do usuário.
    const camposPermitidos = config.campos || [];

    for (const [campo, valor] of Object.entries(filtros)) {
        if (valor === undefined || valor === '') continue;

        if (campo === '__periodo') {
            for (const item of valor) {
                if (!camposPermitidos.includes(item.campo)) {
                    throw new TypeError('Campo de período não permitido.');
                }

                const operador = item.operador === '>=' ? '>=' : '<=';

                where.push(`\`${item.campo}\` ${operador} ?`);
                valores.push(item.valor);
            }

            continue;
        }

        if (!camposPermitidos.includes(campo)) {
            throw new TypeError(`Filtro não permitido: ${campo}.`);
        }

        where.push(`\`${campo}\` = ?`);
        valores.push(valor);
    }

    const clausula = where.length
        ? `WHERE ${where.join(' AND ')}`
        : '';

    const [dados] = await obterPool().query(
        `SELECT *
         FROM \`${config.tabela}\`
         ${clausula}
         ORDER BY \`${config.id}\` DESC
         LIMIT ? OFFSET ?`,
        [...valores, limite, offset]
    );

    const [[{ total }]] = await obterPool().query(
        `SELECT COUNT(*) AS total
         FROM \`${config.tabela}\`
         ${clausula}`,
        valores
    );

    return {
        dados,
        total: Number(total)
    };
}


// ========================================
// 2. BUSCA DE UM REGISTRO
// ========================================

export async function buscar(config, id) {
    const [linhas] = await obterPool().query(
        `SELECT *
         FROM \`${config.tabela}\`
         WHERE \`${config.id}\` = ?
         LIMIT 1`,
        [id]
    );

    return linhas[0] || null;
}


// ========================================
// 3. LISTAGEM DE LEITURAS
// ========================================

export async function listarLeituras({
    ambienteId = null,
    tipo = null,
    dataInicio = null,
    dataFim = null,
    limite = 50,
    offset = 0
} = {}) {
    const consultas = [];
    const valores = [];

    const tipos = tipo
        ? [obterTipoLeitura(tipo)]
        : Object.entries(tiposLeitura).map(
            ([nome, config]) => ({
                tipo: nome,
                ...config
            })
        );

    for (const config of tipos) {
        let sql = `
            SELECT
                h.${config.id} AS id,
                h.id_dispositivo AS dispositivo_id,
                d.id_ambiente AS ambiente_id,
                '${config.tipo}' AS tipo,
                h.${config.colunaValor} AS valor,
                d.unidade_medida AS unidade,
                h.${config.colunaData} AS data_hora
            FROM ${config.tabela} h
            INNER JOIN dispositivo d
                ON d.id_dispositivo = h.id_dispositivo
            WHERE 1 = 1
        `;

        if (ambienteId) {
            sql += ' AND d.id_ambiente = ?';
            valores.push(ambienteId);
        }

        if (dataInicio) {
            sql += ` AND h.${config.colunaData} >= ?`;
            valores.push(dataInicio);
        }

        if (dataFim) {
            sql += ` AND h.${config.colunaData} <= ?`;
            valores.push(dataFim);
        }

        consultas.push(sql);
    }

    const sqlFinal = `
        SELECT *
        FROM (${consultas.join(' UNION ALL ')}) AS leituras
        ORDER BY data_hora DESC
        LIMIT ? OFFSET ?
    `;

    const [dados] = await obterPool().query(
        sqlFinal,
        [...valores, limite, offset]
    );

    const sqlContagem = `
        SELECT COUNT(*) AS total
        FROM (${consultas.join(' UNION ALL ')}) AS leituras
    `;

    const [[{ total }]] = await obterPool().query(
        sqlContagem,
        valores
    );

    return {
        dados,
        total: Number(total)
    };
}


// ========================================
// 4. BUSCA DE UMA LEITURA
// ========================================

export async function buscarLeitura(tipo, id) {
    const config = obterTipoLeitura(tipo);

    const [linhas] = await obterPool().query(
        `SELECT
            h.${config.id} AS id,
            h.id_dispositivo AS dispositivo_id,
            d.id_ambiente AS ambiente_id,
            ? AS tipo,
            h.${config.colunaValor} AS valor,
            d.unidade_medida AS unidade,
            h.${config.colunaData} AS data_hora
         FROM ${config.tabela} h
         INNER JOIN dispositivo d
            ON d.id_dispositivo = h.id_dispositivo
         WHERE h.${config.id} = ?
         LIMIT 1`,
        [config.tipo, id]
    );

    return linhas[0] || null;
}


// ========================================
// 5. INSERÇÃO DE LEITURAS MANUAIS
// ========================================

export async function criarLeitura(tipo, dados) {
    const config = obterTipoLeitura(tipo);

    let resultado;

    if (config.tipo === 'temperatura') {
        const [res] = await obterPool().query(
            `INSERT INTO historico_temperatura
                (id_dispositivo, temperatura_medida, umidade, data_temperatura)
             VALUES (?, ?, ?, ?)`,
            [
                dados.dispositivo_id,
                dados.valor,
                dados.umidade ?? null,
                dados.data_hora
            ]
        );

        resultado = res;
    }

    if (config.tipo === 'iluminacao') {
        const [res] = await obterPool().query(
            `INSERT INTO historico_iluminacao
                (id_dispositivo, iluminacao_medida, data_iluminacao)
             VALUES (?, ?, ?)`,
            [
                dados.dispositivo_id,
                dados.valor,
                dados.data_hora
            ]
        );

        resultado = res;
    }

    if (config.tipo === 'energia') {
        if (!dados.tarifa_id) {
            throw new TypeError(
                'A tarifa de energia é obrigatória para registrar consumo.'
            );
        }

        const [res] = await obterPool().query(
            `INSERT INTO historico_energia
                (id_dispositivo, id_tarifa, consumo_kwh,
                 data_historico_energia, potencia_kw, qualidade_medicao)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                dados.dispositivo_id,
                dados.tarifa_id,
                dados.valor,
                dados.data_hora,
                dados.potencia_kw ?? null,
                dados.qualidade_medicao ?? null
            ]
        );

        resultado = res;
    }

    return await buscarLeitura(config.tipo, resultado.insertId);
}


// ========================================
// 6. BUSCA DE DISPOSITIVO
// ========================================

export async function buscarDispositivo(id) {
    const [linhas] = await obterPool().query(
        `SELECT *
         FROM dispositivo
         WHERE id_dispositivo = ?
         LIMIT 1`,
        [id]
    );

    return linhas[0] || null;
}


// ========================================
// 7. BUSCA DOS LIMITES DE UM DISPOSITIVO
// ========================================

export async function buscarLimites(dispositivoId, tipo) {
    const config = obterTipoLeitura(tipo);

    const tabelas = {
        temperatura: {
            tabela: 'temperatura',
            minimo: 'temperatura_minima',
            maximo: 'temperatura_maxima'
        },
        iluminacao: {
            tabela: 'iluminacao',
            minimo: 'iluminacao_minima',
            maximo: 'iluminacao_maxima'
        },
        energia: {
            tabela: 'energia',
            minimo: 'consumo_minimo',
            maximo: 'consumo_maximo'
        }
    };

    const limite = tabelas[config.tipo];

    const [linhas] = await obterPool().query(
        `SELECT
            t.${limite.minimo} AS limite_minimo,
            t.${limite.maximo} AS limite_maximo
         FROM ${limite.tabela} t
         INNER JOIN dispositivo d
            ON d.id_ambiente = t.id_ambiente
         WHERE d.id_dispositivo = ?
         LIMIT 1`,
        [dispositivoId]
    );

    return linhas[0] || null;
}


// ========================================
// 8. BUSCA DE OCORRÊNCIA ABERTA
// ========================================

export async function buscarOcorrenciaAberta(dispositivoId) {
    const [linhas] = await obterPool().query(
        `SELECT *
         FROM ocorrencia
         WHERE id_dispositivo = ?
         AND status IN ('Aberta', 'Em Atendimento')
         ORDER BY id_ocorrencia DESC
         LIMIT 1`,
        [dispositivoId]
    );

    return linhas[0] || null;
}


// ========================================
// 9. INSERÇÃO DE RECURSOS CADASTRAIS
// ========================================

export async function criar(config, dados) {
    const campos = Object.keys(dados);

    if (!campos.length) {
        throw new TypeError('Nenhum dado informado.');
    }

    const colunas = campos
        .map(campo => `\`${campo}\``)
        .join(', ');

    const placeholders = campos
        .map(() => '?')
        .join(', ');

    const [resultado] = await obterPool().query(
        `INSERT INTO \`${config.tabela}\`
            (${colunas})
         VALUES (${placeholders})`,
        campos.map(campo => dados[campo])
    );

    return await buscar(config, resultado.insertId);
}


// ========================================
// 10. ATUALIZAÇÃO
// ========================================

export async function atualizar(config, id, dados) {
    const campos = Object.keys(dados);

    if (!campos.length) {
        throw new TypeError(
            'Informe ao menos um campo para atualizar.'
        );
    }

    const registro = await buscar(config, id);

    if (!registro) {
        return false;
    }

    const set = campos
        .map(campo => `\`${campo}\` = ?`)
        .join(', ');

    await obterPool().query(
        `UPDATE \`${config.tabela}\`
         SET ${set}
         WHERE \`${config.id}\` = ?`,
        [...campos.map(campo => dados[campo]), id]
    );

    return true;
}


// ========================================
// 11. REMOÇÃO
// ========================================

export async function excluir(config, id) {
    const [resultado] = await obterPool().query(
        `DELETE FROM \`${config.tabela}\`
         WHERE \`${config.id}\` = ?`,
        [id]
    );

    return resultado.affectedRows > 0;
}


// ========================================
// 12. RELATÓRIOS
// ========================================

export async function relatorios(filtros = {}) {
    const leituras = await listarLeituras({
        ambienteId: filtros.ambienteId,
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
        limite: 1000,
        offset: 0
    });

    const condicoes = ['1 = 1'];
    const valores = [];

    if (filtros.ambienteId) {
        condicoes.push('id_ambiente = ?');
        valores.push(filtros.ambienteId);
    }

    if (filtros.dataInicio) {
        condicoes.push('data_ocorrencia >= ?');
        valores.push(filtros.dataInicio);
    }

    if (filtros.dataFim) {
        condicoes.push('data_ocorrencia <= ?');
        valores.push(filtros.dataFim);
    }

    const [ocorrencias] = await obterPool().query(
        `SELECT *
         FROM ocorrencia
         WHERE ${condicoes.join(' AND ')}
         ORDER BY data_ocorrencia DESC
         LIMIT 1000`,
        valores
    );

    return {
        leituras: leituras.dados,
        ocorrencias
    };
}

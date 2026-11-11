import { criarPool } from '../config/database.js';

const obterPool = () => criarPool();

// Configuração das três tabelas de leituras.
const tiposLeitura = {
    temperatura: {
        tabela: 'historico_temperatura',
        id: 'id_historico_temperatura',
        colunaValor: 'temperatura_medida',
        colunaData: 'data_temperatura',
        unidade: '°C'
    },

    iluminacao: {
        tabela: 'historico_iluminacao',
        id: 'id_historico_iluminacao',
        colunaValor: 'iluminacao_medida',
        colunaData: 'data_iluminacao',
        unidade: 'lux'
    },

    energia: {
        tabela: 'historico_energia',
        id: 'id_historico_energia',
        colunaValor: 'consumo_kwh',
        colunaData: 'data_historico_energia',
        unidade: 'kWh'
    }
};

// Busca a configuração de um tipo de leitura.
function obterTipoLeitura(tipo) {
    const config = tiposLeitura[String(tipo || '').toLowerCase()];

    if (!config) {
        throw new TypeError('Tipo de leitura inválido.');
    }

    return config;
}

// 1. Listar recursos.
export async function listar(
    config,
    filtros = {},
    { limite = 50, offset = 0 } = {}
) {
    const where = [];
    const valores = [];

    for (const [campo, valor] of Object.entries(filtros)) {
        if (campo === '__periodo') {
            for (const item of valor) {
                if (!config.campos.includes(item.campo)) {
                    throw new TypeError('Campo de data não permitido.');
                }

                if (!['>=', '<='].includes(item.operador)) {
                    throw new TypeError('Operador de data inválido.');
                }

                where.push(`\`${item.campo}\` ${item.operador} ?`);
                valores.push(item.valor);
            }

            continue;
        }

        if (!config.campos.includes(campo)) {
            throw new TypeError(`Filtro não permitido: ${campo}.`);
        }

        where.push(`\`${campo}\` = ?`);
        valores.push(valor);
    }

    const condicao = where.length
        ? `WHERE ${where.join(' AND ')}`
        : '';

    const [dados] = await obterPool().query(
        `SELECT *
         FROM \`${config.tabela}\`
         ${condicao}
         ORDER BY \`${config.id}\` DESC
         LIMIT ? OFFSET ?`,
        [...valores, limite, offset]
    );

    const [[resultado]] = await obterPool().query(
        `SELECT COUNT(*) AS total
         FROM \`${config.tabela}\`
         ${condicao}`,
        valores
    );

    return {
        dados,
        total: Number(resultado.total)
    };
}

// 2. Buscar registro por ID.
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

// Monta as consultas das tabelas históricas.
function montarConsultasLeituras({
    ambienteId,
    tipo,
    dataInicio,
    dataFim
}) {
    const consultas = [];
    const valores = [];

    const tipos = tipo
        ? [[String(tipo).toLowerCase(), obterTipoLeitura(tipo)]]
        : Object.entries(tiposLeitura);

    for (const [nome, config] of tipos) {
        let sql = `
            SELECT
                h.${config.id} AS id,
                h.id_dispositivo,
                d.id_ambiente,
                '${nome}' AS tipo,
                h.${config.colunaValor} AS valor,
                COALESCE(d.unidade_medida, '${config.unidade}') AS unidade,
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

    return {
        sql: consultas.join(' UNION ALL '),
        valores
    };
}

// 3. Listar leituras.
export async function listarLeituras({
    ambienteId = null,
    tipo = null,
    dataInicio = null,
    dataFim = null,
    limite = 50,
    offset = 0
} = {}) {
    const consulta = montarConsultasLeituras({
        ambienteId,
        tipo,
        dataInicio,
        dataFim
    });

    const [dados] = await obterPool().query(
        `SELECT *
         FROM (${consulta.sql}) AS leituras
         ORDER BY data_hora DESC
         LIMIT ? OFFSET ?`,
        [...consulta.valores, limite, offset]
    );

    const [[resultado]] = await obterPool().query(
        `SELECT COUNT(*) AS total
         FROM (${consulta.sql}) AS leituras`,
        consulta.valores
    );

    return {
        dados,
        total: Number(resultado.total)
    };
}

// 4. Buscar uma leitura.
export async function buscarLeitura(tipo, id) {
    const config = obterTipoLeitura(tipo);

    const [linhas] = await obterPool().query(
        `SELECT
            h.${config.id} AS id,
            h.id_dispositivo,
            d.id_ambiente,
            ? AS tipo,
            h.${config.colunaValor} AS valor,
            COALESCE(d.unidade_medida, ?) AS unidade,
            h.${config.colunaData} AS data_hora
         FROM ${config.tabela} h
         INNER JOIN dispositivo d
            ON d.id_dispositivo = h.id_dispositivo
         WHERE h.${config.id} = ?
         LIMIT 1`,
        [String(tipo).toLowerCase(), config.unidade, id]
    );

    return linhas[0] || null;
}

// 5. Criar leitura manual.
export async function criarLeitura(tipo, dados) {
    const config = obterTipoLeitura(tipo);
    let resultado;

    if (tipo === 'temperatura') {
        const [res] = await obterPool().query(
            `INSERT INTO historico_temperatura
                (id_dispositivo, temperatura_medida, umidade, data_temperatura)
             VALUES (?, ?, ?, ?)`,
            [
                dados.id_dispositivo,
                dados.valor,
                dados.umidade ?? null,
                dados.data_hora
            ]
        );

        resultado = res;
    } else if (tipo === 'iluminacao') {
        const [res] = await obterPool().query(
            `INSERT INTO historico_iluminacao
                (id_dispositivo, iluminacao_medida, data_iluminacao)
             VALUES (?, ?, ?)`,
            [
                dados.id_dispositivo,
                dados.valor,
                dados.data_hora
            ]
        );

        resultado = res;
    } else {
        const [res] = await obterPool().query(
            `INSERT INTO historico_energia
                (id_dispositivo, id_tarifa, consumo_kwh,
                 potencia_kw, qualidade_medicao, data_historico_energia)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                dados.id_dispositivo,
                dados.id_tarifa ?? null,
                dados.valor,
                dados.potencia_kw,
                dados.qualidade_medicao ?? null,
                dados.data_hora
            ]
        );

        resultado = res;
    }

    return await buscarLeitura(tipo, resultado.insertId);
}

// 6. Buscar dispositivo.
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

// 7. Buscar limites do ambiente do dispositivo.
export async function buscarLimites(dispositivoId, tipo) {
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

    const config = tabelas[String(tipo).toLowerCase()];

    if (!config) {
        throw new TypeError('Tipo de limite inválido.');
    }

    const [linhas] = await obterPool().query(
        `SELECT
            t.${config.minimo} AS limite_minimo,
            t.${config.maximo} AS limite_maximo
         FROM ${config.tabela} t
         INNER JOIN dispositivo d
            ON d.id_ambiente = t.id_ambiente
         WHERE d.id_dispositivo = ?
         LIMIT 1`,
        [dispositivoId]
    );

    return linhas[0] || null;
}

// 8. Buscar ocorrência ainda aberta.
export async function buscarOcorrenciaAberta(dispositivoId) {
    const [linhas] = await obterPool().query(
        `SELECT *
         FROM ocorrencia
         WHERE id_dispositivo = ?
           AND status_ocorrencia IN ('Aberta', 'Em andamento')
         ORDER BY id_ocorrencia DESC
         LIMIT 1`,
        [dispositivoId]
    );

    return linhas[0] || null;
}

// 9. Criar recurso.
export async function criar(config, dados) {
    const campos = Object.keys(dados);

    if (!campos.length) {
        throw new TypeError('Nenhum dado informado.');
    }

    const colunas = campos.map(campo => `\`${campo}\``).join(', ');
    const placeholders = campos.map(() => '?').join(', ');

    const [resultado] = await obterPool().query(
        `INSERT INTO \`${config.tabela}\`
            (${colunas})
         VALUES (${placeholders})`,
        campos.map(campo => dados[campo])
    );

    return await buscar(config, resultado.insertId);
}

// 10. Atualizar recurso.
export async function atualizar(config, id, dados) {
    const campos = Object.keys(dados);

    if (!campos.length) {
        throw new TypeError('Nenhum campo informado.');
    }

    const registro = await buscar(config, id);

    if (!registro) {
        return false;
    }

    const atualizacoes = campos
        .map(campo => `\`${campo}\` = ?`)
        .join(', ');

    await obterPool().query(
        `UPDATE \`${config.tabela}\`
         SET ${atualizacoes}
         WHERE \`${config.id}\` = ?`,
        [...campos.map(campo => dados[campo]), id]
    );

    return true;
}

// 11. Excluir recurso.
export async function excluir(config, id) {
    const [resultado] = await obterPool().query(
        `DELETE FROM \`${config.tabela}\`
         WHERE \`${config.id}\` = ?`,
        [id]
    );

    return resultado.affectedRows > 0;
}

// 12. Gerar relatórios.
export async function relatorios(filtros = {}) {
    const leituras = await listarLeituras({
        ambienteId: filtros.ambienteId,
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
        limite: 1000,
        offset: 0
    });

    const condicoes = [];
    const valores = [];

    if (filtros.ambienteId) {
        condicoes.push('d.id_ambiente = ?');
        valores.push(filtros.ambienteId);
    }

    if (filtros.dataInicio) {
        condicoes.push('o.data_ocorrencia >= ?');
        valores.push(filtros.dataInicio);
    }

    if (filtros.dataFim) {
        condicoes.push('o.data_ocorrencia <= ?');
        valores.push(filtros.dataFim);
    }

    const where = condicoes.length
        ? `WHERE ${condicoes.join(' AND ')}`
        : '';

    const [ocorrencias] = await obterPool().query(
        `SELECT o.*
         FROM ocorrencia o
         INNER JOIN dispositivo d
            ON d.id_dispositivo = o.id_dispositivo
         ${where}
         ORDER BY o.data_ocorrencia DESC
         LIMIT 1000`,
        valores
    );

    return {
        leituras: leituras.dados,
        ocorrencias
    };
}
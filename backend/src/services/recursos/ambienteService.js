
import * as Model from '../../models/RecursoModel.js';
import { recursos } from './recursoConfig.js';
import { validarId, validarNumero, preparar } from './validacaoService.js';

const config = recursos.ambientes;

export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const id = validarId(idRecebido);
    const ambiente = await Model.buscar(config, id);

    if (!ambiente) {
        const erro = new Error('Ambiente não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return ambiente;
}

function validarLimitesAmbiente(limitesRecebidos = {}) {
    const limites =
        limitesRecebidos && typeof limitesRecebidos === 'object'
            ? limitesRecebidos
            : {};
    const resultado = {};

    const validarPar = (chave, minimoCampo, maximoCampo, nome, exigePotencia = false, permiteNegativo = false) => {
        const item = limites[chave] || {};
        const valores = exigePotencia
            ? [item.minimo, item.maximo, item.potencia_maxima]
            : [item.minimo, item.maximo];

        if (valores.every(valor => valor === undefined || valor === null || valor === '')) {
            return;
        }
        if (valores.some(valor => valor === undefined || valor === null || valor === '')) {
            throw new TypeError(`Preencha todos os limites de ${nome}.`);
        }

        const minimo = validarNumero(item.minimo, `${nome} mínimo`);
        const maximo = validarNumero(item.maximo, `${nome} máximo`);
        if ((!permiteNegativo && minimo < 0) || maximo < minimo) {
            throw new TypeError(`Os limites de ${nome} devem ser positivos e o máximo não pode ser menor que o mínimo.`);
        }

        resultado[chave] = {
            [minimoCampo]: minimo,
            [maximoCampo]: maximo,
        };

        if (exigePotencia) {
            const potencia = validarNumero(item.potencia_maxima, 'potência máxima');
            if (potencia < 0) throw new TypeError('A potência máxima não pode ser negativa.');
            resultado[chave].potencia_maxima = potencia;
        }
    };

    validarPar('temperatura', 'temperatura_minima', 'temperatura_maxima', 'temperatura', false, true);
    validarPar('iluminacao', 'iluminacao_minima', 'iluminacao_maxima', 'iluminação');
    validarPar('energia', 'consumo_minimo', 'consumo_maximo', 'energia', true);

    return resultado;
}

export async function criar(dados, usuario) {
    const { limites_ambiente: limitesRecebidos, ...dadosAmbiente } = dados || {};
    const dadosValidados = preparar(config, dadosAmbiente);
    const limites = validarLimitesAmbiente(limitesRecebidos);
    return Model.criarAmbienteComLimites(
        config,
        dadosValidados,
        limites,
        usuario?.id
    );
}

export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);
    const dadosValidados = preparar(config, dados, true);

    if (Object.keys(dadosValidados).length === 0) {
        throw new TypeError('Informe os campos para atualização.');
    }

    const atualizou = await Model.atualizar(
        config,
        id,
        dadosValidados
    );

    if (!atualizou) {
        const erro = new Error('Ambiente não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return buscar(id);
}

export async function excluir(idRecebido) {
    const id = validarId(idRecebido);
    const removeu = await Model.excluir(config, id);

    if (!removeu) {
        const erro = new Error('Ambiente não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return { sucesso: true };
}

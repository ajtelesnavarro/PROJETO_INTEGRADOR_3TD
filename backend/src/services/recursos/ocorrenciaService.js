import * as Model from '../../models/RecursoModel.js';
<<<<<<< HEAD
=======
import { pool } from '../../config/database.js';
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
import { recursos } from './recursoConfig.js';
import { validarId, preparar } from './validacaoService.js';

const config = recursos.ocorrencias;

<<<<<<< HEAD
export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const id = validarId(idRecebido);

    const ocorrencia = await Model.buscar(config, id);
=======
export async function listar(filtros = {}, paginacao = {}, usuario = null) {
    const perfil = String(usuario?.perfil || '').toLowerCase();
    if (perfil !== 'manutencao' && perfil !== 'funcionario') {
        return Model.listar(config, filtros, paginacao);
    }

    // O perfil manutencao representa o funcionário operacional neste banco.
    // A lista deve conter somente ocorrências atribuídas diretamente ao usuário.
    const where = ['o.id_tecnico_responsavel = ?'];
    const valores = [Number(usuario.id)];
    for (const [campo, valor] of Object.entries(filtros)) {
        if (valor === undefined || valor === '') continue;
        if (!config.campos.includes(campo)) throw new TypeError(`Filtro não permitido: ${campo}.`);
        where.push(`o.\`${campo}\` = ?`);
        valores.push(valor);
    }

    const limite = Math.max(1, Math.min(1000, Number(paginacao.limite) || 50));
    const offset = Math.max(0, Number(paginacao.offset) || 0);
    const clausula = where.join(' AND ');
    const [dados] = await pool.query(
        `SELECT o.* FROM ocorrencia o INNER JOIN dispositivo d ON d.id_dispositivo = o.id_dispositivo WHERE ${clausula} ORDER BY o.id_ocorrencia DESC LIMIT ? OFFSET ?`,
        [...valores, limite, offset]
    );
    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total FROM ocorrencia o INNER JOIN dispositivo d ON d.id_dispositivo = o.id_dispositivo WHERE ${clausula}`,
        valores
    );
    return { dados, total: Number(total) };
}

export async function buscar(idRecebido, usuario = null) {
    const id = validarId(idRecebido);
    let ocorrencia;
    const perfil = String(usuario?.perfil || '').toLowerCase();

    if (perfil === 'manutencao' || perfil === 'funcionario') {
        const filtroAcesso = 'o.id_tecnico_responsavel = ?';
        const [linhas] = await pool.query(
            `SELECT o.* FROM ocorrencia o
             INNER JOIN dispositivo d ON d.id_dispositivo = o.id_dispositivo
             WHERE o.id_ocorrencia = ? AND ${filtroAcesso} LIMIT 1`,
            [id, Number(usuario.id)]
        );
        ocorrencia = linhas[0] || null;
    } else {
        ocorrencia = await Model.buscar(config, id);
    }
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)

    if (!ocorrencia) {
        const erro = new Error('Ocorrência não encontrada.');
        erro.status = 404;
        throw erro;
    }

    return ocorrencia;
}

export async function criar(dados) {
    const dadosValidados = preparar(config, dados);
    return Model.criar(config, dadosValidados);
}

<<<<<<< HEAD
export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);
=======
export async function atualizar(idRecebido, dados, usuario = null) {
    const id = validarId(idRecebido);
    await buscar(id, usuario);
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
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
        const erro = new Error('Ocorrência não encontrada.');
        erro.status = 404;
        throw erro;
    }

<<<<<<< HEAD
    return buscar(id);
=======
    return buscar(id, usuario);
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
}

export async function excluir(idRecebido) {
    const id = validarId(idRecebido);

    const removeu = await Model.excluir(config, id);

    if (!removeu) {
        const erro = new Error('Ocorrência não encontrada.');
        erro.status = 404;
        throw erro;
    }

    return { sucesso: true };
}

import * as Model from '../../models/RecursoModel.js';
<<<<<<< HEAD
=======
import { pool } from '../../config/database.js';
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
import { recursos } from './recursoConfig.js';
import { validarId, preparar } from './validacaoService.js';

const config = recursos.predios;

export async function listar(filtros = {}, paginacao = {}) {
    return Model.listar(config, filtros, paginacao);
}

export async function buscar(idRecebido) {
    const id = validarId(idRecebido);
    const predio = await Model.buscar(config, id);

    if (!predio) {
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return predio;
}

<<<<<<< HEAD
export async function criar(dados) {
    const dadosValidados = preparar(config, dados);
    return Model.criar(config, dadosValidados);
=======
export async function criar(dados, usuario) {
    const dadosValidados = preparar(config, dados);
    const [usuarios] = await pool.query(
        'SELECT id_predio FROM usuario WHERE id_usuario = ? LIMIT 1',
        [usuario?.id]
    );
    if (usuarios[0]?.id_predio) {
        const erro = new Error('Seu usuário já está vinculado a um prédio.');
        erro.status = 409;
        throw erro;
    }

    const predio = await Model.criar(config, dadosValidados);
    if (usuario?.id) {
        await pool.query(
            'UPDATE usuario SET id_predio = ? WHERE id_usuario = ? AND id_predio IS NULL',
            [predio.id_predio, usuario.id]
        );
    }
    return predio;
>>>>>>> a33c4f6 (feat: Arrumando mudanças do André)
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
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return buscar(id);
}

export async function excluir(idRecebido) {
    const id = validarId(idRecebido);
    const removeu = await Model.excluir(config, id);

    if (!removeu) {
        const erro = new Error('Prédio não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return { sucesso: true };
}


import * as UsuarioModel from "../models/UsuarioModel.js";

function validarId(idRecebido) {
    const id = Number(idRecebido);

    if (!Number.isInteger(id) || id <= 0) {
        throw new TypeError("ID de usuário inválido.");
    }

    return id;
}

export async function buscarPorId(idRecebido) {
    const id = validarId(idRecebido);

    const usuario = await UsuarioModel.buscarPorId(id);

    if (!usuario) {
        const erro = new Error("Usuário não encontrado.");
        erro.status = 404;
        throw erro;
    }

    return usuario;
}

export async function criar(dados) {
    if (!dados || !dados.nome || !dados.email || !dados.senha_hash || !dados.cpf) {
        throw new TypeError("Preencha os campos obrigatórios do usuário.");
    }

    const emailExistente = await UsuarioModel.buscarPorEmail(
        dados.email.trim().toLowerCase()
    );

    if (emailExistente) {
        const erro = new Error("E-mail já cadastrado.");
        erro.status = 409;
        throw erro;
    }

    return await UsuarioModel.criar({
        ...dados,
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase()
    });
}

export async function atualizar(idRecebido, dados) {
    const id = validarId(idRecebido);

    const usuarioExistente = await UsuarioModel.buscarPorId(id);

    if (!usuarioExistente) {
        const erro = new Error("Usuário não encontrado.");
        erro.status = 404;
        throw erro;
    }

    const emailExistente = await UsuarioModel.buscarPorEmail(
        dados.email.trim().toLowerCase()
    );

    if (emailExistente && emailExistente.id_usuario !== id) {
        const erro = new Error("E-mail já utilizado por outro usuário.");
        erro.status = 409;
        throw erro;
    }

    await UsuarioModel.atualizar(id, {
        ...dados,
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase()
    });

    return await UsuarioModel.buscarPorId(id);
}

export async function excluir(idRecebido) {
    const id = validarId(idRecebido);

    const usuarioExistente = await UsuarioModel.buscarPorId(id);

    if (!usuarioExistente) {
        const erro = new Error("Usuário não encontrado.");
        erro.status = 404;
        throw erro;
    }

    await UsuarioModel.excluir(id);

    return { mensagem: "Usuário excluído com sucesso." };
}

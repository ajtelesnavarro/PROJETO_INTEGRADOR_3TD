
import * as UsuarioModel from "../models/UsuarioModel.js";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export async function listarAmbientes() {
    return UsuarioModel.listarAmbientes();
}

export async function criarComAcesso(dados) {
    const { usuario, credencial, permissoes } = dados || {};
    if (!usuario?.nome || !usuario?.email || !usuario?.senha || !usuario?.cpf ||
        !credencial?.token || !credencial?.tipo_credencial || !Array.isArray(permissoes)) {
        throw new TypeError("Preencha os dados do usuário, a credencial e as permissões.");
    }
    if (usuario.senha.length < 8) throw new TypeError("A senha deve ter pelo menos 8 caracteres.");
    const email = usuario.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new TypeError("Informe um e-mail válido.");
    const cpf = String(usuario.cpf).replace(/\D/g, "");
    if (cpf.length !== 11) throw new TypeError("O CPF deve conter 11 números.");
    if (!['administrador', 'manutencao', 'porteiro', 'locador'].includes(usuario.perfil)) throw new TypeError("Perfil inválido.");
    if (!['cartao_rfid', 'tag_nfc', 'qr_code'].includes(credencial.tipo_credencial)) throw new TypeError("Tipo de credencial inválido.");
    const emailExistente = await UsuarioModel.buscarPorEmail(email);
    if (emailExistente) { const erro = new Error("E-mail já cadastrado."); erro.status = 409; throw erro; }
    const permissoesNormalizadas = permissoes.map((p) => {
        const id_ambiente = Number(p.id_ambiente);
        if (!Number.isInteger(id_ambiente) || id_ambiente <= 0 || !p.data_inicio) throw new TypeError("Selecione ambiente e data de início para cada permissão.");
        if (p.data_fim && p.data_fim < p.data_inicio) throw new TypeError("A data final da permissão deve ser igual ou posterior à data inicial.");
        if (p.horario_inicio && p.horario_fim && p.horario_fim <= p.horario_inicio) throw new TypeError("O horário final deve ser posterior ao horário inicial.");
        return {
            id_ambiente, data_inicio: p.data_inicio, data_fim: p.data_fim || null,
            horario_inicio: p.horario_inicio || null, horario_fim: p.horario_fim || null,
            dias_semana: Array.isArray(p.dias_semana) ? p.dias_semana.join(",") : (p.dias_semana || null),
            status_permissao: p.status_permissao || "ativa",
        };
    });
    const senha_hash = await bcrypt.hash(usuario.senha, 12);
    const token_hash = createHash("sha256").update(credencial.token.trim()).digest("hex");
    let foto = null;
    let caminhoFoto = null;
    if (usuario.foto_upload) {
        const correspondencia = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+=*)$/.exec(usuario.foto_upload);
        if (!correspondencia) throw new TypeError("Envie uma imagem PNG, JPG ou WebP válida.");
        const bytes = Buffer.from(correspondencia[2], "base64");
        if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new TypeError("A imagem deve ter no máximo 2 MB.");
        const assinaturaValida = correspondencia[1] === "png"
            ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : correspondencia[1] === "jpeg"
                ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
                : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
        if (!assinaturaValida) throw new TypeError("O arquivo enviado não corresponde a uma imagem válida.");
        const extensao = correspondencia[1] === "jpeg" ? "jpg" : correspondencia[1];
        const diretorio = join(process.cwd(), "uploads", "usuarios");
        await mkdir(diretorio, { recursive: true });
        const nomeArquivo = `${randomUUID()}.${extensao}`;
        caminhoFoto = join(diretorio, nomeArquivo);
        await writeFile(caminhoFoto, bytes, { flag: "wx" });
        foto = `/uploads/usuarios/${nomeArquivo}`;
    }
    try {
        return await UsuarioModel.criarComAcesso({
        id_predio: usuario.id_predio || null, nome: usuario.nome.trim(), email, senha_hash,
        telefone: usuario.telefone || null, perfil: usuario.perfil || "locador", cpf,
        foto, data_nascimento: usuario.data_nascimento || null,
        ativo: usuario.ativo || "ativo",
    }, { token_hash, tipo_credencial: credencial.tipo_credencial, status: credencial.status || "ativa" }, permissoesNormalizadas);
    } catch (error) {
        if (caminhoFoto) await unlink(caminhoFoto).catch(() => {});
        throw error;
    }
}

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

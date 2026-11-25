
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { PROFILE_UPLOADS_DIR } from "../config/uploadPaths.js";
import * as UsuarioModel from "../models/UsuarioModel.js";

// Aceita domínios locais sem ponto (por exemplo, nome@servidor) usados em testes e redes internas.
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+$/;

export async function gerarToken({ email, senha } = {}) {
    const emailLimpo =
        typeof email === "string"
            ? email.trim().toLowerCase()
            : "";

    if (
        !REGEX_EMAIL.test(emailLimpo) ||
        typeof senha !== "string" ||
        !senha
    ) {
        throw new TypeError("Informe e-mail e senha válidos.");
    }

    const usuario = await UsuarioModel.buscarPorEmail(emailLimpo);

    if (!usuario || !usuario.senha_hash || (usuario.ativo !== "ativo" && usuario.ativo !== 1)) {
        const erro = new Error("Credenciais inválidas.");
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaValida) {
        const erro = new Error("Credenciais inválidas.");
        erro.status = 401;
        throw erro;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET não está configurado.");
    }

    const token = jwt.sign(
        { perfil: usuario.perfil },
        jwtSecret,
        {
            subject: String(usuario.id_usuario),
            expiresIn: process.env.JWT_EXPIRES_IN || "2h",
            issuer: "lumora-smartbuilding"
        }
    );

    return {
        token,
        tipo: "Bearer",
        expiraEm: process.env.JWT_EXPIRES_IN || "2h",
        usuario: {
            id: usuario.id_usuario,
            nome: usuario.nome,
            perfil: usuario.perfil
        }
    };
}

export async function buscarPerfil(idUsuario) {
    const perfil = await UsuarioModel.buscarPerfilPorId(idUsuario);
    if (!perfil) {
        const erro = new Error("Usuário não encontrado.");
        erro.status = 404;
        throw erro;
    }
    return perfil;
}

export async function atualizarPerfil(idUsuario, dados = {}) {
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const cpf = String(dados.cpf || '').replace(/\D/g, '');
    const telefone = typeof dados.telefone === 'string' ? dados.telefone.trim() : '';
    const dataNascimento = dados.data_nascimento || null;

    if (nome.length < 3 || nome.length > 100) throw new TypeError('O nome deve ter entre 3 e 100 caracteres.');
    if (!REGEX_EMAIL.test(email)) throw new TypeError('Informe um e-mail válido.');
    if (cpf.length !== 11) throw new TypeError('Informe um CPF com 11 números.');
    if (telefone.length > 20) throw new TypeError('O telefone é muito longo.');
    if (dataNascimento && !/^\d{4}-\d{2}-\d{2}$/.test(String(dataNascimento))) {
        throw new TypeError('Informe uma data de nascimento válida.');
    }
    if (await UsuarioModel.emailEmUso(email, idUsuario)) {
        const erro = new Error('Este e-mail já está sendo usado por outra conta.');
        erro.status = 409;
        throw erro;
    }

    const atualizacao = { nome, email, cpf, telefone: telefone || null, data_nascimento: dataNascimento };
    if (typeof dados.senha === 'string' && dados.senha.length) {
        if (dados.senha.length < 8) throw new TypeError('A senha deve ter pelo menos 8 caracteres.');
        atualizacao.senha_hash = (await bcrypt.hash(dados.senha, 12)).replace(/^\$2b\$/, '$2y$');
    }

    if (dados.foto_upload) {
        const correspondencia = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dados.foto_upload);
        if (!correspondencia) throw new TypeError('A foto deve ser PNG, JPG ou WebP.');
        const extensao = correspondencia[1] === 'jpeg' ? '.jpg' : `.${correspondencia[1]}`;
        const imagem = Buffer.from(correspondencia[2], 'base64');
        if (!imagem.length || imagem.length > 2 * 1024 * 1024) throw new TypeError('A foto deve ter no máximo 2 MB.');
        const nomeArquivo = `${randomUUID()}${extensao}`;
        await mkdir(PROFILE_UPLOADS_DIR, { recursive: true });
        await writeFile(resolve(PROFILE_UPLOADS_DIR, nomeArquivo), imagem);
        atualizacao.foto = `/uploads/perfis/${nomeArquivo}`;
    }

    await UsuarioModel.atualizarPerfil(idUsuario, atualizacao);
    return buscarPerfil(idUsuario);
}

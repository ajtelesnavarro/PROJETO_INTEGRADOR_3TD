import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as AuthModel from '../models/AuthModel.js';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registrar({
    nome,
    email,
    senha,
    telefone,
    cpf,
    foto,
    data_nascimento,
    id_predio = null
} = {}) {

    const nomeLimpo = typeof nome === 'string' ? nome.trim() : '';
    const emailLimpo = typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

    if (nomeLimpo.length < 3) {
        throw new TypeError('O nome deve ter pelo menos 3 caracteres.');
    }

    if (!REGEX_EMAIL.test(emailLimpo)) {
        throw new TypeError('Informe um e-mail válido.');
    }

    if (
        typeof senha !== 'string' ||
        senha.length < 8 ||
        !/[a-z]/.test(senha) ||
        !/[A-Z]/.test(senha) ||
        !/\d/.test(senha) ||
        !/[^A-Za-z0-9]/.test(senha)
    ) {
        throw new TypeError(
            'A senha deve conter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.'
        );
    }

    const usuarioExistente = await AuthModel.buscarPorEmail(emailLimpo);

    if (usuarioExistente) {
        const erro = new Error('E-mail já cadastrado.');
        erro.status = 409;
        throw erro;
    }

    const cpfLimpo = typeof cpf === 'string' ? cpf.trim() : '';

    if (!/^\d{11}$/.test(cpfLimpo)) {
        throw new TypeError('Informe um CPF válido com 11 números.');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await AuthModel.criar({
        nome: nomeLimpo,
        email: emailLimpo,
        senha_hash: senhaHash,
        telefone: telefone || null,
        cpf: cpfLimpo,
        foto: foto || null,
        data_nascimento: data_nascimento || null,
        id_predio,
        perfil: 'locador',
        ativo: 'ativo'
    });
}

export async function login({ email, senha } = {}) {

    const emailLimpo = typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

    if (!REGEX_EMAIL.test(emailLimpo) || typeof senha !== 'string' || !senha) {
        const erro = new Error('Informe e-mail e senha válidos.');
        erro.status = 400;
        throw erro;
    }

    const usuario = await AuthModel.buscarPorEmail(emailLimpo);

    if (!usuario || !usuario.senha_hash || usuario.ativo !== 'ativo') {
        const erro = new Error('Credenciais inválidas.');
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
        const erro = new Error('Credenciais inválidas.' + senhaValida);
        erro.status = 401;
        throw erro;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET não está configurado.');
    }

    const tempoExpiracao = process.env.JWT_EXPIRES_IN || '2h';

    const token = jwt.sign(
        {
            perfil: usuario.perfil,
            id_predio: usuario.id_predio
        },
        jwtSecret,
        {
            subject: String(usuario.id_usuario),
            expiresIn: tempoExpiracao,
            issuer: 'lumora-smartbuilding'
        }
    );

    return {
        token,
        tipo: 'Bearer',
        expiraEm: tempoExpiracao,
        usuario: {
            id: usuario.id_usuario,
            nome: usuario.nome,
            perfil: usuario.perfil,
            id_predio: usuario.id_predio
        }
    };
}

export async function buscarPorId(id) {
    return await AuthModel.buscarPorId(id);
}

export async function atualizarPerfil(idUsuario, dados = {}) {
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const cpf = typeof dados.cpf === 'string' ? dados.cpf.replace(/\D/g, '') : '';
    const telefone = typeof dados.telefone === 'string' ? dados.telefone.trim() : '';
    if (nome.length < 3) throw new TypeError('O nome deve ter pelo menos 3 caracteres.');
    if (!REGEX_EMAIL.test(email)) throw new TypeError('Informe um e-mail válido.');
    if (!/^\d{11}$/.test(cpf)) throw new TypeError('Informe um CPF válido com 11 números.');
    if (dados.senha && (
        typeof dados.senha !== 'string' || dados.senha.length < 8 ||
        !/[a-z]/.test(dados.senha) || !/[A-Z]/.test(dados.senha) ||
        !/\d/.test(dados.senha) || !/[^A-Za-z0-9]/.test(dados.senha)
    )) throw new TypeError('A senha deve conter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.');

    const [porEmail, porCpf] = await Promise.all([
        AuthModel.buscarPorEmail(email),
        AuthModel.buscarPorCpf(cpf),
    ]);
    if (porEmail && Number(porEmail.id_usuario) !== Number(idUsuario)) {
        const erro = new Error('Este e-mail já está sendo usado por outra conta.'); erro.status = 409; throw erro;
    }
    if (porCpf && Number(porCpf.id_usuario) !== Number(idUsuario)) {
        const erro = new Error('Este CPF já está sendo usado por outra conta.'); erro.status = 409; throw erro;
    }

    let foto = typeof dados.foto === 'string' ? dados.foto : null;
    let caminhoFoto = null;
    if (dados.foto_upload) {
        const correspondencia = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+=*)$/.exec(dados.foto_upload);
        if (!correspondencia) throw new TypeError('Envie uma imagem PNG, JPG ou WebP válida.');
        const bytes = Buffer.from(correspondencia[2], 'base64');
        if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new TypeError('A imagem deve ter no máximo 2 MB.');
        const assinaturaValida = correspondencia[1] === 'png'
            ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : correspondencia[1] === 'jpeg'
                ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
                : bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
        if (!assinaturaValida) throw new TypeError('O arquivo enviado não corresponde a uma imagem válida.');
        const extensao = correspondencia[1] === 'jpeg' ? 'jpg' : correspondencia[1];
        const diretorio = join(process.cwd(), 'uploads', 'usuarios');
        await mkdir(diretorio, { recursive: true });
        const nomeArquivo = `${randomUUID()}.${extensao}`;
        caminhoFoto = join(diretorio, nomeArquivo);
        await writeFile(caminhoFoto, bytes, { flag: 'wx' });
        foto = `/uploads/usuarios/${nomeArquivo}`;
    }

    try {
        const senha_hash = dados.senha ? await bcrypt.hash(dados.senha, 10) : null;
        await AuthModel.atualizarPerfil(idUsuario, {
            nome, email, cpf, telefone: telefone || null,
            data_nascimento: dados.data_nascimento || null,
            foto, senha_hash,
        });
        return AuthModel.buscarPorId(idUsuario);
    } catch (erro) {
        if (caminhoFoto) await unlink(caminhoFoto).catch(() => {});
        throw erro;
    }
}

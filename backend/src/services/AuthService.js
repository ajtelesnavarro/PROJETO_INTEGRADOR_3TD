import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../models/AuthModel.js';

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

    const usuarioExistente = await UsuarioModel.buscarPorEmail(emailLimpo);

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

    return await UsuarioModel.criar({
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

    const usuario = await UsuarioModel.buscarPorEmail(emailLimpo);

    if (!usuario || !usuario.senha_hash || usuario.ativo !== 'ativo') {
        const erro = new Error('Credenciais inválidas.');
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
        const erro = new Error('Credenciais inválidas.');
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

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../models/UsuarioModel.js';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function gerarToken({ email, senha } = {}) {
    const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!REGEX_EMAIL.test(emailLimpo) || typeof senha !== 'string' || !senha) {
        throw new TypeError('Informe e-mail e senha válidos.');
    }

    const usuario = await UsuarioModel.buscarPorEmail(emailLimpo);

    if (!usuario || !usuario.senha_hash) {
        const erro = new Error('Credenciais inválidas.');
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida || usuario.ativo !== 1) {
        const erro = new Error('Credenciais inválidas.');
        erro.status = 401;
        throw erro;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET não está configurado.');
    }

    const token = jwt.sign(
        { perfil: usuario.perfil },
        jwtSecret,
        {
            subject: String(usuario.id),
            expiresIn: process.env.JWT_EXPIRES_IN || '2h',
            issuer: 'lumora-smartbuilding'
        }
    );

    return {
        token,
        tipo: 'Bearer',
        expiraEm: process.env.JWT_EXPIRES_IN || '2h',
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            perfil: usuario.perfil
        }
    };
}
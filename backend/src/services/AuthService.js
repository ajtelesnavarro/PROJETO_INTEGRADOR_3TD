
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/UsuarioModel';

export async function cadastrar(dados) {
  const usuarioExistente = await usuarioModel.buscarPorEmail(dados.email);

  if (usuarioExistente) {
    throw new Error('E-mail já cadastrado');
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  return await usuarioModel.criar({
    ...dados,
    senhaHash
  });
}

export async function login(email, senha) {
  const usuario = await usuarioModel.buscarPorEmail(email);

  if (!usuario) {
    throw new Error('E-mail ou senha inválidos');
  }

  if (usuario.ativo !== 'ativo') {
    throw new Error('Usuário inativo');
  }

  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senha_hash
  );

  if (!senhaValida) {
    throw new Error('E-mail ou senha inválidos');
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    }
  };
}

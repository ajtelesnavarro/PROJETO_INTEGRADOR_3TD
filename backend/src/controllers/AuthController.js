
import * as authService from '../services/AuthService';

export async function cadastrar(req, res) {
  try {
    const usuario = await authService.cadastrar(req.body);

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario
    });

  } catch (erro) {
    return res.status(400).json({
      mensagem: erro.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const resultado = await authService.login(email, senha);

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      ...resultado
    });

  } catch (erro) {
    return res.status(401).json({
      mensagem: erro.message
    });
  }
}

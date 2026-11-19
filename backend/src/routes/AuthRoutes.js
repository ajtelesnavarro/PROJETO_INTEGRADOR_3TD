import express from 'express';
import * as AuthController from '../controllers/AuthController.js';
import { autenticar } from '../middlewares/AuthMiddleware.js';

export const authRouter = express.Router();

authRouter.post('/registrar', AuthController.registrar);
authRouter.post('/login', AuthController.login);
authRouter.get('/me', autenticar, AuthController.perfilAtual);
authRouter.put('/me', autenticar, AuthController.atualizarPerfil);

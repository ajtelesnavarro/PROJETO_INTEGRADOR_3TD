
import express from 'express';
import * as authController from '../controllers/AuthController';

const router = express.Router();

router.post('/cadastro', authController.cadastrar);

router.post('/login', authController.login);

export default router;

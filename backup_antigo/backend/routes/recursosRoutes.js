import express from 'express';
import * as authController from '../controllers/AuthController.js'
import * as Controller from '../controllers/RecursoController.js';
import { recursos } from '../services/RecursoService.js';
import { authRouter } from './AuthRoutes.js';
authRouter.post('/gerarToken', authController.gerarToken);

let autenticar = (_req, _res, next) => next();

let autorizarPerfis = (...perfisPermitidos) => (_req, _res, next) => next();

export const recursosRouter = express.Router();

recursosRouter.use((req, res, next) => autenticar(req, res, next));

const admin = (...args) => autorizarPerfis('Administrador')(...args);
const equipe = (...args) => autorizarPerfis('Administrador', 'Manutenção', 'Porteiro')(...args);
const consulta = (...args) => autorizarPerfis('Administrador', 'Manutenção', 'Porteiro', 'Visitante')(...args);

for (const nome of Object.keys(recursos)) {
    const router = express.Router();

    router.get('/', (req, res, next) => consulta(req, res, next), Controller.listar(nome));
    router.get('/:id', (req, res, next) => consulta(req, res, next), Controller.buscar(nome));

    const perfisEscrita = {
        leituras: ['Administrador', 'Manutenção'],
        acessos: ['Administrador', 'Porteiro'],
        ocorrencias: ['Administrador', 'Manutenção', 'Porteiro']
    };

    const escrita = recursos[nome].adminEscrita
        ? (req, res, next) => admin(req, res, next)
        : (req, res, next) => autorizarPerfis(...perfisEscrita[nome])(req, res, next);

    router.post('/', escrita, Controller.criar(nome));

    if (['predios', 'ambientes', 'dispositivos']. includes(nome)) {
        router.patch(
            '/:id',
            (req, res, next) => admin(req, res, next),
            Controller.atualizar(nome)
        )
    }

    if (nome === 'ocorrencias') {
        router.patch('/:id', (req, res, next) => equipe(req, res, next), Controller.atualizar(nome));
    }

    if (['predios', 'ambientes', 'dispositivos'].includes(nome)) {
        router.delete('/:id', (req, res, next) => admin(req, res, next), Controller.excluir(nome));
    }

    recursosRouter.use(`/${nome}`, router);
}

recursosRouter.get(
    '/relatorios',
    (req, res, next) => autorizarPerfis('Administrador', 'Manutenção')(req, res, next),
    Controller.relatorios
);

export function configurarSegurancaRecursos(middlewareAuth, middlewarePerfis) {
    if (middlewareAuth) autenticar = middlewareAuth;
    if (middlewarePerfis) autorizarPerfis = middlewarePerfis;
}
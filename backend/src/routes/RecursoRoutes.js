
import express from 'express';

import * as Controller from '../controllers/RecursoController.js';

import {
    autenticar,
    autorizarPerfis
} from '../middlewares/AuthMiddleware.js';

export const recursosRouter = express.Router();

// Todas as rotas exigem autenticação
recursosRouter.use(autenticar);

// Perfis de acesso
const consulta = autorizarPerfis(
    'administrador',
    'manutencao',
    'porteiro',
    'visitante'
);

const escritaPredios = autorizarPerfis('administrador');

const escritaDispositivos = autorizarPerfis(
    'administrador',
    'manutencao'
);

// Configuração dos recursos disponíveis
const rotas = [
    {
        nome: 'predios',
        escrita: escritaPredios,
        permiteAtualizar: true,
        permiteExcluir: true
    },
    {
        nome: 'andares',
        escrita: escritaPredios,
        permiteAtualizar: true,
        permiteExcluir: true
    },
    {
        nome: 'ambientes',
        escrita: escritaPredios,
        permiteAtualizar: true,
        permiteExcluir: true
    },
    {
        nome: 'dispositivos',
        escrita: escritaDispositivos,
        permiteAtualizar: true,
        permiteExcluir: true
    },
    {
        nome: 'ocorrencias',
        escrita: autorizarPerfis(
            'administrador',
            'manutencao'
        ),
        permiteAtualizar: true,
        permiteExcluir: false
    },
    {
        nome: 'acessos',
        permiteAtualizar: false,
        permiteExcluir: false
    }
];

// Criação das rotas
for (const recurso of rotas) {
    const router = express.Router();

    router.get('/', consulta, Controller.listar(recurso.nome));
    router.get('/:id', consulta, Controller.buscar(recurso.nome));

    if (recurso.escrita) {
        router.post(
            '/',
            recurso.escrita,
            Controller.criar(recurso.nome)
        );
    }

    if (recurso.permiteAtualizar) {
        router.patch(
            '/:id',
            recurso.escrita,
            Controller.atualizar(recurso.nome)
        );
    }

    if (recurso.permiteExcluir) {
        router.delete(
            '/:id',
            recurso.escrita,
            Controller.excluir(recurso.nome)
        );
    }

    recursosRouter.use(`/${recurso.nome}`, router);
}

// Rotas de leituras dos sensores
const leiturasRouter = express.Router();

// Permissões para registrar leituras
const escritaLeituras = autorizarPerfis(
    'administrador',
    'manutencao'
);

// Consultar todas as leituras
leiturasRouter.get(
    '/',
    consulta,
    Controller.listarLeituras
);

// Buscar uma leitura específica
leiturasRouter.get(
    '/:tipo/:id',
    consulta,
    Controller.buscarLeitura
);

// Registrar uma nova leitura
leiturasRouter.post(
    '/:tipo',
    escritaLeituras,
    Controller.criarLeitura
);

// Disponibilizar as rotas
recursosRouter.use('/leituras', leiturasRouter);
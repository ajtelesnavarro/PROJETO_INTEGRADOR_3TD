import express from 'express';
import * as Controller from '../controllers/RecursoController.js';
import { autenticar, autorizarPerfis } from '../middlewares/AuthMiddleware.js';

export const recursosRouter = express.Router();
recursosRouter.use(autenticar);

const admin = autorizarPerfis('administrador');
const adminManutencao = autorizarPerfis('administrador', 'manutencao');
const adminManutencaoPorteiro = autorizarPerfis('administrador', 'manutencao', 'porteiro');
const adminPorteiro = autorizarPerfis('administrador', 'porteiro');
const todos = autorizarPerfis('administrador', 'manutencao', 'porteiro', 'locador');

const rotas = [
    { nome: 'predios', leitura: admin, escrita: admin, permiteAtualizar: true, permiteExcluir: true },
    { nome: 'andares', leitura: admin, escrita: admin, permiteAtualizar: true, permiteExcluir: true },
    { nome: 'setores', leitura: admin, escrita: admin, permiteAtualizar: true, permiteExcluir: true },
    { nome: 'ambientes', leitura: adminManutencao, escrita: admin, permiteAtualizar: true, permiteExcluir: true },
    { nome: 'dispositivos', leitura: adminManutencao, escrita: adminManutencao, permiteAtualizar: true, permiteExcluir: true },
    { nome: 'ocorrencias', leitura: adminManutencaoPorteiro, escrita: adminManutencaoPorteiro, atualizacao: adminManutencao, permiteAtualizar: true, permiteExcluir: false },
    { nome: 'acessos', leitura: adminManutencaoPorteiro, escrita: adminPorteiro, permiteAtualizar: false, permiteExcluir: false }
];

for (const recurso of rotas) {
    const router = express.Router();
    router.get('/', recurso.leitura, Controller.listar(recurso.nome));
    router.get('/:id', recurso.leitura, Controller.buscar(recurso.nome));
    if (recurso.escrita) router.post('/', recurso.escrita, Controller.criar(recurso.nome));
    if (recurso.permiteAtualizar) router.patch('/:id', recurso.atualizacao || recurso.escrita, Controller.atualizar(recurso.nome));
    if (recurso.permiteExcluir) router.delete('/:id', recurso.escrita, Controller.excluir(recurso.nome));
    recursosRouter.use(`/${recurso.nome}`, router);
}

const leiturasRouter = express.Router();
leiturasRouter.get('/', todos, Controller.listarLeituras);
leiturasRouter.get('/:tipo/:id', todos, Controller.buscarLeitura);
leiturasRouter.post('/:tipo', adminManutencao, Controller.criarLeitura);
recursosRouter.use('/leituras', leiturasRouter);

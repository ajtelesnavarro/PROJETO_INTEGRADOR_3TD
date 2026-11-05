import express from 'express';
import * as Controller from '../controllers/RecursoController.js';
import { recursos } from '../services/RecursoService.js';

export const recursosRouter = express.Router();

let autenticar = (_req, res) => {
    return res.status(500).json({
        sucesso: false,
        erro: 'Middleware de autenticação não configurado.'
    });
};

let autorizarPerfis = (...perfisPermitidos) => {
    return (_req, res) => {
        return res.status(500).json({
            sucesso: false,
            erro: 'Middleware de autorização não configurado.'
        });
    };
};

export function configurarSegurancaRecursos(middlewareAuth, middlewarePerfis) {
    if (typeof middlewareAuth !== 'function') {
        throw new TypeError('Middleware de autenticação inválido.');
    }

    if (typeof middlewarePerfis !== 'function') {
        throw new TypeError('Middleware de autorização inválido.');
    }

    autenticar = middlewareAuth;
    autorizarPerfis = middlewarePerfis;
}

// Grupos de permissão.
const admin = () => autorizarPerfis('Administrador');

const equipe = () => autorizarPerfis(
    'Administrador',
    'Manutencao',
    'Porteiro'
);

const consulta = () => autorizarPerfis(
    'Administrador',
    'Manutencao',
    'Porteiro',
    'Visitante'
);

// Permissões para criação.
const perfisEscrita = {
    leituras: ['Administrador', 'Manutencao'],
    acessos: ['Administrador', 'Porteiro'],
    ocorrencias: ['Administrador', 'Manutencao', 'Porteiro']
};

// Recursos que somente o administrador pode alterar ou excluir.
const recursosAdmin = [
    'predios',
    'ambientes',
    'dispositivos'
];

// Todas as rotas exigem autenticação.
recursosRouter.use((req, res, next) => {
    return autenticar(req, res, next);
});

// Relatórios: administrador e manutenção.
recursosRouter.get(
    '/relatorios',
    autorizarPerfis('Administrador', 'Manutencao'),
    Controller.relatorios
);

// Criação, consulta, atualização e exclusão dos recursos.
for (const nome of Object.keys(recursos)) {
    const router = express.Router();
    const config = recursos[nome];

    // Consultar.
    router.get('/', consulta(), Controller.listar(nome));
    router.get('/:id', consulta(), Controller.buscar(nome));

    // Criar.
    if (config.adminEscrita) {
        router.post('/', admin(), Controller.criar(nome));
    } else if (perfisEscrita[nome]) {
        router.post(
            '/',
            autorizarPerfis(...perfisEscrita[nome]),
            Controller.criar(nome)
        );
    }

    // Atualizar.
    if (recursosAdmin.includes(nome)) {
        router.patch('/:id', admin(), Controller.atualizar(nome));
    } else if (nome === 'ocorrencias') {
        router.patch('/:id', equipe(), Controller.atualizar(nome));
    }

    // Excluir.
    if (recursosAdmin.includes(nome)) {
        router.delete('/:id', admin(), Controller.excluir(nome));
    }

    recursosRouter.use(`/${nome}`, router);
}
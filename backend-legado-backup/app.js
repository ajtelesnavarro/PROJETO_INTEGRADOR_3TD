
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { resolve } from 'node:path';

import { authRouter } from './routes/AuthRoutes.js';

import {
    recursosRouter,
    configurarSegurancaRecursos
} from './routes/recursosRoutes.js';

import {
    autenticar,
    autorizarPerfis
} from './middlewares/AuthMiddleware.js';

// Rotas de orçamento, pedido e pagamento
import { criarOrcamentoRoutes } from './src/routes/orcamentoRoutes.js';
import { criarPedidoRoutes } from './src/routes/pedidoRoutes.js';
import { criarPagamentoRoutes } from './src/routes/pagamentoRoutes.js';

// Models
import { criarOrcamentoModel } from './src/models/OrcamentoModel.js';
import { criarPedidoModel } from './src/models/PedidoModel.js';
import { criarPagamentoModel } from './src/models/PagamentoModel.js';

// Services
import { criarOrcamentoService } from './src/services/OrcamentoService.js';
import { criarPedidoService } from './src/services/PedidoService.js';
import { criarPagamentoService } from './src/services/PagamentoService.js';

// Controllers
import { criarOrcamentoController } from './src/controllers/OrcamentoController.js';
import { criarPedidoController } from './src/controllers/PedidoController.js';
import { criarPagamentoController } from './src/controllers/PagamentoController.js';

// Conexão com o banco de dados
import { pool } from './src/config/database.js';

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(helmet());

const origensPermitidas = (
    process.env.CORS_ORIGENS ||
    'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000'
)
    .split(',')
    .map(origem => origem.trim())
    .filter(Boolean);

app.use(cors({
    origin(origem, callback) {
        if (!origem || origensPermitidas.includes(origem)) {
            return callback(null, true);
        }

        return callback(
            new Error('Origem não permitida pelo CORS.')
        );
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));

// ==========================================
// CONFIGURAÇÃO DE SEGURANÇA
// ==========================================

configurarSegurancaRecursos(autenticar, autorizarPerfis);

// ==========================================
// ARQUIVOS ESTÁTICOS
// ==========================================

app.use('/uploads', express.static(resolve('uploads')));

// ==========================================
// VERIFICAÇÃO DA API
// ==========================================

app.get('/api/v1/check', (_req, res) => {
    return res.status(200).json({
        sucesso: true,
        status: 'ok',
        sistema: 'Lumora SmartBuilding'
    });
});

// ==========================================
// ROTAS DE AUTENTICAÇÃO E RECURSOS
// ==========================================

app.use('/api/v1/auth', authRouter);

app.use('/api/v1', recursosRouter);

// ==========================================
// CONFIGURAÇÃO DE ORÇAMENTO, PEDIDO E PAGAMENTO
// ==========================================

// 1. Models
const orcamentoModel = criarOrcamentoModel({ pool });
const pedidoModel = criarPedidoModel({ pool });
const pagamentoModel = criarPagamentoModel({ pool });

// 2. Services
const orcamentoService = criarOrcamentoService({
    orcamentoModel
});

const pedidoService = criarPedidoService({
    pedidoModel,
    orcamentoModel
});

const pagamentoService = criarPagamentoService({
    pagamentoModel,
    pedidoModel
});

// 3. Controllers
const orcamentoController = criarOrcamentoController({
    orcamentoService
});

const pedidoController = criarPedidoController({
    pedidoService
});

const pagamentoController = criarPagamentoController({
    pagamentoService
});

// 4. Rotas
app.use(
    '/api/v1/orcamentos',
    criarOrcamentoRoutes({ orcamentoController })
);

app.use(
    '/api/v1/pedidos',
    criarPedidoRoutes({ pedidoController })
);

app.use(
    '/api/v1/pagamentos',
    criarPagamentoRoutes({ pagamentoController })
);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// Rota não encontrada
app.use((_req, res) => {
    return res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada.'
    });
});

// Tratamento centralizado de erros
app.use((erro, _req, res, _next) => {
    const status =
        Number.isInteger(erro.status) &&
        erro.status >= 400 &&
        erro.status <= 599
            ? erro.status
            : 500;

    if (status >= 500) {
        console.error(erro);
    }

    return res.status(status).json({
        sucesso: false,
        erro: status === 500
            ? 'Erro interno do servidor.'
            : erro.message
    });
});

export default app;
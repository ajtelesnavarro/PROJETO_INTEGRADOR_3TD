
import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path";

// Rotas existentes
import { authRouter } from "../routes/AuthRoutes.js";

import {
    recursosRouter,
    configurarSegurancaRecursos
} from "../routes/recursosRoutes.js";

import {
    autenticar,
    autorizarPerfis
} from "../middlewares/AuthMiddleware.js";

// Rotas de orçamento, pedido e pagamento
import { criarOrcamentoRoutes } from "./routes/orcamentoRoutes.js";
import { criarPedidoRoutes } from "./routes/pedidoRoutes.js";
import { criarPagamentoRoutes } from "./routes/pagamentoRoutes.js";

// Models
import { criarOrcamentoModel } from "./models/OrcamentoModels.js";
import { criarPedidoModel } from "./models/PedidoModels.js";
import { criarPagamentoModel } from "./models/PagamentoModels.js";

// Services
import { criarOrcamentoService } from "./services/OrcamentoService.js";
import { criarPedidoService } from "./services/PedidoService.js";
import { criarPagamentoService } from "./services/PagamentoService.js";

// Controllers
import { criarOrcamentoController } from "./controllers/OrcamentoController.js";
import { criarPedidoController } from "./controllers/PedidoController.js";
import { criarPagamentoController } from "./controllers/PagamentoController.js";

// Banco de dados
import { pool } from "./config/database.js";

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(helmet());

const origensPermitidas = (
    process.env.CORS_ORIGENS ||
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
)
    .split(",")
    .map(origem => origem.trim())
    .filter(Boolean);

app.use(cors({
    origin(origem, callback) {
        if (!origem || origensPermitidas.includes(origem)) {
            return callback(null, true);
        }

        return callback(new Error("Origem não permitida pelo CORS."));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "1mb" }));

// ==========================================
// SEGURANÇA
// ==========================================

configurarSegurancaRecursos(autenticar, autorizarPerfis);

// ==========================================
// ARQUIVOS ESTÁTICOS
// ==========================================

app.use("/uploads", express.static(resolve("uploads")));

// ==========================================
// VERIFICAÇÃO DA API
// ==========================================

app.get("/api/v1/check", (_req, res) => {
    return res.status(200).json({
        sucesso: true,
        status: "ok",
        sistema: "Lumora SmartBuilding"
    });
});

// ==========================================
// ROTAS EXISTENTES
// ==========================================

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", recursosRouter);

// ==========================================
// ORÇAMENTO, PEDIDO E PAGAMENTO
// ==========================================

// Models
const orcamentoModel = criarOrcamentoModel({ pool });
const pedidoModel = criarPedidoModel({ pool });
const pagamentoModel = criarPagamentoModel({ pool });

// Services
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

// Controllers
const orcamentoController = criarOrcamentoController({
    orcamentoService
});

const pedidoController = criarPedidoController({
    pedidoService
});

const pagamentoController = criarPagamentoController({
    pagamentoService
});

// Rotas
app.use(
    "/api/v1/orcamentos",
    criarOrcamentoRoutes({ orcamentoController })
);

app.use(
    "/api/v1/pedidos",
    criarPedidoRoutes({ pedidoController })
);

app.use(
    "/api/v1/pagamentos",
    criarPagamentoRoutes({ pagamentoController })
);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

app.use((_req, res) => {
    return res.status(404).json({
        sucesso: false,
        erro: "Rota não encontrada."
    });
});

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
            ? "Erro interno do servidor."
            : erro.message
    });
});

export default app;

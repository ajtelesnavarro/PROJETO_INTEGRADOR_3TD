
import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { UPLOADS_DIR } from "./config/uploadPaths.js";

// Rotas existentes
import { authRouter } from "./routes/AuthRoutes.js";
import { reclamacaoRouter } from "./routes/ReclamacaoRoutes.js";

import { recursosRouter } from "./routes/RecursoRoutes.js";
import { gestaoRouter } from "./routes/GestaoRoutes.js";

// Rotas de orçamento, pedido e pagamento
import { criarOrcamentoRoutes } from "./routes/orcamentoRoutes.js";
import { criarPedidoRoutes } from "./routes/pedidoRoutes.js";
import { criarPagamentoRoutes } from "./routes/pagamentoRoutes.js";
import { tarifaEnergiaRouter } from "./routes/TarifaEnergiaRoutes.js";

// Models
import { criarOrcamentoModel } from "./models/OrcamentoModels.js";
import { criarPedidoModel } from "./models/PedidoModels.js";
import { criarPagamentoModel } from "./models/PagamentoModels.js";
import { criarProvisionamentoPredioModel } from "./models/ProvisionamentoPredioModel.js";

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
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://back.smartbuilding.10.189.87.231.sslip.io"
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "4mb" }));

// ==========================================
// ARQUIVOS ESTÁTICOS
// ==========================================

app.use(
    "/uploads",
    (_req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
    express.static(UPLOADS_DIR)
);

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
app.use("/api/v1/reclamacoes", reclamacaoRouter);

// ==========================================
// ORÇAMENTO, PEDIDO E PAGAMENTO
// ==========================================

// Models
const orcamentoModel = criarOrcamentoModel({ pool });
const pedidoModel = criarPedidoModel({ pool });
const pagamentoModel = criarPagamentoModel({ pool });
const provisionamentoPredioModel = criarProvisionamentoPredioModel({ pool });

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
    pedidoModel,
    orcamentoModel,
    provisionamentoPredioModel
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
// Rotas
app.use(
    "/api/v1/orcamentos",
    criarOrcamentoRoutes({ orcamentoController })
);

// O cliente cria/consulta o pedido depois de aprovar um orçamento, sem login.
// Registre antes dos routers protegidos montados em /api/v1.
app.use(
    "/api/v1/pedidos",
    criarPedidoRoutes({ pedidoController })
);

// O cliente registra/consulta o pagamento do pedido sem login.
app.use(
    "/api/v1/pagamentos",
    criarPagamentoRoutes({ pagamentoController })
);

app.use("/api/v1/tarifa-energia", tarifaEnergiaRouter);

// Rotas protegidas
app.use("/api/v1", recursosRouter);
app.use("/api/v1", gestaoRouter);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// SLA

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

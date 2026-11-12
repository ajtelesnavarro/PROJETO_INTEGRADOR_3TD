import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path";

// Rotas
import { authRouter } from "./routes/AuthRoutes.js";
// import { recursosRouter } from "./routes/RecursoRoutes.js";
import { orcamentoRouter } from "./routes/orcamentoRoutes.js";
import { pedidoRouter } from "./routes/pedidoRoutes.js";
import { pagamentoRouter } from "./routes/pagamentoRoutes.js";

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
// ARQUIVOS ESTÁTICOS
// ==========================================

app.use("/uploads", express.static(resolve("uploads")));

// ==========================================
// VERIFICAÇÃO DA API
// ==========================================

app.get("/api/check", (_req, res) => {
    return res.status(200).json({
        sucesso: true,
        status: "ok",
        sistema: "Lumora SmartBuilding"
    });
});

// ==========================================
// ROTAS DA API
// ==========================================

app.use("/api/auth", authRouter);
// app.use("/api/v1", recursosRouter);
app.use("/api/orcamentos", orcamentoRouter);
app.use("/api/pedidos", pedidoRouter);
app.use("/api/pagamentos", pagamentoRouter);

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

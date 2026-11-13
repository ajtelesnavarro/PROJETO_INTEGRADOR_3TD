import express from "express";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path";

// Rotas existentes
import { errorHandler } from "./middlewares/errorHandler.js";
import { autenticar, autorizarAdmin } from "./middlewares/AuthMiddleware.js";
import healthRoutes from "./routes/healthRoutes.js";
import { authRouter } from "./routes/AuthRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import orcamentoRoutes from "./routes/orcamentoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import pagamentoRoutes from "./routes/pagamentoRoutes.js";

const app = express();

// 1. Defesas de borda: Helmet e CORS

app.use(helmet());

const origensPermitidas = (
  process.env.CORS_ORIGENS || process.env.FRONTEND_URL || "http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin(origem, callback) {
      if (!origem || origensPermitidas.includes(origem)) {
        return callback(null, true);
      }
      return callback(new Error("Origem não permitida pelo CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));

// 2. Rotas

app.use("/uploads", express.static(resolve("uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "API do projeto base",
  });
});

app.use("/api/auth", authRouter);

app.use("/api/health", healthRoutes);

app.use("/api/orcamentos", orcamentoRoutes);

app.use("/api/pedidos", pedidoRoutes);

app.use("/api/pagamentos", pagamentoRoutes);

app.use("/api/usuarios", autenticar, autorizarAdmin, usuarioRoutes);

// 3. Fallback 404 (rota que não existe)

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: `A rota ${req.method} ${req.originalUrl} não existe.`,
  });
});

// 4. Tratador global de erros
app.use(errorHandler);

export default app;

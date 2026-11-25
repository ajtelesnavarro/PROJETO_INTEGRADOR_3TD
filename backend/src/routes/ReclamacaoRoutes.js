import express from "express";
import { autenticar } from "../middlewares/AuthMiddleware.js";
import * as ReclamacaoController from "../controllers/ReclamacaoController.js";

export const reclamacaoRouter = express.Router();

reclamacaoRouter.use(autenticar);
reclamacaoRouter.get("/contexto", ReclamacaoController.buscarContexto);
reclamacaoRouter.get("/", ReclamacaoController.listar);
reclamacaoRouter.post("/", ReclamacaoController.criar);
reclamacaoRouter.put("/:id", ReclamacaoController.atualizar);
reclamacaoRouter.patch("/:id/status", ReclamacaoController.mudarStatus);
reclamacaoRouter.patch("/:id/responsavel", ReclamacaoController.mudarResponsavel);

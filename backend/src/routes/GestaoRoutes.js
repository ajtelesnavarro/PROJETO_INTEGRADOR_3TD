import express from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import * as GestaoController from "../controllers/GestaoController.js";

export const gestaoRouter = express.Router();
gestaoRouter.use(autenticar);

const admin = autorizarPerfis("administrador");
const adminManutencao = autorizarPerfis("administrador", "manutencao");
const adminPorteiro = autorizarPerfis("administrador", "porteiro");
const adminManutencaoPorteiro = autorizarPerfis("administrador", "manutencao", "porteiro");

gestaoRouter.get("/equipes", adminManutencao, GestaoController.listarEquipes);
gestaoRouter.post("/equipes/:id/integrantes", adminManutencao, GestaoController.adicionarIntegrante);
gestaoRouter.patch("/equipes/:id/integrantes/:idUsuario", adminManutencao, GestaoController.atualizarIntegrante);
gestaoRouter.delete("/equipes/:id/integrantes/:idUsuario", adminManutencao, GestaoController.removerIntegrante);

gestaoRouter.get("/credenciais", adminPorteiro, GestaoController.listarCredenciais);
gestaoRouter.patch("/credenciais/:id", adminPorteiro, GestaoController.atualizarCredencial);
gestaoRouter.get("/acessos-detalhados", adminManutencaoPorteiro, GestaoController.listarAcessosDetalhado);

gestaoRouter.get("/usuarios", admin, GestaoController.listarUsuarios);

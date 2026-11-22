import express from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import * as GestaoController from "../controllers/GestaoController.js";

export const gestaoRouter = express.Router();

gestaoRouter.use(autenticar);

const consulta = autorizarPerfis("administrador", "manutencao", "porteiro", "funcionario");
const adminOuManutencao = autorizarPerfis("administrador", "manutencao");
const adminOuPorteiro = autorizarPerfis("administrador", "porteiro");

gestaoRouter.get("/equipes", consulta, GestaoController.listarEquipes);
gestaoRouter.post("/equipes/:id/integrantes", adminOuManutencao, GestaoController.adicionarIntegrante);
gestaoRouter.patch("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.atualizarIntegrante);
gestaoRouter.delete("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.removerIntegrante);

gestaoRouter.get("/credenciais", consulta, GestaoController.listarCredenciais);
gestaoRouter.patch("/credenciais/:id", adminOuPorteiro, GestaoController.atualizarCredencial);

gestaoRouter.get("/acessos-detalhados", consulta, GestaoController.listarAcessosDetalhado);
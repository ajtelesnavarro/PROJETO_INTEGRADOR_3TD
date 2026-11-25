import express from "express";
import { autenticar, autorizarPerfis, somenteAdmin } from "../middlewares/AuthMiddleware.js";
import * as GestaoController from "../controllers/GestaoController.js";

export const gestaoRouter = express.Router();

gestaoRouter.use(autenticar);

const consulta = autorizarPerfis("administrador", "manutencao", "porteiro", "funcionario");
const consultaAlertas = autorizarPerfis("administrador", "manutencao", "porteiro", "funcionario", "locador");
const adminOuManutencao = autorizarPerfis("administrador", "manutencao");
const adminOuPorteiro = autorizarPerfis("administrador", "porteiro");

gestaoRouter.get("/equipes", consulta, GestaoController.listarEquipes);
gestaoRouter.get("/usuarios", consulta, GestaoController.listarUsuarios);
gestaoRouter.post("/usuarios", somenteAdmin, GestaoController.criarUsuario);
gestaoRouter.post("/equipes", adminOuManutencao, GestaoController.criarEquipe);
gestaoRouter.get("/alertas-limites", consultaAlertas, GestaoController.listarAlertasLimites);
gestaoRouter.post("/equipes/:id/integrantes", adminOuManutencao, GestaoController.adicionarIntegrante);
gestaoRouter.patch("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.atualizarIntegrante);
gestaoRouter.delete("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.removerIntegrante);

gestaoRouter.get("/credenciais", consulta, GestaoController.listarCredenciais);
gestaoRouter.patch("/credenciais/:id", adminOuPorteiro, GestaoController.atualizarCredencial);

gestaoRouter.get("/acessos-detalhados", consulta, GestaoController.listarAcessosDetalhado);
gestaoRouter.get("/historico-dispositivos/contexto", adminOuManutencao, GestaoController.contextoHistoricoDispositivos);
gestaoRouter.get("/historico-dispositivos", adminOuManutencao, GestaoController.listarHistoricoDispositivos);
gestaoRouter.post("/historico-dispositivos", adminOuManutencao, GestaoController.criarHistoricoDispositivo);

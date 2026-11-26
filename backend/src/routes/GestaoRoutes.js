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
gestaoRouter.get("/usuarios/contexto-cadastro", adminOuPorteiro, GestaoController.contextoCadastroUsuario);
gestaoRouter.post("/usuarios", adminOuPorteiro, GestaoController.criarUsuario);
gestaoRouter.post("/equipes", adminOuManutencao, GestaoController.criarEquipe);
gestaoRouter.get("/alertas-limites", consultaAlertas, GestaoController.listarAlertasLimites);
gestaoRouter.post("/equipes/:id/integrantes", adminOuManutencao, GestaoController.adicionarIntegrante);
gestaoRouter.patch("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.atualizarIntegrante);
gestaoRouter.delete("/equipes/:id/integrantes/:idUsuario", adminOuManutencao, GestaoController.removerIntegrante);

gestaoRouter.get("/credenciais", consulta, GestaoController.listarCredenciais);
gestaoRouter.get("/permissoes-acesso", consulta, GestaoController.listarPermissoesAcesso);
gestaoRouter.patch("/credenciais/:id", adminOuPorteiro, GestaoController.atualizarCredencial);
gestaoRouter.patch("/credenciais/:id/editar", adminOuPorteiro, GestaoController.editarCredencial);
gestaoRouter.patch("/permissoes-acesso/:id", adminOuPorteiro, GestaoController.atualizarPermissaoAcesso);
gestaoRouter.patch(
  "/permissoes-acesso/usuario/:idUsuario/ambientes",
  adminOuPorteiro,
  GestaoController.atualizarAmbientesUsuario,
);

gestaoRouter.get("/acessos-detalhados", consulta, GestaoController.listarAcessosDetalhado);
gestaoRouter.post("/eventos-acesso", adminOuPorteiro, GestaoController.registrarEventoAcesso);
gestaoRouter.get("/historico-dispositivos/contexto", adminOuManutencao, GestaoController.contextoHistoricoDispositivos);
gestaoRouter.get("/historico-dispositivos", adminOuManutencao, GestaoController.listarHistoricoDispositivos);
gestaoRouter.post("/historico-dispositivos", adminOuManutencao, GestaoController.criarHistoricoDispositivo);
gestaoRouter.patch("/historico-dispositivos/:id", adminOuManutencao, GestaoController.atualizarHistoricoDispositivo);

import { Router } from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import * as C from "../controllers/CompatController.js";

export const compatRouter = Router();
compatRouter.use(autenticar);

const admin = autorizarPerfis("administrador");
const todos = autorizarPerfis("administrador", "manutencao", "porteiro", "locador");
const adminManutencao = autorizarPerfis("administrador", "manutencao");
const adminManutencaoPorteiro = autorizarPerfis("administrador", "manutencao", "porteiro");

compatRouter.get("/usuarios", admin, C.listarUsuarios);
compatRouter.get("/usuarios/ambientes", admin, C.listarUsuariosAmbientes);
compatRouter.get("/usuarios/com-acesso", admin, C.listarUsuariosComAcesso);
compatRouter.get("/reclamacoes", todos, C.listarReclamacoes);
compatRouter.post("/reclamacoes", adminManutencaoPorteiro, C.criarReclamacao);
compatRouter.put("/reclamacoes/:id", adminManutencaoPorteiro, C.atualizarReclamacao);
compatRouter.patch("/reclamacoes/:id/status", adminManutencao, C.atualizarStatusReclamacao);
compatRouter.patch("/reclamacoes/:id/responsavel", adminManutencao, C.atualizarResponsavelReclamacao);

import { Router } from "express";

import * as UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

router.get("/ambientes", UsuarioController.listarAmbientes);
router.post("/com-acesso", UsuarioController.criarComAcesso);
router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.buscarPorId);
router.post("/", UsuarioController.criar);
router.put("/:id", UsuarioController.atualizar);
router.delete("/:id", UsuarioController.excluir);

export default router;

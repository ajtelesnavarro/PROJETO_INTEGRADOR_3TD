import { Router } from "express";
import { autenticar, somenteAdmin } from "../middlewares/AuthMiddleware.js";

export function criarOrcamentoRoutes({ orcamentoController }) {
    const router = Router();

    router.get("/", autenticar, somenteAdmin, orcamentoController.listar);
    router.get("/servicos", autenticar, somenteAdmin, orcamentoController.listarServicos);
    router.post("/", orcamentoController.criar);
    router.get("/:id", orcamentoController.buscarPorId);
    router.patch("/:id", autenticar, somenteAdmin, orcamentoController.atualizarStatus);
    router.patch("/:id/aprovar", orcamentoController.aprovar);
    router.patch("/:id/recusar", orcamentoController.recusar);

    return router;
}

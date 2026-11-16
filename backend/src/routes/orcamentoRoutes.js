import { Router } from "express";

export function criarOrcamentoRoutes({ orcamentoController }) {
    const router = Router();

    router.get("/", orcamentoController.listar);
    router.post("/", orcamentoController.criar);
    router.get("/:id", orcamentoController.buscarPorId);
    router.patch("/:id", orcamentoController.atualizarStatus);
    router.patch("/:id/aprovar", orcamentoController.aprovar);
    router.patch("/:id/recusar", orcamentoController.recusar);

    return router;
}
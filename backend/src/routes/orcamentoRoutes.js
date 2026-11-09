import { Router } from "express";

export function criarOrcamentoRoutes({ orcamentoController }) {
    const router = Router();

    router.post("/", orcamentoController.criar);
    router.get("/:id", orcamentoController.buscarPorId);
    router.patch("/:id/aprovar", orcamentoController.aprovar);
    router.patch("/:id/recusar", orcamentoController.recusar);

    return router;
}
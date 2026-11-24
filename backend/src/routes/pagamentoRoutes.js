import { Router } from "express";

export function criarPagamentoRoutes({ pagamentoController }) {
    const router = Router();

    router.post("/", pagamentoController.criar);
    router.get("/:id/orcamento", pagamentoController.buscarOrcamento);
    router.get("/:id/predio", pagamentoController.buscarPredio);
    router.post("/:id/predio", pagamentoController.criarPredio);
    router.get("/:id", pagamentoController.buscarPorId);

    return router;
}

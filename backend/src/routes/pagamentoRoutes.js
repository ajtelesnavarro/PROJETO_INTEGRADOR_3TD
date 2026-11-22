import { Router } from "express";

export function criarPagamentoRoutes({ pagamentoController }) {
    const router = Router();

    router.post("/", pagamentoController.criar);
    router.get("/:id", pagamentoController.buscarPorId);
    router.patch("/:id/resultado", pagamentoController.atualizarResultado);

    return router;
}
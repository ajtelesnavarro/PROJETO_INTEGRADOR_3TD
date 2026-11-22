import { Router } from "express";

export function criarPedidoRoutes({ pedidoController }) {
    const router = Router();

    router.post("/", pedidoController.criar);
    router.get("/:id", pedidoController.buscarPorId);

    return router;
}
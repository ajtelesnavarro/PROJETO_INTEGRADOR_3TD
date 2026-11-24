import { Router } from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import * as Controller from "../controllers/TarifaEnergiaController.js";

export const tarifaEnergiaRouter = Router();
tarifaEnergiaRouter.use(autenticar);
tarifaEnergiaRouter.get("/:idPredio", Controller.buscarAtual);
tarifaEnergiaRouter.patch(
  "/:idPredio",
  autorizarPerfis("administrador", "manutencao"),
  Controller.definir
);

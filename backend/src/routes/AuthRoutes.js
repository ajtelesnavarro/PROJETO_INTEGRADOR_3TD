import express from "express";
import * as AuthController from "../controllers/AuthController.js";
import { autenticar } from "../middlewares/AuthMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/gerarToken", AuthController.gerarToken);
authRouter.get("/me", autenticar, AuthController.buscarPerfil);
authRouter.put("/me", autenticar, AuthController.atualizarPerfil);

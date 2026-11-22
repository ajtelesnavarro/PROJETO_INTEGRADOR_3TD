import express from "express";
import * as AuthController from "../controllers/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/gerarToken", AuthController.gerarToken);

import { autenticar } from "../middlewares/AuthMiddleware.js";
authRouter.get("/me", autenticar, AuthController.me);
authRouter.post("/login", AuthController.gerarToken);
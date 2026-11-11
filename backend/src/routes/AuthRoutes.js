import express from "express";
import * as AuthController from "../controllers/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/gerarToken", AuthController.gerarToken);
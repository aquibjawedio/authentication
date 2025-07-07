import { Router } from "express";
import { registerUserController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);

export { authRouter };

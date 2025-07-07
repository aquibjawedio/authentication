import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);
authRouter.route("/login").post(loginUserController);

export { authRouter };

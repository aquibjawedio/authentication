import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter
  .route("/current/:username")
  .get(isLoggedIn, getCurrentUserController);

export { userRouter };

import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  resendVerificationEmailController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);
authRouter.route("/login").post(loginUserController);
authRouter.route("/logout").post(isLoggedIn, logoutUserController);
authRouter.route("/refresh-access-token").post(refreshAccessTokenController);
authRouter.route("/verify-email/:token").post(verifyEmailController);
authRouter.route("/resend-verification-email").post(resendVerificationEmailController);

export { authRouter };

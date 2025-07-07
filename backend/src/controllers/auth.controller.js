import { registerUserSchema } from "../schemas/auth.schema.js";
import { registerUserService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(
    req.body
  );

  const user = await registerUserService({
    fullname,
    username,
    email,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", { user }));
});

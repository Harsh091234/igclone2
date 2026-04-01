import { Router } from "express";

import { registerUser } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUserSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);

export default router;

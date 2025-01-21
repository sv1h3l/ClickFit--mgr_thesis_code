import { Router } from "express";
import { emailVerificationController } from "./controllers/emailVerificationController";
import { forgottenPasswordController } from "./controllers/forgottenPasswordController";
import { loginController } from "./controllers/loginController";
import { registerController } from "./controllers/registerController";
import { verifyEmailController } from "./controllers/verifyEmailController";
import { newPasswordController } from "./controllers/newPasswordController";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/send-email", emailVerificationController);
router.post("/forgotten-password", forgottenPasswordController);
router.post("/new-password", newPasswordController);

router.get("/verify-email", verifyEmailController);

export default router;

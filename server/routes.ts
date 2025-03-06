import { Router } from "express";
import { categoryCreationController } from "./controllers/categoryCreationController";
import { deleteExerciseController } from "./controllers/deleteExerciseController";
import { emailVerificationController } from "./controllers/emailVerificationController";
import { exerciseCreationController } from "./controllers/exerciseCreationController";
import { forgottenPasswordController } from "./controllers/forgottenPasswordController";
import { getCategoriesAndExercisesController } from "./controllers/getCategoriesAndExercisesController";
import { getExercisesController } from "./controllers/getExercisesController";
import { getSportsController } from "./controllers/getSportsController";
import { loginController } from "./controllers/loginController";
import { newPasswordController } from "./controllers/newPasswordController";
import { registerController } from "./controllers/registerController";
import { sportCreationController } from "./controllers/sportCreationController";
import { verifyEmailController } from "./controllers/verifyEmailController";
import { moveExerciseController } from "./controllers/moveExerciseController";

const router = Router();

// POSTs requests
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/send-email", emailVerificationController);
router.post("/forgotten-password", forgottenPasswordController);
router.post("/new-password", newPasswordController);

router.post("/create-sport", sportCreationController);
router.post("/create-category", categoryCreationController);
router.post("/create-exercise", exerciseCreationController);

router.post("/delete-exercise", deleteExerciseController);

router.post("/move-exercise", moveExerciseController);

// GETs requests
router.get("/verify-email", verifyEmailController);

router.get("/get-sports", getSportsController);
router.get("/get-exercises", getExercisesController);
router.get("/get-categories-and-exercises", getCategoriesAndExercisesController);

export default router;

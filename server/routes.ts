// #region Imports
import { Router } from "express";
import { changeExerciseDescriptionController } from "./controllers/change/changeExerciseDescriptionController";
import { createExerciseInformationValueController } from "./controllers/create/createExerciseInformationValueController";
import { changeYoutubeLinkController } from "./controllers/change/changeYoutubeLinkController";
import { createCategoryController } from "./controllers/create/createCategoryController";
import { createExerciseController } from "./controllers/create/createExerciseController";
import { createExerciseInformationLabelController } from "./controllers/create/createExerciseInformationLabelController";
import { createSportController } from "./controllers/create/createSportController";
import { deleteCategoryController } from "./controllers/delete/deleteCategoryController";
import { deleteExerciseController } from "./controllers/delete/deleteExerciseController";
import { getCategoriesAndExercisesController } from "./controllers/get/getCategoriesAndExercisesController";
import { getExerciseInformationLabelsController } from "./controllers/get/getExerciseInformationLabelsController";
import { getExerciseInformationValuesController } from "./controllers/get/getExerciseInformationValuesController";
import { getExercisesController } from "./controllers/get/getExercisesController";
import { getSportsController } from "./controllers/get/getSportsController";
import { moveCategoryController } from "./controllers/move/moveCategoryController";
import { moveExerciseController } from "./controllers/move/moveExerciseController";
import { emailVerificationController } from "./controllers/residue/emailVerificationController";
import { forgottenPasswordController } from "./controllers/residue/forgottenPasswordController";
import { loginController } from "./controllers/residue/loginController";
import { newPasswordController } from "./controllers/residue/newPasswordController";
import { registerController } from "./controllers/residue/registerController";
import { verifyEmailController } from "./controllers/residue/verifyEmailController";
// #endregion

const router = Router();

// POSTs requests
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/send-email", emailVerificationController);
router.post("/forgotten-password", forgottenPasswordController);
router.post("/new-password", newPasswordController);

router.post("/create-sport", createSportController);
router.post("/create-category", createCategoryController);
router.post("/create-exercise", createExerciseController);
router.post("/create-exercise-information-label", createExerciseInformationLabelController);
router.post("/create-exercise-information-value", createExerciseInformationValueController);


router.post("/delete-category", deleteCategoryController);
router.post("/delete-exercise", deleteExerciseController);

router.post("/move-category", moveCategoryController);
router.post("/move-exercise", moveExerciseController);

router.post("/change-exercise-description", changeExerciseDescriptionController);
router.post("/change-youtube-link", changeYoutubeLinkController);

// GETs requests
router.get("/verify-email", verifyEmailController);

router.get("/get-sports", getSportsController);
router.get("/get-exercises", getExercisesController);
router.get("/get-categories-and-exercises", getCategoriesAndExercisesController);
router.get("/get-exercise-information-labels", getExerciseInformationLabelsController);
router.get("/get-exercise-information-values", getExerciseInformationValuesController);

export default router;

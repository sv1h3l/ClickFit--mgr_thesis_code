// #region Imports
import { Router } from "express";
import { changeBlacklistCont } from "./controllers/change/changeBlacklistCont";
import { changeCategoryCont } from "./controllers/change/changeCategoryCont";
import { changeDiaryContentCont } from "./controllers/change/changeDiaryContentCont";
import { changeDescCont } from "./controllers/change/changeDescCont";
import { changeExerciseDifficultyRecommendedValsCont } from "./controllers/change/changeExerciseDifficultyRecommendedValsCont";
import { changeHasRepeatabilityCont } from "./controllers/change/changeHasRepeatabilityCont";
import { changeExerciseRecommendedValsCont } from "./controllers/change/changeExerciseRecommendedValsCont";
import { changeRepeatabilityQuantityCont } from "./controllers/change/changeRepeatabilityQuantityCont";
import { changeExerciseUnitCodeCont } from "./controllers/change/changeExerciseUnitCodeCont";
import { changeGoalGraphValueCont } from "./controllers/change/changeGoalGraphValueCont";
import { changeGraphCont } from "./controllers/change/changeGraphCont";
import { changeGraphValueCont } from "./controllers/change/changeGraphValueCont";
import { changeLooseEntityCont } from "./controllers/change/changeLooseEntityCont";
import { changeSportDescCont } from "./controllers/change/changeSportDescCont";
import { changeSportDetailValCont } from "./controllers/change/changeSportDetailValCont";
import { changeSportDifficultyCont } from "./controllers/change/changeSportDifficultyCont";
import { changeSportHasAutomaticPlanCreationCont } from "./controllers/change/changeSportHasAutomaticPlanCreationCont";
import { changeSportHasCategoriesCont } from "./controllers/change/changeSportHasCategoriesCont";
import { changeSportHasDifficultiesCont } from "./controllers/change/changeSportHasDifficultiesCont";
import { changeSportHasRecommendedDifficultyValsCont } from "./controllers/change/changeSportHasRecommendedDifficultyValsCont";
import { changeSportHasRecommendedValsCont } from "./controllers/change/changeSportHasRecommendedValsCont";
import { changeUnitCodeCont } from "./controllers/change/changeUnitCodeCont";
import { changeUserAtrCont } from "./controllers/change/changeUserAtrCont";
import { changeUserHealthCont } from "./controllers/change/changeUserHealthCont";
import { changeUserPswCont } from "./controllers/change/changeUserPswCont";
import { changeYoutubeLinkCont } from "./controllers/change/changeYoutubeLinkCont";
import { createCategoryCont } from "./controllers/create/createCategoryCont";
import { createConnectionCont } from "./controllers/create/createConnectionCont";
import { createExerciseCont } from "./controllers/create/createExerciseCont";
import { createExerciseDifficultyRecommendedValsCont } from "./controllers/create/createExerciseDifficultyRecommendedValsCont";
import { createExerciseInformationLabCont } from "./controllers/create/createExerciseInformationLabCont";
import { createExerciseInformationValCont } from "./controllers/create/createExerciseInformationValCont";
import { createGraphCont } from "./controllers/create/createGraphCont";
import { createGraphValueCont } from "./controllers/create/createGraphValueCont";
import { createSportCont } from "./controllers/create/createSportCont";
import { createSportDetailLabCont } from "./controllers/create/createSportDetailLabCont";
import { createSportDifficultyCont } from "./controllers/create/createSportDifficultyCont";
import { createTrainingPlanCont } from "./controllers/create/createTrainingPlanCont";
import { deleteCategoryController } from "./controllers/delete/deleteCategoryCont";
import { deleteExerciseCont } from "./controllers/delete/deleteExerciseCont";
import { deleteExerciseInformationLabCont } from "./controllers/delete/deleteExerciseInformationLabCont";
import { deleteGraphCont } from "./controllers/delete/deleteGraphCont";
import { deleteGraphValueCont } from "./controllers/delete/deleteGraphValueCont";
import { deleteSportDetailLabCont } from "./controllers/delete/deleteSportDetailLabCont";
import { deleteSportDifficultyCont } from "./controllers/delete/deleteSportDifficultyCont";
import { getAllUserAtrsCont } from "./controllers/get/getAllUserAtrsCont";
import { getAllVisitedUserAtrsCont } from "./controllers/get/getAllVisitedUserAtrsCont";
import { getCategoriesWithExercisesCont } from "./controllers/get/getCategoriesWithExercisesCont";
import { getConnectedUserAndMessagesCont } from "./controllers/get/getConnectedUserAndMessagesCont";
import { getConnectionAtrsCont } from "./controllers/get/getConnectionAtrsCont";
import { getDiaryCont } from "./controllers/get/getDiaryCont";
import { getDifficultiesCont } from "./controllers/get/getDifficultiesCont";
import { getExerciseDifficultiesCont } from "./controllers/get/getExerciseDifficultiesCont";
import { getExerciseInformationLabsCont } from "./controllers/get/getExerciseInformationLabsCont";
import { getExerciseInformationValsCont } from "./controllers/get/getExerciseInformationValsCont";
import { getExercisesCont } from "./controllers/get/getExercisesCont";
import { getGraphsCont } from "./controllers/get/getGraphsCont";
import { getGraphValuesCont } from "./controllers/get/getGraphValuesCont";
import { getSportDetailLabsAndValsCont } from "./controllers/get/getSportDetailLabsAndValsCont";
import { getSportsCont } from "./controllers/get/getSportsCont";
import { getTrainingPlanCreationPropsCont } from "./controllers/get/getTrainingPlanCreationPropsCont";
import { getTrainingPlanExercisesCont } from "./controllers/get/getTrainingPlanExercisesCont";
import { getTrainingPlansCont } from "./controllers/get/getTrainingPlansCont";
import { getVisitedUserSportsCont } from "./controllers/get/getVisitedUserSportsCont";
import { hideDefaultGraphCont } from "./controllers/move/hideDefaultGraphCont";
import { moveCategoryCont } from "./controllers/move/moveCategoryCont";
import { moveExerciseCont } from "./controllers/move/moveExerciseCont";
import { moveExerciseInformationLabCont } from "./controllers/move/moveExerciseInformationLabCont";
import { moveGraphCont } from "./controllers/move/moveGraphCont";
import { moveGraphValueCont } from "./controllers/move/moveGraphValueCont";
import { moveSportDetailLabelCont } from "./controllers/move/moveSportDetailLabelCont";
import { moveSportDifficultyCont } from "./controllers/move/moveSportDifficultyCont";
import { showDefaultGraphCont } from "./controllers/move/showDefaultGraphCont";
import { emailVerificationCont } from "./controllers/residue/emailVerificationCont";
import { forgottenPasswordCont } from "./controllers/residue/forgottenPasswordCont";
import { loginCont } from "./controllers/residue/loginCont";
import { newPswCont } from "./controllers/residue/newPswCont";
import { registerCont } from "./controllers/residue/registerCont";
import { verifyEmailCont } from "./controllers/residue/verifyEmailCont";
import { changeTightEntityCont } from "./controllers/change/changeTightEntityCont";
import { changePriorityPointsCont } from "./controllers/change/changePriorityPointsCont";
// #endregion

const router = Router();

// POSTs requests
router.post("/register", registerCont);
router.post("/login", loginCont);
router.post("/send-email", emailVerificationCont);
router.post("/forgotten-password", forgottenPasswordCont);
router.post("/new-password", newPswCont);

router.post("/create-sport", createSportCont);
router.post("/create-sport-detail-label", createSportDetailLabCont);
router.post("/create-category", createCategoryCont);
router.post("/create-exercise", createExerciseCont);
router.post("/create-exercise-information-label", createExerciseInformationLabCont);
router.post("/create-exercise-information-value", createExerciseInformationValCont);
router.post("/create-sport-difficulty", createSportDifficultyCont);
router.post("/create-exercise-difficulty-recommended-values", createExerciseDifficultyRecommendedValsCont);
router.post("/create-graph", createGraphCont);
router.post("/create-graph-value", createGraphValueCont);
router.post("/create-connection", createConnectionCont);
router.post("/create-training-plan", createTrainingPlanCont);

router.post("/delete-category", deleteCategoryController);
router.post("/delete-exercise", deleteExerciseCont);
router.post("/delete-exercise-information-label", deleteExerciseInformationLabCont);
router.post("/delete-sport-detail-label", deleteSportDetailLabCont);
router.post("/delete-sport-difficulty", deleteSportDifficultyCont);
router.post("/delete-graph-value", deleteGraphValueCont);
router.post("/delete-graph", deleteGraphCont);

router.post("/move-category", moveCategoryCont);
router.post("/move-exercise", moveExerciseCont);
router.post("/move-sport-difficulty", moveSportDifficultyCont);
router.post("/move-sport-detail-label", moveSportDetailLabelCont);
router.post("/move-exercise-information-label", moveExerciseInformationLabCont);
router.post("/move-graph-value", moveGraphValueCont);
router.post("/move-graph", moveGraphCont);
router.post("/hide-default-graph", hideDefaultGraphCont);
router.post("/show-default-graph", showDefaultGraphCont);

router.post("/change-category", changeCategoryCont);
router.post("/change-sport-difficulty", changeSportDifficultyCont);
router.post("/change-sport-description", changeSportDescCont);
router.post("/change-sport-detail-value", changeSportDetailValCont);
router.post("/change-sport-has-categories", changeSportHasCategoriesCont);
router.post("/change-sport-has-difficulties", changeSportHasDifficultiesCont);
router.post("/change-sport-has-recommended-values", changeSportHasRecommendedValsCont);
router.post("/change-sport-has-recommended-difficulty-values", changeSportHasRecommendedDifficultyValsCont);
router.post("/change-sport-has-automatic-plan-creation", changeSportHasAutomaticPlanCreationCont);
router.post("/change-unit-code", changeUnitCodeCont);
router.post("/change-exercise-series-repetitions-or-burden", changeExerciseRecommendedValsCont);
router.post("/change-exercise-with-difficulty-series-repetitions-or-burden", changeExerciseDifficultyRecommendedValsCont);
router.post("/change-exercise-unit-code", changeExerciseUnitCodeCont);
router.post("/change-description", changeDescCont);
router.post("/change-has-repeatability", changeHasRepeatabilityCont);
router.post("/change-repeatability-quantity", changeRepeatabilityQuantityCont);
router.post("/change-loose-entity", changeLooseEntityCont);
router.post("/change-tight-connection", changeTightEntityCont);
router.post("/change-priority-points", changePriorityPointsCont);
router.post("/change-blacklist", changeBlacklistCont);


router.post("/change-youtube-link", changeYoutubeLinkCont);
router.post("/change-user-health", changeUserHealthCont);
router.post("/change-user-password", changeUserPswCont);
router.post("/change-user-atr", changeUserAtrCont);
router.post("/change-diary-content", changeDiaryContentCont);
router.post("/change-graph-value", changeGraphValueCont);
router.post("/change-goal-graph-value", changeGoalGraphValueCont);
router.post("/change-graph", changeGraphCont);

// GETs requests
router.get("/verify-email", verifyEmailCont);
router.get("/get-sports", getSportsCont);
router.get("/get-visited-user-sports", getVisitedUserSportsCont);
router.get("/get-training-plan-creation-props", getTrainingPlanCreationPropsCont);
router.get("/get-training-plans", getTrainingPlansCont);
router.get("/get-training-plan-exercises", getTrainingPlanExercisesCont);
router.get("/get-sport-detail-labels-and-values", getSportDetailLabsAndValsCont);
router.get("/get-exercises", getExercisesCont);
router.get("/get-categories-and-exercises", getCategoriesWithExercisesCont);
router.get("/get-difficulties", getDifficultiesCont);
router.get("/get-exercise-difficulties", getExerciseDifficultiesCont);
router.get("/get-exercise-information-labels", getExerciseInformationLabsCont);
router.get("/get-exercise-information-values", getExerciseInformationValsCont);
router.get("/get-all-user-atrs", getAllUserAtrsCont);
router.get("/get-all-visited-user-atrs", getAllVisitedUserAtrsCont);
router.get("/get-diary", getDiaryCont);
router.get("/get-graphs", getGraphsCont);
router.get("/get-graph-values", getGraphValuesCont);
router.get("/get-connection-attributes", getConnectionAtrsCont);
router.get("/get-connected-user-and-messages", getConnectedUserAndMessagesCont);

export default router;

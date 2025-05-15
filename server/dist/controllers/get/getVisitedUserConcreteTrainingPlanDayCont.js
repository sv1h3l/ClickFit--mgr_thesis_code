"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserConcreteTrainingPlanDayCont = void 0;
const getConcreteTrainingPlanExercisesMod_1 = require("../../models/get/getConcreteTrainingPlanExercisesMod");
const getConcreteTrainingPlanMod_1 = require("../../models/get/getConcreteTrainingPlanMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserConcreteTrainingPlanDayCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    const trainingPlanId = Number(req.query.trainingPlanId);
    if (!trainingPlanId || trainingPlanId < 1) {
        res.status(400).json({ message: "Nevalidní ID tréninkového plánu" });
        return;
    }
    const dayOrderNumber = Number(req.query.dayOrderNumber);
    if (!dayOrderNumber || dayOrderNumber < 1) {
        res.status(400).json({ message: "Nevalidní identifikátor dne tréninkového plánu" });
        return;
    }
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResTrainingPlanExercises = await (0, getConcreteTrainingPlanExercisesMod_1.getConcreteTrainingPlanExercisesMod)({ trainingPlanId, dayOrderNumber });
        const dbResTrainingPlan = await (0, getConcreteTrainingPlanMod_1.getConcreteTrainingPlanMod)({ trainingPlanId });
        res.status(dbResTrainingPlanExercises.status).json({
            message: dbResTrainingPlanExercises.message,
            data: {
                trainingPlan: dbResTrainingPlan.data,
                trainingPlanExercises: dbResTrainingPlanExercises.data,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getVisitedUserConcreteTrainingPlanDayCont = getVisitedUserConcreteTrainingPlanDayCont;
//# sourceMappingURL=getVisitedUserConcreteTrainingPlanDayCont.js.map
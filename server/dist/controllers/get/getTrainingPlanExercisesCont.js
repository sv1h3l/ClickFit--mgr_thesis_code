"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingPlanExercisesCont = void 0;
const getTrainingPlanExercisesMod_1 = require("../../models/get/getTrainingPlanExercisesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getTrainingPlanExercisesCont = async (req, res) => {
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
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: trainingPlanId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS && !checkRes.data) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResTrainingPlanExercises = await (0, getTrainingPlanExercisesMod_1.getTrainingPlanExercisesMod)({ trainingPlanId });
        res.status(dbResTrainingPlanExercises.status).json({
            message: dbResTrainingPlanExercises.message,
            data: {
                trainingPlanExercises: dbResTrainingPlanExercises.data,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getTrainingPlanExercisesCont = getTrainingPlanExercisesCont;
//# sourceMappingURL=getTrainingPlanExercisesCont.js.map
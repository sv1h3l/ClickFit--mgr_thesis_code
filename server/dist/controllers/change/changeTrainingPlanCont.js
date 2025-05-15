"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTrainingPlanCont = void 0;
const changeTrainingPlanMod_1 = require("../../models/change/changeTrainingPlanMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeTrainingPlanCont = async (req, res) => {
    const props = req.body;
    if (!props.trainingPlanId && props.trainingPlanId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID tréninkového plánu." });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: props.trainingPlanId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeTrainingPlanMod_1.changeTrainingPlanMod)({
            trainingPlanId: props.trainingPlanId,
            trainingPlanName: props.trainingPlanName,
            trainingPlanExercises: props.trainingPlanExercises,
            hasBurdenAndUnit: props.hasBurdenAndUnit,
            unitCode: props.unitCode,
        });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeTrainingPlanCont = changeTrainingPlanCont;
//# sourceMappingURL=changeTrainingPlanCont.js.map
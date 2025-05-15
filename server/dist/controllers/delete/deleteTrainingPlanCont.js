"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingPlanCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const deleteTrainingPlanMod_1 = require("../../models/delete/deleteTrainingPlanMod");
const deleteTrainingPlanCont = async (req, res) => {
    const { trainingPlanId, orderNumber } = req.body;
    if (!trainingPlanId || trainingPlanId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!orderNumber || orderNumber === -1) {
        res.status(400).json({ message: "Předáno nevalidní číslo pořadí tréninkového plánu." });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: trainingPlanId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.TRAINING_PLAN_VIEW });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, deleteTrainingPlanMod_1.deleteTrainingPlanMod)({ trainingPlanId, orderNumber });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteTrainingPlanCont = deleteTrainingPlanCont;
//# sourceMappingURL=deleteTrainingPlanCont.js.map
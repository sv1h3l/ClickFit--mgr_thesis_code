"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserTrainingPlansCont = void 0;
const getTrainingPlansMod_1 = require("../../models/get/getTrainingPlansMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserTrainingPlansCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token", data: [] });
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
        const dbResTrainingPlans = await (0, getTrainingPlansMod_1.getTrainingPlansMod)({ userId: visitedUserId });
        res.status(dbResTrainingPlans.status).json({
            message: dbResTrainingPlans.message,
            data: {
                userId: visitedUserId,
                trainingPlans: dbResTrainingPlans.data,
            },
        });
    }
    catch (error) {
        console.error("Chyba při získání tréninkových plánů: ", error);
        res.status(500).json({ message: "Chyba při získání tréninkových plánů" });
    }
};
exports.getVisitedUserTrainingPlansCont = getVisitedUserTrainingPlansCont;
//# sourceMappingURL=getVisitedUserTrainingPlansCont.js.map
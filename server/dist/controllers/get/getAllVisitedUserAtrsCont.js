"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVisitedUserAtrsCont = void 0;
const getAllUserAtrsMod_1 = require("../../models/get/getAllUserAtrsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getAllVisitedUserAtrsCont = async (req, res) => {
    const authToken = req.headers["authorization"]?.split(" ")[1];
    if (!authToken) {
        res.status(400).json({ message: "Chybějící token" });
        return;
    }
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const allUserAtrs = await (0, getAllUserAtrsMod_1.getAllUserAtrsMod)({ userId: visitedUserId });
        let formattedUser;
        if (allUserAtrs.status === GenResEnum_1.GenEnum.SUCCESS || allUserAtrs.data) {
            formattedUser = {
                userId: allUserAtrs.data.user_id,
                subscriptionId: allUserAtrs.data.subscription_id,
                email: "",
                firstName: allUserAtrs.data.first_name,
                lastName: allUserAtrs.data.last_name,
                height: allUserAtrs.data.height,
                weight: allUserAtrs.data.weight,
                age: allUserAtrs.data.age,
                sex: allUserAtrs.data.sex,
                health: allUserAtrs.data.health,
            };
        }
        res.status(allUserAtrs.status).json({ message: allUserAtrs.message, data: formattedUser });
    }
    catch (error) {
        console.error("Nastala serverová chyba: " + error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getAllVisitedUserAtrsCont = getAllVisitedUserAtrsCont;
//# sourceMappingURL=getAllVisitedUserAtrsCont.js.map
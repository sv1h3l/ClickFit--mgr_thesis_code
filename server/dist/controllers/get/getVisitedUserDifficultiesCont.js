"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserDifficultiesCont = void 0;
const getDifficultiesMod_1 = require("../../models/get/getDifficultiesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserDifficultiesCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
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
        const dbRes = await (0, getDifficultiesMod_1.getDifficultiesMod)({ sportId: sportIdNumber });
        let difficulties;
        if (dbRes.data && dbRes.data.length > 0) {
            difficulties = dbRes.data
                .map((difficulty) => ({
                sportDifficultyId: difficulty.sport_difficulty_id,
                difficultyName: difficulty.difficulty_name,
                orderNumber: difficulty.order_number,
            }))
                .sort((a, b) => a.orderNumber - b.orderNumber);
        }
        res.status(dbRes.status).json({ message: dbRes.message, data: difficulties });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getVisitedUserDifficultiesCont = getVisitedUserDifficultiesCont;
//# sourceMappingURL=getVisitedUserDifficultiesCont.js.map
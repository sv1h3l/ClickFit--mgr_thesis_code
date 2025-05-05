"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveSportDifficultyCont = void 0;
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const reorderTwoSportDifficultiesMod_1 = require("../../models/move/reorderTwoSportDifficultiesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveSportDifficultyCont = async (req, res) => {
    const { sportId, reorderDifficulties } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (reorderDifficulties.length < 1) {
        res.status(400).json({ message: "Nebyly předány obtížnosti pro přeuspořádání" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbReorderResult = await (0, reorderTwoSportDifficultiesMod_1.reorderTwoSportDifficultiesMod)({ sportId, reorderDifficulties });
        res.status(dbReorderResult.status).json({ message: dbReorderResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveSportDifficultyCont = moveSportDifficultyCont;
//# sourceMappingURL=moveSportDifficultyCont.js.map
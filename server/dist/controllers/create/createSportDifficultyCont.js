"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportDifficultyCont = void 0;
const createSportDifficultyMod_1 = require("../../models/create/createSportDifficultyMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createSportDifficultyCont = async (req, res) => {
    const { sportId, difficultyName, orderNumber } = req.body;
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, createSportDifficultyMod_1.createSportDifficultyMod)({ sportId, difficultyName, orderNumber });
        res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createSportDifficultyCont = createSportDifficultyCont;
//# sourceMappingURL=createSportDifficultyCont.js.map
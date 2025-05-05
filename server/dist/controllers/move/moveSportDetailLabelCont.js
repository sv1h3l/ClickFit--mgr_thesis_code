"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveSportDetailLabelCont = void 0;
const moveSportDetailLabelMod_1 = require("../../models/move/moveSportDetailLabelMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const moveSportDetailLabelCont = async (req, res) => {
    const { sportId, reorderSportDetailLabels } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (reorderSportDetailLabels.length < 1) {
        res.status(400).json({ message: "Nebyly předány informace o cvicích pro přeuspořádání" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbReorderResult = await (0, moveSportDetailLabelMod_1.moveSportDetailLabelMod)({ sportId, reorderSportDetailLabels });
        res.status(dbReorderResult.status).json({ message: dbReorderResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveSportDetailLabelCont = moveSportDetailLabelCont;
//# sourceMappingURL=moveSportDetailLabelCont.js.map
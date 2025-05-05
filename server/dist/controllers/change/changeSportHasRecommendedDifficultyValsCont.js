"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasRecommendedDifficultyValsCont = void 0;
const changeSportHasRecommendedDifficultyValsMod_1 = require("../../models/change/changeSportHasRecommendedDifficultyValsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeSportHasRecommendedDifficultyValsCont = async (req, res) => {
    const { sportId, hasRecommendedDifficultyValues } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResult = await (0, changeSportHasRecommendedDifficultyValsMod_1.changeSportHasRecommendedDifficultyValsMod)({ sportId, hasRecommendedDifficultyValues });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSportHasRecommendedDifficultyValsCont = changeSportHasRecommendedDifficultyValsCont;
//# sourceMappingURL=changeSportHasRecommendedDifficultyValsCont.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseDifficultyRecommendedValsCont = void 0;
const createExerciseDifficultyRecommendedValsMod_1 = require("../../models/create/createExerciseDifficultyRecommendedValsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const createExerciseDifficultyRecommendedValsCont = async (req, res) => {
    const { sportId, sportDifficultyId, exerciseId, series, repetitions, burden } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!sportDifficultyId || sportDifficultyId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID obtížnosti sportu" });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, createExerciseDifficultyRecommendedValsMod_1.createExerciseDifficultyRecommendedValsMod)({ sportDifficultyId, exerciseId, series, repetitions, burden });
        res.status(dbResult.status).json({ message: dbResult.message, data: dbResult.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createExerciseDifficultyRecommendedValsCont = createExerciseDifficultyRecommendedValsCont;
//# sourceMappingURL=createExerciseDifficultyRecommendedValsCont.js.map
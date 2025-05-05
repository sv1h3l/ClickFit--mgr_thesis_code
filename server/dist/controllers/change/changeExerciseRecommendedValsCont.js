"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseRecommendedValsCont = void 0;
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeExerciseRecommendedValsMod_1 = require("../../models/change/changeExerciseRecommendedValsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseRecommendedValsCont = async (req, res) => {
    const { sportId, exerciseId, seriesRepetitonsOrBurden, series, repetitions, burden } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku" });
        return;
    }
    if (seriesRepetitonsOrBurden < 1 || seriesRepetitonsOrBurden > 3) {
        res.status(400).json({ message: "Nebyl předán kód identifikující série, opakování nebo zátěž" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeExerciseRecommendedValsMod_1.changeExerciseRecommendedValsMod)({ sportId, exerciseId, seriesRepetitonsOrBurden, series, repetitions, burden });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeExerciseRecommendedValsCont = changeExerciseRecommendedValsCont;
//# sourceMappingURL=changeExerciseRecommendedValsCont.js.map
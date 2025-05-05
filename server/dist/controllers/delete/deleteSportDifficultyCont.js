"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportDifficultyCont = void 0;
const changeExercisesDifficultyMod_1 = require("../../models/change/changeExercisesDifficultyMod");
const deleteSportDifficultyMod_1 = require("../../models/delete/deleteSportDifficultyMod");
const getSportDifficultyNeighbourMod_1 = require("../../models/get/getSportDifficultyNeighbourMod");
const reorderSportDifficultiesMod_1 = require("../../models/move/reorderSportDifficultiesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const deleteSportDifficultyCont = async (req, res) => {
    const { sportId, sportDifficultyId, orderNumber } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!sportDifficultyId || sportDifficultyId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID obtížnosti" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const resSportDifficultyNeighbour = await (0, getSportDifficultyNeighbourMod_1.getSportDifficultyNeighbourMod)({ sportId, orderNumber });
        if (resSportDifficultyNeighbour.status === GenResEnum_1.GenEnum.FAILURE || !resSportDifficultyNeighbour.data) {
            res.status(resSportDifficultyNeighbour.status).json({ message: resSportDifficultyNeighbour.message });
            return;
        }
        const resExercisesDifficulty = await (0, changeExercisesDifficultyMod_1.changeExercisesDifficultyMod)({ sportId, sportDifficultyId, newSportDifficultyId: resSportDifficultyNeighbour.data });
        if (resExercisesDifficulty.status === GenResEnum_1.GenEnum.FAILURE) {
            res.status(resExercisesDifficulty.status).json({ message: resExercisesDifficulty.message });
            return;
        }
        const dbDeleteSportDifficultyResult = await (0, deleteSportDifficultyMod_1.deleteSportDifficultyMod)({ sportId, sportDifficultyId });
        if (dbDeleteSportDifficultyResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            await (0, reorderSportDifficultiesMod_1.reorderSportDifficultiesMod)({ sportId, orderNumber });
        }
        res.status(dbDeleteSportDifficultyResult.status).json({ message: dbDeleteSportDifficultyResult.message, data: resSportDifficultyNeighbour.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteSportDifficultyCont = deleteSportDifficultyCont;
//# sourceMappingURL=deleteSportDifficultyCont.js.map
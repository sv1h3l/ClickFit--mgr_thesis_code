"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseNameCont = void 0;
const changeExerciseNameMod_1 = require("../../models/change/changeExerciseNameMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const checkExerciseNameExistenceMod_1 = require("../../models/residue/checkExerciseNameExistenceMod");
const changeExerciseNameCont = async (req, res) => {
    const { sportId, exerciseId, exerciseName } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku." });
        return;
    }
    if (exerciseName.length < 1) {
        res.status(400).json({ message: "Název nesmí být prázdný" });
        return;
    }
    if (exerciseName.length > 75) {
        res.status(400).json({ message: "Název nesmí být delší než 75 znaků" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const checkExerciseNameRes = await (0, checkExerciseNameExistenceMod_1.checkExerciseNameExistenceMod)({ sportId, exerciseName });
        if (checkExerciseNameRes.status === GenResEnum_1.GenEnum.ALREADY_EXISTS) {
            res.status(checkExerciseNameRes.status).json({ message: checkExerciseNameRes.message });
            return;
        }
        const dbResult = await (0, changeExerciseNameMod_1.changeExerciseNameMod)({ sportId, exerciseId, exerciseName });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeExerciseNameCont = changeExerciseNameCont;
//# sourceMappingURL=changeExerciseNameCont.js.map
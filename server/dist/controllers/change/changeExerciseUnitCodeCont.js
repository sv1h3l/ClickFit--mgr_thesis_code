"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExerciseUnitCodeCont = void 0;
const changeExerciseUnitCodeMod_1 = require("../../models/change/changeExerciseUnitCodeMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeExerciseUnitCodeCont = async (req, res) => {
    const { sportId, exerciseId, unitCode } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku" });
        return;
    }
    if (!unitCode || unitCode === -1) {
        res.status(400).json({ message: "Předán nevalidní kód jednotky" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeExerciseUnitCodeMod_1.changeExerciseUnitCodeMod)({ sportId, exerciseId, unitCode });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeExerciseUnitCodeCont = changeExerciseUnitCodeCont;
//# sourceMappingURL=changeExerciseUnitCodeCont.js.map
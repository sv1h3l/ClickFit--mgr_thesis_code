"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveExerciseInformationLabCont = void 0;
const reorderExerciseInformationLabsMod_1 = require("../../models/move/reorderExerciseInformationLabsMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const moveExerciseInformationLabCont = async (req, res) => {
    const { sportId, reorderExerciseInformationLabels } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (reorderExerciseInformationLabels.length < 1) {
        res.status(400).json({ message: "Nebyly předány informace o cvicích pro přeuspořádání" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbReorderResult = await (0, reorderExerciseInformationLabsMod_1.reorderExerciseInformationLabsMod)({ sportId, reorderExerciseInformationLabels });
        res.status(dbReorderResult.status).json({ message: dbReorderResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveExerciseInformationLabCont = moveExerciseInformationLabCont;
//# sourceMappingURL=moveExerciseInformationLabCont.js.map
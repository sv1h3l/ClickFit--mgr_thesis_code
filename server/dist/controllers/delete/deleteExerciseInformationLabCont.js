"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseInformationLabCont = void 0;
const deleteExerciseInformationLabMod_1 = require("../../models/delete/deleteExerciseInformationLabMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderExerciseInformationLabsMod_1 = require("../../models/move/reorderExerciseInformationLabsMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const deleteExerciseInformationValsMod_1 = require("../../models/delete/deleteExerciseInformationValsMod");
const deleteExerciseInformationLabCont = async (req, res) => {
    const { sportId, exerciseInformationLabelId, reorderExerciseInformationLabels } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!exerciseInformationLabelId || exerciseInformationLabelId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT }); // FIXME vložit return k ostatním checkAutorization
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbDeleteLabelResult = await (0, deleteExerciseInformationLabMod_1.deleteExerciseInformationLabMod)({ sportId, exerciseInformationLabelId });
        if (dbDeleteLabelResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            const dbDeleteValueResult = await (0, deleteExerciseInformationValsMod_1.deleteExerciseInformationValsMod)({ exerciseInformationLabelId });
            if (reorderExerciseInformationLabels.length > 0) {
                const dbReorderResult = await (0, reorderExerciseInformationLabsMod_1.reorderExerciseInformationLabsMod)({ sportId, reorderExerciseInformationLabels });
                res.status(dbDeleteLabelResult.status).json({ message: dbDeleteLabelResult.message });
            }
        }
        else {
            res.status(dbDeleteLabelResult.status).json({ message: dbDeleteLabelResult.message });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteExerciseInformationLabCont = deleteExerciseInformationLabCont;
//# sourceMappingURL=deleteExerciseInformationLabCont.js.map
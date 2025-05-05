"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseInformationLabCont = void 0;
const createExerciseInformationLabMod_1 = require("../../models/create/createExerciseInformationLabMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const createExerciseInformationLabCont = async (req, res) => {
    const { sportId, exerciseInformationLabel, orderNumber } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!exerciseInformationLabel) {
        res.status(400).json({ message: "Informace o cviku nesmí být prázdná" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbLabelResult = await (0, createExerciseInformationLabMod_1.createExerciseInformationLabMod)({ sportId, exerciseInformationLabel, orderNumber });
        res.status(dbLabelResult.status).json({ message: dbLabelResult.message, data: dbLabelResult.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createExerciseInformationLabCont = createExerciseInformationLabCont;
//# sourceMappingURL=createExerciseInformationLabCont.js.map
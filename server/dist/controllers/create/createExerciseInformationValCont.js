"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseInformationValCont = void 0;
const changeExerciseInformationValMod_1 = require("../../models/change/changeExerciseInformationValMod");
const createExerciseInformationValMod_1 = require("../../models/create/createExerciseInformationValMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const createExerciseInformationValCont = async (req, res) => {
    const { sportId, exerciseId, exerciseInformationLabelId, exerciseInformationValue } = req.body;
    if (!exerciseInformationLabelId) {
        res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS || !checkRes.data) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbCreateResult = await (0, createExerciseInformationValMod_1.createExerciseInformationValMod)({ exerciseInformationValue, exerciseInformationLabelId, exerciseId, userId: checkRes.data.userId || -1 });
        if (dbCreateResult.status === GenResEnum_1.GenEnum.ALREADY_EXISTS) {
            const dbChangeResult = await (0, changeExerciseInformationValMod_1.changeExerciseInformationValMod)({ exerciseInformationValueId: dbCreateResult.data || -1, exerciseInformationValue });
            res.status(dbChangeResult.status).json({ message: dbChangeResult.message, data: dbCreateResult.data });
        }
        else {
            res.status(dbCreateResult.status).json({ message: dbCreateResult.message, data: dbCreateResult.data });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createExerciseInformationValCont = createExerciseInformationValCont;
//# sourceMappingURL=createExerciseInformationValCont.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePriorityPointsCont = void 0;
const changePriorityPointsMod_1 = require("../../models/change/changePriorityPointsMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changePriorityPointsCont = async (req, res) => {
    const { sportId, entityId, entityIsExercise, priorityPoints } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResult = await (0, changePriorityPointsMod_1.changePriorityPointsMod)({ entityId, entityIsExercise, priorityPoints });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changePriorityPointsCont = changePriorityPointsCont;
//# sourceMappingURL=changePriorityPointsCont.js.map
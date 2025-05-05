"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasAutomaticPlanCreationCont = void 0;
const changeSportHasAutomaticPlanCreationMod_1 = require("../../models/change/changeSportHasAutomaticPlanCreationMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeSportHasAutomaticPlanCreationCont = async (req, res) => {
    const { sportId, hasAutomaticPlanCreation } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const dbResult = await (0, changeSportHasAutomaticPlanCreationMod_1.changeSportHasAutomaticPlanCreationMod)({ sportId, hasAutomaticPlanCreation });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSportHasAutomaticPlanCreationCont = changeSportHasAutomaticPlanCreationCont;
//# sourceMappingURL=changeSportHasAutomaticPlanCreationCont.js.map
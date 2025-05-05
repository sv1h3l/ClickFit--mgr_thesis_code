"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportHasCategoriesCont = void 0;
const changeSportHasCategoriesMod_1 = require("../../models/change/changeSportHasCategoriesMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeSportHasCategoriesCont = async (req, res) => {
    const { sportId, hasCategories } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeSportHasCategoriesMod_1.changeSportHasCategoriesMod)({ sportId, hasCategories });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSportHasCategoriesCont = changeSportHasCategoriesCont;
//# sourceMappingURL=changeSportHasCategoriesCont.js.map
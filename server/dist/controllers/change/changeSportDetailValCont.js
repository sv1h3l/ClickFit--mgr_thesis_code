"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportDetailValCont = void 0;
const changeSportDetailValMod_1 = require("../../models/change/changeSportDetailValMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeSportDetailValCont = async (req, res) => {
    const { sportId, sportDetailValId, sportDetailVal } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!sportDetailValId || sportDetailValId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID hodnoty údaje sportu" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportDetailValId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_VAL_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeSportDetailValMod_1.changeSportDetailValMod)({ userId: checkRes.data?.userId, sportDetailValId, sportDetailVal });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSportDetailValCont = changeSportDetailValCont;
//# sourceMappingURL=changeSportDetailValCont.js.map
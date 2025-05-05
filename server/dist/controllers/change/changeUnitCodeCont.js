"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUnitCodeCont = void 0;
const changeUnitCodeMod_1 = require("../../models/change/changeUnitCodeMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const changeUnitCodeCont = async (req, res) => {
    const { sportId, unitCode } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!unitCode || unitCode === -1) {
        res.status(400).json({ message: "Předán nevalidní kód jednotky." });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbResult = await (0, changeUnitCodeMod_1.changeUnitCodeMod)({ sportId, unitCode });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUnitCodeCont = changeUnitCodeCont;
//# sourceMappingURL=changeUnitCodeCont.js.map
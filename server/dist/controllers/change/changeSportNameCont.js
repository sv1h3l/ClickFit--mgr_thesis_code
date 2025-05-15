"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSportNameCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const checkSportNameExistenceMod_1 = require("../../models/residue/checkSportNameExistenceMod");
const changeSportNameMod_1 = require("../../models/change/changeSportNameMod");
const changeSportNameCont = async (req, res) => {
    const { sportId, sportName } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (sportName.length < 1) {
        res.status(400).json({ message: "Název nesmí být prázdný" });
        return;
    }
    if (sportName.length > 25) {
        res.status(400).json({ message: "Název nesmí být delší než 25 znaků" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const checkSportNameRes = await (0, checkSportNameExistenceMod_1.checkSportNameExistenceMod)({ sportName, userId: checkRes.data?.userId });
        if (checkSportNameRes.status === GenResEnum_1.GenEnum.ALREADY_EXISTS) {
            res.status(checkSportNameRes.status).json({ message: checkSportNameRes.message });
            return;
        }
        const dbResult = await (0, changeSportNameMod_1.changeSportNameMod)({ sportId, sportName });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeSportNameCont = changeSportNameCont;
//# sourceMappingURL=changeSportNameCont.js.map
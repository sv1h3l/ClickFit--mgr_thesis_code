"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSportDetailLabCont = void 0;
const deleteSportDetailLabMod_1 = require("../../models/delete/deleteSportDetailLabMod");
const deleteSportDetailValsMod_1 = require("../../models/delete/deleteSportDetailValsMod");
const moveSportDetailLabelMod_1 = require("../../models/move/moveSportDetailLabelMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const deleteSportDetailLabCont = async (req, res) => {
    const { sportId, sportDetailLabId, reorderSportDetailLabs } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!sportDetailLabId || sportDetailLabId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID informace o cviku" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const dbDeleteLabelResult = await (0, deleteSportDetailLabMod_1.deleteSportDetailLabMod)({ sportId, sportDetailLabId });
        if (dbDeleteLabelResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            await (0, deleteSportDetailValsMod_1.deleteSportDetailValsMod)({ sportDetailLabId });
            if (reorderSportDetailLabs.length > 0) {
                await (0, moveSportDetailLabelMod_1.moveSportDetailLabelMod)({ sportId, reorderSportDetailLabels: reorderSportDetailLabs });
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
exports.deleteSportDetailLabCont = deleteSportDetailLabCont;
//# sourceMappingURL=deleteSportDetailLabCont.js.map
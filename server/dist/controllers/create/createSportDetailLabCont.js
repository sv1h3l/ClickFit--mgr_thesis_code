"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportDetailLabCont = void 0;
const createSportDetailLabMod_1 = require("../../models/create/createSportDetailLabMod");
const createSportDetailValMod_1 = require("../../models/create/createSportDetailValMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const createSportDetailLabCont = async (req, res) => {
    const { sportId, sportDetailLab, orderNumber } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu" });
        return;
    }
    if (!sportDetailLab) {
        res.status(400).json({ message: "Štítek údaje sportu nesmí být prázdný" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const resLabel = await (0, createSportDetailLabMod_1.createSportDetailLabMod)({ sportId, sportDetailLab, orderNumber });
        let resVal;
        if (resLabel.status === GenResEnum_1.GenEnum.SUCCESS) {
            resVal = await (0, createSportDetailValMod_1.createSportDetailValMod)({ sport_detail_label_id: resLabel.data, userId: checkRes.data?.userId });
        }
        res.status(resLabel.status).json({ message: resLabel.message, data: { sportDetailLabId: resLabel.data, sportDetailValId: resVal?.data } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.createSportDetailLabCont = createSportDetailLabCont;
//# sourceMappingURL=createSportDetailLabCont.js.map
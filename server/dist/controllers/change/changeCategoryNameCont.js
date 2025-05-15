"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCategoryNameCont = void 0;
const checkCategoryNameExistenceMod_1 = require("../../models/residue/checkCategoryNameExistenceMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeCategoryNameMod_1 = require("../../models/change/changeCategoryNameMod");
const changeCategoryNameCont = async (req, res) => {
    const { sportId, categoryId, categoryName } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!categoryId || categoryId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku." });
        return;
    }
    if (categoryName.length < 1) {
        res.status(400).json({ message: "Název nesmí být prázdný" });
        return;
    }
    if (categoryName.length > 40) {
        res.status(400).json({ message: "Název nesmí být delší než 40 znaků" });
        return;
    }
    try {
        const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
        if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
            res.status(checkRes.status).json({ message: checkRes.message });
            return;
        }
        const checkCategoryNameRes = await (0, checkCategoryNameExistenceMod_1.checkCategoryNameExistenceMod)({ sportId, categoryName });
        if (checkCategoryNameRes.status === GenResEnum_1.GenEnum.ALREADY_EXISTS) {
            res.status(checkCategoryNameRes.status).json({ message: checkCategoryNameRes.message });
            return;
        }
        const dbResult = await (0, changeCategoryNameMod_1.changeCategoryNameMod)({ sportId, categoryId, categoryName });
        res.status(dbResult.status).json({ message: dbResult.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeCategoryNameCont = changeCategoryNameCont;
//# sourceMappingURL=changeCategoryNameCont.js.map
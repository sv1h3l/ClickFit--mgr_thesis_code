"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCategoryCont = void 0;
const changeCategoryMod_1 = require("../../models/change/changeCategoryMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestOrderNumberOfCategoryMod_1 = require("../../models/get/getHighestOrderNumberOfCategoryMod");
const reorderExercisesMod_1 = require("../../models/move/reorderExercisesMod");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const changeCategoryCont = async (req, res) => {
    const { sportId, categoryId, exerciseId, oldCategoryId, oldOrderNumber } = req.body;
    if (!sportId || sportId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    if (!categoryId || categoryId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID kategorie." });
        return;
    }
    if (!exerciseId || exerciseId === -1) {
        res.status(400).json({ message: "Předáno nevalidní ID cviku." });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, id: sportId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.SPORT_EDIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const highestOrderNumber = await (0, getHighestOrderNumberOfCategoryMod_1.getHighestOrderNumberOfCategoryMod)({ props: { sportId, categoryId } });
        if (highestOrderNumber.data) {
            const dbResult = await (0, changeCategoryMod_1.changeCategoryMod)({ sportId, categoryId, exerciseId, highestOrderNumber: highestOrderNumber.data });
            const dbReorderExercises = await (0, reorderExercisesMod_1.reorderExercisesMod)({ sportId, categoryId: oldCategoryId, orderNumber: oldOrderNumber });
            if (dbReorderExercises.status === GenResEnum_1.GenEnum.SUCCESS) {
                res.status(dbResult.status).json({ message: dbResult.message });
            }
            else {
                res.status(dbReorderExercises.status).json({ message: dbReorderExercises.message });
            }
        }
        else {
            res.status(highestOrderNumber.status).json({ message: highestOrderNumber.message });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeCategoryCont = changeCategoryCont;
//# sourceMappingURL=changeCategoryCont.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExerciseCont = void 0;
const createExerciseMod_1 = require("../../models/create/createExerciseMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestOrderNumberOfCategoryMod_1 = require("../../models/get/getHighestOrderNumberOfCategoryMod");
const getHighestOrderNumberWithoutCategoriesMod_1 = require("../../models/get/getHighestOrderNumberWithoutCategoriesMod");
const getResidueCategoryMod_1 = require("../../models/get/getResidueCategoryMod");
const getEasiestDifficultyIdMod_1 = require("../../models/get/getEasiestDifficultyIdMod");
const getDefaultUnitCodeMod_1 = require("../../models/get/getDefaultUnitCodeMod");
const createExerciseCont = async (req, res) => {
    const { sportId, exerciseName, categoryId } = req.body;
    if (!exerciseName) {
        res.status(400).json({ message: "Název cviku nesmí být prázdný" });
        return;
    }
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID." });
        return;
    }
    try {
        let localCategoryId;
        if (categoryId === -1) {
            const dbCategoryId = await (0, getResidueCategoryMod_1.getResidueCategoryMod)({ props: { sportId } });
            localCategoryId = dbCategoryId.data;
        }
        else
            localCategoryId = categoryId;
        const highestOrderNumber = await (0, getHighestOrderNumberOfCategoryMod_1.getHighestOrderNumberOfCategoryMod)({ props: { sportId, categoryId: localCategoryId } });
        const highestOrderNumberWithoutCategories = await (0, getHighestOrderNumberWithoutCategoriesMod_1.getHighestOrderNumberWithoutCategoriesMod)({ sportId });
        const getEasiestDifficultyId = await (0, getEasiestDifficultyIdMod_1.getEasiestDifficultyIdMod)({ sportId });
        const getDefaultUnitCode = await (0, getDefaultUnitCodeMod_1.getDefaultUnitCodeMod)({ sportId });
        if ([highestOrderNumber, highestOrderNumberWithoutCategories, getEasiestDifficultyId].every((item) => item.status === GenResEnum_1.GenEnum.SUCCESS)) {
            const dbRes = await (0, createExerciseMod_1.createExerciseMod)({
                props: { sportId, exerciseName, sportDifficultyId: getEasiestDifficultyId.data, orderNumber: highestOrderNumber.data, orderNumberWithoutCategories: highestOrderNumberWithoutCategories.data, categoryId: localCategoryId, unitCode: getDefaultUnitCode.data },
            });
            switch (dbRes.status) {
                case createExerciseMod_1.ExerciseCreationStatus.SUCCESS:
                    res.status(201).json({
                        message: "Cvik byl úspěšně vytvořen",
                        data: {
                            exerciseId: dbRes.exerciseId,
                            difficultyId: getEasiestDifficultyId.data,
                            orderNumber: highestOrderNumber.data,
                            orderNumberWithoutCategories: highestOrderNumberWithoutCategories.data,
                            unitCode: getDefaultUnitCode.data
                        },
                    });
                    break;
                case createExerciseMod_1.ExerciseCreationStatus.ALREADY_EXISTS:
                    res.status(409).json({ message: "Cvik s tímto názvem již existuje" });
                    break;
                default:
                    res.status(500).json({ message: "Neznámá chyba při vytváření cviku" });
                    break;
                //TODO → kontrola jestli kategorie existuje
            }
        }
        else {
            if (highestOrderNumber.status !== GenResEnum_1.GenEnum.SUCCESS) {
                res.status(highestOrderNumber.status).json({ message: highestOrderNumber.message });
            }
            else {
                res.status(highestOrderNumberWithoutCategories.status).json({ message: highestOrderNumberWithoutCategories.message });
            }
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Došlo k serverové chybě. Zkuste to znovu." });
    }
};
exports.createExerciseCont = createExerciseCont;
//# sourceMappingURL=createExerciseCont.js.map
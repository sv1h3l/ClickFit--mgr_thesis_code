"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryController = void 0;
const deleteCategoryMod_1 = require("../../models/delete/deleteCategoryMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const getHighestOrderNumberOfCategoryMod_1 = require("../../models/get/getHighestOrderNumberOfCategoryMod");
const getResidueCategoryMod_1 = require("../../models/get/getResidueCategoryMod");
const reorderCategoriesMod_1 = require("../../models/move/reorderCategoriesMod");
const transferExercisesMod_1 = require("../../models/move/transferExercisesMod");
const deleteCategoryCont = async ({ props }) => {
    const dbResidueCategoryResult = await (0, getResidueCategoryMod_1.getResidueCategoryMod)({
        props: { sportId: props.sportId },
    });
    if (dbResidueCategoryResult.status === GenResEnum_1.GenEnum.SUCCESS) {
        const categoryId = dbResidueCategoryResult.data ? dbResidueCategoryResult.data : 0;
        const dbHighestOrderNumberResult = await (0, getHighestOrderNumberOfCategoryMod_1.getHighestOrderNumberOfCategoryMod)({
            props: { sportId: props.sportId, categoryId },
        });
        if (dbHighestOrderNumberResult.status === GenResEnum_1.GenEnum.SUCCESS) {
            const highestOrderNumber = dbHighestOrderNumberResult.data ? dbHighestOrderNumberResult.data : 0;
            const dbTransferResult = await (0, transferExercisesMod_1.transferExercisesMod)({
                props: {
                    sportId: props.sportId,
                    categoryId: categoryId,
                    highestOrderNumber,
                    exercisesOfCategory: props.exercisesOfCategory,
                },
            });
            if (dbTransferResult.status === GenResEnum_1.GenEnum.SUCCESS) {
                if (props.reorder) {
                    return { status: dbTransferResult.status, message: "Kategorie byla úspěšně odstraněna, cviky přesunuty do kategorie 'Ostatní' a následující kategorie přeuspořádány" };
                }
                else {
                    return { status: dbTransferResult.status, message: "Kategorie byla úspěšně odstraněna a cviky přesunuty do kategorie 'Ostatní'" };
                }
            }
            else {
                return { status: dbTransferResult.status, message: dbTransferResult.message ? dbTransferResult.message : "" };
            }
        }
        return { status: dbHighestOrderNumberResult.status, message: dbHighestOrderNumberResult.message ? dbHighestOrderNumberResult.message : "" };
    }
    return { status: dbResidueCategoryResult.status, message: dbResidueCategoryResult.message ? dbResidueCategoryResult.message : "" };
};
const deleteCategoryController = async (req, res) => {
    const { sportId, categoryId, exercisesOfCategory, reorderCategories } = req.body;
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID sportu." });
        return;
    }
    else if (!categoryId) {
        res.status(400).json({ message: "Předáno nevalidní ID kategorie." });
        return;
    }
    try {
        const dbDeleteResult = await (0, deleteCategoryMod_1.deleteCategoryMod)({ props: { sportId, categoryId } });
        switch (dbDeleteResult.status) {
            case GenResEnum_1.GenEnum.SUCCESS:
                if (reorderCategories.length > 0) {
                    const dbReorderResult = await (0, reorderCategoriesMod_1.reorderCategoriesMod)({ props: { sportId, reorderCategories } });
                    switch (dbReorderResult.status) {
                        case GenResEnum_1.GenEnum.SUCCESS:
                            const result = await deleteCategoryCont({ props: { sportId, reorder: true, exercisesOfCategory } });
                            res.status(result.status).json({
                                message: result.message,
                            });
                            break;
                        default:
                            console.error(dbReorderResult.message);
                            res.status(500).json({ message: "Nastala chyba během přeuspořádávání kategorií" });
                    }
                }
                else if (exercisesOfCategory.length > 0) {
                    const result = await deleteCategoryCont({ props: { sportId, reorder: false, exercisesOfCategory } });
                    res.status(result.status).json({
                        message: result.message,
                    });
                }
                else {
                    res.status(201).json({
                        message: "Kategorie byla úspěšně odstraněna",
                    });
                }
                break;
            default:
                console.error(dbDeleteResult.message);
                res.status(500).json({ message: "Nastala chyba během odstraňování kategorie" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteCategoryController = deleteCategoryController;
//# sourceMappingURL=deleteCategoryCont.js.map
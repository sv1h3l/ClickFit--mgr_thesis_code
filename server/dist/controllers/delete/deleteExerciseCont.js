"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const deleteExerciseMod_1 = require("../../models/delete/deleteExerciseMod");
const reorderExercisesMod_1 = require("../../models/move/reorderExercisesMod");
const deleteExerciseCont = async (req, res) => {
    const { sportId, categoryId, exerciseId, orderNumber, orderNumberWithoutCategories } = req.body;
    if (!sportId || !exerciseId) {
        res.status(400).json({ message: "Předáno nevalidní ID." });
        return;
    }
    try {
        const dbDeleteResult = await (0, deleteExerciseMod_1.deleteExerciseMod)({ props: { sportId, exerciseId } });
        switch (dbDeleteResult.status) {
            case GenResEnum_1.GenEnum.SUCCESS:
                const dbReorderResult = await (0, reorderExercisesMod_1.reorderExercisesMod)({ sportId, categoryId, orderNumber, orderNumberWithoutCategories });
                switch (dbReorderResult.status) {
                    case GenResEnum_1.GenEnum.SUCCESS:
                        res.status(201).json({
                            message: "Cvik byl úspěšně odstraněn a následující cviky přeuspořádány",
                        });
                        break;
                    default:
                        console.error(dbReorderResult.message);
                        res.status(500).json({ message: "Nastala chyba během přeuspořádávání cviku" });
                        break;
                }
                break;
            default:
                console.error(dbDeleteResult.message);
                res.status(500).json({ message: "Nastala chyba během odstraňování cviku" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.deleteExerciseCont = deleteExerciseCont;
//# sourceMappingURL=deleteExerciseCont.js.map
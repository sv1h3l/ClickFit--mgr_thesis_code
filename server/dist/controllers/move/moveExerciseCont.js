"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveExerciseCont = void 0;
const GenResEnum_1 = require("../../utilities/GenResEnum");
const reorderTwoExercisesMod_1 = require("../../models/move/reorderTwoExercisesMod");
const moveExerciseCont = async (req, res) => {
    const { sportId, reorderExercises, hasCategories } = req.body;
    if (!sportId) {
        res.status(400).json({ message: "Předáno nevalidní ID." });
        return;
    }
    if (reorderExercises.length < 1) {
        res.status(400).json({ message: "Nebyly předány cviky pro přeuspořádání" });
        return;
    }
    try {
        const dbReorderResult = await (0, reorderTwoExercisesMod_1.reorderTwoExercisesMod)({ props: { sportId, hasCategories, reorderExercises } });
        switch (dbReorderResult.status) {
            case GenResEnum_1.GenEnum.SUCCESS:
                res.status(201).json({
                    message: "Cviky byly úspěšně přeuspořádány",
                });
                break;
            default:
                console.error(dbReorderResult.message);
                res.status(500).json({ message: "Nastala chyba během přeuspořádávání cviku" });
                break;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.moveExerciseCont = moveExerciseCont;
//# sourceMappingURL=moveExerciseCont.js.map
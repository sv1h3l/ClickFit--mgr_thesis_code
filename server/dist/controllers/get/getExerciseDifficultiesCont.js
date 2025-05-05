"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseDifficultiesCont = void 0;
const getExerciseDifficultiesMod_1 = require("../../models/get/getExerciseDifficultiesMod");
const getExerciseDifficultiesCont = async (req, res) => {
    const { sportId, exerciseId } = req.query;
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const exerciseIdNumber = Number(exerciseId);
    if (isNaN(sportIdNumber)) {
        res.status(400).json({ message: "ID cviku musí být číslo", data: [] });
        return;
    }
    if (!sportId || sportIdNumber === -1) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    if (!exerciseId || exerciseIdNumber === -1) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    /* TODO
    const checkRes = await checkAuthorizationController(req, sportIdNumber, CheckAuthorizationCodeEnum.SPORT_VIEW);
    if (!checkRes.authorized) {
        res.status(401).json({ message: checkRes.message });
    }*/
    try {
        const dbRes = await (0, getExerciseDifficultiesMod_1.getExerciseDifficultiesMod)({ exerciseId: exerciseIdNumber });
        let difficulties;
        if (dbRes.data && dbRes.data.length > 0) {
            difficulties = dbRes.data.map((difficulty) => ({
                exerciseDifficultyId: difficulty.exercise_difficulty_id,
                sportDifficultyId: difficulty.sport_difficulty_id,
                exerciseId: exerciseIdNumber,
                series: difficulty.series,
                repetitions: difficulty.repetitions,
                burden: difficulty.burden,
            }));
        }
        res.status(dbRes.status).json({ message: dbRes.message, data: difficulties });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.getExerciseDifficultiesCont = getExerciseDifficultiesCont;
//# sourceMappingURL=getExerciseDifficultiesCont.js.map
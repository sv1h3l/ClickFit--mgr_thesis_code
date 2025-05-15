"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitedUserExercisesCont = void 0;
const getExercisesMod_1 = require("../../models/get/getExercisesMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
const checkAuthorizationCont_1 = require("../residue/checkAuthorizationCont");
const getVisitedUserExercisesCont = async (req, res) => {
    const { sportId } = req.query;
    if (!sportId) {
        res.status(400).json({ message: "Chybějící ID sportu", data: [] });
        return;
    }
    const sportIdNumber = Number(sportId);
    if (isNaN(sportIdNumber)) {
        // Kontrola, jestli to je validní číslo
        res.status(400).json({ message: "ID sportu musí být číslo", data: [] });
        return;
    }
    const authToken = req.headers["authorization"]?.split(" ")[1];
    const visitedUserId = Number(req.query.visitedUserId);
    if (!visitedUserId || visitedUserId < 1) {
        res.status(400).json({ message: "Předáno nevalidní ID uživatele" });
        return;
    }
    const checkRes = await (0, checkAuthorizationCont_1.checkAuthorizationCont)({ req, authToken, id: visitedUserId, checkAuthorizationCode: checkAuthorizationCont_1.CheckAuthorizationCodeEnum.USER_VISIT });
    if (checkRes.status !== GenResEnum_1.GenEnum.SUCCESS) {
        res.status(checkRes.status).json({ message: checkRes.message });
        return;
    }
    try {
        const exercises = await (0, getExercisesMod_1.getExercisesMod)(sportIdNumber); // Získáme sporty
        if (exercises.length > 0) {
            // Mapujeme sport z databázového formátu (snake_case) na formát camelCase
            const formattedExercises = exercises
                .map((exercise) => ({
                exerciseId: exercise.exercise_id,
                categoryId: exercise.category_id,
                sportDifficultyId: exercise.sport_difficulty_id,
                exerciseName: exercise.name,
                orderNumber: exercise.order_number,
                orderNumberWithoutCategories: exercise.order_number_without_categories,
                series: exercise.series,
                repetitions: exercise.repetitions,
                burden: exercise.burden,
                unitCode: exercise.unit_code,
                description: exercise.description,
                youtubeLink: exercise.youtube_link,
                hasRepeatability: exercise.has_repeatability,
                repeatabilityQuantity: exercise.repeatability_quantity,
                looseConnection: exercise.loose_connection,
                tightConnection: exercise.tight_connection,
                priorityPoints: exercise.priority_points,
                blacklist: exercise.blacklist,
            }))
                .sort((a, b) => a.orderNumberWithoutCategories - b.orderNumberWithoutCategories);
            res.status(200).json({ message: "Cviky úspěšně předány.", data: formattedExercises });
        }
        else {
            res.status(200).json({ message: "Žádné cviky nenalezeny.", data: [] }); // TODO: opravit kód i u getSportsController
        }
    }
    catch (error) {
        console.error("Chyba při získání cviků: ", error);
        res.status(500).json({ message: "Chyba při získání cviků.", data: [] });
    }
};
exports.getVisitedUserExercisesCont = getVisitedUserExercisesCont;
//# sourceMappingURL=getVisitedUserExercisesCont.js.map